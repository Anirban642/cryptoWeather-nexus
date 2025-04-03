import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './slices/weatherSlice';
import cryptoReducer from './slices/cryptoSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    crypto: cryptoReducer,
  },
});

export default store;
