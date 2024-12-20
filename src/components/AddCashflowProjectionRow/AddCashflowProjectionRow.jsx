import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCashflowProjection } from '../../redux/CashflowProjectionSlice';
import { Button, FormContainer, CloseButton, Overlay, Box, FormRow, SelectInput, InputField } from './AddCashflowProjectionRow.styles';

const AddCashflowProjectionRow = ({ closePopup }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    RevenueCcy: '',
    RevenueAmount: '',
    RevenueDueMonth: '',
    RevenueDueYear: '',
    ExpenseCcy: '',
    ExpenseAmount: '',
    ExpenseDueMonth: '',
    ExpenseDueYear: '',
    Region: '',
    Asset: '',
    RiskProfile: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'RevenueAmount' || name === 'ExpenseAmount') {
      // Ensure no decimal places
      setFormData({
        ...formData,
        [name]: value.replace(/[^\d]/g, '') // Only allow numeric characters
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      'RevenueCcy', 'RevenueAmount', 'RevenueDueMonth', 'RevenueDueYear',
      'ExpenseCcy', 'ExpenseAmount', 'ExpenseDueMonth', 'ExpenseDueYear',
      'Region', 'Asset', 'RiskProfile'
    ];

    const isEmpty = requiredFields.some(field => !formData[field]);

    if (isEmpty) {
      alert('Please fill in all required fields.');
      return;
    }

    const newCashflowProjection = {
      ...formData,
    };

    console.log("Dispatching new Cashflow Projection:", newCashflowProjection);

    dispatch(addCashflowProjection(newCashflowProjection));

    fetch('http://127.0.0.1:8000/firebase-api/add-cashflow-projection/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([newCashflowProjection]),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Cashflow Projection added to Firestore:', data);
      })
      .catch(error => {
        console.error('Error posting Cashflow Projection to Firestore:', error);
        alert('Error adding Cashflow Projection to Firestore');
      });

    setFormData({
      RevenueCcy: '',
      RevenueAmount: '',
      RevenueDueMonth: '',
      RevenueDueYear: '',
      ExpenseCcy: '',
      ExpenseAmount: '',
      ExpenseDueMonth: '',
      ExpenseDueYear: '',
      Region: '',
      Asset: '',
      RiskProfile: ''
    });

    closePopup();
  };

  return (
    <Overlay>
      <FormContainer>
        <CloseButton onClick={closePopup}>X</CloseButton>
        <form onSubmit={handleSubmit}>
          <Box>
            <FormRow>
              <SelectInput
                name="RevenueCcy"
                value={formData.RevenueCcy}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Revenue Currency</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </SelectInput>
              <InputField
                name="RevenueAmount"
                type="number"
                value={formData.RevenueAmount}
                onChange={handleChange}
                placeholder="Revenue Amount"
                required
              />
              <SelectInput
                name="RevenueDueMonth"
                value={formData.RevenueDueMonth}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Revenue Due Month</option>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </SelectInput>
              <SelectInput
                name="RevenueDueYear"
                value={formData.RevenueDueYear}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Revenue Due Year</option>
                {[2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </SelectInput>
            </FormRow>
          </Box>

          <Box>
            <FormRow>
              <SelectInput
                name="ExpenseCcy"
                value={formData.ExpenseCcy}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Expense Currency</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </SelectInput>
              <InputField
                name="ExpenseAmount"
                type="number"
                value={formData.ExpenseAmount}
                onChange={handleChange}
                placeholder="Expense Amount"
                required
              />
              <SelectInput
                name="ExpenseDueMonth"
                value={formData.ExpenseDueMonth}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Expense Due Month</option>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </SelectInput>
              <SelectInput
                name="ExpenseDueYear"
                value={formData.ExpenseDueYear}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Expense Due Year</option>
                {[2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </SelectInput>
            </FormRow>
          </Box>

          <Box>
            <FormRow>
              <SelectInput
                name="Region"
                value={formData.Region}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Region</option>
                <option value="Americas">Americas</option>
                <option value="EMEA">EMEA</option>
                <option value="APAC">APAC</option>
                <option value="Russia/CIS">Russia/CIS</option>
              </SelectInput>
              <InputField
                name="Asset"
                value={formData.Asset}
                onChange={handleChange}
                placeholder="Asset"
                required
              />
              <SelectInput
                name="RiskProfile"
                value={formData.RiskProfile}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Risk Profile</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </SelectInput>
            </FormRow>
          </Box>

          <Button type="submit">Add Cashflow Projection</Button>
        </form>
      </FormContainer>
    </Overlay>
  );
};

export default AddCashflowProjectionRow;
