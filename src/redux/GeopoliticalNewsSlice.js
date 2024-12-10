import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGeopoliticalNews = createAsyncThunk(
  'geopoliticalNews/fetchGeopoliticalNews',
  async () => {
    const response = await fetch('http://127.0.0.1:8000/api/geopolitical-risk-data/');
    const data = await response.json();
    return data;
  }
);

const geopoliticalNewsSlice = createSlice({
  name: 'geopoliticalNews',
  initialState: {
    newsData: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeopoliticalNews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGeopoliticalNews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.newsData = action.payload;
      })
      .addCase(fetchGeopoliticalNews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default geopoliticalNewsSlice.reducer;
