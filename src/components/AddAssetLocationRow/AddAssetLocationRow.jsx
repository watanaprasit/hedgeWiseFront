import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAssetLocation } from '../../redux/AssetLocationSlice';
import { Button, FormContainer, CloseButton, Overlay, Box, FormRow, SelectInput, InputField } from './AddAssetLocationRow.styles';

const BASE_URL = process.env.REACT_APP_API_URL;


const AddAssetLocationRow = ({ closePopup }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    assetName: '',
    region: '',
    country: '',
    latitude: '',
    longitude: '',
    status: '',
    productType: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.assetName || !formData.region || !formData.status || !formData.productType) {
      alert('Please fill in all required fields.');
      return;
    }

 
    const newAsset = {
      ...formData,
    };

    console.log("Dispatching new asset:", newAsset);  

    // Dispatch the asset to the Redux store
    dispatch(addAssetLocation(newAsset));

    // Send the new asset to Firestore
    fetch(`${BASE_URL}/firebase-api/add-asset-location/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([newAsset]), // Send the asset as an array to match API format
    })
    .then(response => response.json())
    .then(data => {
      console.log('Asset added to Firestore:', data);
      // Optionally handle Firestore response or errors here
    })
    .catch(error => {
      console.error('Error posting asset to Firestore:', error);
      alert('Error adding asset to Firestore');
    });

    // Reset form data after submission
    setFormData({
      assetName: '',
      region: '',
      country: '',
      latitude: '',
      longitude: '',
      status: '',
      productType: ''
    });

    // Close the popup after submission
    closePopup();
  };

  return (
    <Overlay>
      <FormContainer>
        <CloseButton onClick={closePopup}>X</CloseButton>
        <form onSubmit={handleSubmit}>
          <Box>
            <FormRow>
              <InputField
                name="assetName"
                value={formData.assetName}
                onChange={handleChange}
                placeholder="Asset Name"
                required
              />
              <SelectInput name="region" value={formData.region} onChange={handleChange} required>
                <option value="" disabled>Region</option>
                <option value="Americas">Americas</option>
                <option value="EMEA">EMEA</option>
                <option value="APAC">APAC</option>
                <option value="Russia/CIS">Russia/CIS</option>
              </SelectInput>
              <InputField
                name="country"
                value={formData.country}  
                onChange={handleChange}
                placeholder="Country"
              />
              <InputField
                name="latitude"
                type="number"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Latitude"
              />
              <InputField
                name="longitude"
                type="number"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Longitude"
              />
            </FormRow>
          </Box>

          <Box>
            <FormRow>
              <SelectInput name="status" value={formData.status} onChange={handleChange} required>
                <option value="" disabled>Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </SelectInput>
              <SelectInput name="productType" value={formData.productType} onChange={handleChange} required>
                <option value="" disabled>Select Product Type</option>
                <option value="crudeOil">Crude Oil</option>
                <option value="LNG">LNG</option>
              </SelectInput>
            </FormRow>
          </Box>

          <Button type="submit">Add Location</Button>
        </form>
      </FormContainer>
    </Overlay>
  );
};

export default AddAssetLocationRow;







