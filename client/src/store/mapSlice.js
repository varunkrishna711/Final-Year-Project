import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNearybyProducers } from "../api/mapsApi";

const initialState = {
  isLoading: false,
  nearbyProducers: [],
  totalCount: 0,
  currentPosition: null,
  selectedLocation: null,
  routingLocation: null,
};

export const loadProducersNearby = createAsyncThunk(
  "map/loadProducersNearby",
  async (arg) => {
    try {
      const response = await fetchNearybyProducers(arg.latitude, arg.longitude);
      return response;
    } catch (error) {
      throw error.response.data;
    }
  }
);

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setNearbyProducers: (state, action) => {
      state.nearbyProducers = action.payload;
    },
    setCurrentPosition: (state, action) => {
      state.currentPosition = action.payload;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setRoutingLocation: (state, action) => {
      state.routingLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducersNearby.pending, (state) => {
        state.isLoading = true;
        state.isProductsLoading = true;
      })
      .addCase(loadProducersNearby.fulfilled, (state, action) => {
        state.nearbyProducers = action.payload;
        state.totalCount = action.payload.count;
        state.isLoading = false;
      })
      .addCase(loadProducersNearby.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { setCurrentPosition, setSelectedLocation, setRoutingLocation } =
  mapSlice.actions;

export default mapSlice.reducer;
