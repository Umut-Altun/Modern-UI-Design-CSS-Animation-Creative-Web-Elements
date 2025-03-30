"""
Çekirdek proje için WSGI yapılandırması.

WSGI çağrılabilirini ``application`` adlı modül düzeyinde bir değişken olarak gösterir.

Bu dosya hakkında daha fazla bilgi için bkz.
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()
