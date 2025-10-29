import pandas as pd
from utils.qdrant_client import client
from services.embeddings import get_embedding
from qdrant_client.http import models
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

COLLECTION_NAME = "cars_collection"
DATA_PATH = "data/cleaned_car_dataset_with_images.csv"
INR_TO_CAD = 0.016  # adjust based on current rate

df = pd.read_csv(DATA_PATH)

# Create collection (if not exists)
if not client.collection_exists(COLLECTION_NAME):
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE),
    )
else:
    print(f"Collection '{COLLECTION_NAME}' already exists, skipping creation.")


required_columns = ['name', 'year', 'price', 'km_driven', 'fuel', 'seller_type', 'transmission', 'owner', 'mileage', 'engine', 'max_power', 'torque', 'seats']
points = []
skipped_rows = 0

for idx, row in df.iterrows():
    # Check if required columns are empty
    if row[required_columns].isnull().any():
        skipped_rows += 1
        continue

    price_cad = int(row['price'] * INR_TO_CAD)

    description = (
        f"{row['name']} - {row['year']} - INR {row['price']} (~CAD {price_cad}) - {row['km_driven']} - "
        f"{row['fuel']} - {row['seller_type']} - {row['transmission']} - {row['owner']} - "
        f"{row['mileage']} - {row['engine']} - {row['max_power']} - {row['torque']} - "
        f"{row['seats']}"
    )

    payload = row.to_dict()
    payload['price_cad'] = price_cad

    vector = get_embedding(description)
    
    points.append(
        models.PointStruct(
            id=int(idx),
            vector=vector,
            payload=payload
        )
    )

for i, point in enumerate(points):
    try:
        client.upsert(collection_name=COLLECTION_NAME, points=[point])
    except Exception as e:
        logger.error(f"Failed to upload point {point.id}: {e}")

print(f"✅ Uploaded {len(points)} car entries to Qdrant!")
