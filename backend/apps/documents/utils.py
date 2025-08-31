import PyPDF2
import docx
from pptx import Presentation
import magic
import os
from django.conf import settings


def get_file_type(file_path):
    
    """Determine le type de fichier"""
    
    mime        = magic.Magic(mime=True)
    file_type   = mime.from_file(file_path)
    
    if 'pdf' in file_type:
        return 'pdf'
    elif 'wordprocessingml' in file_type or 'msword' in file_type:
        return 'docx'
    elif 'presentationml' in file_type or 'presentation' in file_type:
        return 'pptx'
    else:
        return 'unknown'
    


def extract_text_from_pdf_file(file_path):
    
    """Extrait le texte d'un fichier pdf"""
    
    try:
        with open(file_path, 'rb') as file:
            reader  = PyPDF2.PdfReader(file)
            text    = ""
            for page in reader.pages:
                text += page.extract_text() + '\n'
            return text.strip()
    except Exception as e:
        print(f"Erreur lors de l'extraction PDF {e}")
        return ""
    


def extract_text_from_docx(file_path):
    
    """Extrait le texte d'un fichier docx"""
    
    try:
        doc     = docx.Document(file_path)
        text    = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + '\n'
        return text.strip()
    except Exception as e:
        print(f"Erreur lors de l'extractin DOCX {e}")
        return ""