from datetime import datetime, timezone
from typing import List, Optional, Any, Dict

from pydantic import BaseModel, Field, EmailStr
import uuid


# ---- USERS ----
class UserDoc(BaseModel):
    id: str
    email: str
    name: str
    role: str  # "admin" | "staff"
    password_hash: str
    created_at: str


# ---- OFFICES ----
class OfficeIn(BaseModel):
    name: str
    name_en: Optional[str] = ""
    capacity: int
    price: float
    currency: str = "ريال/شهر"
    available: bool = True
    reserved_until: Optional[str] = None
    image: Optional[str] = ""
    images: List[str] = Field(default_factory=list)
    description: Optional[str] = ""
    description_en: Optional[str] = ""
    order: int = 0
    active: bool = True


class OfficeOut(OfficeIn):
    id: str


# ---- SHARED DESKS (singleton) ----
class SharedDesksDoc(BaseModel):
    price: float = 800
    currency: str = "ريال/شهر"
    total_seats: int = 30
    available_seats: int = 12
    occupied_seats: int = 18
    image: str = ""
    description: str = ""
    description_en: str = ""
    active: bool = True


# ---- MEETING ROOMS ----
class MeetingRoomIn(BaseModel):
    name: str
    name_en: Optional[str] = ""
    capacity: int
    price: float
    currency: str = "ريال/ساعة"
    image: Optional[str] = ""
    images: List[str] = Field(default_factory=list)
    description: Optional[str] = ""
    description_en: Optional[str] = ""
    order: int = 0
    active: bool = True
    booked_slots: List[str] = Field(default_factory=list)


class MeetingRoomOut(MeetingRoomIn):
    id: str


# ---- BOOKINGS ----
class DeskBookingIn(BaseModel):
    name: str
    phone: str
    email: EmailStr
    num_desks: int


class OfficeBookingIn(BaseModel):
    name: str
    phone: str
    email: EmailStr
    office_id: str


class MeetingRoomBookingIn(BaseModel):
    name: str
    phone: str
    email: EmailStr
    room_id: str
    date: str
    time_slot: str


class BookingOut(BaseModel):
    id: str
    type: str
    status: str
    name: str
    phone: str
    email: str
    details: Dict[str, Any]
    notes: Optional[str] = ""
    created_at: str
    updated_at: Optional[str] = None


class BookingStatusUpdate(BaseModel):
    status: str  # pending | confirmed | rejected | cancelled
    notes: Optional[str] = ""


class BookingResponse(BaseModel):
    id: str
    status: str
    message: str


# ---- CONTACT MESSAGES ----
class ContactIn(BaseModel):
    name: str
    phone: str
    email: EmailStr
    service_type: str
    message: str


class ContactOut(BaseModel):
    id: str
    name: str
    phone: str
    email: str
    service_type: str
    message: str
    status: str  # new | read | replied | archived
    created_at: str


class MessageStatusUpdate(BaseModel):
    status: str


# ---- CMS CONTENT BLOCKS ----
class ContentBlockIn(BaseModel):
    # key comes from URL path on PUT /admin/content/{key}; accepted here for convenience
    key: Optional[str] = None
    ar: Dict[str, Any] = Field(default_factory=dict)
    en: Dict[str, Any] = Field(default_factory=dict)
    active: bool = True


class ContentBlockOut(ContentBlockIn):
    updated_at: Optional[str] = None


# ---- SETTINGS (singleton doc with key="site") ----
class SiteSettings(BaseModel):
    phone: str = "0535420969"
    email: str = "info@kun.com"
    whatsapp: str = "0535420969"
    address_ar: str = "طريق الملك سلمان"
    address_en: str = "King Salman Road"
    map_embed: str = ""
    map_lat: float = 24.7136
    map_lng: float = 46.6753
    social: Dict[str, str] = Field(default_factory=dict)  # {twitter, instagram, linkedin, ...}
    admin_notify_email: str = "aalnhari@ilogic.com.sa"
