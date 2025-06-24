from .auth import auth_bp
from .agreemant import agreement_bp
from .details import details_bp
from .profile import user_bp
from .search import search_bp
from .upload import upload_bp
from .views import views_bp

__all__ = [
    'auth_bp',
    'agreement_bp',
    'details_bp',
    'user_bp',
    'search_bp',
    'upload_bp',
    'views_bp'
]
