# CryptoInformer

## Project Overview

CryptoInformer is a modern web application that provides users with up-to-date information about cryptocurrencies, including prices, changes over the last hours and days, as well as crypto market news. The application supports user registration and authentication, along with functionality to manage favorite cryptocurrencies.

## Technologies Used

The project is built using the following technologies:

- **Backend**: Django REST Framework (DRF)
- **Authentication**: JWT for user registration and authentication
- **Frontend**: React
- **Database**: PostgreSQL
- **Additional Tools**: Redis and Celery for task management

## Environment Setup

To set up the environment, you will need to create two `.env` files: one in the root folder of the `crypto` directory and another in the `frontend` directory. Populate these files with the necessary configuration data.

## Installing Requirements

To install the required packages, follow these steps:

1. Navigate to the `crypto` directory and install the backend requirements:
   ```bash
   cd crypto
   pip install -r requirements.txt
  
2. Then, go to the root directory, and then to the frontend, into frontend install packages:
   ```bash
   cd ..
   cd frontend
   npm install

3. Open 3 new terminal windows. In the first one, start the redis server. After that, in the other 2 terminals, navigate to the crypto folder. In the second one, start the celery worker. And in the third one, run the celery beat
   ```bash
   start redis server > /etc/init.d/redis-server start
   start celery worker > cd crypto > celery -A crypto worker --loglevel=info
   start celery beat > cd crypto > celery -A crypto beat --loglevel=info

4. Now you can go to each directory and run the project:
    ```bash
    cd frontend > npm start
    cd .. > cd crypto > python manage.py runserver