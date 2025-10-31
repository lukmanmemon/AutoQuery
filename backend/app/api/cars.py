from fastapi import APIRouter, Query
from app.services.car_service import get_all_cars

router = APIRouter()

@router.get("/")
def read_cars(page: int = Query(1, ge = 1), page_size: int = Query(20, ge = 1, le = 100)):
    return get_all_cars(page = page, page_size = page_size)
