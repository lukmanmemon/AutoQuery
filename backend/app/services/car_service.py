import pandas as pd
from pathlib import Path
import numpy as np

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "cleaned_car_dataset_with_images.csv"
df = pd.read_csv(DATA_PATH)
clean_df = df.copy()
clean_df = clean_df.replace([np.nan, np.inf, -np.inf], None)

def get_all_cars(page: int = 1, page_size: int = 20):
    start = (page - 1) * page_size
    end = start + page_size

    car_data = {}
    car_data['total_count'] = len(df)
    car_data['results'] = clean_df.iloc[start:end].to_dict(orient="records")
    
    return car_data

