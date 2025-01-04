import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addDataUpload } from '../../redux/ProductionDataUploadSlice';
import {
  Button, FormContainer, CloseButton, Overlay, Box, FormRow, SelectInput, InputField
} from './AddProductionRow.styles';

const BASE_URL = process.env.REACT_APP_API_URL;

const AddProductionRow = ({ closePopup }) => {
  const dispatch = useDispatch();

  // Initial form data aligned with expectedHeaders
  const [formData, setFormData] = useState({
    Region: '',
    Country: '',
    Asset: '',
    "Reservoir Status": '',
    "Product Type": '',
    CCY: '',
    "Breakeven Price": '',
    Volume: '',
    "Volume Units": '',
    "Forecast Period": '',
    "Due Month": '',
    Year: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProductTypeChange = (e) => {
    const selectedProductType = e.target.value;
    let volumeUnit = '';
    if (selectedProductType === 'Crude Oil') {
      volumeUnit = 'BOE';
    } else if (selectedProductType === 'LNG') {
      volumeUnit = 'MMBtu';
    }
    setFormData({
      ...formData,
      "Product Type": selectedProductType,
      "Volume Units": volumeUnit,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Log form data for debugging
    console.log("Submitted Data:", formData);
  
    // Dispatch the data to Redux
    dispatch(addDataUpload(formData)); // Removed the array wrapper
  
    fetch(`${BASE_URL}/firebase-api/add-production-row/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData), // Send formData directly
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Production Forecast added to Firestore:', data);
      })
      .catch((error) => {
        console.error('Error posting Production Forecast to Firestore:', error);
        alert('Error adding Production Forecast to Firestore');
      });
  
    // Reset form after submission
    setFormData({
      Region: '',
      Country: '',
      Asset: '',
      "Reservoir Status": '',
      "Product Type": '',
      CCY: '',
      "Breakeven Price": '',
      Volume: '',
      "Volume Units": '',
      "Forecast Period": '',
      "Due Month": '',
      Year: '',
    });
  
    // Close the popup
    closePopup();
  };
  

  return (
    <Overlay>
      <FormContainer>
        <CloseButton onClick={closePopup}>X</CloseButton>
        <form onSubmit={handleSubmit}>
          {/* Region and Country Selection */}
          <Box>
            <FormRow>
              <SelectInput name="Region" value={formData.Region} onChange={handleChange}>
                <option value="" disabled>Region</option>
                <option value="Americas">Americas</option>
                <option value="EMEA">EMEA</option>
                <option value="APAC">APAC</option>
                <option value="Russia/CIS">Russia/CIS</option>
              </SelectInput>
              <SelectInput name="Country" value={formData.Country} onChange={handleChange}>
                <option value="" disabled>Country</option>
                <option value="US">US</option>
                <option value="Mexico">Mexico</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Brazil">Brazil</option>
                <option value="Kazakhstan">Kazakhstan</option>
              </SelectInput>
            </FormRow>
          </Box>

          {/* Asset and Reservoir Status */}
          <Box>
            <FormRow>
              <InputField
                name="Asset"
                value={formData.Asset}
                onChange={handleChange}
                maxLength={20}
                placeholder="Asset"
              />
              <SelectInput name="Reservoir Status" value={formData["Reservoir Status"]} onChange={handleChange}>
                <option value="" disabled>Reservoir Status</option>
                <option value="New">New</option>
                <option value="Midlife">Midlife</option>
                <option value="Depleting">Depleting</option>
              </SelectInput>
            </FormRow>
          </Box>

          {/* Product Type and Volume */}
          <Box>
            <FormRow>
              <SelectInput name="Product Type" value={formData["Product Type"]} onChange={handleProductTypeChange}>
                <option value="" disabled>Product Type</option>
                <option value="Crude Oil">Crude Oil</option>
                <option value="LNG">LNG</option>
              </SelectInput>
              <InputField
                name="Volume"
                type="number"
                step="0.01"
                value={formData.Volume}
                onChange={handleChange}
                placeholder="Volume"
              />
              <InputField
                name="Volume Units"
                value={formData["Volume Units"]}
                readOnly
                placeholder="Volume Units"
              />
            </FormRow>
          </Box>

          {/* CCY and Breakeven Price */}
          <Box>
            <FormRow>
              <SelectInput name="CCY" value={formData.CCY} onChange={handleChange}>
                <option value="" disabled>CCY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </SelectInput>
              <InputField
                name="Breakeven Price"
                value={formData["Breakeven Price"]}
                onChange={handleChange}
                placeholder="Breakeven Price"
              />
            </FormRow>
          </Box>

          {/* Forecast Period, Due Month, and Year */}
          <Box>
            <FormRow>
              <SelectInput name="Forecast Period" value={formData["Forecast Period"]} onChange={handleChange}>
                <option value="" disabled>Forecast Period</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annual">Annual</option>
              </SelectInput>
              <SelectInput name="Due Month" value={formData["Due Month"]} onChange={handleChange}>
                <option value="" disabled>Due Month</option>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </SelectInput>
              <SelectInput name="Year" value={formData.Year} onChange={handleChange}>
                <option value="" disabled>Year</option>
                {[2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </SelectInput>
            </FormRow>
          </Box>

          {/* Submit Button */}
          <Button type="submit">Add Row</Button>
        </form>
      </FormContainer>
    </Overlay>
  );
};

export default AddProductionRow;
