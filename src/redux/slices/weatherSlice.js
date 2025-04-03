import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {}, // Store weather data for multiple cities
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    fetchWeatherStart: (state) => {
      state.loading = true;
    },
    fetchWeatherSuccess: (state, action) => {
      state.loading = false;
      state.data[action.payload.city] = action.payload.data; // Store city-specific data
      state.error = null;
    },
    fetchWeatherFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchWeatherStart, fetchWeatherSuccess, fetchWeatherFailure } = weatherSlice.actions;
export default weatherSlice.reducer;

export const fetchWeatherData = (city) => async (dispatch) => {
  dispatch(fetchWeatherStart());
  try {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch weather for ${city}`);
    }

    const data = await response.json();
    dispatch(fetchWeatherSuccess({ city, data })); // Store each city separately
  } catch (error) {
    dispatch(fetchWeatherFailure(error.message));
  }
};
