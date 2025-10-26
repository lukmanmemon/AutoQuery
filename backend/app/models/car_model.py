from pydantic import BaseModel

class Car(BaseModel):
    name: str
    year: int
    price: str
    image_url: str
    mileage: int
    fuel: str
    transmission: str
