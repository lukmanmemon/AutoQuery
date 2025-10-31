from app.utils.qdrant_client import client
from app.services.embeddings import get_embedding
from qdrant_client.http import models
import re

COLLECTION_NAME = "cars_collection"

def extract_filters(query: str):
    filters = {}
    query_lowercase = query.lower()

    if "manual" in query_lowercase:
        filters["transmission"] = "Manual"
    elif "automatic" in query_lowercase:
        filters["transmission"] = "Automatic"

    if "diesel" in query_lowercase:
        filters["fuel"] = "Diesel"
    elif "petrol" in query_lowercase:
        filters["fuel"] = "Petrol"
    elif "cng" in query_lowercase:
        filters["fuel"] = "CNG"
    elif "lpg" in query_lowercase:
        filters["fuel"] = "LPG"
    elif "electric" in query_lowercase:
        filters["fuel"] = "Electric"

    if "individual" in query_lowercase:
        filters["seller_type"] = "Individual"
    elif "dealer" in query_lowercase:
        filters["seller_type"] = "Dealer"
    
    if "first owner" in query_lowercase:
        filters["owner"] = "First Owner"
    elif "second owner" in query_lowercase:
        filters["owner"] = "Second Owner"
    elif "third owner" in query_lowercase:
        filters["owner"] = "Third Owner"
    elif "fourth owner" in query_lowercase:
        filters["owner"] = "Fourth & Above Owner"

    # === Year Filters ===
    # e.g. "after 2015", "newer than 2018", "before 2010"
    if match := re.search(r"(?:after|newer than|from)\s*(20\d{2})", query_lowercase):
        filters["year_min"] = int(match.group(1))
    elif match := re.search(r"(?:before|older than|until)\s*(20\d{2})", query_lowercase):
        filters["year_max"] = int(match.group(1))
    elif match := re.search(r"\b(19\d{2}|20\d{2})\b", query_lowercase):
        # Exact year match if just a year is mentioned
        filters["year_exact"] = int(match.group(1))

    # === KM Driven Filters ===
    # Examples: "under 100,000 km", "below 150,000 kilometers"
    km_match = re.search(
        r"(?:under|less than|below)\s*([\d,]+)\s*(km|kms|kilometer|kilometre|kilometers|kilometres)",
        query_lowercase
    )

    if km_match:
        num_str = km_match.group(1).replace(",", "").strip()
        km_value = int(num_str)
        filters["km_driven_max"] = km_value
        print(f"[DEBUG] Parsed km_driven_max = {filters['km_driven_max']} from query: {query}")

    # === Price (in CAD) Filters ===
    # Handles: "$20,000", "under 15k CAD", "below 15,000 dollars", "between 10,000 and 25,000 CAD"
    price_range = re.search(
        r"between\s*\$?([\d,]+)(?:\s*(?:and|to)\s*\$?([\d,]+))?",
        query_lowercase
    )

    price_max = re.search(
        r"(?:under|below|less than|upto|underneath)\s*\$?([\d,]+(?:\.\d+)?)(?:\s*(k|cad|dollars)?)",
        query_lowercase
    )

    def parse_price(number_str, unit=None):
        """Helper: parse price strings like '20,000' or '20k' into integer"""
        number_str = number_str.replace(",", "")
        number = float(number_str)
        if unit == "k":
            number *= 1000
        return int(number)

    if price_range and price_range.group(1) and price_range.group(2):
        filters["price_cad_min"] = parse_price(price_range.group(1))
        filters["price_cad_max"] = parse_price(price_range.group(2))
    elif price_max:
        number = price_max.group(1)
        unit = price_max.group(2)
        filters["price_cad_max"] = parse_price(number, unit)
    
    return filters

def search_cars(query: str, top_k: int = 5):
    """
    Given a search query, returns the most semantically similar cars.
    """

    # Extract possible filters from user query
    filter_dict = extract_filters(query)

    # Convert dict to Qdrant filter format
    conditions = []

    if filter_dict:
        for key, value in filter_dict.items():
            # Handle numeric range filters
            if key == "year_min":
                conditions.append(
                    models.FieldCondition(
                        key="year",
                        range=models.Range(gte=value)
                    )
                )
            elif key == "year_max":
                conditions.append(
                    models.FieldCondition(
                        key="year",
                        range=models.Range(lte=value)
                    )
                )
            elif key == "year_exact":
                conditions.append(
                    models.FieldCondition(
                        key="year",
                        match=models.MatchValue(value=value)
                    )
                )
            elif key == "km_driven_max":
                conditions.append(
                    models.FieldCondition(
                        key="km_driven",
                        range=models.Range(lte=value)
                    )
                )
            elif key == "price_cad_min":
                conditions.append(
                    models.FieldCondition(key="price_cad", range=models.Range(gte=value))
                )
            elif key == "price_cad_max":
                conditions.append(
                    models.FieldCondition(key="price_cad", range=models.Range(lte=value))
                )
            # Handle categorical (exact match) filters
            else:
                conditions.append(
                    models.FieldCondition(
                        key=key,
                        match=models.MatchValue(value=value)
                    )
                )

        qdrant_filter = models.Filter(must=conditions)
    else:
        qdrant_filter = None
    
    query_vector = get_embedding(query)
    
    search_result = client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_vector,
        limit=top_k,
        with_payload=True,
        query_filter=qdrant_filter,
        score_threshold=0.3
    )

    # Format results nicely
    results = [
        {
            "id": hit.id,
            "score": hit.score,
            "car": hit.payload
        }
        for hit in search_result
    ]
    return results
