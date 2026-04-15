from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# --- Models ---
class ContactForm(BaseModel):
    name: str
    phone: str
    email: str
    service_type: str
    message: str

class ContactResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: str
    service_type: str
    message: str
    created_at: str

class DeskBooking(BaseModel):
    name: str
    phone: str
    email: str
    num_desks: int

class OfficeBooking(BaseModel):
    name: str
    phone: str
    email: str
    office_id: str

class MeetingRoomBooking(BaseModel):
    name: str
    phone: str
    email: str
    room_id: str
    date: str
    time_slot: str

class BookingResponse(BaseModel):
    id: str
    status: str
    message: str

# --- Mock Data ---
OFFICES_DATA = [
    {
        "id": "office-1",
        "name": "مكتب ١",
        "capacity": 2,
        "price": 2500,
        "currency": "ريال/شهر",
        "available": True,
        "reserved_until": None,
        "image": "https://images.unsplash.com/photo-1746021451691-4385f318ec13?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85"
    },
    {
        "id": "office-2",
        "name": "مكتب ٢",
        "capacity": 4,
        "price": 4500,
        "currency": "ريال/شهر",
        "available": True,
        "reserved_until": None,
        "image": "https://images.unsplash.com/photo-1746021375246-7dc8ab0583f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85"
    },
    {
        "id": "office-3",
        "name": "مكتب ٣",
        "capacity": 6,
        "price": 6500,
        "currency": "ريال/شهر",
        "available": False,
        "reserved_until": "2025-03-15",
        "image": "https://images.unsplash.com/photo-1765366417077-dc1a6fbd5e34?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85"
    },
    {
        "id": "office-4",
        "name": "مكتب ٤",
        "capacity": 3,
        "price": 3500,
        "currency": "ريال/شهر",
        "available": True,
        "reserved_until": None,
        "image": "https://images.unsplash.com/photo-1746021451691-4385f318ec13?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85"
    },
    {
        "id": "office-5",
        "name": "مكتب ٥",
        "capacity": 8,
        "price": 8500,
        "currency": "ريال/شهر",
        "available": False,
        "reserved_until": "2025-02-28",
        "image": "https://images.unsplash.com/photo-1746021375246-7dc8ab0583f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85"
    },
    {
        "id": "office-6",
        "name": "مكتب ٦",
        "capacity": 5,
        "price": 5500,
        "currency": "ريال/شهر",
        "available": True,
        "reserved_until": None,
        "image": "https://images.unsplash.com/photo-1765366417077-dc1a6fbd5e34?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85"
    }
]

SHARED_DESKS_DATA = {
    "price": 800,
    "currency": "ريال/شهر",
    "total_seats": 30,
    "available_seats": 12,
    "occupied_seats": 18,
    "image": "https://images.unsplash.com/photo-1765366417046-f46361a7f26f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85"
}

MEETING_ROOMS_DATA = [
    {
        "id": "room-1",
        "name": "قاعة الاجتماعات ١",
        "capacity": 8,
        "price": 150,
        "currency": "ريال/ساعة",
        "image": "https://images.unsplash.com/photo-1770993151375-0dee97eda931?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBtZWV0aW5nJTIwcm9vbSUyMGdsYXNzJTIwb2ZmaWNlfGVufDB8fHx8MTc3NjI1NzY4OHww&ixlib=rb-4.1.0&q=85",
        "booked_slots": ["2025-01-15T09:00", "2025-01-15T10:00", "2025-01-16T14:00"]
    },
    {
        "id": "room-2",
        "name": "قاعة الاجتماعات ٢",
        "capacity": 12,
        "price": 250,
        "currency": "ريال/ساعة",
        "image": "https://images.unsplash.com/photo-1637665662134-db459c1bbb46?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBvZmZpY2UlMjBtZWV0aW5nJTIwcm9vbXxlbnwwfHx8fDE3NzYyNTc2OTV8MA&ixlib=rb-4.1.0&q=85",
        "booked_slots": ["2025-01-15T11:00", "2025-01-17T09:00"]
    }
]

# --- Routes ---
@api_router.get("/")
async def root():
    return {"message": "KUN Workspace API"}

@api_router.get("/offices")
async def get_offices():
    return OFFICES_DATA

@api_router.get("/shared-desks")
async def get_shared_desks():
    return SHARED_DESKS_DATA

@api_router.get("/meeting-rooms")
async def get_meeting_rooms():
    return MEETING_ROOMS_DATA

@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(form: ContactForm):
    doc = form.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.contacts.insert_one({**doc})
    return ContactResponse(**doc)

@api_router.post("/bookings/desk", response_model=BookingResponse)
async def book_desk(booking: DeskBooking):
    doc = booking.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["type"] = "desk"
    doc["status"] = "pending"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.bookings.insert_one({**doc})
    return BookingResponse(id=doc["id"], status="pending", message="تم استلام طلب حجز المكتب المشترك بنجاح")

@api_router.post("/bookings/office", response_model=BookingResponse)
async def book_office(booking: OfficeBooking):
    doc = booking.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["type"] = "office"
    doc["status"] = "pending"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.bookings.insert_one({**doc})
    return BookingResponse(id=doc["id"], status="pending", message="تم استلام طلب حجز المكتب الخاص بنجاح")

@api_router.post("/bookings/meeting-room", response_model=BookingResponse)
async def book_meeting_room(booking: MeetingRoomBooking):
    doc = booking.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["type"] = "meeting_room"
    doc["status"] = "pending"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.bookings.insert_one({**doc})
    return BookingResponse(id=doc["id"], status="pending", message="تم استلام طلب حجز قاعة الاجتماعات بنجاح")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
