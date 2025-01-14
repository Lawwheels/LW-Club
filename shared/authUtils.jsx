import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate} from '../src/navigation/navigationRef';
import {server} from '../src/constants/config';
import {logoutUser} from '../src/redux/reducers/auth/authSlice';
import {navigationRef} from '../src/navigation/navigationRef';
import {store} from '../src/redux/store';

// Function to refresh the token
export const refreshTokenApi = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const refreshResult = await fetch(`${server}/authUser/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {refreshToken},
    });
    if (refreshResult?.data) {
      const newAuthToken = refreshResult.data.AccessToken;
      const newRefreshToken = refreshResult.data.refreshToken;

      // Save new tokens to AsyncStorage
      await AsyncStorage.setItem('authToken', newAuthToken);
      await AsyncStorage.setItem('refreshToken', newRefreshToken);
      return true;
    } else {
      await store.dispatch(logoutUser()); // Dispatch logout action
      if (navigationRef.isReady()) {
        console.log('Navigating to authStack...');
        navigate('authStack');
      } else {
        console.error('Navigation reference is not ready.');
      }
      return false;
    }
  } catch (err) {
    console.error('Error refreshing token:', err);

    return false;
  }
};

// Function to handle errors
export const handleError = error => {
  console.log('handleerror', error);
  if (
    error?.data?.message === 'Unauthorized' ||
    error?.data?.message === 'jwt expired'
  ) {
    console.log('Handling error: Unauthorized or JWT expired');
    return refreshTokenApi();
  }
  console.log('Unhandled error:', error?.data);
  console.log('console error:', error?.data?.message);
};
