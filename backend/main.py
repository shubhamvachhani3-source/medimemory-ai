from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware

import models, schemas, auth, database, pdf_parser
from database import engine, get_db

# Initialize Database
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MediMemory AI API")

# --- Auth Routes ---

@app.post("/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- Patient Routes ---

@app.post("/patients/upload", response_model=schemas.PatientResponse)
async def upload_patient_pdf(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    contents = await file.read()
    parsed_info = pdf_parser.extract_patient_info(contents)
    
    # Create new patient from parsed data
    new_patient = models.Patient(
        first_name=parsed_info["first_name"],
        last_name=parsed_info["last_name"],
        date_of_birth=datetime.strptime(parsed_info["date_of_birth"], "%Y-%m-%d").date() if "-" in parsed_info["date_of_birth"] else None,
        gender=parsed_info["gender"],
        mrn=parsed_info["mrn"]
    )
    
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

@app.get("/patients", response_model=List[schemas.PatientResponse])
def list_patients(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.Patient).all()

@app.get("/patients/{patient_id}", response_model=schemas.PatientResponse)
def get_patient(
    patient_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
import models, schemas, auth, database, pdf_parser

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="MediMemory AI API")

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Authentication Routes ---

@app.post("/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    print(f"DEBUG - RECEIVED PASSWORD: {user.password}")
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, full_name=user.full_name, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- AI & Patient Routes ---

@app.post("/patients/upload", response_model=schemas.PatientResponse)
async def upload_medical_pdf(
    file: UploadFile = File(...), 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    # 1. Read the raw PDF file
    pdf_content = await file.read()
    
    # 2. Extract raw text using PyMuPDF (from pdf_parser.py)
    raw_text = pdf_parser.extract_text_from_pdf(pdf_content)
    if not raw_text:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    # 3. MOCK COGNEE AI PROCESSING
    # (This simulates the AI structuring the data until you get the real API keys)
    mock_ai_data = {
        "name": "Jane Doe",
        "dob": "1985-04-12",
        "gender": "Female",
        "medical_records": [
            {"diagnosis": "Hypertension", "treatment": "Lisinopril 10mg daily", "date_recorded": "2023-10-01"}
        ],
        "allergies": [{"allergen": "Penicillin", "severity": "High"}],
        "medications": [{"name": "Lisinopril", "dosage": "10mg", "frequency": "Daily"}]
    }

    # 4. Save to Database
    new_patient = models.Patient(
        user_id=current_user.id,
        name=mock_ai_data["name"],
        dob=mock_ai_data["dob"],
        gender=mock_ai_data["gender"]
    )
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient