from django.shortcuts import render
from rest_framework import status, generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.http import HttpResponse
from .models import Document
from .serializers import DocumentSerializer, DocumentListSerializer, DocumentUploadSerializer
from .services import DocumentProcessingService
from .permissions import IsOwnerOrReadOnly

# Create your views here.

class DocumentListView(generics.ListAPIView):
    serializer_class    = DocumentListSerializer
    permission_classes  = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Document.objects.filter(user=self.request.user)
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset
    

class DocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class    = DocumentSerializer
    permission_classes  = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)



class DocumentUploadView(generics.CreateAPIView):
    serializer_class    = DocumentUploadSerializer
    permission_classes  = [permissions.IsAuthenticated]
    parser_classes      = [MultiPartParser, FormParser]
    
    def perform_create(self, serializer):
        # creer l'instance du document
        document = serializer.save(user=self.request.user)
        
        # traiter le document (extraction de texte et classification)
        document = DocumentProcessingService.process_uploaded_document(document, self.request.FILES['file'])
        document.save()
        
        
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def download_documents_zip(request):
    """Endpoint pour telecharger un zip contenant tous les documents classes"""
    
    try:
        zip_buffer      = DocumentProcessingService.create_documents_zip(request.user)
        
        response        = HttpResponse(
            zip_buffer.getvalue(),
            content_type = 'application/zip'    
        )
        response['Content-Disposition'] = 'attachement; filename="mes_documents.classes.zip"'
        return response
    except Exception as e:
        return Response(
            {'error':f'erreur lors de la creation du zip: {str(e)}'},
            status  = status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def document_stats(request):
    """Statistiques des documents de l'utilisateur"""
    
    user_documents = Document.objects.filter(user=request.user)
    
    stats = {
        'total_documents': user_documents.count(),
        'categories': {}
    }
    
    # compter par categories
    for category, _ in Document.CATEGORY_CHOICES:
        count = user_documents.filter(category=category).count()
        stats['categories'][category] = count


    return Response(stats)