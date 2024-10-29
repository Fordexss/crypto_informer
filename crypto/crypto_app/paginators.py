from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CryptoPaginator(PageNumberPagination):
    page_size = 20

    def get_paginated_response(self, data):
        return Response({
            'current_page': self.page.number,
            'num_pages': self.page.paginator.num_pages,
            'has_next': self.page.has_next(),
            'has_previous': self.page.has_previous(),
            'top_crypto': data
        })