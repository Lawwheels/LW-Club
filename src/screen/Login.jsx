import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  BackHandler,
  ToastAndroid,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from '../../shared/CustomButton';
import CustomTextInput from '../../shared/CustomTextInput';
import {useLoginMutation} from '../redux/api/api';
import navigationStrings from '../constants/navigationStrings';

const {height: screenHeight} = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
  const [login, {isLoading}] = useLoginMutation();
  const validationSchema = Yup.object().shape({
    mobileNumber: Yup.string()
      .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
      .required('Mobile number is required'),
  });

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const handleSendOtp = async values => {
    try {
      const res = await login({
        mobileNumber: values.mobileNumber,
      }).unwrap();

      console.log('res', res);

      if (res && res.success) {
        ToastAndroid.show(res.message || 'Success', ToastAndroid.SHORT);
        navigation.navigate(navigationStrings.OTP_SCREEN, {
          mobileNumber: values.mobileNumber,
        });
      } else if (
        res &&
        res.success === false &&
        res.message === 'NOTPRESENT!'
      ) {
        navigation.navigate(navigationStrings.REGISTER, {
          mobileNumber: values.mobileNumber,
        });
      } else {
        ToastAndroid.show(
          res.message || 'Failed to send OTP',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      if (error.data && error.data.message === 'NOTPRESENT!') {
        navigation.navigate(navigationStrings.REGISTER, {
          mobileNumber: values.mobileNumber,
        });
      } else {
        console.error('Error occurred while submitting mobileNumber', error);
        ToastAndroid.show(
          'Error occurred while submitting mobileNumber',
          error,
        );
      }
    }
  };

  return (
    <>
      <View style={styles.container}>
        {/* Background Gradient */}
        <LinearGradient
          colors={['#17316D', '#1262D2']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.background}>
          {/* Slanting Lines Overlay */}
          <View style={styles.lineOverlay}>
            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.line} />
          </View>

          {/* Login Section */}
          <View style={styles.loginContainer}>
            <Formik
              initialValues={{mobileNumber: ''}}
              validationSchema={validationSchema}
              onSubmit={handleSendOtp}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.content}>
                  <View style={styles.loginLine} />
                  <Text style={styles.loginTitle}>Login</Text>
                  <Text style={styles.inputLabel}>Mobile Number</Text>
                  <CustomTextInput
                    placeholder="Enter Your Number Here"
                    value={values.mobileNumber}
                    onChangeText={handleChange('mobileNumber')}
                    onBlur={handleBlur('mobileNumber')}
                    inputStyle={{fontFamily: 'Poppins', fontSize: 14}}
                    placeholderTextStyle={{color: '#888'}}
                    keyboardType="numeric"
                    error={touched.mobileNumber && errors.mobileNumber} // Pass error condition
                  />
                  {touched.mobileNumber && errors.mobileNumber ? (
                    <Text style={styles.errorText}>{errors.mobileNumber}</Text>
                  ) : null}
                  <CustomButton
                    title="Send OTP"
                    onPress={handleSubmit}
                    loading={isLoading}
                  />
                </View>
              )}
            </Formik>
          </View>
        </LinearGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  lineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: '160%',
    height: hp(12),
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // semi-transparent white
    transform: [{rotate: '-45deg'}],
    marginBottom: hp(25),
  },
  loginContainer: {
    backgroundColor: '#E1EBFF', // Light blue background
    paddingHorizontal: wp('5%'),
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    width: '100%',
    maxWidth: wp('100%'),
    position: 'absolute',
    height: screenHeight * 0.36,
    // height: hp('38%'),
    // maxheight: hp('38%'),
    bottom: 0, // To adjust position from bottom
  },
  loginLine: {
    width: wp('16%'),
    height: hp('0.5%'),
    backgroundColor: '#000',
    alignSelf: 'center',
    marginBottom: hp('1%'),
  },
  loginTitle: {
    fontSize: wp('6%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
    color: '#000',
    fontFamily: 'Poppins SemiBold',
  },
  inputLabel: {
    fontSize: wp('4%'),
    color: '#000',
    marginBottom: hp('0.5%'),
    fontFamily: 'Poppins SemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: wp('5%'),
    borderRadius: wp('5%'),
    marginBottom: hp('10%'),
    backgroundColor: '#fff',
  },
  customInputStyle: {
    fontFamily: 'Poppins',
  },
  customPlaceholderStyle: {
    color: '#888',
    fontFamily: 'Poppins',
  },
  content: {
    flexGrow: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: hp('1.5%'),
    fontFamily: 'Poppins',
  },
});

export default LoginScreen;
