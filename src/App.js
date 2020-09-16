import React, { useEffect, useState } from "react";
import CurrencyRow from "./CurrencyRow";
import ExchangeRatesTable from "./ExchangeRatesTable";
import Loader from "./Loader";

const uniqid = require("uniqid");

const BASE_URL =
  "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5";

function App() {
  const [rates, setRates] = useState({});
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(1);
  const [showLoader, setShowLoader] = useState(true);
  const [stockRates, setStockRates] = useState([]);
  const [toCurrency, setToCurrency] = useState();
  const [fromCurrency, setFromCurrency] = useState();
  const [previousValue, setPreviousValue] = useState("");
  const [exchangeBuyRate, setExchangeBuyRate] = useState(1);
  const [exchangeSaleRate, setExchangeSaleRate] = useState(1);
  const [currentCellValue, setCurrentCellValue] = useState("");
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [isSomeElementEditing, setIsSomeElementEditing] = useState(false);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * (exchangeBuyRate / exchangeSaleRate);
  } else {
    toAmount = amount;
    fromAmount = amount / (exchangeBuyRate / exchangeSaleRate);
  }

  useEffect(() => {
    if (!+localStorage.getItem("loadCounter")) {
      localStorage.setItem("loadCounter", "1");
    }
    if (+localStorage.getItem("loadCounter") < 5) {
      fetch(BASE_URL)
        .then((res) => res.json())
        .then((data) => {
          const ratesObject = {
            UAH: {
              buy: 1,
              sale: 1,
            },
          };
          data.forEach((element) => {
            ratesObject[element.ccy] = {
              buy: +element.buy,
              sale: +element.sale,
            };
            element.id = uniqid();
            element.buttonConfig = {
              buyCellEditing: false,
              saleCellEditing: false,
              buyCellReadyToSave: true,
              saleCellReadyToSave: true,
            };
          });
          ratesObject["BTC"].buy *= ratesObject["USD"].buy;
          ratesObject["BTC"].sale *= ratesObject["USD"].sale;
          setStockRates(data);
          setRates(ratesObject);
          setFromCurrency("UAH");
          setToCurrency(data[0].ccy);
          setExchangeBuyRate(ratesObject["UAH"].buy);
          setExchangeSaleRate(+data[0].sale);
          setShowLoader(false);
          localStorage.setItem(
            "loadCounter",
            +localStorage.getItem("loadCounter") + 1
          );
        })
        .catch(() => {
          setError("Something went wrong. Please, try again later");
        });
    } else {
      setTimeout(() => {
        setShowLoader(false);
        localStorage.setItem("loadCounter", "1");
        setError("Server does not respond. Please, try again later");
      }, 3000);
    }
  }, []);

  const handleFromAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  };

  const handleToAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  };

  const handleFromCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setFromCurrency(newCurrency);
    setExchangeBuyRate(rates[newCurrency].buy);
  };

  const handleToCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setToCurrency(newCurrency);
    setExchangeSaleRate(rates[newCurrency].sale);
  };

  const reorder = () => {
    setFromCurrency(toCurrency);
    setExchangeBuyRate(rates[toCurrency].buy);
    setToCurrency(fromCurrency);
    setExchangeSaleRate(rates[fromCurrency].sale);
  };

  const refreshRates = () => {
    const ratesObject = {
      UAH: {
        buy: 1,
        sale: 1,
      },
    };
    stockRates.forEach((element) => {
      ratesObject[element.ccy] = {
        buy: +element.buy,
        sale: +element.sale,
      };
    });
    ratesObject["BTC"].buy *= ratesObject["USD"].buy;
    ratesObject["BTC"].sale *= ratesObject["USD"].sale;

    setRates(ratesObject);

    setExchangeBuyRate(ratesObject[fromCurrency].buy);
    setExchangeSaleRate(ratesObject[toCurrency].sale);
  };

  const fieldCancelEdit = (id, key) => {
    const currentObject = stockRates.find((element) => element.id === id);

    return () => {
      currentObject[key] = previousValue;
      currentObject.buttonConfig[`${key}CellEditing`] = false;
      currentObject.buttonConfig[`${key}CellReadyToSave`] = true;
      setCurrentCellValue("");
      setPreviousValue("");
      setIsSomeElementEditing(false);
    };
  };

  const onFieldChange = (id, key) => {
    const currentObject = stockRates.find((element) => element.id === id);

    return () => {
      if (currentObject.buttonConfig[`${key}CellEditing`]) {
        if (currentCellValue.trim()) {
          currentObject[key] = currentCellValue;
          refreshRates();
        } else {
          currentObject[key] = previousValue;
        }
        currentObject.buttonConfig[`${key}CellEditing`] = false;
        setCurrentCellValue("");
        setPreviousValue("");
        setIsSomeElementEditing(false);
      } else {
        currentObject.buttonConfig[`${key}CellEditing`] = true;
        currentObject.buttonConfig[`${key}CellReadyToSave`] = false;
        setPreviousValue(currentObject[key]);
        setIsSomeElementEditing(true);
      }
    };
  };

  const tableInputChange = (id, key) => {
    const currentObject = stockRates.find((element) => element.id === id);

    return ({ target: { value } }) => {
      if (+value / previousValue <= 0.9 || +value / previousValue >= 1.1) {
        currentObject.buttonConfig[`${key}CellReadyToSave`] = true;
      } else if (currentObject.buttonConfig[`${key}CellReadyToSave`]) {
        currentObject.buttonConfig[`${key}CellReadyToSave`] = false;
      }
      currentObject[key] = value;
      setCurrentCellValue(value);
    };
  };

  return (
    <>
      <div id="mainHeader">Text Logo</div>
      <div id="wrapper">
        <div id="mainContent">
          <Loader showLoader={showLoader} error={error}>
            <div id="tableComponent">
              <ExchangeRatesTable
                stockRates={stockRates}
                tableInputChange={tableInputChange}
                onFieldChange={onFieldChange}
                fieldCancelEdit={fieldCancelEdit}
                isSomeElementEditing={isSomeElementEditing}
              />
            </div>
            <div id="converterWrapper">
              <div className="exchangeInput">
                <CurrencyRow
                  currencyOptions={Object.keys(rates)}
                  selectedCurrency={fromCurrency}
                  onChangeCurrency={handleFromCurrencyChange}
                  amount={fromAmount}
                  onChangeAmount={handleFromAmountChange}
                />
              </div>
              <button onClick={reorder} id="equalsButton">
                &#8646;
              </button>
              <div className="exchangeInput">
                <CurrencyRow
                  currencyOptions={Object.keys(rates)}
                  selectedCurrency={toCurrency}
                  onChangeCurrency={handleToCurrencyChange}
                  amount={toAmount}
                  onChangeAmount={handleToAmountChange}
                />
              </div>
            </div>
          </Loader>
        </div>
      </div>
      <div id="footer">2020 All Rights Reserved</div>
    </>
  );
}

export default App;
