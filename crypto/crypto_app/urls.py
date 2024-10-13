from django.urls import path
from . import views

urlpatterns = [
    path('api/index/', views.IndexApiView.as_view(), name='index_api'),
    path('api/news/', views.CryptoNewsApiView.as_view(), name='crypto_news_api'),
    path('login/', views.LoginApiView.as_view, name='login'),
    path('registration/', views.RegistrationApiView.as_view(), name='registration'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
]