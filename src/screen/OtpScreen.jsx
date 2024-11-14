import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ToastAndroid,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNOtpVerify from 'react-native-otp-verify';
import {useFocusEffect} from '@react-navigation/native';
import CustomButton from '../../shared/CustomButton';
import LinearGradient from 'react-native-linear-gradient';
import navigationStrings from '../constants/navigationStrings';
import {useVerifyOtpMutation, useLoginMutation} from '../redux/api/api';
import {setUser} from '../redux/reducers/auth/authSlice';

const {height: screenHeight} = Dimensions.get('window');

// Validation Schema with Yup
const validationSchema = Yup.object({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^\d{4}$/, 'OTP must be exactly 4 digits'), // 4 digits validation
});

const OtpScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {mobileNumber} = route.params || {};
  const [remainingTime, setRemainingTime] = useState(30);
  const [showTimer, setShowTimer] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Mutation hook
  const [verifyOtp, {isLoading, error}] = useVerifyOtpMutation();
  const [login, {isLoading: loginLoading}] = useLoginMutation();

  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();

  const inputRefs = [firstInput, secondInput, thirdInput, fourthInput];

  const formik = useFormik({
    initialValues: {
      otp: '', // Store OTP as a string in one field
    },
    validationSchema,
    onSubmit: async values => {
      try {
        const res = await verifyOtp({mobileNumber, otp: values.otp});
        console.log(res);
        const authToken = res?.data?.AccessToken;
        let role = res?.data?.user?.role;
        console.log(role);
        // console.log(authToken)
        if (res && res?.data?.success) {
          await AsyncStorage.setItem('authToken', authToken);
          dispatch(
            setUser({
              user: {token: authToken}, // Assuming user data contains token
            }),
          );
          ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
          if (role) {
            await AsyncStorage.setItem('role', role);
          } else {
            // If role is undefined in the API, try to get it from AsyncStorage
            role = await AsyncStorage.getItem('role');
          }

          // console.log('Fetched Role:', role);

          if (role) {
            navigation.navigate('appStack', {role: role});
          } else {
            // If the role is null, navigate to RoleSelect
            navigation.navigate('RoleSelect');
          }
        } else {
          // Handle non-successful API responses here
          const errorMsg = res.error?.data?.message || 'Something went wrong!';
          ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
        }
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.data?.message || // Check if error.data.message exists
          error?.message || // Check if error.message exists
          'OTP verification failed. Please try again.';
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      }
    },
  });

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       BackHandler.exitApp();
  //       return true;
  //     };

  //     BackHandler.addEventListener('hardwareBackPress', onBackPress);

  //     return () =>
  //       BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //   }, []),
  // );
  // OTP Auto-read functionality using react-native-otp-verify (RNOtpVerify)
  useEffect(() => {
    RNOtpVerify.getHash()
      .then(hash => {
        console.log('Hash: ', hash);
      })
      .catch(error => console.error('Error getting hash: ', error));

    RNOtpVerify.getOtp()
      .then(() => RNOtpVerify.addListener(otpHandler))
      .catch(error => console.error('Error starting OTP listener: ', error));

    return () => {
      RNOtpVerify.removeListener();
      console.log('OTP Listener removed');
    };
  }, []);
  useEffect(() => {
    if (showTimer) {
      const timer = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setShowTimer(false);
            return 30;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showTimer]);


  const otpHandler = message => {
    console.log(message);
    const extractedOtp = message.match(/\b\d{4}\b/)?.[0];
    console.log('extractedOtp', extractedOtp);
    if (extractedOtp) {
      formik.setFieldValue('otp', extractedOtp); // Auto-fill the OTP field
      formik.handleSubmit(); // Submit if OTP is auto-read
    }
  };

  const handleResendOtp = async () => {
    if (resendAttempts >= 3) {
      ToastAndroid.show(
        'OTP attempts exhausted. Please try again after some time.',
        ToastAndroid.SHORT,
      );
      return;
    }

    // setError(false);
    setResendLoading(true);
    try {
      const res = await login({mobileNumber});
      if (res?.data?.success) {
        setResendAttempts(resendAttempts + 1);
        ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
        setRemainingTime(30);
        setShowTimer(true);
        console.log(
          'OTP Resent Successfully. Resend Attempts: ',
          resendAttempts + 1,
        );
      } else {
        const errorMsg = res.error?.data?.message || 'Failed to resend OTP';
        ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.data?.message || error?.message || 'Failed to resend OTP';
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    } finally {
      setResendLoading(false);
    }
  };

  return (
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
          <View style={styles.loginLine} />
          <View style={styles.content}>
            <Text style={styles.title}>Enter Your OTP</Text>
            <Text style={styles.subtitle}>
              Enter the code from the SMS we sent you on your mobile number
            </Text>
            <Text style={styles.phoneNumber}>+91{mobileNumber}</Text>

            {/* OTP Input Boxes */}
            <View style={styles.otpInputContainer}>
              {[1, 2, 3, 4].map(index => (
                <TextInput
                  key={index}
                  style={[
                    styles.otpInput,
                    {
                      borderColor:
                        formik.errors.otp && formik.touched.otp
                          ? 'red'
                          : formik.values.otp[index - 1]
                          ? 'blue'
                          : 'gray',
                    },
                  ]}
                  value={formik.values.otp[index - 1] || ''}
                  keyboardType="number-pad"
                  maxLength={1}
                  ref={inputRefs[index - 1]}
                  onChangeText={text => {
                    const newOtp = formik.values.otp.split('');
                    newOtp[index - 1] = text;
                    formik.setFieldValue('otp', newOtp.join(''));

                    if (text && index < 4) {
                      inputRefs[index].current.focus();
                    }
                  }}
                  onKeyPress={({nativeEvent}) => {
                    if (
                      nativeEvent.key === 'Backspace' &&
                      formik.values.otp[index - 1] === ''
                    ) {
                      if (index > 1) {
                        inputRefs[index - 2].current.focus();
                      }
                    }
                  }}
                />
              ))}
            </View>

            {/* Button with Gradient */}
            <View style={{width: '100%'}}>
              <CustomButton
                title="Verify"
                onPress={formik.handleSubmit} // Formik's submit function
                loading={isLoading}
              />

              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>

            {/* Resend Section */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn’t receive the code?</Text>
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={showTimer || resendAttempts >= 3}>
                {resendLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="blue"
                    style={styles.indicator}
                  />
                ) : (
                  <Text
                    style={[
                      styles.resendLink,
                      {
                        color:
                          showTimer || resendAttempts >= 3 ? 'gray' : '#000',
                      },
                    ]}>
                    {showTimer
                      ? `Resend Code in ${remainingTime} sec`
                      : 'Resend Code'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transform: [{rotate: '-45deg'}],
    marginBottom: hp(25),
  },
  loginContainer: {
    backgroundColor: '#E1EBFF',
    paddingHorizontal: wp('5%'),
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    width: '100%',
    maxWidth: wp('100%'),
    position: 'absolute',
    height: screenHeight * 0.53,
    bottom: 0,
    alignItems: 'center',
  },
  loginLine: {
    width: wp('16%'),
    height: hp('0.5%'),
    backgroundColor: '#000',
    alignSelf: 'center',
    marginBottom: hp('1%'),
  },
  title: {
    fontSize: wp('5%'),
    textAlign: 'center',
    marginVertical: hp('1%'),
    color: '#000',
    fontFamily: 'Poppins SemiBold',
  },
  subtitle: {
    fontSize: wp('3.5%'),
    maxWidth: '70%',
    color: '#7E7E7E',
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  phoneNumber: {
    fontSize: wp('4%'),
    marginBottom: hp('3%'),
    color: '#000',
    fontFamily: 'Poppins SemiBold',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('3%'),
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#000',
    width: wp('17%'),
    height: hp('8%'),
    marginHorizontal: wp('3%'),
    borderRadius: wp('2%'),
    textAlign: 'center',
    fontSize: hp('4%'),
    backgroundColor: '#E1EBFF',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    marginBottom: hp('3%'),
    color: '#7E7E7E',
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins',
  },
  resendLink: {
    marginBottom: hp('3%'),
    // color: '#000',
    fontFamily: 'Poppins SemiBold',
    marginLeft: 5,
  },
  content: {
    width: '100%',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: hp('1.5%'),
    fontFamily: 'Poppins',
  },
  indicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
});

export default OtpScreen;
