import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from pydantic import BaseModel

from database import get_db
from auth_utils import require_admin, require_staff_or_admin, hash_password
from storage import put_object, APP_NAME
from models.schemas import (
    OfficeIn,
    OfficeOut,
    SharedDesksDoc,
    MeetingRoomIn,
    MeetingRoomOut,
    ContentBlockIn,
    ContentBlockOut,
    SiteSettings,
    BookingStatusUpdate,
    BookingOut,
    ContactOut,
    MessageStatusUpdate,
    AvailabilityDoc,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin", tags=["admin"])


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ================= OFFICES =================
@router.get("/offices")
async def list_offices(_user: dict = Depends(require_staff_or_admin)):
    db = get_db()
    cursor = db.offices.find({}, {"_id": 0}).sort("order", 1)
    return await cursor.to_list(length=500)


@router.post("/offices", response_model=OfficeOut)
async def create_office(payload: OfficeIn, _user: dict = Depends(require_admin)):
    db = get_db()
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    await db.offices.insert_one({**doc})
    return OfficeOut(**doc)


@router.put("/offices/{office_id}", response_model=OfficeOut)
async def update_office(office_id: str, payload: OfficeIn, _user: dict = Depends(require_admin)):
    db = get_db()
    doc = payload.model_dump()
    result = await db.offices.find_one_and_update(
        {"id": office_id},
        {"$set": doc},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Office not found")
    return OfficeOut(**result)


@router.delete("/offices/{office_id}")
async def delete_office(office_id: str, _user: dict = Depends(require_admin)):
    db = get_db()
    result = await db.offices.delete_one({"id": office_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Office not found")
    return {"ok": True}


# ================= SHARED DESKS (singleton) =================
@router.get("/shared-desks")
async def get_shared_desks_admin(_user: dict = Depends(require_staff_or_admin)):
    db = get_db()
    doc = await db.shared_desks.find_one({"key": "singleton"}, {"_id": 0, "key": 0})
    return doc or SharedDesksDoc().model_dump()


@router.put("/shared-desks")
async def update_shared_desks(payload: SharedDesksDoc, _user: dict = Depends(require_admin)):
    db = get_db()
    doc = payload.model_dump()
    await db.shared_desks.update_one(
        {"key": "singleton"},
        {"$set": doc},
        upsert=True,
    )
    return doc


# ================= MEETING ROOMS =================
@router.get("/meeting-rooms")
async def list_meeting_rooms(_user: dict = Depends(require_staff_or_admin)):
    db = get_db()
    cursor = db.meeting_rooms.find({}, {"_id": 0}).sort("order", 1)
    return await cursor.to_list(length=500)


@router.post("/meeting-rooms", response_model=MeetingRoomOut)
async def create_meeting_room(payload: MeetingRoomIn, _user: dict = Depends(require_admin)):
    db = get_db()
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    await db.meeting_rooms.insert_one({**doc})
    return MeetingRoomOut(**doc)


@router.put("/meeting-rooms/{room_id}", response_model=MeetingRoomOut)
async def update_meeting_room(room_id: str, payload: MeetingRoomIn, _user: dict = Depends(require_admin)):
    db = get_db()
    doc = payload.model_dump()
    result = await db.meeting_rooms.find_one_and_update(
        {"id": room_id},
        {"$set": doc},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Room not found")
    return MeetingRoomOut(**result)


@router.delete("/meeting-rooms/{room_id}")
async def delete_meeting_room(room_id: str, _user: dict = Depends(require_admin)):
    db = get_db()
    result = await db.meeting_rooms.delete_one({"id": room_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"ok": True}


# ================= CMS CONTENT BLOCKS =================
@router.get("/content")
async def list_content(_user: dict = Depends(require_staff_or_admin)):
    db = get_db()
    cursor = db.content_blocks.find({}, {"_id": 0})
    return await cursor.to_list(length=500)


@router.get("/content/{key}")
async def get_content(key: str, _user: dict = Depends(require_staff_or_admin)):
    db = get_db()
    doc = await db.content_blocks.find_one({"key": key}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Content not found")
    return doc


@router.put("/content/{key}")
async def upsert_content(key: str, payload: ContentBlockIn, _user: dict = Depends(require_admin)):
    db = get_db()
    doc = payload.model_dump()
    doc["key"] = key
    doc["updated_at"] = _now_iso()
    await db.content_blocks.update_one({"key": key}, {"$set": doc}, upsert=True)
    return doc


@router.delete("/content/{key}")
async def delete_content(key: str, _user: dict = Depends(require_admin)):
    db = get_db()
    result = await db.content_blocks.delete_one({"key": key})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Content not found")
    return {"ok": True}


# ================= SITE SETTINGS =================
@router.get("/settings")
async def get_settings_admin(_user: dict = Depends(require_staff_or_admin)):
    db = get_db()
    doc = await db.settings.find_one({"key": "site"}, {"_id": 0, "key": 0})
    return doc or SiteSettings().model_dump()


@router.put("/settings")
async def update_settings(payload: SiteSettings, _user: dict = Depends(require_admin)):
    db = get_db()
    doc = payload.model_dump()
    await db.settings.update_one({"key": "site"}, {"$set": doc}, upsert=True)
    return doc


# ================= BOOKINGS =================
_DETAIL_FIELDS = {"num_desks", "office_id", "room_id", "date", "time_slot", "slot"}


def _normalize_booking(doc: dict) -> dict:
    """Ensure booking has a `details` sub-dict and flat resource fields are folded in."""
    d = dict(doc)
    details = d.get("details") or {}
    if not isinstance(details, dict):
        details = {}
    for f in _DETAIL_FIELDS:
        if f in d and d[f] is not None:
            details.setdefault(f, d.pop(f))
        else:
            d.pop(f, None)
    d["details"] = details
    d.setdefault("notes", "")
    d.setdefault("updated_at", None)
    return d


async def _enrich_bookings(docs: list, db) -> list:
    office_ids = {d["details"].get("office_id") for d in docs if d["type"] == "office"}
    room_ids = {d["details"].get("room_id") for d in docs if d["type"] == "meeting_room"}
    office_map = {}
    room_map = {}
    if office_ids:
        async for off in db.offices.find({"id": {"$in": list(office_ids)}}, {"_id": 0, "id": 1, "name": 1, "name_en": 1}):
            office_map[off["id"]] = off
    if room_ids:
        async for rm in db.meeting_rooms.find({"id": {"$in": list(room_ids)}}, {"_id": 0, "id": 1, "name": 1, "name_en": 1}):
            room_map[rm["id"]] = rm
    for d in docs:
        det = d.get("details", {})
        if d["type"] == "office":
            oid = det.get("office_id")
            if oid and oid in office_map:
                det["office_name"] = office_map[oid]["name"]
                det["office_name_en"] = office_map[oid].get("name_en", "")
        elif d["type"] == "meeting_room":
            rid = det.get("room_id")
            if rid and rid in room_map:
                det["room_name"] = room_map[rid]["name"]
                det["room_name_en"] = room_map[rid].get("name_en", "")
    return docs


@router.get("/bookings")
async def list_bookings(
    status: Optional[str] = None,
    type: Optional[str] = None,
    _user: dict = Depends(require_staff_or_admin),
):
    db = get_db()
    q = {}
    if status:
        q["status"] = status
    if type:
        q["type"] = type
    cursor = db.bookings.find(q, {"_id": 0}).sort("created_at", -1)
    raw = await cursor.to_list(length=1000)
    normalized = [_normalize_booking(d) for d in raw]
    return await _enrich_bookings(normalized, db)


@router.patch("/bookings/{booking_id}")
async def update_booking_status(
    booking_id: str,
    payload: BookingStatusUpdate,
    _user: dict = Depends(require_staff_or_admin),
):
    """Approve/reject/cancel a booking. Always returns:
    {"success": true, "message": "...", "data": <booking>} on success (200).
    Only raises HTTP errors for validation/not-found/auth problems.
    """
    db = get_db()
    valid = {"pending", "confirmed", "rejected", "cancelled"}
    if payload.status not in valid:
        raise HTTPException(status_code=400, detail="Invalid status")

    try:
        update = {"status": payload.status, "updated_at": _now_iso()}
        if payload.notes is not None:
            update["notes"] = payload.notes
        result = await db.bookings.find_one_and_update(
            {"id": booking_id},
            {"$set": update},
            return_document=True,
            projection={"_id": 0},
        )
        if not result:
            raise HTTPException(status_code=404, detail="Booking not found")

        normalized = _normalize_booking(result)
        enriched = await _enrich_bookings([normalized], db)
        booking = BookingOut(**enriched[0]).model_dump()

        status_label = {
            "confirmed": "تم تأكيد الحجز",
            "rejected": "تم رفض الحجز",
            "cancelled": "تم إلغاء الحجز",
            "pending": "تم إعادة الحجز إلى قيد المراجعة",
        }[payload.status]
        return {"success": True, "message": status_label, "data": booking}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to update booking %s: %s", booking_id, e)
        raise HTTPException(status_code=500, detail=f"حدث خطأ أثناء تحديث الحجز: {e}")


@router.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str, _user: dict = Depends(require_admin)):
    db = get_db()
    result = await db.bookings.delete_one({"id": booking_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"ok": True}


# ================= MESSAGES =================
@router.get("/messages")
async def list_messages(
    status: Optional[str] = None,
    _user: dict = Depends(require_staff_or_admin),
):
    db = get_db()
    q = {}
    if status:
        q["status"] = status
    cursor = db.messages.find(q, {"_id": 0}).sort("created_at", -1)
    return await cursor.to_list(length=1000)


@router.patch("/messages/{message_id}", response_model=ContactOut)
async def update_message_status(
    message_id: str,
    payload: MessageStatusUpdate,
    _user: dict = Depends(require_staff_or_admin),
):
    db = get_db()
    valid = {"new", "read", "replied", "archived"}
    if payload.status not in valid:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.messages.find_one_and_update(
        {"id": message_id},
        {"$set": {"status": payload.status}},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Message not found")
    return ContactOut(**result)


@router.delete("/messages/{message_id}")
async def delete_message(message_id: str, _user: dict = Depends(require_admin)):
    db = get_db()
    result = await db.messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"ok": True}


# ================= USERS (staff management) =================
class StaffCreate(BaseModel):
    email: str
    password: str
    name: str
    role: str = "staff"  # admin | staff


class StaffUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = None


@router.get("/users")
async def list_users(_user: dict = Depends(require_admin)):
    db = get_db()
    cursor = db.users.find({}, {"_id": 0, "password_hash": 0})
    return await cursor.to_list(length=500)


@router.post("/users")
async def create_user(payload: StaffCreate, _user: dict = Depends(require_admin)):
    db = get_db()
    email = payload.email.lower().strip()
    if payload.role not in ("admin", "staff"):
        raise HTTPException(status_code=400, detail="Invalid role")
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=409, detail="البريد مستخدم بالفعل")
    doc = {
        "id": str(uuid.uuid4()),
        "email": email,
        "name": payload.name,
        "role": payload.role,
        "password_hash": hash_password(payload.password),
        "created_at": _now_iso(),
    }
    await db.users.insert_one({**doc})
    doc.pop("password_hash", None)
    return doc


@router.patch("/users/{user_id}")
async def update_user(user_id: str, payload: StaffUpdate, _user: dict = Depends(require_admin)):
    db = get_db()
    update = {}
    if payload.name is not None:
        update["name"] = payload.name
    if payload.role is not None:
        if payload.role not in ("admin", "staff"):
            raise HTTPException(status_code=400, detail="Invalid role")
        update["role"] = payload.role
    if payload.password:
        update["password_hash"] = hash_password(payload.password)
    if not update:
        raise HTTPException(status_code=400, detail="Nothing to update")
    result = await db.users.find_one_and_update(
        {"id": user_id},
        {"$set": update},
        return_document=True,
        projection={"_id": 0, "password_hash": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, current: dict = Depends(require_admin)):
    db = get_db()
    if current["id"] == user_id:
        raise HTTPException(status_code=400, detail="لا يمكن حذف حسابك الخاص")
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True}


# ================= DASHBOARD STATS =================
@router.get("/stats")
async def dashboard_stats(_user: dict = Depends(require_staff_or_admin)):
    db = get_db()
    total_bookings = await db.bookings.count_documents({})
    pending_bookings = await db.bookings.count_documents({"status": "pending"})
    confirmed_bookings = await db.bookings.count_documents({"status": "confirmed"})
    total_messages = await db.messages.count_documents({})
    new_messages = await db.messages.count_documents({"status": "new"})
    total_offices = await db.offices.count_documents({})
    available_offices = await db.offices.count_documents({"available": True, "active": True})
    return {
        "bookings": {
            "total": total_bookings,
            "pending": pending_bookings,
            "confirmed": confirmed_bookings,
        },
        "messages": {"total": total_messages, "new": new_messages},
        "offices": {"total": total_offices, "available": available_offices},
    }



# ================= AVAILABILITY (working hours / blocked slots) =================
@router.get("/availability")
async def get_availability_admin(_user: dict = Depends(require_staff_or_admin)):
    db = get_db()
    doc = await db.availability.find_one({"key": "singleton"}, {"_id": 0, "key": 0})
    return doc or AvailabilityDoc().model_dump()


@router.put("/availability")
async def update_availability(payload: AvailabilityDoc, _user: dict = Depends(require_admin)):
    db = get_db()
    doc = payload.model_dump()
    await db.availability.update_one({"key": "singleton"}, {"$set": doc}, upsert=True)
    return doc


# ================= MEDIA LIBRARY =================
_ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


@router.get("/media")
async def list_media(_user: dict = Depends(require_staff_or_admin)):
    db = get_db()
    cursor = db.media.find({"is_deleted": {"$ne": True}}, {"_id": 0}).sort("created_at", -1)
    return await cursor.to_list(length=500)


@router.post("/media/upload")
async def upload_media(
    file: UploadFile = File(...),
    current: dict = Depends(require_staff_or_admin),
):
    ctype = (file.content_type or "application/octet-stream").lower()
    if ctype not in _ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="صيغة الصورة غير مدعومة")
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="حجم الصورة أكبر من 10 ميجابايت")
    ext = (file.filename or "").rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else "bin"
    file_id = str(uuid.uuid4())
    path = f"{APP_NAME}/media/{file_id}.{ext}"
    try:
        result = put_object(path, data, ctype)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Storage error: {e}")
    stored_path = result.get("path", path)
    doc = {
        "id": file_id,
        "storage_path": stored_path,
        "url": f"/api/media/file/{stored_path}",
        "original_filename": file.filename or "",
        "content_type": ctype,
        "size": int(result.get("size") or len(data)),
        "tag": "",
        "uploaded_by": current["id"],
        "is_deleted": False,
        "created_at": _now_iso(),
    }
    await db_insert_media(doc)
    return {k: v for k, v in doc.items() if k != "is_deleted"}


async def db_insert_media(doc: dict):
    db = get_db()
    await db.media.insert_one({**doc})


@router.delete("/media/{media_id}")
async def delete_media(media_id: str, _user: dict = Depends(require_admin)):
    db = get_db()
    result = await db.media.update_one({"id": media_id}, {"$set": {"is_deleted": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Media not found")
    return {"ok": True}
