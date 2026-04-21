import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from database import get_db
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
    slot_key = f"{booking.date}T{booking.time_slot}"
    # check if slot already booked
    existing = await db.bookings.find_one(
        {
            "type": "meeting_room",
            "status": {"$in": ["pending", "confirmed"]},
            "details.room_id": booking.room_id,
            "details.slot": slot_key,
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
