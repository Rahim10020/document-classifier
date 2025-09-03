from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

# Create your tests here.
User = get_user_model()

class AuthenticationTests(APITestCase):
    
    def test_user_registration(self):
        """Test d'inscription utilisateur"""
        
        url     = reverse('register')
        data    = {
            'username': '       testuser',
            'email':            'test@example.com',
            'password':         'testpass123',
            'password_confirm': 'testpass123'
        } 
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('tokens' in response.data)
        self.assertTrue(User.objects.filter(email='test@example.com').exists())
        
        
    def test_user_login(self):
        """Test de connexion de l'utilisateur"""
        
        # Creer un utilisateur
        user = User.objects.create_user(
            username    = 'testuser',
            email       = 'test@example.com',
            password    = 'testpass123'
        )
        
        url     = reverse('login')
        data    = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('tokens' in response.data)
        
    
    def test_profile_access(self):  
        """Test d'acces au profil utilisateur"""
        
        user = User.objects.create_user(
            username    = 'testuser',
            email       = 'test@example.com',
            password    = 'testpass123'
        )
        
        self.client.force_authenticate(user=user)
        
        url         = reverse('profile')
        response    = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')