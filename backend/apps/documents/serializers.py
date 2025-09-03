from rest_framework import serializers
from .models import Document
from django.conf import settings
import re
import os

class DocumentSerializer(serializers.ModelSerializer):
    file_name = serializers.ReadOnlyField()
    
    class Meta:
        model               = Document
        fields              = [
            'id', 'title', 'file', 'file_name', 'category', 
            'content_preview', 'keywords', 'file_type', 
            'file_size', 'created_at', 'updated_at'
        ]
        read_only_fields    = [
            'category', 'content_preview', 'keywords', 
            'file_type', 'file_size', 'created_at', 'updated_at'
        ]
        
        
class DocumentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model   = Document
        fields  = ['title', 'file']
        
    def validate_file(self, value):
        # validation de la taille du fichier
        if value.size > settings.FILE_UPLOAD_MAX_MEMORY_SIZE:
            raise serializers.ValidationError("La taille du fichier ne dois pas depasser 10MB")
        
        # validation du type de fichier
        allowed_types = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.presentationml.presentation']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError("Type de fichier non supporte. Utilisez PDF, PPTX ou DOCX")
        
        # Validation du nom de fichier
        if not re.match(r'^[a-zA-Z0-9._-]+$', value.name):
            raise serializers.ValidationError("Nom de fichier invalide")
        
        # Vérification de l'extension
        allowed_extensions = ['.pdf', '.docx', '.pptx']
        file_ext = os.path.splitext(value.name)[1].lower()
        if file_ext not in allowed_extensions:
            raise serializers.ValidationError("Extension de fichier non autorisée")
        
        return value
    

class DocumentListSerializer(serializers.ModelSerializer):
    file_name = serializers.ReadOnlyField()
    
    class Meta:
        model   = Document
        fields  = [
            'id', 'title', 'file_name', 'category', 
            'file_type', 'file_size', 'created_at'
        ]