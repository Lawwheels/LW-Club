import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useFocusEffect } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomButton from '../../shared/CustomButton';
import LinearGradient from 'react-native-linear-gradient';
import CustomTextInput from '../../shared/CustomTextInput';
import navigationStrings from '../constants/navigationStrings';
import {useRegisterMutation} from '../redux/api/api';

const {height: screenHeight} = Dimensions.get('window');

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'), // Name is required
  email: Yup.string()
    .email('Invalid email format') // Validates email format
    .required('Email is required') // Email is required
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email must be a valid format',
    ), // Custom regex validation
});

const Register = ({navigation, route}) => {
  const {mobileNumber} = route.params || {};

  console.log(mobileNumber);
  const [register, {isLoading}] = useRegisterMutation(); // Use the register mutation hook

  const handleRegister = async values => {
    try {
      const res = await register({
        name: values.name,
        email: values.email,
        mobileNumber: mobileNumber, // Include mobile number in registration data
      }).unwrap(); // unwrap() throws an error if the response is not successful
      console.log(res);
      if (res && res.success) {
        Alert.alert(`${res.message}`);
        navigation.navigate(navigationStrings.OTP_SCREEN, {
          mobileNumber: mobileNumber,
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.data?.message || 'Registration failed.'); // Handle error message
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
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.loginLine} />
          <Formik
            initialValues={{name: '', email: ''}}
            validationSchema={validationSchema}
            onSubmit={handleRegister}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.content}>
                <Text style={styles.loginTitle}>Welcome</Text>
                <Text style={styles.subtitle}>
                  Hi there! Welcome to Lawwheels.{'\n'}
                  We're excited to have you on board!
                </Text>

                <Text style={styles.inputLabel}>Full Name</Text>
                <CustomTextInput
                  placeholder="Enter Your Name Here"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  inputStyle={{fontFamily: 'Poppins', fontSize: 14}}
                  placeholderTextStyle={{color: '#888'}}
                  keyboardType="default"
                  error={touched.name && errors.name}
                />
                {touched.name && errors.name ? (
                  <Text style={styles.errorText}>{errors.name}</Text>
                ) : null}

                <Text style={styles.inputLabel}>Email</Text>
                <CustomTextInput
                  placeholder="Enter Your Email Address Here"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  inputStyle={{fontFamily: 'Poppins', fontSize: 14}}
                  placeholderTextStyle={{color: '#888'}}
                  keyboardType="email-address"
                  error={touched.email && errors.email}
                />
                {touched.email && errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}

                <CustomButton
                  title="Get Started"
                  onPress={handleSubmit}
                  loading={isLoading}
                />
              </View>
            )}
          </Formik>
          </KeyboardAwareScrollView>
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
    backgroundColor: '#E1EBFF', // Light blue background
    paddingHorizontal: wp('5%'),
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius:wp('5%'),
    width: '100%',
    maxWidth: '100%',
    position: 'absolute',
    // height: '60%',
    // maxHeight: '60%',
    height: screenHeight * 0.58,
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
    fontSize: wp('4.5%'),
    textAlign: 'center',
    marginBottom: hp('2.5%'),
    color: '#000',
    fontFamily: 'Poppins SemiBold',
  },
  subtitle: {
    fontSize: wp('4%'),
    maxWidth: '100%',
    color: '#000',
    fontFamily: 'Poppins',
    fontWeight: '600',
    marginBottom: hp('2%'),
    textAlign:'center'
  },
  inputLabel: {
    fontSize: wp('4%'),
    color: '#000',
    marginBottom: 5,
    fontFamily: 'Poppins SemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: wp('2.5%'),
    borderRadius: wp('2.5%'),
    marginBottom: hp('5%'),
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
    width: '100%',
    flexGrow: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: hp('1.5%'),
    fontFamily: 'Poppins',
  },
});

export default Register;
