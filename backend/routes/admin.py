import uuid
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from database import get_db
from auth_utils import require_admin, require_staff_or_admin, hash_password
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
)

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
    return await cursor.to_list(length=1000)


@router.patch("/bookings/{booking_id}", response_model=BookingOut)
async def update_booking_status(
    booking_id: str,
    payload: BookingStatusUpdate,
    _user: dict = Depends(require_staff_or_admin),
):
    db = get_db()
    valid = {"pending", "confirmed", "rejected", "cancelled"}
    if payload.status not in valid:
        raise HTTPException(status_code=400, detail="Invalid status")
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
    return BookingOut(**result)


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
