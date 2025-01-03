import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableCell,
  CurrencyCell,
  ScrollableTableContainer,
  LeftAlignedContainer,
  RightAlignedContainer, 
} from './FXTabulation.styles';

const FXTabulation = () => {
  const cashflowProjections = useSelector((state) => state.cashflowProjection.data);
  const forwardContracts = useSelector((state) => state.forwardContract.data);
  const [netExposureData, setNetExposureData] = useState([]);
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [monthYearFilter, setMonthYearFilter] = useState('');
  const [lowPoint, setLowPoint] = useState(0);
  const [highPoint, setHighPoint] = useState(100);

  useEffect(() => {
    const calculateNetExposure = () => {
      const revenueMap = {};
      const expenseMap = {};

      if (!Array.isArray(cashflowProjections) || cashflowProjections.length === 0) return;

      cashflowProjections.forEach(({ RevenueCcy, RevenueAmount, RevenueDueMonth, RevenueDueYear, ExpenseCcy, ExpenseAmount, ExpenseDueMonth, ExpenseDueYear }) => {
        if (RevenueCcy === 'USD' && ExpenseCcy === 'USD') return;

        const revenueKey = `${RevenueCcy}-${RevenueDueMonth}-${RevenueDueYear}`;
        const expenseKey = `${ExpenseCcy}-${ExpenseDueMonth}-${ExpenseDueYear}`;

        if (RevenueAmount && RevenueCcy !== 'USD') {
          revenueMap[revenueKey] = (revenueMap[revenueKey] || 0) + parseFloat(RevenueAmount);
        }

        if (ExpenseAmount && ExpenseCcy !== 'USD') {
          expenseMap[expenseKey] = (expenseMap[expenseKey] || 0) + parseFloat(ExpenseAmount);
        }
      });

      const netExposureMap = {};

      Object.keys(revenueMap).forEach((key) => {
        const [currency, month, year] = key.split('-');
        const revenueAmount = revenueMap[key];
        const expenseAmount = expenseMap[key] || 0;

        const netExposure = revenueAmount - expenseAmount;

        if (!netExposureMap[currency]) {
          netExposureMap[currency] = {};
        }

        netExposureMap[currency][`${month}-${year}`] = netExposure;
      });

      Object.keys(expenseMap).forEach((key) => {
        const [currency, month, year] = key.split('-');
        if (!revenueMap[`${currency}-${month}-${year}`]) {
          const expenseAmount = expenseMap[key];
          const netExposure = -expenseAmount;

          if (!netExposureMap[currency]) {
            netExposureMap[currency] = {};
          }

          netExposureMap[currency][`${month}-${year}`] = netExposure;
        }
      });

      const formattedNetExposureData = [];
      Object.keys(netExposureMap).forEach((currency) => {
        Object.keys(netExposureMap[currency]).forEach((monthYear) => {
          formattedNetExposureData.push({
            Currency: currency,
            MonthYear: monthYear,
            NetExposure: netExposureMap[currency][monthYear],
          });
        });
      });

      setNetExposureData(formattedNetExposureData);
    };

    calculateNetExposure();
  }, [cashflowProjections]);

  const formatNetExposure = (value) => {
    const roundedValue = Math.round(value);
    const formattedValue = Math.abs(roundedValue).toLocaleString();
    return value < 0 ? `(${formattedValue})` : formattedValue;
  };

  const formatAmount = (amount) => {
    const amountInThousands = amount / 1000;
    const roundedValue = Math.round(amountInThousands);
    const formattedValue = Math.abs(roundedValue).toLocaleString();

    return amountInThousands < 0
      ? `(${formattedValue})`
      : formattedValue;
  };

  const getHedgedAmount = (currency, monthYear) => {
    const hedgedContract = forwardContracts.find((contract) => {
      const contractMonth = contract['Maturity Month'] || 'Unknown';
      let contractYear = contract['Maturity Year'] || new Date().getFullYear();

      const contractMonthYear = `${contractMonth}-${contractYear}`;

      const [currency1, currency2] = contract['Ccy Pair'].split('/');

      return (
        (currency1 === currency || currency2 === currency) &&
        contractMonthYear === monthYear
      );
    });

    if (!hedgedContract) {
      return 0;
    }

    const hedgedAmount = parseFloat(hedgedContract['Hedged Amt'].replace(/,/g, '')) || 0;
    return hedgedAmount;
  };

  const getHedgedPercentage = (hedgedAmount, netExposure) => {
    const validHedgedAmount = Math.abs(parseFloat(hedgedAmount)) / 1000 || 0;
    const validNetExposure = Math.abs(parseFloat(netExposure)) || 0;

    if (validNetExposure === 0) {
      return validHedgedAmount === 0 ? '0.00' : '100.00';
    }

    const percentage = (validHedgedAmount / validNetExposure) * 100;

    return percentage.toFixed(1);
  };

  const filteredData = netExposureData.filter(
    (row) =>
      (currencyFilter ? row.Currency === currencyFilter : true) &&
      (monthYearFilter ? row.MonthYear === monthYearFilter : true)
  );

  return (
    <div>
      <h3>FX Hedging Portfolio</h3>

      <RightAlignedContainer>
      <h3>Hedge Threshold</h3>
      </RightAlignedContainer>
     
      <RightAlignedContainer>
        
        <div>
          <label>Low Point:</label>
          <select
            value={lowPoint}
            onChange={(e) => setLowPoint(Number(e.target.value))}
          >
            {[...Array(21)].map((_, index) => (
              <option key={index} value={index * 5}>
                {index * 5}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>High Point:</label>
          <select
            value={highPoint}
            onChange={(e) => setHighPoint(Number(e.target.value))}
          >
            {[...Array(21)].map((_, index) => (
              <option key={index} value={index * 5}>
                {index * 5}
              </option>
            ))}
          </select>
        </div>
      </RightAlignedContainer>

      <ScrollableTableContainer>
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>
                <LeftAlignedContainer>
                  <span>Currency</span>
                  <select onChange={(e) => setCurrencyFilter(e.target.value)} value={currencyFilter}>
                    <option value="">All</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                  </select>
                </LeftAlignedContainer>
              </TableHeaderCell>

              <TableHeaderCell>
                <LeftAlignedContainer>
                  <span>Month-Year</span>
                  <select onChange={(e) => setMonthYearFilter(e.target.value)} value={monthYearFilter}>
                    <option value="">All</option>
                    {[...new Set(netExposureData.map((row) => row.MonthYear))].map((monthYear) => (
                      <option key={monthYear} value={monthYear}>
                        {monthYear}
                      </option>
                    ))}
                  </select>
                </LeftAlignedContainer>
              </TableHeaderCell>

              <TableHeaderCell>Net Exposure ('000)</TableHeaderCell>
              <TableHeaderCell>Total Hedged Amt ('000)</TableHeaderCell>
              <TableHeaderCell>% Hedged</TableHeaderCell>
            </tr>
          </TableHead>
          <tbody>
            {filteredData.map((row, index) => {
              const hedgedAmount = getHedgedAmount(row.Currency, row.MonthYear);
              const hedgedPercentage = getHedgedPercentage(hedgedAmount, row.NetExposure);

              const isOutOfRange =
                hedgedPercentage < lowPoint || hedgedPercentage > highPoint;

              return (
                <TableRow key={index} style={{ backgroundColor: isOutOfRange ? 'lightcoral' : '' }}>
                  <CurrencyCell>{row.Currency}</CurrencyCell>
                  <TableCell>{row.MonthYear}</TableCell>
                  <TableCell>{formatNetExposure(row.NetExposure)}</TableCell>
                  <TableCell>{formatAmount(hedgedAmount)}</TableCell>
                  <TableCell>{hedgedPercentage}</TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </ScrollableTableContainer>
    </div>
  );
};

export default FXTabulation;
