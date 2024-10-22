from django.urls import path
from . import views

urlpatterns = [
    path('api/index/', views.IndexApiView.as_view(), name='index_api'),
    path('api/news/', views.CryptoNewsApiView.as_view(), name='crypto_news_api'),
]