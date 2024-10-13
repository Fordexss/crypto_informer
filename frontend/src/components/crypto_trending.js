import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import './crypto_trending.css';

const apiKey = process.env.REACT_APP_CG_API_KEY;

const CryptoItem = ({ coin }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchChartData = async () => {
      const url = `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?x_cg_demo_api_key=${apiKey}&vs_currency=usd&days=7`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        const prices = data.prices.map(pricePoint => pricePoint[1]);
        const chartLabels = data.prices.map(pricePoint => new Date(pricePoint[0]).toLocaleDateString());

        if (chartRef.current) {
          const chartContext = chartRef.current.getContext('2d');
          new Chart(chartContext, {
            type: 'line',
            data: {
              labels: chartLabels,
              datasets: [{
                label: 'Price (7d)',
                data: prices,
                borderColor: '#4CAF50',
                fill: false,
                borderWidth: 2
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { display: false },
                y: { display: false }
              },
              elements: {
                point: { radius: 0 }
              },
              plugins: {
                legend: { display: false }
              }
            }
          });
        }
      } catch (error) {
        console.error('Ошибка при получении данных графика:', error);
      }
    };

    fetchChartData();
  }, [coin.id]);

  return (
    <div className="crypto-item">
      <div className="crypto-info">
        <img src={coin.image} alt={coin.name} />
        <div>
          <div className="crypto-name">{coin.name}</div>
          <div className="crypto-symbol">{coin.symbol.toUpperCase()}</div>
        </div>
      </div>
      <div className="crypto-stats">
        <div><strong>Цена:</strong> ${coin.current_price.toFixed(2)}</div>
        <div><strong>Объем:</strong> ${coin.total_volume.toLocaleString()}</div>
        <div><strong>Рыночная капитализация:</strong> ${coin.market_cap.toLocaleString()}</div>
        <div><strong>Изменение за 24ч:</strong> {coin.price_change_percentage_24h.toFixed(2)}%</div>
      </div>
      <div className="crypto-chart">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

const CryptoTrending = () => {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchTrendingData = async () => {
      const url = `https://api.coingecko.com/api/v3/coins/markets?x_cg_demo_api_key=${apiKey}&vs_currency=usd&order=percent_change_24h&per_page=10&page=1`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setTrending(data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchTrendingData();
  }, []);

  return (
    <div>
      <h1>Тренд топ 10 криптовалют</h1>
      <div id="trendingContainer">
        {trending.map(coin => <CryptoItem key={coin.id} coin={coin} />)}
      </div>
    </div>
  );
};

export default CryptoTrending;