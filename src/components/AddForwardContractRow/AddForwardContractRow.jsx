import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addForwardContract } from '../../redux/ForwardContractSlice';
import { Button, FormContainer, CloseButton, Overlay, Box, FormRow, SelectInput, InputField } from './AddForwardContractRow.styles';

const AddForwardContractRow = ({ closePopup }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    CcyPair: '',
    AmtPurchased: '',
    Direction: '',
    ForwardRate: '',
    HedgedAmt: '',
    MaturityMonth: '',
    MaturityYear: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'AmtPurchased' || name === 'ForwardRate' || name === 'HedgedAmt') {
      // Ensure no decimal places if needed
      setFormData({
        ...formData,
        [name]: value.replace(/[^\d.]/g, '') // Only allow numeric characters and decimal point
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
      'CcyPair', 'AmtPurchased', 'Direction', 'ForwardRate',
      'HedgedAmt', 'MaturityMonth', 'MaturityYear'
    ];

    const isEmpty = requiredFields.some(field => !formData[field]);

    if (isEmpty) {
      alert('Please fill in all required fields.');
      return;
    }

    const newForwardContract = {
      ...formData,
    };

    console.log("Dispatching new Forward Contract:", newForwardContract);

    dispatch(addForwardContract(newForwardContract));

    fetch('http://127.0.0.1:8000/firebase-api/add-forward-contract/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([newForwardContract]),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Forward Contract added to Firestore:', data);
      })
      .catch(error => {
        console.error('Error posting Forward Contract to Firestore:', error);
        alert('Error adding Forward Contract to Firestore');
      });

    setFormData({
      CcyPair: '',
      AmtPurchased: '',
      Direction: '',
      ForwardRate: '',
      HedgedAmt: '',
      MaturityMonth: '',
      MaturityYear: ''
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
                name="CcyPair"
                value={formData.CcyPair}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Currency Pair</option>
                <option value="USD/EUR">USD/EUR</option>
                <option value="USD/GBP">USD/GBP</option>
                <option value="EUR/GBP">EUR/GBP</option>
              </SelectInput>
              <InputField
                name="AmtPurchased"
                type="number"
                value={formData.AmtPurchased}
                onChange={handleChange}
                placeholder="Amount Purchased"
                required
              />
              <SelectInput
                name="Direction"
                value={formData.Direction}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Direction</option>
                <option value="Long">Long</option>
                <option value="Short">Short</option>
              </SelectInput>
              <InputField
                name="ForwardRate"
                type="number"
                value={formData.ForwardRate}
                onChange={handleChange}
                placeholder="Forward Rate"
                required
              />
            </FormRow>
          </Box>

          <Box>
            <FormRow>
              <InputField
                name="HedgedAmt"
                type="number"
                value={formData.HedgedAmt}
                onChange={handleChange}
                placeholder="Hedged Amount (USD)"
                required
              />
              <SelectInput
                name="MaturityMonth"
                value={formData.MaturityMonth}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Maturity Month</option>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </SelectInput>
              <SelectInput
                name="MaturityYear"
                value={formData.MaturityYear}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Maturity Year</option>
                {[2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </SelectInput>
            </FormRow>
          </Box>

          <Button type="submit">Add Forward Contract</Button>
        </form>
      </FormContainer>
    </Overlay>
  );
};

export default AddForwardContractRow;

