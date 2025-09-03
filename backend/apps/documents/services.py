import os
import tempfile
import zipfile
from io import BytesIO
from django.conf import settings
from django.http import HttpResponse
from .models import Document
import logging
from .utils import get_file_type, extract_text_from_document, classify_document


class DocumentProcessingService:
    @staticmethod
    def process_uploaded_document(document_instance, uploaded_file):
        """Traite un document uploade : extraction de texte et classification"""
        
        temp_file_path = None
        
        try:
            # Sauvegarder temporairement le fichier pour traitement
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                for chunk in uploaded_file.chunks():
                    temp_file.write(chunk)
                temp_file_path = temp_file.name
            
            # Vérifier que le fichier existe
            if not os.path.exists(temp_file_path):
                raise FileNotFoundError("Fichier temporaire non créé")
                
            # determiner le type de fichier
            file_type = get_file_type(temp_file_path)
            
            # extraire le texte
            extracted_text = extract_text_from_document(temp_file_path, file_type)
            
            # classifier le document
            category, keywords = classify_document(extracted_text)
            
            # mettre a jour l'instance du document
            document_instance.file_type = file_type
            document_instance.file_size = uploaded_file.size
            document_instance.category = category
            document_instance.keywords = keywords
            document_instance.content_preview = extracted_text[:500] if extracted_text else "Aucun contenu extrait"
            
            return document_instance
            
        except Exception as e:
            # Log l'erreur
            logger = logging.getLogger(__name__)
            logger.error(f"Erreur lors du traitement du document {uploaded_file.name}: {e}")
            
            # Valeurs par défaut en cas d'erreur
            document_instance.file_type = 'unknown'
            document_instance.file_size = uploaded_file.size
            document_instance.category = 'autres'
            document_instance.keywords = []
            document_instance.content_preview = "Erreur lors de l'extraction du contenu"
            
            return document_instance
            
        finally:
            # Nettoyer le fichier temporaire
            if temp_file_path and os.path.exists(temp_file_path):
                try:
                    os.remove(temp_file_path)
                except OSError as e:
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.warning(f"Impossible de supprimer le fichier temporaire {temp_file_path}: {e}")
                    
    
    @staticmethod
    def create_documents_zip(user):
        """Creer un fichier zip contenant tous les documents de l'utilisateur classes par categorie"""
        documents = Document.objects.filter(user=user)
        
        # Creer un buffer pour le zip
        zip_buffer = BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for document in documents:
                if document.file and os.path.exists(document.file.path):
                    # chemin dans le zip category/nom_du_fichier
                    zip_path = f"{document.category}/{document.file_name}"
                    zip_file.write(document.file.path, zip_path)
                    
        zip_buffer.seek(0)
        return zip_buffer