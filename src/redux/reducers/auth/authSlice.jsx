import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: null, // Stores user info
  role: null, // Stores the user role
  authToken: null, // Stores the authentication token
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.authToken = action.payload.authToken;
    },
    clearUser: (state) => {
      state.user = null;
      state.role = null;
      state.authToken = null; // Clear Redux state as well
    },
  },
});

export const {setUser, clearUser} = authSlice.actions;

export const logoutUser = () => async (dispatch) => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('role');
    await AsyncStorage.removeItem('refreshToken');
    dispatch(clearUser());
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export default authSlice.reducer;
