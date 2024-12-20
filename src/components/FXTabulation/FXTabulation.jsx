import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableRow, TableCell } from './FXTabulation.styles';

const FXTabulation = () => {
  const cashflowProjections = useSelector((state) => state.cashflowProjection.data);
  const forwardContracts = useSelector((state) => state.forwardContract.data); // Access forwardContract data
  const [netExposureData, setNetExposureData] = useState([]);
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [monthYearFilter, setMonthYearFilter] = useState('');

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
    const roundedValue = Math.round(value); // Convert to thousands
    const formattedValue = Math.abs(roundedValue).toLocaleString(); // Add comma separators
    return value < 0 ? `(${formattedValue})` : formattedValue; // Add parentheses for negatives
  };


  
  const formatAmount = (amount) => {
    // Ensure proper scaling by dividing by 1000 to get '70' instead of '70000'
    const amountInThousands = amount / 1000; // Divide by 1000 to get '70' instead of '70000'
    const roundedValue = Math.round(amountInThousands); // Round to nearest integer
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
  
      return contract['Ccy Pair'] === `${currency}/USD` && contractMonthYear === monthYear;
    });
  
    if (!hedgedContract) {
      return 0;
    }
  
    const hedgedAmount = parseFloat(hedgedContract['Hedged Amt'].replace(/,/g, '')) || 0;
    return hedgedAmount; // Return the raw hedged amount without formatting
  };

  const getHedgedPercentage = (hedgedAmount, netExposure) => {
    // Divide both values by 1000 for proper scaling
    const validHedgedAmount = Math.abs(parseFloat(hedgedAmount)) / 1000 || 0;
    const validNetExposure = Math.abs(parseFloat(netExposure)) || 0;
  
    console.log(`Valid Hedged Amount: ${validHedgedAmount}, Valid Net Exposure: ${validNetExposure}`);
  
    // Avoid division by zero
    if (validNetExposure === 0) {
      return validHedgedAmount === 0 ? '0.00' : '100.00';
    }
  
    // Calculate percentage
    const percentage = (validHedgedAmount / validNetExposure) * 100; // Scale to percentage
  
    console.log(`Calculated Hedged Percentage: ${percentage}`);
  
    return percentage.toFixed(1);  // Show percentage with one decimal
  };
  
  
  
  
  // Filtered data based on selected filters
  const filteredData = netExposureData.filter(
    (row) =>
      (currencyFilter ? row.Currency === currencyFilter : true) &&
      (monthYearFilter ? row.MonthYear === monthYearFilter : true)
  );

  return (
    <div>
      <h3>FX Net Exposure Tabulation</h3>
      
      <Table>
        <thead>
          <tr>
            <TableCell>
              Currency
              <select onChange={(e) => setCurrencyFilter(e.target.value)} value={currencyFilter} style={{ marginLeft: '10px' }}>
                <option value="">All</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </TableCell>
  
            <TableCell>
              Month-Year
              <select onChange={(e) => setMonthYearFilter(e.target.value)} value={monthYearFilter} style={{ marginLeft: '10px' }}>
                <option value="">All</option>
                {[...new Set(netExposureData.map((row) => row.MonthYear))].map((monthYear) => (
                  <option key={monthYear} value={monthYear}>{monthYear}</option>
                ))}
              </select>
            </TableCell>
  
            <TableCell>Net Exposure ('000)</TableCell>
            <TableCell>Total Hedged Amt ('000)</TableCell>
            <TableCell>% Hedged</TableCell>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => {
            const hedgedAmount = getHedgedAmount(row.Currency, row.MonthYear);
            const hedgedPercentage = getHedgedPercentage(hedgedAmount, row.NetExposure);
  
            return (
              <TableRow key={index}>
                <TableCell>{row.Currency}</TableCell>
                <TableCell>{row.MonthYear}</TableCell>
                <TableCell>{formatNetExposure(row.NetExposure)}</TableCell>
                <TableCell>{formatAmount(hedgedAmount)}</TableCell> {/* Format the hedged amount */}
                <TableCell>{hedgedPercentage}</TableCell> {/* Display the calculated percentage */}
              </TableRow>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default FXTabulation;
