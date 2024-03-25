from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"], 
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./uploaded_json_files"


@app.post("/upload/")
async def upload_json_file(file: UploadFile = File(...)):
    try:
        with open(os.path.join(UPLOAD_DIR, file.filename), "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        file.file.close()

    with open(os.path.join(UPLOAD_DIR, file.filename), "r") as uploaded_file:
        file_content = json.load(uploaded_file)

    print(file_content)
    return file_content


HTML_SAVE_DIR = "./saved_html_files"

class HTMLContent(BaseModel):
    html: str

@app.post("/save_html/")
async def save_html_content(content: HTMLContent):
    if not os.path.exists(HTML_SAVE_DIR):
        os.makedirs(HTML_SAVE_DIR)

    try:
        # Generate a unique filename (you can customize this logic as per your requirements)
        filename = f"generated_html.html"
        
        # Save the HTML content to a file
        with open(os.path.join(HTML_SAVE_DIR, filename), "w") as file:
            file.write(content.html)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to save HTML content")

    return {"message": "HTML content saved successfully", "filename": filename}
