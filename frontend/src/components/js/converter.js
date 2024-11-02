import React, { useState, useEffect } from 'react';

const apiKey = process.env.REACT_APP_CG_API_KEY;

const CryptoConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('bitcoin');
  const [toCurrency, setToCurrency] = useState('uah');
  const [result, setResult] = useState('');
  const [showFiatOnly, setShowFiatOnly] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (amount && parseFloat(amount) > 0) {
        updateConversion();
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [amount, fromCurrency, toCurrency]);

  const updateConversion = () => {
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setResult('');
      return;
    }

    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=${toCurrency}&x_cg_api_key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        const rate = data[fromCurrency][toCurrency];
        const conversionResult = parsedAmount * rate;
        const formattedResult = formatCurrency(conversionResult, toCurrency);

        setResult(`${parsedAmount} ${fromCurrency.toUpperCase()} = ${formattedResult} ${toCurrency.toUpperCase()}`);
      })
      .catch(error => console.error('Error:', error));
  };

  const formatCurrency = (value, currency) => {
      return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    };

  const handleAmountChange = (event) => {
    let input = event.target.value;
    let sanitizedInput = input.replace(/[^0-9.]/g, '');
    const parts = sanitizedInput.split('.');
    if (parts.length > 2) {
      sanitizedInput = parts.shift() + '.' + parts.join('');
    }
    setAmount(sanitizedInput);
  };

  const filterCurrencies = (optionType) => {
    return showFiatOnly ? optionType === 'fiat' : true;
  };


  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Crypto Converter</h1>
      <div style={styles.converterBox}>
        <form id="converter">
          <input
            type="text"
            id="amount"
            placeholder="Enter amount"
            value={amount}
            onChange={handleAmountChange}
            style={styles.input}
          />
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={e => setFromCurrency(e.target.value)}
            style={styles.select}
          >
            <option value="bitcoin">Bitcoin (BTC)</option>
            <option value="ethereum">Ethereum (ETH)</option>
            <option value="tether">Tether (USDT)</option>
            <option value="binancecoin">BNB (BNB)</option>
            <option value="solana">Solana (SOL)</option>
            <option value="usd-coin">USDC (USDC)</option>
            <option value="ripple">XRP (XRP)</option>
            <option value="lido-staked-ether">Lido Staked Ether (STETH)</option>
            <option value="dogecoin">Dogecoin (DOGE)</option>
            <option value="tron">TRON (TRX)</option>
            <option value="toncoin">Toncoin (TON)</option>
            <option value="cardano">Cardano (ADA)</option>
            <option value="wrapped-steth">Wrapped stETH (WSTETH)</option>
            <option value="avalanche-2">Avalanche (AVAX)</option>
            <option value="wrapped-bitcoin">Wrapped Bitcoin (WBTC)</option>
            <option value="shiba-inu">Shiba Inu (SHIB)</option>
            <option value="weth">WETH (WETH)</option>
            <option value="chainlink">Chainlink (LINK)</option>
            <option value="bitcoin-cash">Bitcoin Cash (BCH)</option>
            <option value="polkadot">Polkadot (DOT)</option>
            <option value="near">NEAR Protocol (NEAR)</option>
            <option value="leo-token">LEO Token (LEO)</option>
            <option value="dai">Dai (DAI)</option>
            <option value="uniswap">Uniswap (UNI)</option>
            <option value="matic-network">Polygon (MATIC)</option>
            <option value="litecoin">Litecoin (LTC)</option>
            <option value="wrapped-ethereum-ethereum-pow-iou">Wrapped eETH (WEETH)</option>
            <option value="kaspa">Kaspa (KAS)</option>
            <option value="internet-computer">Internet Computer (ICP)</option>
            <option value="pepe">Pepe (PEPE)</option>
          </select>

          <div style={styles.checkboxContainer}>
            <label htmlFor="filterCheckbox" style={styles.checkboxLabel}>
              Show only fiat currencies
            </label>
            <input
              type="checkbox"
              id="filterCheckbox"
              checked={showFiatOnly}
              onChange={() => setShowFiatOnly(!showFiatOnly)}
              style={styles.checkbox}
            />
          </div>

          <select
            id="toCurrency"
            value={toCurrency}
            onChange={e => setToCurrency(e.target.value)}
            style={styles.select}
          >
            {[
              { value: 'uah', label: 'Ukrainian hryvnia (UAH)', type: 'fiat' },
              { value: 'usd', label: 'US Dollar (USD)', type: 'fiat' },
              { value: 'aed', label: 'United Arab Emirates Dirham (AED)', type: 'fiat' },
              { value: 'ars', label: 'Argentine Peso (ARS)', type: 'fiat' },
              { value: 'aud', label: 'Australian Dollar (AUD)', type: 'fiat' },
              { value: 'bdt', label: 'Bangladeshi Taka (BDT)', type: 'fiat' },
              { value: 'bhd', label: 'Bahraini Dinar (BHD)', type: 'fiat' },
              { value: 'bmd', label: 'Bermudian Dollar (BMD)', type: 'fiat' },
              { value: 'brl', label: 'Brazil Real (BRL)', type: 'fiat' },
              { value: 'cad', label: 'Canadian Dollar (CAD)', type: 'fiat' },
              { value: 'chf', label: 'Swiss Franc (CHF)', type: 'fiat' },
              { value: 'clp', label: 'Chilean Peso (CLP)', type: 'fiat' },
              { value: 'cny', label: 'Chinese Yuan (CNY)', type: 'fiat' },
              { value: 'czk', label: 'Czech Koruna (CZK)', type: 'fiat' },
              { value: 'dkk', label: 'Danish Krone (DKK)', type: 'fiat' },
              { value: 'eur', label: 'Euro (EUR)', type: 'fiat' },
              { value: 'gbp', label: 'British Pound Sterling (GBP)', type: 'fiat'},
              { value: 'gel', label: 'Georgian Lari (GEL)', type: 'fiat' },
              { value: 'hkd', label: 'Hong Kong Dollar (HKD)', type: 'fiat' },
              { value: 'huf', label: 'Hungarian Forint (HUF)', type: 'fiat' },
              { value: 'idr', label: 'Indonesian Rupiah (IDR)', type: 'fiat' },
              { value: 'ils', label: 'Israeli New Shekel (ILS)', type: 'fiat' },
              { value: 'inr', label: 'Indian Rupee (INR)', type: 'fiat' },
              { value: 'jpy', label: 'Japanese Yen (JPY)', type: 'fiat' },
              { value: 'krw', label: 'South Korean Won (KRW)', type: 'fiat' },
              { value: 'kwd', label: 'Kuwaiti Dinar (KWD)', type: 'fiat' },
              { value: 'lkr', label: 'Sri Lankan Rupee (LKR)', type: 'fiat' },
              { value: 'mmk', label: 'Burmese Kyat (MMK)', type: 'fiat' },
              { value: 'mxn', label: 'Mexican Peso (MXN)', type: 'fiat' },
              { value: 'myr', label: 'Malaysian Ringgit (MYR)', type: 'fiat' },
              { value: 'ngn', label: 'Nigerian Naira (NGN)', type: 'fiat' },
              { value: 'nok', label: 'Norwegian Krone (NOK)', type: 'fiat' },
              { value: 'nzd', label: 'New Zealand Dollar (NZD)', type: 'fiat' },
              { value: 'php', label: 'Philippine Peso (PHP)', type: 'fiat' },
              { value: 'pkr', label: 'Pakistani Rupee (PKR)', type: 'fiat' },
              { value: 'pln', label: 'Polish Zloty (PLN)', type: 'fiat' },
              { value: 'rub', label: 'Russian Ruble (RUB)', type: 'fiat' },
              { value: 'sar', label: 'Saudi Riyal (SAR)', type: 'fiat' },
              { value: 'sek', label: 'Swedish Krona (SEK)', type: 'fiat' },
              { value: 'sgd', label: 'Singapore Dollar (SGD)', type: 'fiat' },
              { value: 'thb', label: 'Thai Baht (THB)', type: 'fiat' },
              { value: 'try', label: 'Turkish Lira (TRY)', type: 'fiat' },
              { value: 'twd', label: 'New Taiwan Dollar (TWD)', type: 'fiat' },
              { value: 'vef', label: 'Venezuelan bolívar fuerte (VEF)', type: 'fiat' },
              { value: 'vnd', label: 'Vietnamese đồng (VND)', type: 'fiat' },
              { value: 'zar', label: 'South African Rand (ZAR)', type: 'fiat' },
              { value: 'xdr', label: 'IMF Special Drawing Rights (XDR)', type: 'fiat' },
              { value: 'xag', label: 'Silver - Troy Ounce (XAG)', type: 'fiat' },
              { value: 'xau', label: 'Gold - Troy Ounce (XAU)', type: 'fiat' },
              { value: 'bits', label: 'Bits (BITS)', type: 'fiat' },
              { value: 'sats', label: 'Satoshi (SATS)', type: 'fiat' },
              // Crypto
              { value: 'btc', label: 'Bitcoin (BTC)', type: 'crypto' },
              { value: 'eth', label: 'Etherium (ETH)', type: 'crypto' },
              { value: 'ltc', label: 'Litecoin (LTC)', type: 'crypto' },
              { value: 'bch', label: 'Bitcoin Cash (BCH)', type: 'crypto' },
              { value: 'bnb', label: 'Binance Coin (BNB)', type: 'crypto' },
              { value: 'eos', label: 'EOS (EOS)', type: 'crypto' },
              { value: 'xrp', label: 'XRP (XRP)', type: 'crypto' },
              { value: 'xlm', label: 'Lumens (XLM)', type: 'crypto' },
              { value: 'link', label: 'Chainlink (LINK)', type: 'crypto' },
              { value: 'dot', label: 'Polkadot (DOT)', type: 'crypto' },
              { value: 'yfi', label: 'Yearn.finance (YFI)', type: 'crypto' },
            ].map(option =>
              filterCurrencies(option.type) ? (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ) : null
            )}
          </select>
        </form>

        <p id="result" style={{ ...styles.result, opacity: result ? 1 : 0 }}>
          {result}
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Inter', sans-serif",
    padding: '50px 20px',
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    justifyContent: 'center',
    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  header: {
    fontSize: '48px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '40px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  converterBox: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    maxWidth: '450px',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '15px',
    marginBottom: '20px',
    borderRadius: '10px',
    border: '2px solid #ddd',
    fontSize: '18px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    ':focus': {
      borderColor: '#667eea',
    },
  },
  select: {
    width: '100%',
    padding: '15px',
    marginBottom: '20px',
    borderRadius: '10px',
    border: '2px solid #ddd',
    fontSize: '18px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    ':focus': {
      borderColor: '#667eea',
    },
  },
  checkboxContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  checkboxLabel: {
    fontSize: '16px',
    color: '#4a5568',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: '2px solid #ddd',
    transition: 'border-color 0.3s ease',
    ':checked': {
      borderColor: '#667eea',
    },
  },
  result: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#4a5568',
    textAlign: 'center',
    marginTop: '30px',
  },
};

export default CryptoConverter;