import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import styled from 'styled-components';
import { useTheme } from './theme_context';

const apiKey = process.env.REACT_APP_CG_API_KEY;

const CryptoTrendingContainer = styled.div`
  background-color: ${({ theme }) => (theme === 'dark' ? '#2c2c2c' : '#f5f5f5')};
  padding: 20px;
  border-radius: 8px;
  color: ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};
`;

const CryptoItemContainer = styled.div`
  background-color: ${({ theme }) => (theme === 'dark' ? '#1e1e1e' : '#fff')};
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#333')};
  border: 1px solid ${({ theme }) => (theme === 'dark' ? '#333' : '#ccc')};
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .crypto-info {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;

    img {
      width: 32px;
      height: 32px;
      margin-right: 0.5rem;
    }

    .crypto-name {
      font-weight: bold;
    }

    .crypto-symbol {
      color: #777;
      font-size: 0.9rem;
    }
  }

  .crypto-stats {
    div {
      margin-bottom: 0.25rem;
    }
  }

  .crypto-chart {
    height: 100px;
    margin-top: 0.5rem;
    canvas {
      height: 100%;
    }
  }
`;

const CryptoItem = ({ coin }) => {
  const chartRef = useRef(null);
  const { isDarkMode } = useTheme();

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
                borderColor: isDarkMode ? '#4CAF50' : '#007bff',
                backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(0, 123, 255, 0.2)',
                fill: false,
                borderWidth: 2
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { display: false },
                y: {
                  display: false,
                  ticks: {
                    color: isDarkMode ? '#fff' : '#333',
                  },
                  grid: {
                    color: isDarkMode ? '#333' : '#ccc',
                  },
                }
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
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, [coin.id, isDarkMode]);

  return (
    <CryptoItemContainer theme={isDarkMode ? 'dark' : 'light'}>
      <div className="crypto-info">
        <img src={coin.image} alt={coin.name} />
        <div>
          <div className="crypto-name">{coin.name}</div>
          <div className="crypto-symbol">{coin.symbol.toUpperCase()}</div>
        </div>
      </div>
      <div className="crypto-stats">
        <div><strong>Price:</strong> ${coin.current_price.toFixed(2)}</div>
        <div><strong>Volume:</strong> ${coin.total_volume.toLocaleString()}</div>
        <div><strong>Market cap:</strong> ${coin.market_cap.toLocaleString()}</div>
        <div><strong>Change per 24h:</strong> {coin.price_change_percentage_24h.toFixed(2)}%</div>
      </div>
      <div className="crypto-chart">
        <canvas ref={chartRef} />
      </div>
    </CryptoItemContainer>
  );
};

const CryptoTrending = () => {
  const [trending, setTrending] = useState([]);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    document.title = "Trends"
    const fetchTrendingData = async () => {
      const url = `https://api.coingecko.com/api/v3/coins/markets?x_cg_demo_api_key=${apiKey}&vs_currency=usd&order=percent_change_24h&per_page=10&page=1`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setTrending(data);
      } catch (error) {
        console.error('Error in data retrieval:', error);
      }
    };

    fetchTrendingData();
  }, []);

  return (
    <CryptoTrendingContainer theme={isDarkMode ? 'dark' : 'light'}>
      <h1>Top 10 cryptocurrencies trend</h1>
      <div id="trendingContainer">
        {trending.map(coin => <CryptoItem key={coin.id} coin={coin} />)}
      </div>
    </CryptoTrendingContainer>
  );
};

export default CryptoTrending;