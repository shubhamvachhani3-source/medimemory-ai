import os
from fpdf import FPDF

# Create a folder for our fake data
output_dir = "fake_medical_records"
os.makedirs(output_dir, exist_ok=True)

patients = [
    {
        "id": "PT-8472", "name": "Eleanor Vance", "age": "42", "gender": "Female",
        "history": "Diagnosed with essential hypertension in 2021. Family history of cardiovascular disease.",
        "medications": "Lisinopril 10mg daily, Amlodipine 5mg daily",
        "allergies": "Penicillin (causes hives)",
        "recent_labs": "Blood pressure 138/88 mmHg. Cholesterol 210 mg/dL (Elevated)."
    },
    {
        "id": "PT-8471", "name": "Marcus Webb", "age": "58", "gender": "Male",
        "history": "Type 2 Diabetes Mellitus diagnosed in 2018. Neuropathy in lower extremities.",
        "medications": "Metformin 1000mg twice daily, Insulin Glargine 15 units at bedtime",
        "allergies": "Sulfa drugs",
        "recent_labs": "HbA1c 7.8%. Fasting glucose 145 mg/dL."
    },
    {
        "id": "PT-8470", "name": "Sarah Jenkins", "age": "31", "gender": "Female",
        "history": "Lifelong history of severe asthma. Multiple childhood hospitalizations.",
        "medications": "Albuterol inhaler as needed, Fluticasone daily",
        "allergies": "Peanuts, Dust Mites",
        "recent_labs": "Spirometry shows mild obstructive pattern. O2 sat 98%."
    }
]

class PDF(FPDF):
    def header(self):
        self.set_font("Arial", "B", 10)
        self.set_text_color(220, 53, 69) # Red disclaimer
        self.cell(0, 10, "DISCLAIMER: Demo application using fictional medical records only. Not intended for clinical use.", 0, 1, "C")
        self.ln(5)

for p in patients:
    pdf = PDF()
    pdf.add_page()
    
    # Title
    pdf.set_font("Arial", "B", 16)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, f"Medical Record: {p['name']}", 0, 1, "L")
    pdf.set_font("Arial", "", 10)
    pdf.cell(0, 6, f"Patient ID: {p['id']} | Age: {p['age']} | Gender: {p['gender']}", 0, 1, "L")
    pdf.line(10, 35, 200, 35)
    pdf.ln(10)
    
    # Content Sections
    sections = [
        ("Clinical History", p['history']),
        ("Current Medications", p['medications']),
        ("Known Allergies", p['allergies']),
        ("Recent Lab Results", p['recent_labs'])
    ]
    
    for title, content in sections:
        pdf.set_font("Arial", "B", 12)
        pdf.cell(0, 8, title, 0, 1, "L")
        pdf.set_font("Arial", "", 11)
        pdf.multi_cell(0, 6, content)
        pdf.ln(5)
        
    filename = f"{output_dir}/{p['id']}_{p['name'].replace(' ', '_')}.pdf"
    pdf.output(filename)
    print(f"Generated: {filename}")

print("\nSuccess! All fictional PDF records are ready for the hackathon demo.")
