from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional
from datetime import date, datetime

# --- Base Schemas ---

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

# --- Medical Sub-Schemas ---

class MedicationBase(BaseModel):
    name: str
    dosage: str
    frequency: str

class MedicationCreate(MedicationBase):
    patient_id: int

class MedicationResponse(MedicationBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class AllergyBase(BaseModel):
    allergen: str
    reaction: str

class AllergyCreate(AllergyBase):
    patient_id: int

class AllergyResponse(AllergyBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class DiagnosisBase(BaseModel):
    condition: str
    diagnosed_date: date

class DiagnosisCreate(DiagnosisBase):
    patient_id: int

class DiagnosisResponse(DiagnosisBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class LabResultBase(BaseModel):
    test_name: str
    value: str
    unit: str
    reference_range: str

class LabResultCreate(LabResultBase):
    patient_id: int

class LabResultResponse(LabResultBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- Patient & Medical Record Schemas ---

class MedicalRecordBase(BaseModel):
    visit_date: date
    notes: str
    doctor_name: str

class MedicalRecordCreate(MedicalRecordBase):
    patient_id: int

class MedicalRecordResponse(MedicalRecordBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class PatientBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    gender: str
    mrn: str

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    medications: List[MedicationResponse] = []
    allergies: List[AllergyResponse] = []
    diagnoses: List[DiagnosisResponse] = []
    lab_results: List[LabResultResponse] = []
    medical_records: List[MedicalRecordResponse] = []
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None