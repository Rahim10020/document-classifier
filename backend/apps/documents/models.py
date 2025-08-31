from django.db import models
from django.conf import settings
import os

# Create your models here.

def document_upload_path(instance, filename):
    """ Genere le chemin de stockage base sur la categorie"""
    category = instance.category or 'autres'
    return f'documents/{category}/{filename}'

class Document(models.Model):
    CATEGORY_CHOICES = [
        ('math', 'Mathématiques'),
        ('algo', 'Algorithme'),
        ('histoire', 'Histoire'),
        ('autres', 'Autres'),
    ]
    title               = models.CharField(max_length=255)
    file                = models.FileField(upload_to=document_upload_path)
    category            = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='autres')
    content_preview     = models.TextField(blank=True)
    keywords            = models.JSONField(default=list)
    file_type           = models.CharField(max_length=10)
    file_size           = models.PositiveBigIntegerField()
    user                = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.category})"
    
    @property
    def file_name(self):
        return os.path.basename(self.file.name)
    
    def delete(self, *args, **kwargs):
        # supprimer le fichier physique lors de la suppression
        if self.file:
            if os.path.isfile(self.file.name):
                os.remove(self.file.name)
        super().delete(*args, **kwargs)