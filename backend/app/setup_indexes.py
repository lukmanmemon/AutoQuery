from qdrant_client.http import models
from app.utils.qdrant_client import client

COLLECTION_NAME = "cars_collection"
field_names = ["year", "km_driven", "price", "price_cad"]

# Create integer index for numeric fields
for field_name in field_names:
    client.create_payload_index(
    collection_name=COLLECTION_NAME,
    field_name=field_name,
    field_schema=models.PayloadSchemaType.INTEGER
    )

print("✅ Numeric indexes created for 'year', 'km_driven', 'price' and 'price_cad'.")
