import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Response

from database import get_db
from storage import get_object
from models.schemas import (
    OfficeOut,
    MeetingRoomOut,
    SharedDesksDoc,
    DeskBookingIn,
    OfficeBookingIn,
    MeetingRoomBookingIn,
    BookingResponse,
    ContactIn,
    ContactOut,
    SiteSettings,
    ContentBlockOut,
    AvailabilityDoc,
)

router = APIRouter(tags=["public"])


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- Public read-only content ----------
@router.get("/offices")
async def get_offices():
    db = get_db()
    cursor = db.offices.find({"active": True}, {"_id": 0}).sort("order", 1)
    return await cursor.to_list(length=200)


@router.get("/shared-desks")
async def get_shared_desks():
    db = get_db()
    doc = await db.shared_desks.find_one({"key": "singleton"}, {"_id": 0, "key": 0})
    return doc or {}


@router.get("/meeting-rooms")
async def get_meeting_rooms():
    db = get_db()
    cursor = db.meeting_rooms.find({"active": True}, {"_id": 0}).sort("order", 1)
    return await cursor.to_list(length=200)


@router.get("/content/{key}")
async def get_content_block(key: str):
    db = get_db()
    doc = await db.content_blocks.find_one({"key": key, "active": True}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Content not found")
    return doc


@router.get("/content")
async def get_all_content():
    db = get_db()
    cursor = db.content_blocks.find({"active": True}, {"_id": 0})
    items = await cursor.to_list(length=500)
    return {item["key"]: item for item in items}


@router.get("/settings")
async def get_settings():
    db = get_db()
    doc = await db.settings.find_one({"key": "site"}, {"_id": 0, "key": 0})
    return doc or SiteSettings().model_dump()


@router.get("/availability")
async def get_availability_public():
    db = get_db()
    doc = await db.availability.find_one({"key": "singleton"}, {"_id": 0, "key": 0})
    return doc or AvailabilityDoc().model_dump()


@router.get("/booked-slots")
async def get_booked_slots(room_id: str, date: str):
    """Return list of booked time slots (HH:MM) for a given room+date."""
    db = get_db()
    cursor = db.bookings.find(
        {
            "type": "meeting_room",
            "status": {"$in": ["pending", "confirmed"]},
            "$or": [
                {"details.room_id": room_id, "details.date": date},
                {"room_id": room_id, "date": date},
            ],
        },
        {"_id": 0, "details": 1, "time_slot": 1},
    )
    items = await cursor.to_list(length=200)
    slots = []
    for it in items:
        det = it.get("details") or {}
        s = det.get("time_slot") or it.get("time_slot")
        if s:
            slots.append(s)
    return {"room_id": room_id, "date": date, "booked": sorted(set(slots))}


# ---------- Media file serving (public) ----------
@router.get("/media/file/{path:path}")
async def serve_media(path: str):
    db = get_db()
    record = await db.media.find_one({"storage_path": path, "is_deleted": {"$ne": True}}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        data, ctype = get_object(path)
    except Exception:
        raise HTTPException(status_code=404, detail="File not available")
    return Response(
        content=data,
        media_type=record.get("content_type") or ctype,
        headers={"Cache-Control": "public, max-age=86400"},
    )


# ---------- Contact form ----------
@router.post("/contact", response_model=ContactOut)
async def submit_contact(form: ContactIn):
    db = get_db()
    doc = form.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["status"] = "new"
    doc["created_at"] = _now_iso()
    await db.messages.insert_one({**doc})
    return ContactOut(**doc)


# ---------- Bookings ----------
@router.post("/bookings/desk", response_model=BookingResponse)
async def book_desk(booking: DeskBookingIn):
    db = get_db()
    doc = {
        "id": str(uuid.uuid4()),
        "type": "desk",
        "status": "pending",
        "name": booking.name,
        "phone": booking.phone,
        "email": booking.email,
        "details": {"num_desks": booking.num_desks},
        "notes": "",
        "created_at": _now_iso(),
        "updated_at": None,
    }
    await db.bookings.insert_one({**doc})
    return BookingResponse(id=doc["id"], status="pending", message="تم استلام طلب حجز المكتب المشترك بنجاح")


@router.post("/bookings/office", response_model=BookingResponse)
async def book_office(booking: OfficeBookingIn):
    db = get_db()
    doc = {
        "id": str(uuid.uuid4()),
        "type": "office",
        "status": "pending",
        "name": booking.name,
        "phone": booking.phone,
        "email": booking.email,
        "details": {"office_id": booking.office_id},
        "notes": "",
        "created_at": _now_iso(),
        "updated_at": None,
    }
    await db.bookings.insert_one({**doc})
    return BookingResponse(id=doc["id"], status="pending", message="تم استلام طلب حجز المكتب الخاص بنجاح")


@router.post("/bookings/meeting-room", response_model=BookingResponse)
async def book_meeting_room(booking: MeetingRoomBookingIn):
    db = get_db()

    # Check availability rules
    avail_doc = await db.availability.find_one({"key": "singleton"}, {"_id": 0, "key": 0})
    if avail_doc:
        avail = AvailabilityDoc(**avail_doc)
        try:
            d = datetime.strptime(booking.date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="صيغة التاريخ غير صحيحة")
        # Python weekday: Monday=0 … Sunday=6. Convert to Sun=0 convention.
        dow = (d.weekday() + 1) % 7
        if dow not in (avail.working_days or []):
            raise HTTPException(status_code=400, detail="اليوم غير متاح للحجز")
        if booking.date in (avail.blocked_dates or []):
            raise HTTPException(status_code=400, detail="هذا التاريخ مغلق")
        # time window
        if booking.time_slot < avail.start_time or booking.time_slot >= avail.end_time:
            raise HTTPException(status_code=400, detail="الموعد خارج أوقات العمل")
        # blocked slots
        for bs in (avail.blocked_slots or []):
            if bs.get("date") == booking.date and bs.get("slot") == booking.time_slot:
                raise HTTPException(status_code=400, detail="هذا الموعد محجوز من الإدارة")

    slot_key = f"{booking.date}T{booking.time_slot}"
    # check if slot already booked
    existing = await db.bookings.find_one(
        {
            "type": "meeting_room",
            "status": {"$in": ["pending", "confirmed"]},
            "$or": [
                {"details.room_id": booking.room_id, "details.slot": slot_key},
                {"room_id": booking.room_id, "date": booking.date, "time_slot": booking.time_slot},
            ],
        }
    )
    if existing:
        raise HTTPException(status_code=409, detail="هذا الموعد محجوز مسبقاً")

    doc = {
        "id": str(uuid.uuid4()),
        "type": "meeting_room",
        "status": "pending",
        "name": booking.name,
        "phone": booking.phone,
        "email": booking.email,
        "details": {
            "room_id": booking.room_id,
            "date": booking.date,
            "time_slot": booking.time_slot,
            "slot": slot_key,
        },
        "notes": "",
        "created_at": _now_iso(),
        "updated_at": None,
    }
    await db.bookings.insert_one({**doc})
    return BookingResponse(id=doc["id"], status="pending", message="تم استلام طلب حجز قاعة الاجتماعات بنجاح")
