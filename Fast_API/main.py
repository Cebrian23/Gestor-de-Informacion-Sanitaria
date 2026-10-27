from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from connection import get_database
from extract_tables import extract_tables

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.get("/")
def read_root():
    return {"Hello World"}

@app.get("/users")
def get_Users():
    db = get_database()

    usersCollection = db["Users"]

    users = usersCollection.find()
    data_users = []

    for u in users:
        print(u)
        data_users.append(
            {
                "id": str(u["_id"]),
                "name": u["name"],
                "surname_1": u["surname_1"],
                "surname_2": u["surname_2"],
                "email": u["email"],
                "phone_prefix": u["phone_prefix"],
                "phone_number": u["phone_number"],
            }
        )

    return data_users

@app.post("/read_document")
def read_document(file: UploadFile = File(...)):
    file.file.seek(0)
    data = extract_tables(file.file)
    
    return data