from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

class UserRegistrationSerializer(serializers.ModelSerializer):
    password           = serializers.CharField(write_only=True, validator = [validate_password])
    password_confirm   = serializers.CharField(write_only=True)
    
    class Meta:
        model   = CustomUser
        fields  = ('username', 'email', 'password', 'password_confirm')
        
    def validate(self, attrs):
        if (attrs['password'] != attrs['password_confirm']):
            raise serializers.ValidationError("Les mot de passe ne correspondent pas.")
        return attrs
        
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = CustomUser.objects.create_user(**validated_data)
        return user
    

class UserLoginSerializer(serializers.ModelSerializer):
    email       = serializers.EmailField()
    password    = serializers.CharField()
    
    def validate(self, attrs):
        email       = attrs.get['email']
        password    = attrs.get['password']
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError("Email ou mot de passe incorrect")
            if not user.is_active:
                raise serializers.ValidationError("Compte utilisateur desactive")
            attrs['user'] = user
        else:
            raise serializers.ValidationError("Email uet mot de passe requis")
        return attrs
    

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser,
        fields = ('id', 'username','email', 'date_joined')
        read_only_fields = ('id', 'date_joined')