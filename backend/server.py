from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path(__file__).parent / ".env")

import os
import logging

from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

from database import close_client
from routes.auth import router as auth_router
from routes.public import router as public_router
from routes.admin import router as admin_router
from seed import run_all as seed_run_all
from storage import init_storage

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="KUN Workspace API")
api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"message": "KUN Workspace API"}


api_router.include_router(auth_router)
api_router.include_router(public_router)
api_router.include_router(admin_router)
app.include_router(api_router)

# CORS: explicit origins with credentials (needed for httpOnly cookies)
_origins_env = os.environ.get("CORS_ORIGINS", "").strip()
_frontend_url = os.environ.get("FRONTEND_URL", "").strip()
_origins: list[str] = []
if _origins_env and _origins_env != "*":
    _origins.extend([o.strip() for o in _origins_env.split(",") if o.strip()])
if _frontend_url and _frontend_url not in _origins:
    _origins.append(_frontend_url)
if not _origins:
    _origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    try:
        await seed_run_all()
    except Exception as e:
        logger.exception("Seed failed: %s", e)
    try:
        init_storage()
    except Exception as e:
        logger.exception("Storage init failed: %s", e)


@app.on_event("shutdown")
async def on_shutdown():
    await close_client()
