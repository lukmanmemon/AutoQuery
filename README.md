# AutoQuery
🚗 🔍  A semantic search app for cars

The app can be viewed at: {placeholder_url}

## Tech Stack
| Component      | Technology     |
|----------------|----------------|
| **Backend**    | FastAPI (Python)    |
| **Database**   | Qdrant         |
| **Frontend**   | React.js + TypeScript |
| **Styling**    | Tailwind CSS   |
| **Deployment** |    |

## Dataset
The data used for this project is a vehicle [dataset](https://www.kaggle.com/datasets/nehalbirla/vehicle-dataset-from-cardekho) from Kaggle. It is a dataset consisting of 8,000+ vehicles from India's car marketplace CarDekho. Prices were converted to Canadian dollars based on the conversion rate.

It does not include images for each vehicle. Thus, a Python script was used to fetch an image for each car using [DDGS](https://pypi.org/project/ddgs/) (Python search library) and included in the CSV file.

Limitations:
- Duplicate data within dataset
- Data does not consist of car type e.g. sedan, SUV, coupe etc
