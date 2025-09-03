"""

Commande pour creer les repertoires de stockage de documents 
Usage : python manage.py create_media_directories

"""

from django.core.management.base import BaseCommand
from django.conf import settings
import os

class Command(BaseCommand):
    help = 'Creer les repertoires de stockage de documents par categories'
    
    def handle(self, *args, **options):
        media_root = settings.MEDIA_ROOT
        
        if not media_root:
            self.stdout.write(self.style.ERROR("MEDIA_ROOT n'est pas definie dans settings.py"))
            return
        
        categories = settings.DOCUMENT_CATEGORIES.keys()
        
        for category in categories:
            dir_path = os.path.join(media_root, 'documents', category)
            if not os.path.exists(dir_path):
                os.makedirs(dir_path, exist_ok=True)
                self.stdout.write(
                    self.style.SUCCESS(f'Repertoire cree: {dir_path}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Repertoire deja existant {dir_path}')
                )