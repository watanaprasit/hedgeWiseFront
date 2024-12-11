import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addDataUpload } from '../../redux/ProductionDataUploadSlice';
import { Button, Input, Select, FormContainer, CloseButton, Overlay, Box, FormRow, SelectInput, InputField } from './AddProductionRow.styles';

const AddProductionRow = ({ closePopup }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    forecastPeriod: '',
    region: '',
    country: '',
    asset: '',
    currentStatus: '',
    productType: '',
    breakevenPrice: '',
    dueMonth: '',
    volumeUnits: '',
    year: '',
    currency: '',
    volume: '',  
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addDataUpload(formData));
    setFormData({
      forecastPeriod: '',
      region: '',
      country: '',
      asset: '',
      currentStatus: '',
      productType: '',
      breakevenPrice: '',
      dueMonth: '',
      volumeUnits: '',
      year: '',
      currency: '',
      volume: '',  
    });
    closePopup();
  };

  const handleProductTypeChange = (e) => {
    const selectedProductType = e.target.value;
    let volumeUnit = '';
    if (selectedProductType === 'crudeOil') {
      volumeUnit = 'BOE';
    } else if (selectedProductType === 'LNG') {
      volumeUnit = 'MMBtu';
    }
    setFormData({
      ...formData,
      productType: selectedProductType,
      volumeUnits: volumeUnit,
    });
  };

  const handleVolumeChange = (e) => {
    setFormData({
      ...formData,
      volume: e.target.value,
    });
  };

  return (
    <Overlay>
      <FormContainer>
        <CloseButton onClick={closePopup}>X</CloseButton>
        <form onSubmit={handleSubmit}>
          <Box>
            <FormRow>
              <SelectInput name="region" value={formData.region} onChange={handleChange}>
                <option value="" disabled>Region</option>
                <option value="Americas">Americas</option>
                <option value="EMEA">EMEA</option>
                <option value="APAC">APAC</option>
                <option value="Russia/CIS">Russia/CIS</option>
              </SelectInput>
              <SelectInput name="country" value={formData.country} onChange={handleChange}>
                <option value="" disabled>Country</option>
                <option value="US">US</option>
                <option value="Mexico">Mexico</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Brazil">Brazil</option>
                <option value="Kazakhstan">Kazakhstan</option>
              </SelectInput>
              <InputField
                name="asset"
                value={formData.asset}
                onChange={handleChange}
                maxLength={20}
                placeholder="Asset Name"
              />
              <SelectInput name="currentStatus" value={formData.currentStatus} onChange={handleChange}>
                <option value="" disabled>Reservoir Status</option>
                <option value="new">New</option>
                <option value="midlife">Midlife</option>
                <option value="depleting">Depleting</option>
              </SelectInput>
            </FormRow>
          </Box>

          <Box>
            <FormRow>
              <SelectInput name="productType" value={formData.productType} onChange={handleProductTypeChange}>
                <option value="">Product Type</option>
                <option value="crudeOil">Crude Oil</option>
                <option value="LNG">LNG</option>
              </SelectInput>
              <InputField
                name="volume"
                type="number"
                step="0.01"
                value={formData.volume}
                onChange={handleVolumeChange}
                placeholder="Volume"
              />
              <InputField
                name="volumeUnits"
                value={formData.volumeUnits}
                readOnly
                placeholder="Volume Units"
              />
            </FormRow>
          </Box>

          <Box>
            <FormRow>
              <SelectInput name="currency" value={formData.currency} onChange={handleChange}>
                <option value="" disabled>CCY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </SelectInput>
              <InputField
                name="breakevenPrice"
                value={formData.breakevenPrice}
                onChange={handleChange}
                placeholder="Breakeven Price"
              />
            </FormRow>
          </Box>

          <Box>
            <FormRow>
              <SelectInput name="forecastPeriod" value={formData.forecastPeriod} onChange={handleChange}>
                <option value="" disabled>Forecast Period</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </SelectInput>
              <SelectInput name="dueMonth" value={formData.dueMonth} onChange={handleChange}>
                <option value="" disabled>Due Month</option>
                <option value="Jan">Jan</option>
                <option value="Feb">Feb</option>
                <option value="Mar">Mar</option>
                <option value="Apr">Apr</option>
                <option value="May">May</option>
                <option value="Jun">Jun</option>
                <option value="Jul">Jul</option>
                <option value="Aug">Aug</option>
                <option value="Sep">Sep</option>
                <option value="Oct">Oct</option>
                <option value="Nov">Nov</option>
                <option value="Dec">Dec</option>
              </SelectInput>
              <SelectInput name="year" value={formData.year} onChange={handleChange}>
                <option value="" disabled>Year</option>
                {[2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </SelectInput>
            </FormRow>
          </Box>

          <Button type="submit">Add Row</Button>
        </form>
      </FormContainer>
    </Overlay>
  );
};

export default AddProductionRow;










