import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},
  loading: false,
  error: null,
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    fetchCryptoStart: (state) => {
      state.loading = true;
    },
    fetchCryptoSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchCryptoFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchCryptoStart, fetchCryptoSuccess, fetchCryptoFailure } = cryptoSlice.actions;
export default cryptoSlice.reducer;

export const fetchCryptoData = () => async (dispatch) => {
  dispatch(fetchCryptoStart());
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_market_cap=true&include_24hr_change=true"
    );
    const data = await response.json();
    dispatch(fetchCryptoSuccess(data));
  } catch (error) {
    dispatch(fetchCryptoFailure(error.message));
  }
};

