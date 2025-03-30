"""
Çekirdek proje için ASGI yapilandirmasi.

ASGI çağrilabilirini ``application`` adli modül düzeyinde bir değişken olarak gösterir.

Bu dosya hakkinda daha fazla bilgi için bkz.
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_asgi_application()
