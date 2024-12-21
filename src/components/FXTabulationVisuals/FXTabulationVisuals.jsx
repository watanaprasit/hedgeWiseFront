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

  // Fill in net exposure values for each currency and month-year
  barChartData.forEach((item) => {
    Object.keys(netExposureMap).forEach((currency) => {
      const currencyData = netExposureMap[currency];
      if (currencyData[item.MonthYear] !== undefined) {
        item[currency] = currencyData[item.MonthYear] / 1000; // Convert to '000s
      } else {
        item[currency] = 0;
      }
    });
  });

  return (
    <div>
      <h3>Total Net Exposure by Currency</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={barChartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="category" dataKey="MonthYear" />
          <YAxis type="number" tickFormatter={(value) => `${value}k`} />
          <Tooltip
            formatter={(value) => [`${value}k`, "Net Exposure"]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Legend />
          
          {/* Dynamically render bars for each currency */}
          {Object.keys(netExposureMap).map((currency, index) => (
            <Bar
              key={currency}
              dataKey={currency}
              stackId="a"
              fill={index % 2 === 0 ? "#8884d8" : "#FF8042"} // Alternate colors
              name={currency}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FXTabulationVisuals;
