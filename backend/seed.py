"""Seed initial data: admin user, offices, shared desks, meeting rooms, CMS content, settings."""
import os
import uuid
from datetime import datetime, timezone

from auth_utils import hash_password, verify_password
from database import get_db


OFFICE_IMAGES = {
    "set_a": [
        "https://images.unsplash.com/photo-1746021451691-4385f318ec13?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85",
        "https://images.unsplash.com/photo-1637665662134-db459c1bbb46?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBvZmZpY2UlMjBtZWV0aW5nJTIwcm9vbXxlbnwwfHx8fDE3NzYyNTc2OTV8MA&ixlib=rb-4.1.0&q=85",
        "https://images.unsplash.com/photo-1770993151375-0dee97eda931?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBtZWV0aW5nJTIwcm9vbSUyMGdsYXNzJTIwb2ZmaWNlfGVufDB8fHx8MTc3NjI1NzY4OHww&ixlib=rb-4.1.0&q=85",
    ],
    "set_b": [
        "https://images.unsplash.com/photo-1746021375246-7dc8ab0583f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85",
        "https://images.unsplash.com/photo-1772751541531-e084e8f56630?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85",
        "https://images.unsplash.com/photo-1765366417046-f46361a7f26f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85",
    ],
    "set_c": [
        "https://images.unsplash.com/photo-1765366417077-dc1a6fbd5e34?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85",
        "https://images.unsplash.com/photo-1746021451691-4385f318ec13?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85",
        "https://images.unsplash.com/photo-1746021375246-7dc8ab0583f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85",
    ],
}

INITIAL_OFFICES = [
    {"name": "مكتب ١", "name_en": "Office 1", "capacity": 2, "price": 2500, "available": True, "reserved_until": None, "images": OFFICE_IMAGES["set_a"], "order": 1},
    {"name": "مكتب ٢", "name_en": "Office 2", "capacity": 4, "price": 4500, "available": True, "reserved_until": None, "images": OFFICE_IMAGES["set_b"], "order": 2},
    {"name": "مكتب ٣", "name_en": "Office 3", "capacity": 6, "price": 6500, "available": False, "reserved_until": "2025-03-15", "images": OFFICE_IMAGES["set_c"], "order": 3},
    {"name": "مكتب ٤", "name_en": "Office 4", "capacity": 3, "price": 3500, "available": True, "reserved_until": None, "images": [OFFICE_IMAGES["set_a"][1], OFFICE_IMAGES["set_b"][1], OFFICE_IMAGES["set_c"][1]], "order": 4},
    {"name": "مكتب ٥", "name_en": "Office 5", "capacity": 8, "price": 8500, "available": False, "reserved_until": "2025-02-28", "images": [OFFICE_IMAGES["set_b"][1], OFFICE_IMAGES["set_c"][1], OFFICE_IMAGES["set_a"][1]], "order": 5},
    {"name": "مكتب ٦", "name_en": "Office 6", "capacity": 5, "price": 5500, "available": True, "reserved_until": None, "images": [OFFICE_IMAGES["set_c"][2], OFFICE_IMAGES["set_a"][2], OFFICE_IMAGES["set_b"][2]], "order": 6},
]

INITIAL_ROOMS = [
    {
        "name": "قاعة الاجتماعات ١",
        "name_en": "Meeting Room 1",
        "capacity": 8,
        "price": 150,
        "currency": "ريال/ساعة",
        "image": "https://images.unsplash.com/photo-1770993151375-0dee97eda931?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBtZWV0aW5nJTIwcm9vbSUyMGdsYXNzJTIwb2ZmaWNlfGVufDB8fHx8MTc3NjI1NzY4OHww&ixlib=rb-4.1.0&q=85",
        "images": [],
        "order": 1,
        "active": True,
        "booked_slots": ["2025-01-15T09:00", "2025-01-15T10:00", "2025-01-16T14:00"],
    },
    {
        "name": "قاعة الاجتماعات ٢",
        "name_en": "Meeting Room 2",
        "capacity": 12,
        "price": 250,
        "currency": "ريال/ساعة",
        "image": "https://images.unsplash.com/photo-1637665662134-db459c1bbb46?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBvZmZpY2UlMjBtZWV0aW5nJTIwcm9vbXxlbnwwfHx8fDE3NzYyNTc2OTV8MA&ixlib=rb-4.1.0&q=85",
        "images": [],
        "order": 2,
        "active": True,
        "booked_slots": ["2025-01-15T11:00", "2025-01-17T09:00"],
    },
]

INITIAL_SHARED_DESKS = {
    "price": 800,
    "currency": "ريال/شهر",
    "total_seats": 30,
    "available_seats": 12,
    "occupied_seats": 18,
    "image": "https://images.unsplash.com/photo-1765366417046-f46361a7f26f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85",
    "description": "مكان مشترك عصري للعمل المنتج مع جميع الخدمات الأساسية.",
    "description_en": "Modern shared workspace with all essentials included.",
    "active": True,
}

INITIAL_SETTINGS = {
    "phone": "0535420969",
    "email": "info@kun.com",
    "whatsapp": "0535420969",
    "address_ar": "طريق الملك سلمان",
    "address_en": "King Salman Road",
    "map_embed": "",
    "map_lat": 24.7136,
    "map_lng": 46.6753,
    "social": {"twitter": "", "instagram": "", "linkedin": ""},
    "admin_notify_email": "aalnhari@ilogic.com.sa",
}

INITIAL_CONTENT_BLOCKS = [
    {
        "key": "home_hero",
        "ar": {
            "eyebrow": "حلول مساحات عمل متكاملة",
            "title": "كُنْ حيث يبدأ العمل الحقيقي",
            "subtitle": "مكاتب خاصة، مساحات مشتركة، وقاعات اجتماعات في قلب الرياض.",
            "cta_primary": "احجز جولتك المجانية",
            "cta_secondary": "تعرّف على المساحات",
        },
        "en": {
            "eyebrow": "Integrated workspace solutions",
            "title": "KUN — where real work begins",
            "subtitle": "Private offices, shared desks, and meeting rooms in the heart of Riyadh.",
            "cta_primary": "Book your free tour",
            "cta_secondary": "Explore spaces",
        },
        "active": True,
    },
    {
        "key": "home_about",
        "ar": {
            "title": "من نحن",
            "body": "نوفّر بيئة عمل مرنة ومتكاملة للأفراد والشركات، مصممة لتعزيز الإنتاجية والإبداع.",
        },
        "en": {
            "title": "About Us",
            "body": "A flexible, fully-equipped workspace designed for individuals and companies to stay productive and creative.",
        },
        "active": True,
    },
    {
        "key": "services_overview",
        "ar": {
            "title": "خدماتنا",
            "items": [
                {"title": "المساحات", "description": "مكاتب خاصة ومشتركة وقاعات اجتماعات."},
                {"title": "خدمات الأعمال", "description": "استشارات قانونية وموارد بشرية وحلول ريادة الأعمال."},
                {"title": "الكبسولة الذكية", "description": "مساحة ذكية مخصصة للعمل الفردي المركّز."},
            ],
        },
        "en": {
            "title": "Our Services",
            "items": [
                {"title": "Spaces", "description": "Private offices, shared desks, and meeting rooms."},
                {"title": "Business Services", "description": "Legal, HR, and entrepreneurship support."},
                {"title": "Smart Pod", "description": "A focused smart workspace for deep individual work."},
            ],
        },
        "active": True,
    },
]


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


async def seed_admin():
    db = get_db()
    admin_email = os.environ["ADMIN_EMAIL"].lower().strip()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "name": "Admin",
            "role": "admin",
            "password_hash": hash_password(admin_password),
            "created_at": _now_iso(),
        })
        print(f"[seed] created admin user: {admin_email}")
    elif not verify_password(admin_password, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        print(f"[seed] updated admin password for: {admin_email}")


async def seed_offices():
    db = get_db()
    count = await db.offices.count_documents({})
    if count > 0:
        return
    for entry in INITIAL_OFFICES:
        doc = {
            "id": str(uuid.uuid4()),
            "name": entry["name"],
            "name_en": entry.get("name_en", ""),
            "capacity": entry["capacity"],
            "price": entry["price"],
            "currency": "ريال/شهر",
            "available": entry["available"],
            "reserved_until": entry.get("reserved_until"),
            "image": entry["images"][0] if entry.get("images") else "",
            "images": entry.get("images", []),
            "description": "",
            "description_en": "",
            "order": entry.get("order", 0),
            "active": True,
        }
        await db.offices.insert_one(doc)
    print(f"[seed] inserted {len(INITIAL_OFFICES)} offices")


async def seed_rooms():
    db = get_db()
    count = await db.meeting_rooms.count_documents({})
    if count > 0:
        return
    for entry in INITIAL_ROOMS:
        doc = {
            "id": str(uuid.uuid4()),
            "name": entry["name"],
            "name_en": entry.get("name_en", ""),
            "capacity": entry["capacity"],
            "price": entry["price"],
            "currency": entry["currency"],
            "image": entry["image"],
            "images": entry.get("images", []),
            "description": "",
            "description_en": "",
            "order": entry["order"],
            "active": entry["active"],
            "booked_slots": entry["booked_slots"],
        }
        await db.meeting_rooms.insert_one(doc)
    print(f"[seed] inserted {len(INITIAL_ROOMS)} rooms")


async def seed_shared_desks():
    db = get_db()
    existing = await db.shared_desks.find_one({"key": "singleton"})
    if existing:
        return
    doc = {**INITIAL_SHARED_DESKS, "key": "singleton"}
    await db.shared_desks.insert_one(doc)
    print("[seed] inserted shared desks singleton")


async def seed_settings():
    db = get_db()
    existing = await db.settings.find_one({"key": "site"})
    if existing:
        return
    doc = {**INITIAL_SETTINGS, "key": "site"}
    await db.settings.insert_one(doc)
    print("[seed] inserted site settings")


async def seed_content():
    db = get_db()
    for block in INITIAL_CONTENT_BLOCKS:
        existing = await db.content_blocks.find_one({"key": block["key"]})
        if existing:
            continue
        doc = {**block, "updated_at": _now_iso()}
        await db.content_blocks.insert_one(doc)
    print("[seed] ensured content blocks")


async def ensure_indexes():
    db = get_db()
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.offices.create_index("id", unique=True)
    await db.meeting_rooms.create_index("id", unique=True)
    await db.bookings.create_index("id", unique=True)
    await db.bookings.create_index("created_at")
    await db.messages.create_index("id", unique=True)
    await db.messages.create_index("created_at")
    await db.content_blocks.create_index("key", unique=True)


async def run_all():
    await ensure_indexes()
    await seed_admin()
    await seed_offices()
    await seed_rooms()
    await seed_shared_desks()
    await seed_settings()
    await seed_content()
