import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def get_database():
    mongo_url = os.getenv('MONGO_URL')

    if(mongo_url is None):
        raise ValueError(f"mongo_url no encontrada")

    client = MongoClient(mongo_url)

    return client['Gestor_Sanitario']