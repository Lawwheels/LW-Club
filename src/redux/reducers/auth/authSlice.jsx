import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: null, // Stores user info
  role: null, // Stores the user role
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      console.log(action.payload.role);
    },
    clearUser: state => {
      state.user = null;
      state.role = null;

      // Clear token and role from AsyncStorage
      AsyncStorage.removeItem('authToken');
      AsyncStorage.removeItem('role');
    },
  },
});

export const {setUser, clearUser} = authSlice.actions;

export default authSlice.reducer;
