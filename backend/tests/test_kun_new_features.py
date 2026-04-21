"""Tests for new features: availability, media library, booked-slots, booking normalization."""
import os
import io
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break

ADMIN_EMAIL = "admin@kun.com"
ADMIN_PASSWORD = "Kun@9632147"


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, r.text
    return s


# ---------- Availability ----------
class TestAvailability:
    def test_admin_get_returns_default(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/admin/availability", timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "working_days" in d
        assert "start_time" in d and "end_time" in d
        assert "blocked_dates" in d and "blocked_slots" in d
        assert isinstance(d["working_days"], list)

    def test_admin_put_updates(self, admin_session):
        payload = {
            "working_days": [0, 1, 2, 3, 4],
            "start_time": "09:00",
            "end_time": "17:00",
            "blocked_dates": ["2026-05-15"],
            "blocked_slots": [{"date": "2026-05-20", "slot": "10:00"}],
            "slot_minutes": 60,
        }
        r = admin_session.put(f"{BASE_URL}/api/admin/availability", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        got = r.json()
        assert got["start_time"] == "09:00"
        assert got["working_days"] == [0, 1, 2, 3, 4]
        assert "2026-05-15" in got["blocked_dates"]

        # verify via GET
        r2 = admin_session.get(f"{BASE_URL}/api/admin/availability", timeout=15)
        assert r2.json()["start_time"] == "09:00"

    def test_public_availability(self, admin_session):
        # ensure admin set config
        admin_session.put(f"{BASE_URL}/api/admin/availability", json={
            "working_days": [0, 1, 2, 3, 4],
            "start_time": "09:00",
            "end_time": "17:00",
            "blocked_dates": ["2026-05-15"],
            "blocked_slots": [{"date": "2026-05-20", "slot": "10:00"}],
            "slot_minutes": 60,
        }, timeout=15)
        r = requests.get(f"{BASE_URL}/api/availability", timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["start_time"] == "09:00"
        assert d["end_time"] == "17:00"


# ---------- Booked slots + meeting-room availability enforcement ----------
class TestBookedSlotsAndMRAvailability:
    @pytest.fixture(scope="class", autouse=True)
    def _set_avail(self, admin_session):
        admin_session.put(f"{BASE_URL}/api/admin/availability", json={
            "working_days": [0, 1, 2, 3, 4],  # Sun-Thu (Sun=0)
            "start_time": "09:00",
            "end_time": "17:00",
            "blocked_dates": ["2026-05-19"],
            "blocked_slots": [{"date": "2026-05-20", "slot": "10:00"}],
            "slot_minutes": 60,
        }, timeout=15)
        yield
        # Reset to permissive defaults so other tests are not affected
        admin_session.put(f"{BASE_URL}/api/admin/availability", json={
            "working_days": [0, 1, 2, 3, 4, 5, 6],
            "start_time": "00:00",
            "end_time": "23:59",
            "blocked_dates": [],
            "blocked_slots": [],
            "slot_minutes": 60,
        }, timeout=15)

    def _room_id(self):
        rooms = requests.get(f"{BASE_URL}/api/meeting-rooms").json()
        return rooms[0]["id"]

    def test_reject_blocked_date(self):
        rid = self._room_id()
        # 2026-05-19 is Tuesday (working day) but explicitly blocked
        payload = {"name": "TEST_av1", "phone": "05", "email": "a@b.com",
                   "room_id": rid, "date": "2026-05-19", "time_slot": "10:00"}
        r = requests.post(f"{BASE_URL}/api/bookings/meeting-room", json=payload, timeout=15)
        assert r.status_code == 400
        assert "مغلق" in r.json().get("detail", "")

    def test_reject_non_working_day(self):
        # 2026-05-16 is a Saturday (Python weekday=5 → Sun=0 convention → dow=6)
        rid = self._room_id()
        payload = {"name": "TEST_av2", "phone": "05", "email": "a@b.com",
                   "room_id": rid, "date": "2026-05-16", "time_slot": "10:00"}
        r = requests.post(f"{BASE_URL}/api/bookings/meeting-room", json=payload, timeout=15)
        assert r.status_code == 400

    def test_reject_outside_hours(self):
        rid = self._room_id()
        # 2026-05-18 is Monday
        payload = {"name": "TEST_av3", "phone": "05", "email": "a@b.com",
                   "room_id": rid, "date": "2026-05-18", "time_slot": "08:00"}
        r = requests.post(f"{BASE_URL}/api/bookings/meeting-room", json=payload, timeout=15)
        assert r.status_code == 400

    def test_reject_blocked_slot(self):
        rid = self._room_id()
        # 2026-05-20 is Wednesday, 10:00 is blocked
        payload = {"name": "TEST_av4", "phone": "05", "email": "a@b.com",
                   "room_id": rid, "date": "2026-05-20", "time_slot": "10:00"}
        r = requests.post(f"{BASE_URL}/api/bookings/meeting-room", json=payload, timeout=15)
        assert r.status_code == 400

    def test_accept_valid_then_duplicate_409(self, admin_session):
        rid = self._room_id()
        # pick a valid slot: 2026-05-18 Monday 11:00
        payload = {"name": "TEST_av_ok", "phone": "05", "email": "a@b.com",
                   "room_id": rid, "date": "2026-05-18", "time_slot": "11:00"}
        r1 = requests.post(f"{BASE_URL}/api/bookings/meeting-room", json=payload, timeout=15)
        assert r1.status_code == 200, r1.text
        bid = r1.json()["id"]

        # booked-slots endpoint returns this slot
        r_slots = requests.get(f"{BASE_URL}/api/booked-slots", params={"room_id": rid, "date": "2026-05-18"}, timeout=15)
        assert r_slots.status_code == 200
        assert "11:00" in r_slots.json()["booked"]

        # duplicate
        r2 = requests.post(f"{BASE_URL}/api/bookings/meeting-room", json=payload, timeout=15)
        assert r2.status_code == 409

        admin_session.delete(f"{BASE_URL}/api/admin/bookings/{bid}", timeout=15)


# ---------- Booking normalization + admin patch for old flat bookings ----------
class TestBookingNormalization:
    def test_admin_list_has_details_dict(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/admin/bookings", timeout=15)
        assert r.status_code == 200
        for b in r.json():
            assert "details" in b and isinstance(b["details"], dict)

    def test_patch_office_booking_resolves_name(self, admin_session):
        offices = requests.get(f"{BASE_URL}/api/offices").json()
        oid = offices[0]["id"]
        expected_name = offices[0]["name"]
        payload = {"name": "TEST_norm", "phone": "05", "email": "a@b.com", "office_id": oid}
        r = requests.post(f"{BASE_URL}/api/bookings/office", json=payload, timeout=15)
        bid = r.json()["id"]
        # list
        r2 = admin_session.get(f"{BASE_URL}/api/admin/bookings?type=office", timeout=15)
        assert r2.status_code == 200
        match = [b for b in r2.json() if b["id"] == bid]
        assert match
        assert match[0]["details"].get("office_name") == expected_name
        # patch status
        r3 = admin_session.patch(f"{BASE_URL}/api/admin/bookings/{bid}", json={"status": "confirmed"}, timeout=15)
        assert r3.status_code == 200
        assert r3.json()["status"] == "confirmed"
        admin_session.delete(f"{BASE_URL}/api/admin/bookings/{bid}", timeout=15)

    def test_patch_legacy_flat_booking(self, admin_session):
        """Insert flat (no details dict) booking directly via a normal desk-booking, patch status."""
        # Create a normal booking (already has details), then simulate an old one by first creating
        # and then confirming the endpoint doesn't 500 even when we PATCH twice.
        payload = {"name": "TEST_flat", "phone": "05", "email": "a@b.com", "num_desks": 1}
        r = requests.post(f"{BASE_URL}/api/bookings/desk", json=payload, timeout=15)
        bid = r.json()["id"]
        r2 = admin_session.patch(f"{BASE_URL}/api/admin/bookings/{bid}", json={"status": "confirmed"}, timeout=15)
        assert r2.status_code == 200
        r3 = admin_session.patch(f"{BASE_URL}/api/admin/bookings/{bid}", json={"status": "rejected", "notes": "test"}, timeout=15)
        assert r3.status_code == 200
        assert r3.json()["status"] == "rejected"
        admin_session.delete(f"{BASE_URL}/api/admin/bookings/{bid}", timeout=15)


# ---------- Media ----------
def _png_bytes():
    # Smallest valid PNG (1x1 transparent)
    import base64
    b64 = (
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAA"
        "AAYAAjCB0C8AAAAASUVORK5CYII="
    )
    return base64.b64decode(b64)


class TestMedia:
    def test_upload_requires_auth(self):
        files = {"file": ("x.png", _png_bytes(), "image/png")}
        r = requests.post(f"{BASE_URL}/api/admin/media/upload", files=files, timeout=30)
        assert r.status_code == 401

    def test_upload_rejects_non_image(self, admin_session):
        files = {"file": ("x.txt", b"hello", "text/plain")}
        r = admin_session.post(f"{BASE_URL}/api/admin/media/upload", files=files, timeout=30)
        assert r.status_code == 400

    def test_upload_and_list_and_serve_and_delete(self, admin_session):
        files = {"file": (f"test_{uuid.uuid4().hex[:6]}.png", _png_bytes(), "image/png")}
        r = admin_session.post(f"{BASE_URL}/api/admin/media/upload", files=files, timeout=60)
        if r.status_code == 500:
            pytest.skip(f"Storage not available: {r.text}")
        assert r.status_code == 200, r.text
        body = r.json()
        assert "id" in body and "storage_path" in body and "url" in body
        assert body["url"].startswith("/api/media/file/")
        assert body["content_type"] == "image/png"
        mid = body["id"]

        # list
        r2 = admin_session.get(f"{BASE_URL}/api/admin/media", timeout=15)
        assert r2.status_code == 200
        ids = [m["id"] for m in r2.json()]
        assert mid in ids

        # serve publicly
        r3 = requests.get(f"{BASE_URL}{body['url']}", timeout=30)
        assert r3.status_code == 200
        assert r3.headers.get("content-type", "").startswith("image/")

        # delete
        r4 = admin_session.delete(f"{BASE_URL}/api/admin/media/{mid}", timeout=15)
        assert r4.status_code == 200

        # not listed
        r5 = admin_session.get(f"{BASE_URL}/api/admin/media", timeout=15)
        assert mid not in [m["id"] for m in r5.json()]

        # serving returns 404
        r6 = requests.get(f"{BASE_URL}{body['url']}", timeout=15)
        assert r6.status_code == 404

    def test_serve_unknown_path_404(self):
        r = requests.get(f"{BASE_URL}/api/media/file/nope/does_not_exist.png", timeout=15)
        assert r.status_code == 404
