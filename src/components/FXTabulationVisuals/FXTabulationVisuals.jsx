import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";

const FXTabulationVisuals = () => {
  const CashflowProjections = useSelector((state) => state.cashflowProjection.data);

  // Ensure CashflowProjections is defined and has data
  if (!CashflowProjections || CashflowProjections.length === 0) {
    return <div>No data available for visualization.</div>;
  }

  // Calculate net exposure using revenue and expense maps
  const revenueMap = {};
  const expenseMap = {};

  CashflowProjections.forEach(({ RevenueCcy, RevenueAmount, RevenueDueMonth, RevenueDueYear, ExpenseCcy, ExpenseAmount, ExpenseDueMonth, ExpenseDueYear }) => {
    if (RevenueCcy === 'USD' && ExpenseCcy === 'USD') return; // Skip USD only entries

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

  // Handle cases where there are only expenses and no revenue
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

  // Prepare data for the BarChart
  const barChartData = [];
  Object.keys(netExposureMap).forEach((currency) => {
    const currencyData = netExposureMap[currency];
    Object.keys(currencyData).forEach((monthYear) => {
      const existingMonthYear = barChartData.find(item => item.MonthYear === monthYear);
      
      if (!existingMonthYear) {
        barChartData.push({ MonthYear: monthYear });
      }
    });
  });

  // Sort data by month-year in chronological order using a proper Date object
  barChartData.sort((a, b) => {
    const [aMonth, aYear] = a.MonthYear.split('-');
    const [bMonth, bYear] = b.MonthYear.split('-');

    // Convert month names (Jan, Feb, Mar, ...) to their corresponding month number
    const months = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

    // Convert to Date objects with Year and Month
    const dateA = new Date(Number(aYear), months[aMonth] - 1); // months are zero-indexed
    const dateB = new Date(Number(bYear), months[bMonth] - 1);

    return dateA - dateB; // Compare the Date objects
  });

  // Fill in net exposure values for each currency and month-year
  barChartData.forEach((item) => {
    Object.keys(netExposureMap).forEach((currency) => {
      const currencyData = netExposureMap[currency];
      if (currencyData[item.MonthYear] !== undefined) {
        item[currency] = currencyData[item.MonthYear]; // Directly use the value
      } else {
        item[currency] = 0;
      }
    });
  });

  // Separate the data for EUR, GBP, and JPY
  const filterDataByCurrency = (currency) => {
    return barChartData.map((item) => ({
      MonthYear: item.MonthYear,
      NetExposure: item[currency] || 0,
    }));
  };

  return (
    <div>
      <h3>Total Net Exposure by Currency</h3>

      {/* EUR Chart */}
      <h4>EUR</h4>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={filterDataByCurrency('EUR')}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="category" dataKey="MonthYear" />
          <YAxis type="number" />
          <Tooltip formatter={(value) => [`${value}`, "Net Exposure"]} labelFormatter={(label) => `Month: ${label}`} />
          <Legend />
          <Bar dataKey="NetExposure" fill="#8884d8" name="EUR" />
        </BarChart>
      </ResponsiveContainer>

      {/* GBP Chart */}
      <h4>GBP</h4>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={filterDataByCurrency('GBP')}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="category" dataKey="MonthYear" />
          <YAxis type="number" />
          <Tooltip formatter={(value) => [`${value}`, "Net Exposure"]} labelFormatter={(label) => `Month: ${label}`} />
          <Legend />
          <Bar dataKey="NetExposure" fill="#FF8042" name="GBP" />
        </BarChart>
      </ResponsiveContainer>

      {/* JPY Chart */}
      <h4>JPY</h4>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={filterDataByCurrency('JPY')}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="category" dataKey="MonthYear" />
          <YAxis type="number" />
          <Tooltip formatter={(value) => [`${value}`, "Net Exposure"]} labelFormatter={(label) => `Month: ${label}`} />
          <Legend />
          <Bar dataKey="NetExposure" fill="#82ca9d" name="JPY" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FXTabulationVisuals;
