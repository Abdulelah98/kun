"""KUN Workspace API Tests"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestGetEndpoints:
    """Test all GET endpoints"""

    def test_offices(self):
        r = requests.get(f"{BASE_URL}/api/offices")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 6
        assert "id" in data[0]
        assert "price" in data[0]
        assert "available" in data[0]

    def test_shared_desks(self):
        r = requests.get(f"{BASE_URL}/api/shared-desks")
        assert r.status_code == 200
        data = r.json()
        assert "price" in data
        assert "total_seats" in data
        assert "available_seats" in data
        assert "occupied_seats" in data

    def test_meeting_rooms(self):
        r = requests.get(f"{BASE_URL}/api/meeting-rooms")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 2
        assert "id" in data[0]
        assert "capacity" in data[0]


class TestPostEndpoints:
    """Test all POST endpoints"""

    def test_contact_form(self):
        payload = {
            "name": "TEST_User",
            "phone": "0500000000",
            "email": "test@test.com",
            "service_type": "shared_desk",
            "message": "Test message"
        }
        r = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["name"] == "TEST_User"
        assert "id" in data
        assert "created_at" in data

    def test_book_desk(self):
        payload = {
            "name": "TEST_DeskUser",
            "phone": "0500000001",
            "email": "desk@test.com",
            "num_desks": 2
        }
        r = requests.post(f"{BASE_URL}/api/bookings/desk", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "pending"
        assert "id" in data

    def test_book_office(self):
        payload = {
            "name": "TEST_OfficeUser",
            "phone": "0500000002",
            "email": "office@test.com",
            "office_id": "office-1"
        }
        r = requests.post(f"{BASE_URL}/api/bookings/office", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "pending"
        assert "id" in data

    def test_book_meeting_room(self):
        payload = {
            "name": "TEST_MeetingUser",
            "phone": "0500000003",
            "email": "meeting@test.com",
            "room_id": "room-1",
            "date": "2026-03-01",
            "time_slot": "09:00"
        }
        r = requests.post(f"{BASE_URL}/api/bookings/meeting-room", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "pending"
        assert "id" in data

    def test_contact_form_missing_fields(self):
        r = requests.post(f"{BASE_URL}/api/contact", json={"name": "Test"})
        assert r.status_code == 422
