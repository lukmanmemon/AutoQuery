from fastapi import APIRouter, Query
from ..services.search_service import search_cars

router = APIRouter()

@router.get("/")
def search(query: str = Query(..., description="Search term"), limit: int = 5):
    # Search for similar cars based on the input query.
    results = search_cars(query, limit)
    return {"query": query, "results": results}
