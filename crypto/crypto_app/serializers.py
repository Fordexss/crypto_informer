from rest_framework import serializers


class IndexSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    symbol = serializers.CharField()
    quote = serializers.DictField()

