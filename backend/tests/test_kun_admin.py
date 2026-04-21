"""End-to-end backend tests for KUN Workspace admin + public API."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else None
if not BASE_URL:
    # Fallback: read from frontend .env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break

ADMIN_EMAIL = "admin@kun.com"
ADMIN_PASSWORD = "Kun@9632147"


@pytest.fixture(scope="session")
def admin_session():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert data["email"] == ADMIN_EMAIL
    assert data["role"] == "admin"
    # cookie must be set
    assert "access_token" in s.cookies.keys(), f"access_token cookie missing: {s.cookies}"
    return s


@pytest.fixture(scope="session")
def anon_session():
    return requests.Session()


# ---------- Auth ----------
class TestAuth:
    def test_login_success_sets_cookies(self, anon_session):
        s = requests.Session()
        r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200
        body = r.json()
        assert body["email"] == ADMIN_EMAIL
        assert body["role"] == "admin"
        assert "access_token" in s.cookies.keys()
        assert "refresh_token" in s.cookies.keys()

    def test_login_bad_password(self):
        r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=15)
        assert r.status_code == 401

    def test_me_without_cookie(self):
        r = requests.get(f"{BASE_URL}/api/auth/me", timeout=15)
        assert r.status_code == 401

    def test_me_with_cookie(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/auth/me", timeout=15)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_admin_requires_auth(self):
        r = requests.get(f"{BASE_URL}/api/admin/stats", timeout=15)
        assert r.status_code == 401

    def test_logout_clears_cookie(self):
        s = requests.Session()
        s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
        r = s.post(f"{BASE_URL}/api/auth/logout", timeout=15)
        assert r.status_code == 200
        r2 = s.get(f"{BASE_URL}/api/auth/me", timeout=15)
        assert r2.status_code == 401


# ---------- Public content ----------
class TestPublic:
    def test_offices_list(self):
        r = requests.get(f"{BASE_URL}/api/offices", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 6
        for o in data:
            assert "id" in o and "name" in o and "price" in o
            assert "_id" not in o

    def test_shared_desks_singleton(self):
        r = requests.get(f"{BASE_URL}/api/shared-desks", timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "price" in d
        assert d.get("total_seats", 0) >= 1

    def test_meeting_rooms_list(self):
        r = requests.get(f"{BASE_URL}/api/meeting-rooms", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 2

    def test_content_all(self):
        r = requests.get(f"{BASE_URL}/api/content", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, dict)
        assert "home_hero" in data

    def test_content_single(self):
        r = requests.get(f"{BASE_URL}/api/content/home_hero", timeout=15)
        assert r.status_code == 200
        assert r.json()["key"] == "home_hero"

    def test_content_missing(self):
        r = requests.get(f"{BASE_URL}/api/content/does_not_exist_xyz", timeout=15)
        assert r.status_code == 404

    def test_settings(self):
        r = requests.get(f"{BASE_URL}/api/settings", timeout=15)
        assert r.status_code == 200
        assert "phone" in r.json()


# ---------- Contact + bookings ----------
class TestContactAndBookings:
    def test_contact_create_persists(self, admin_session):
        payload = {"name": "TEST_user", "phone": "0500000000", "email": "test@test.com", "service_type": "offices", "message": "hi"}
        r = requests.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 200
        body = r.json()
        assert body["status"] == "new"
        mid = body["id"]
        # verify via admin
        r2 = admin_session.get(f"{BASE_URL}/api/admin/messages", timeout=15)
        assert r2.status_code == 200
        ids = [m["id"] for m in r2.json()]
        assert mid in ids
        # cleanup
        admin_session.delete(f"{BASE_URL}/api/admin/messages/{mid}", timeout=15)

    def test_book_desk(self, admin_session):
        payload = {"name": "TEST_desk", "phone": "0500000001", "email": "a@b.com", "num_desks": 2}
        r = requests.post(f"{BASE_URL}/api/bookings/desk", json=payload, timeout=15)
        assert r.status_code == 200
        bid = r.json()["id"]
        assert r.json()["status"] == "pending"
        admin_session.delete(f"{BASE_URL}/api/admin/bookings/{bid}", timeout=15)

    def test_book_office(self, admin_session):
        offices = requests.get(f"{BASE_URL}/api/offices").json()
        oid = offices[0]["id"]
        payload = {"name": "TEST_office", "phone": "0500000002", "email": "a@b.com", "office_id": oid}
        r = requests.post(f"{BASE_URL}/api/bookings/office", json=payload, timeout=15)
        assert r.status_code == 200
        bid = r.json()["id"]
        admin_session.delete(f"{BASE_URL}/api/admin/bookings/{bid}", timeout=15)

    def test_book_meeting_room_and_duplicate_409(self, admin_session):
        rooms = requests.get(f"{BASE_URL}/api/meeting-rooms").json()
        rid = rooms[0]["id"]
        unique_date = f"2030-0{(abs(hash(uuid.uuid4())) % 9)+1}-15"
        payload = {"name": "TEST_mr", "phone": "0500000003", "email": "a@b.com", "room_id": rid, "date": unique_date, "time_slot": "09:00"}
        r1 = requests.post(f"{BASE_URL}/api/bookings/meeting-room", json=payload, timeout=15)
        assert r1.status_code == 200
        bid = r1.json()["id"]
        # duplicate
        r2 = requests.post(f"{BASE_URL}/api/bookings/meeting-room", json=payload, timeout=15)
        assert r2.status_code == 409
        admin_session.delete(f"{BASE_URL}/api/admin/bookings/{bid}", timeout=15)


# ---------- Admin CRUD ----------
class TestAdmin:
    def test_stats(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/admin/stats", timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "bookings" in d and "messages" in d and "offices" in d

    def test_office_crud(self, admin_session):
        payload = {
            "name": "TEST_office_crud", "name_en": "TEST Office CRUD", "capacity": 4, "price": 1234,
            "currency": "ريال/شهر", "available": True, "reserved_until": None,
            "image": "", "images": [], "description": "", "description_en": "", "order": 99, "active": True,
        }
        r = admin_session.post(f"{BASE_URL}/api/admin/offices", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        oid = r.json()["id"]
        # update
        payload["price"] = 9999
        r2 = admin_session.put(f"{BASE_URL}/api/admin/offices/{oid}", json=payload, timeout=15)
        assert r2.status_code == 200
        assert r2.json()["price"] == 9999
        # list via admin
        r3 = admin_session.get(f"{BASE_URL}/api/admin/offices", timeout=15)
        assert r3.status_code == 200
        assert any(o["id"] == oid for o in r3.json())
        # delete
        r4 = admin_session.delete(f"{BASE_URL}/api/admin/offices/{oid}", timeout=15)
        assert r4.status_code == 200

    def test_meeting_room_crud(self, admin_session):
        payload = {
            "name": "TEST_mr", "name_en": "TEST MR", "capacity": 6, "price": 100, "currency": "ريال/ساعة",
            "image": "", "images": [], "description": "", "description_en": "", "order": 99,
            "active": True, "booked_slots": [],
        }
        r = admin_session.post(f"{BASE_URL}/api/admin/meeting-rooms", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        rid = r.json()["id"]
        payload["price"] = 500
        r2 = admin_session.put(f"{BASE_URL}/api/admin/meeting-rooms/{rid}", json=payload, timeout=15)
        assert r2.status_code == 200 and r2.json()["price"] == 500
        r3 = admin_session.delete(f"{BASE_URL}/api/admin/meeting-rooms/{rid}", timeout=15)
        assert r3.status_code == 200

    def test_shared_desks_update(self, admin_session):
        r_get = admin_session.get(f"{BASE_URL}/api/admin/shared-desks", timeout=15)
        assert r_get.status_code == 200
        current = r_get.json()
        # update price
        original_price = current.get("price", 800)
        current["price"] = 1234
        r = admin_session.put(f"{BASE_URL}/api/admin/shared-desks", json=current, timeout=15)
        assert r.status_code == 200
        assert r.json()["price"] == 1234
        # restore
        current["price"] = original_price
        admin_session.put(f"{BASE_URL}/api/admin/shared-desks", json=current, timeout=15)

    def test_content_upsert(self, admin_session):
        key = f"test_block_{uuid.uuid4().hex[:8]}"
        # NOTE: backend ContentBlockIn schema requires 'key' in body even though
        # endpoint is PUT /api/admin/content/{key}. Including it to make the test pass.
        payload = {"key": key, "ar": {"title": "عنوان"}, "en": {"title": "title"}, "active": True}
        r = admin_session.put(f"{BASE_URL}/api/admin/content/{key}", json=payload, timeout=15)
        assert r.status_code == 200
        # verify via public
        r2 = requests.get(f"{BASE_URL}/api/content/{key}", timeout=15)
        assert r2.status_code == 200
        # cleanup
        admin_session.delete(f"{BASE_URL}/api/admin/content/{key}", timeout=15)

    def test_settings_update(self, admin_session):
        r_get = admin_session.get(f"{BASE_URL}/api/admin/settings", timeout=15)
        assert r_get.status_code == 200
        current = r_get.json()
        original_phone = current.get("phone", "")
        current["phone"] = "0500000099"
        r = admin_session.put(f"{BASE_URL}/api/admin/settings", json=current, timeout=15)
        assert r.status_code == 200
        assert r.json()["phone"] == "0500000099"
        # restore
        current["phone"] = original_phone
        admin_session.put(f"{BASE_URL}/api/admin/settings", json=current, timeout=15)

    def test_bookings_list_with_filter(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/admin/bookings?status=pending", timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_booking_status_update(self, admin_session):
        # create a booking
        payload = {"name": "TEST_patch", "phone": "0500000004", "email": "a@b.com", "num_desks": 1}
        r = requests.post(f"{BASE_URL}/api/bookings/desk", json=payload, timeout=15)
        bid = r.json()["id"]
        r2 = admin_session.patch(f"{BASE_URL}/api/admin/bookings/{bid}", json={"status": "confirmed", "notes": "ok"}, timeout=15)
        assert r2.status_code == 200
        assert r2.json()["status"] == "confirmed"
        admin_session.delete(f"{BASE_URL}/api/admin/bookings/{bid}", timeout=15)

    def test_messages_list(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/admin/messages", timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ---------- Users + roles ----------
class TestUsersAndRoles:
    def test_create_staff_and_role_enforcement(self, admin_session):
        email = f"test_staff_{uuid.uuid4().hex[:6]}@kun.com"
        password = "StaffPass@123"
        r = admin_session.post(
            f"{BASE_URL}/api/admin/users",
            json={"email": email, "password": password, "name": "TEST Staff", "role": "staff"},
            timeout=15,
        )
        assert r.status_code == 200, r.text
        uid = r.json()["id"]
        assert "password_hash" not in r.json()

        # login as staff
        staff_s = requests.Session()
        r_login = staff_s.post(f"{BASE_URL}/api/auth/login", json={"email": email, "password": password}, timeout=15)
        assert r_login.status_code == 200
        assert r_login.json()["role"] == "staff"

        # staff can read
        r_stats = staff_s.get(f"{BASE_URL}/api/admin/stats", timeout=15)
        assert r_stats.status_code == 200
        # staff CANNOT create office (admin only)
        r_forbid = staff_s.post(f"{BASE_URL}/api/admin/offices", json={
            "name": "x", "name_en": "x", "capacity": 1, "price": 1, "currency": "ريال/شهر",
            "available": True, "reserved_until": None, "image": "", "images": [],
            "description": "", "description_en": "", "order": 1, "active": True,
        }, timeout=15)
        assert r_forbid.status_code == 403
        # staff CANNOT list users
        r_users = staff_s.get(f"{BASE_URL}/api/admin/users", timeout=15)
        assert r_users.status_code == 403

        # cleanup
        admin_session.delete(f"{BASE_URL}/api/admin/users/{uid}", timeout=15)

    def test_cannot_delete_own_account(self, admin_session):
        me = admin_session.get(f"{BASE_URL}/api/auth/me", timeout=15).json()
        r = admin_session.delete(f"{BASE_URL}/api/admin/users/{me['id']}", timeout=15)
        assert r.status_code == 400
