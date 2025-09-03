from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Document

# Register your models here.
@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display    = ['title','category','file_type','user','created_at']
    list_filter     = ['category','file_type','created_at']
    search_fields   = ['title', 'user__email', 'user__username']
    ordering        = ['email']
    
    fieldsets       = UserAdmin.fieldsets  + (
        ('Informations supplémentaires', {'fields': ('created_at', 'updated_at')}),
    )
    readonly_fields = ['created_at', 'updated_at']