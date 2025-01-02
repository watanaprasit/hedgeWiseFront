import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGeopoliticalNews = createAsyncThunk(
  'geopoliticalNews/fetchGeopoliticalNews',
  async () => {
    const response = await fetch('http://127.0.0.1:8000/api/geopolitical-risk-data/');
    const text = await response.text();
    const data = JSON.parse(text);
    return data;
  }
);

const geopoliticalNewsSlice = createSlice({
  name: 'geopoliticalNews',
  initialState: {
    newsData: [],
    PRIs: [],  // Ensuring PRIs are part of the initial state
    status: 'idle',
    error: null,
  },
  reducers: {
    addPRIs: (state, action) => {
      // If action.payload is an array, append all elements to PRIs
      if (Array.isArray(action.payload)) {
        state.PRIs.push(...action.payload);
      } else {
        state.PRIs.push(action.payload);  // Adds a single PRI to the list
      }
    },
    deletePRI: (state, action) => {
      // Removes a PRI by its id
      state.PRIs = state.PRIs.filter(pri => pri.id !== action.payload.id);
    },
    setPRIsFromBackend: (state, action) => {
      // Replaces the PRIs list with data from backend
      state.PRIs = action.payload;
    },
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

// Export the action creators to dispatch in components
export const { addPRIs, deletePRI, setPRIsFromBackend } = geopoliticalNewsSlice.actions;

export default geopoliticalNewsSlice.reducer;
