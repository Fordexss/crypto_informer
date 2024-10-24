import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { PulseLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from './theme_context';

const apiKey = process.env.REACT_APP_CG_API_KEY;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  color: ${({ theme }) => (theme === 'dark' ? 'white' : 'inherit')};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: ${({ theme }) => (theme === 'dark' ? '#ffffff' : '#333')};
  background-color: ${({ theme }) => (theme === 'dark' ? '#1e1e1e' : '#f5f5f5')};
  padding: 10px;
  border-radius: 8px;
`;

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const TimerText = styled.p`
  margin-right: 10px;
  font-size: 1.2rem;
  color: ${({ theme }) => (theme === 'dark' ? '#ffffff' : '#555')};
`;

const ProgressBar = styled.div`
  width: 300px;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
`;

const TableContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
`;

const TableWrapper = styled.div`
  flex: 1;
  background-color: ${({ theme }) => (theme === 'dark' ? '#1e1e1e' : '#fff')};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableTitle = styled.div`
  background-color: ${({ theme }) => (theme === 'dark' ? '#333' : '#e2e2e2')};
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#333')};
  padding: 10px;
  text-align: center;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: ${({ theme }) => (theme === 'dark' ? '#333' : '#f5f5f5')};
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#333')};
  padding: 10px;
  text-align: left;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid ${({ theme }) => (theme === 'dark' ? '#444' : '#eee')};

  &:hover {
    background-color: ${({ theme }) => (theme === 'dark' ? '#444' : '#e0e0e0')};
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${({ theme }) => (theme === 'dark' ? '#2c2c2c' : '#f9f9f9')};
  }
`;

const TableData = styled.td`
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => (theme === 'dark' ? '#444' : '#eee')};
`;

const TokenSymbol = styled.span`
  color: #777;
  font-size: 0.9rem;
  margin-left: 5px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ArrowUp = styled(FontAwesomeIcon)`
  color: #4caf50;
  margin-left: 5px;
`;

const ArrowDown = styled(FontAwesomeIcon)`
  color: #f44336;
  margin-left: 5px;
`;

const PositiveChange = styled.span`
  color: #4caf50;
  font-weight: bold;
`;

const NegativeChange = styled.span`
  color: #f44336;
  font-weight: bold;
`;

function compare(a, b, ascending) {
  return ascending ? a.localeCompare(b) : b.localeCompare(a);
}

function sortByColumn(data, columnIndex, ascending) {
  return data.sort((a, b) => {
    if (columnIndex === 0) {
      return compare(a.name, b.name, ascending);
    } else {
      return ascending
        ? a.price_change_percentage_24h - b.price_change_percentage_24h
        : b.price_change_percentage_24h - a.price_change_percentage_24h;
    }
  });
}

function CryptoGainersLosers() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [gainersSort, setGainersSort] = useState({ columnIndex: 0, ascending: true });
  const [losersSort, setLosersSort] = useState({ columnIndex: 0, ascending: true });
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?x_cg_demo_api_key=${apiKey}&vs_currency=usd&order=percent_change_24h&per_page=250&page=1`);
        const data = await response.json();

        const rowsPerTable = Math.floor((window.innerHeight * 0.8) / 50) + 3;

        const gainersData = data
          .filter(coin => coin.price_change_percentage_24h > 0)
          .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
          .slice(0, rowsPerTable);

        const losersData = data
          .filter(coin => coin.price_change_percentage_24h < 0)
          .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
          .slice(0, rowsPerTable);

        setGainers(gainersData);
        setLosers(losersData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchCryptoData();

    const intervalId = setInterval(() => {
      fetchCryptoData();
      setSecondsLeft(300);
    }, 300000);

    const countdownInterval = setInterval(() => {
      setSecondsLeft(prevSeconds => (prevSeconds > 0 ? prevSeconds - 1 : 300));
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(countdownInterval);
    };
  }, []);

  const handleSortGainers = (columnIndex) => {
    const ascending= columnIndex === gainersSort.columnIndex ? !gainersSort.ascending : true;
    setGainersSort({ columnIndex, ascending });
    setGainers(sortByColumn([...gainers], columnIndex, ascending));
  };

  const handleSortLosers = (columnIndex) => {
    const ascending = columnIndex === losersSort.columnIndex ? !losersSort.ascending : true;
    setLosersSort({ columnIndex, ascending });
    setLosers(sortByColumn([...losers], columnIndex, ascending));
  };

  const progress = (300 - secondsLeft) / 300 * 100;

  return (
    <Container theme={isDarkMode ? 'dark' : 'light'}>
      <Title theme={isDarkMode ? 'dark' : 'light'}>Crypto Gainers and Losers</Title>
      <TimerContainer>
        <TimerText theme={isDarkMode ? 'dark' : 'light'}>Next update in: {Math.floor(secondsLeft / 60)}:{('0' + (secondsLeft % 60)).slice(-2)}</TimerText>
        <ProgressBar>
          <ProgressFill style={{ width: `${progress}%` }} />
        </ProgressBar>
      </TimerContainer>

      {isLoading ? (
        <LoadingContainer>
          <PulseLoader color="#4caf50" size={15} />
        </LoadingContainer>
      ) : (
        <TableContainer>
          <TableWrapper theme={isDarkMode ? 'dark' : 'light'}>
            <TableTitle theme={isDarkMode ? 'dark' : 'light'}>Top Gainers</TableTitle>
            <Table>
              <thead>
                <tr>
                  <TableHeader onClick={() => handleSortGainers(0)} theme={isDarkMode ? 'dark' : 'light'}>Token Name</TableHeader>
                  <TableHeader onClick={() => handleSortGainers(1)} theme={isDarkMode ? 'dark' : 'light'}>Price Change (24h %)</TableHeader>
                </tr>
              </thead>
              <tbody>
                {gainers.map((coin, index) => (
                  <TableRow key={index} theme={isDarkMode ? 'dark' : 'light'}>
                    <TableData theme={isDarkMode ? 'dark' : 'light'}>{coin.name} <TokenSymbol>{coin.symbol.toUpperCase()}</TokenSymbol></TableData>
                    <TableData theme={isDarkMode ? 'dark' : 'light'}>
                      <PositiveChange>{coin.price_change_percentage_24h.toFixed(2)}%</PositiveChange>
                      <ArrowUp icon={faArrowUp} />
                    </TableData>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableWrapper>

          <TableWrapper theme={isDarkMode ? 'dark' : 'light'}>
            <TableTitle theme={isDarkMode ? 'dark' : 'light'}>Top Losers</TableTitle>
            <Table>
              <thead>
                <tr>
                  <TableHeader onClick={() => handleSortLosers(0)} theme={isDarkMode ? 'dark' : 'light'}>Token Name</TableHeader>
                  <TableHeader onClick={() => handleSortLosers(1)} theme={isDarkMode ? 'dark' : 'light'}>Price Change (24h %)</TableHeader>
                </tr>
              </thead>
              <tbody>
                {losers.map((coin, index) => (
                  <TableRow key={index} theme={isDarkMode ? 'dark' : 'light'}>
                    <TableData theme={isDarkMode ? 'dark' : 'light'}>{coin.name} <TokenSymbol>{coin.symbol.toUpperCase()}</TokenSymbol></TableData>
                    <TableData theme={isDarkMode ? 'dark' : 'light'}>
                      <NegativeChange>{coin.price_change_percentage_24h.toFixed(2)}%</NegativeChange>
                      <ArrowDown icon={faArrowDown} />
                    </TableData>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </TableContainer>
      )}
    </Container>
  );
}

export default CryptoGainersLosers;