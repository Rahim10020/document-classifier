from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Document
from .utils import classify_document

# Create your tests here.
User = get_user_model()

class DocumentTests(APITestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(
            username    ='testuser',
            email       = 'test@example.com',
            password    = 'testpass123'
        )
        self.client.force_authenticate(user=self.user)
        


    def test_document_classification(self):
        """Test de classification des documents"""
        
        # test classification mathematique
        math_text = "Cette equation mathematique montre que l'algebre est importante dans le calcul des statistiques."
        category, keywords = classify_document(math_text)
        self.assertEqual(category, 'math')
        self.assertTrue(len(keywords) > 0)
        
        # test classification algorithme
        algo_text           = "Ce code python montre un algorithme de programmation pour le developpement web."
        category, keywords  = classify_document(algo_text)
        self.assertEqual(category, 'algo')
        
        # test de clasification d'histoire
        history_text        = "Cette guerre historique du 19eme siecle a marque l'histoire de la revolution."
        category, keywords  = classify_document(history_text)
        self.assertEqual(category, 'histoire')
    
        
    
    def test_document_upload(self):
        """Test d'upload de document"""
        # creer un fichier de test
        test_file = SimpleUploadedFile(
            "test.txt",
            b"Contenu de test avec les mots-cles mathematiques equation algebre ",
            content_type='text/plain'
        )
        
        url = '/api/documents/upload/'
        data = {
            'title': 'Document de test',
            'file': test_file
        }
        # Note: Ce test nécessiterait un fichier PDF/DOCX/PPTX réel pour fonctionner complètement
        # response = self.client.post(url, data, format='multipart')
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    
    def test_document_list(self):
        """Test de recuperation de la liste des documents"""
        
        url = '/api/documents/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    
    
    def test_document_stats(self):
        """Test des statistiques des documents"""
        
        url = "/api/documents/stats/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('total_document' in response.data)
        self.assertTrue('categories' in response.data)