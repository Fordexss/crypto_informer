from django.http import JsonResponse
from django.views import View
from rest_framework.generics import ListAPIView
from .helpers import *
from .paginators import CryptoPaginator
from .serializers import IndexSerializer
from .helpers import get_top_crypto


class IndexApiView(ListAPIView):
    queryset = get_top_crypto()
    serializer_class = IndexSerializer
    pagination_class = CryptoPaginator


class CryptoNewsApiView(View):
    def get(self, request, *args, **kwargs):
        news = get_crypto_news()
        news_f_temp = [{'title': article['title'], 'url': article['url']} for article in news] if news else []
        return JsonResponse({'news': news_f_temp})
