from django.urls import path
from .views import (
    DocumentListView, 
    DocumentDetailView, 
    DocumentUploadView, 
    download_documents_zip,
    document_stats,
)

urlpatterns = [
    path('', DocumentListView.as_view(), name="document-list"),
    path('<int:pk>/', DocumentDetailView.as_view(), name="document-detail"),
    path('upload/', DocumentUploadView.as_view(), name="document-upload"),
    path('download-zip/', download_documents_zip, name="download-documents-zip"),
    path('stats/', document_stats, name="document-stats"),
]   