import os

import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY2 = os.getenv('API_KEY2')
API_KEY = os.getenv('API_KEY')
url_listing = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'


def get_top_crypto():
    parameters = {
        'limit': 100
    }

    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': API_KEY,
    }

    response = requests.get(url_listing, headers=headers, params=parameters)
    if response.status_code == 200:
        data = response.json()
        crypto_data = data.get('data', [])
        filtered_crypto_data = [
            {
                'id': crypto['id'],
                'name': f"{crypto['name']}",
                'symbol': crypto['symbol'],
                'quote': {
                    'USD': {
                        'price': crypto['quote']['USD']['price'],
                        'percent_change_1h': crypto['quote']['USD']['percent_change_1h'],
                        'percent_change_24h': crypto['quote']['USD']['percent_change_24h'],
                        'percent_change_7d': crypto['quote']['USD']['percent_change_7d'],
                        'market_cap': crypto['quote']['USD']['market_cap'],
                    }
                }
            }
            for crypto in crypto_data
        ]
        return filtered_crypto_data
    else:
        return []


def get_crypto_news():
    url_news = 'https://cryptopanic.com/api/v1/posts/'
    params = {
        'auth_token': API_KEY2,
        'filter': 'hot',
        'public': 'true',
    }
    response = requests.get(url_news, params=params)

    if response.status_code == 200:
        data = response.json()
        result = [
            {
                'id': news['id'],
                'title': news['title'],
                'url': news['url']
            }
            for news in data['results']
        ]
        return result
    else:
        return []

