import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Formik} from 'formik';
import {showMessage} from 'react-native-flash-message';
import * as Yup from 'yup';
import {SelectList} from 'react-native-dropdown-select-list';
import CustomHeader from '../../../shared/CustomHeader';
import CustomButton from '../../../shared/CustomButton';
import CustomText from '../../../shared/CustomText';
import {
  useGetAdviseSeekerQuery,
  useUpdateUserBioMutation,
} from '../../redux/api/api';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
import { handleError } from '../../../shared/authUtils';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters long'),
  location: Yup.object().shape({
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
  }),
  headLine: Yup.string().optional(),
});

const EditUserProfile = () => {
  const navigation = useNavigation();

  const {data, isLoading, error} = useGetAdviseSeekerQuery();
  const [updateUserBio, {isLoading: loading}] = useUpdateUserBioMutation();

  const countries = [{key: 'IN', value: 'India'}];

  const states = [
    {key: 'MH', value: 'Maharashtra'},
    {key: 'DL', value: 'Delhi'},
    {key: 'UP', value: 'Uttar Pradesh'},
    {key: 'KA', value: 'Karnataka'},
  ];

  const cities = [
    {key: 'MUM', value: 'Mumbai'},
    {key: 'DEL', value: 'New Delhi'},
    {key: 'BLR', value: 'Bangalore'},
    {key: 'LKO', value: 'Lucknow'},
    {key: 'PUN', value: 'Pune'},
  ];

  const userDetails = data?.data;

  //   console.log('userDetails', userDetails);
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle error state
  if (error) {
    handleError(error);
    console.log(error);
    return <Text>An error occurred: {error?.message}</Text>;
  }
  const initialValues = {
    name: userDetails?.name || '',
    email: userDetails?.email || '',
    mobileNumber: userDetails?.mobileNumber || '',
    location: {
      country: userDetails?.location?.country || '',
      state: userDetails?.location?.state || '',
      city: userDetails?.location?.city || '',
    },
    headLine: userDetails?.headLine || '',
    profession_nun_user: userDetails?.profession_nun_user || '',
  };
  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Edit Profile'}
        icon={require('../../../assets/images/backImage.png')}
      />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={{paddingHorizontal: wp('5%')}}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, {setSubmitting}) => {
              setSubmitting(true);
              try {
                const updateData = {
                  name: values.name,
                  location: values.location,
                  ...(values.profession_nun_user && {
                    profession_nun_user: values.profession_nun_user,
                  }),
                  ...(values.headLine && {headLine: values.headLine}),
                };
                const res = await updateUserBio(updateData).unwrap();
                console.log(res);
                if (res && res?.success) {
                  showMessage({
                    message: 'Success',
                    description: res?.message,
                    type: 'success',
                    titleStyle: {fontFamily: 'Poppins SemiBold'},
                    textStyle: {fontFamily: 'Poppins'},
                  });
                  navigation.navigate("UserNavigator")
                } else {
                  const errorMsg =
                    res.error?.data?.message || 'Something went wrong!';
                  showMessage({
                    message: 'Error',
                    description: errorMsg,
                    type: 'danger',
                    titleStyle: {fontFamily: 'Poppins SemiBold'},
                    textStyle: {fontFamily: 'Poppins'},
                  });
                }
              } catch (error) {
                console.error('Submission error: ', error);
                const errorMsg =
                  error?.response?.data?.error?.data?.message ||
                  'Something went wrong!';
                showMessage({
                  message: 'Error',
                  description: errorMsg,
                  type: 'danger',
                  titleStyle: {fontFamily: 'Poppins SemiBold'},
                  textStyle: {fontFamily: 'Poppins'},
                });
              } finally {
                setSubmitting(false); // Ensure this is always called
              }
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              setFieldValue,
              touched,
            }) => (
              <View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Name</Text>
                  <CustomText
                    placeholder="Enter Your Name Here"
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    inputStyle={{fontFamily: 'Poppins', fontSize: 14}}
                    placeholderTextStyle={{color: '#7F7F80'}}
                    keyboardType="default"
                    error={touched.name && errors.name}
                  />
                  {errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>
                <Text style={styles.inputLabel}>Email</Text>
                <CustomText
                  placeholder="Enter Email"
                  value={values.email}
                  // onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  inputStyle={{fontFamily: 'Poppins', fontSize: 14}}
                  placeholderTextStyle={{color: '#7F7F80'}}
                  keyboardType="email-address"
                />
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <CustomText
                  placeholder="Enter Mobile Number"
                  value={values.mobileNumber}
                  // onChangeText={handleChange('email')}
                  onBlur={handleBlur('mobileNumber')}
                  inputStyle={{fontFamily: 'Poppins', fontSize: 14}}
                  placeholderTextStyle={{color: '#7F7F80'}}
                  keyboardType="number"
                />

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Country</Text>
                  <SelectList
                    setSelected={val => setFieldValue('location.country', val)}
                    data={countries}
                    defaultOption={{
                      key: initialValues.location.country,
                      value: initialValues.location.country,
                    }}
                    placeholder="Select a country"
                    onBlur={handleBlur('location.country')}
                    fontFamily="Poppins"
                    save="value"
                    inputStyles={{color: '#8E8E8E'}}
                    boxStyles={styles.dropdown}
                    dropdownStyles={styles.dropdownBox}
                    dropdownTextStyles={styles.dropdownText}
                  />
                  {touched.location?.country && errors.location?.country && (
                    <Text style={styles.errorText}>
                      {errors.location.country}
                    </Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>State</Text>
                  <SelectList
                    setSelected={val => setFieldValue('location.state', val)}
                    data={states}
                    defaultOption={{
                      key: initialValues.location.state,
                      value: initialValues.location.state,
                    }}
                    placeholder="Select a state"
                    onBlur={handleBlur('location.state')}
                    fontFamily="Poppins"
                    save="value"
                    inputStyles={{color: '#8E8E8E'}}
                    boxStyles={styles.dropdown}
                    dropdownStyles={styles.dropdownBox}
                    dropdownTextStyles={styles.dropdownText}
                  />
                  {touched?.location && errors?.location?.state && (
                    <Text style={styles.errorText}>
                      {errors.location.state}
                    </Text>
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>City</Text>
                  <SelectList
                    setSelected={val => setFieldValue('location.city', val)}
                    data={cities}
                    defaultOption={{
                      key: initialValues.location.city,
                      value: initialValues.location.city,
                    }}
                    placeholder="Select a city"
                    onBlur={handleBlur('location.city')}
                    fontFamily="Poppins"
                    save="value"
                    inputStyles={{color: '#8E8E8E'}}
                    boxStyles={styles.dropdown}
                    dropdownStyles={styles.dropdownBox}
                    dropdownTextStyles={styles.dropdownText}
                  />
                  {touched?.location && errors?.location?.city && (
                    <Text style={styles.errorText}>{errors.location.city}</Text>
                  )}
                </View>

                <Text style={styles.inputLabel}>Profession</Text>
                <CustomText
                  placeholder="Enter Answer"
                  value={values.profession_nun_user}
                  onChangeText={handleChange('profession_nun_user')}
                  onBlur={handleBlur('profession_nun_user')}
                  inputStyle={{fontFamily: 'Poppins', fontSize: 14}}
                  placeholderTextStyle={{color: '#7F7F80'}}
                  keyboardType="default"
                />

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Bio</Text>

                  <TextInput
                    placeholder="Enter Answer"
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      backgroundColor: '#E1EBFF',
                      fontFamily: 'Poppins',
                    }}
                    placeholderTextStyle={{color: '#7F7F80'}}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={values.headLine}
                    onChangeText={handleChange('headLine')}
                    onBlur={handleBlur('headLine')}
                  />
                </View>

                <View style={{marginVertical: hp('3%')}}>
                  <CustomButton
                    title="Save"
                    onPress={handleSubmit}
                    loading={loading}
                  />
                </View>
              </View>
            )}
          </Formik>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EditUserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingTop:hp('2.5%')
  },
  inputLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
    fontFamily: 'Poppins SemiBold',
  },
  dropdown: {
    // marginVertical: hp('1%'),
    borderColor: '#fff',
    backgroundColor: '#E1EBFF',
    borderRadius: wp('3%'),
  },
  dropdownBox: {
    marginVertical: 2,
    borderColor: '#fff',
    backgroundColor: '#E1EBFF',
    borderRadius: wp('3%'),
  },
  dropdownText: {
    color: '#8E8E8E',
    fontSize: wp('3.73%'),
    fontWeight: '400',
    marginVertical: 2,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: hp('1.5%'),
  },
  errorText: {
    color: 'red',
    marginBottom: hp('1.5%'),
    fontFamily: 'Poppins',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
