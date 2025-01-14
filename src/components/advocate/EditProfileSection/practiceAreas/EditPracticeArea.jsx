import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomButton from '../../../../../shared/CustomButton';
import CustomHeader from '../../../../../shared/CustomHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  useEditPracticeAreaMutation,
  useGetPracticeAreaByIdQuery,
} from '../../../../redux/api/api';
import {useNavigation} from '@react-navigation/native';
import { handleError } from '../../../../../shared/authUtils';

const EditPracticeArea = ({route}) => {
  const {id} = route?.params || {};
  const navigation = useNavigation();
  const validationSchema = Yup.object().shape({
    practiceArea: Yup.string().required('Practice Area is required'),
  });

  const {data, isLoading, error} = useGetPracticeAreaByIdQuery(id);
  const [editPracticeArea] = useEditPracticeAreaMutation();

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle error state
  if (error) {
    handleError(error);
    console.log(error);
    // Show the flash message
    showMessage({
      message: `An error occurred: ${error?.message}`,
      type: 'danger',
      titleStyle: {fontFamily: 'Poppins'},
      style: {backgroundColor: 'red'},
    });

    return null;
  }

  return (
    <>
      <CustomHeader
        title={'Edit Practice Area'}
        icon={require('../../../../../assets/images/back.png')}
      />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={{practiceArea: data?.data?.practiceArea}}
          validationSchema={validationSchema}
          onSubmit={async (values, {setSubmitting}) => {
            setSubmitting(true); // Set submitting to true at the start
            try {
              const data = {
                practiceArea: values.practiceArea,
                id,
              };

              const res = await editPracticeArea(data);
              console.log('practice area edit', res);
              if (res && res?.data && res?.data?.success) {
                showMessage({
                  message: 'Success',
                  description: res?.data?.message,
                  type: 'success',
                  titleStyle: {fontFamily: 'Poppins SemiBold'},
                  textStyle: {fontFamily: 'Poppins'},
                });
                navigation.navigate('ViewAdvocateProfile');
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
            isSubmitting,
          }) => (
            <View style={styles.container}>
              <Text style={styles.label}>Practice Area</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('practiceArea')}
                onBlur={handleBlur('practiceArea')}
                value={values.practiceArea}
                placeholder="Enter practice area"
              />
              {errors.practiceArea && (
                <Text style={styles.errorText}>{errors.practiceArea}</Text>
              )}
              <View style={{marginVertical: hp('3%')}}>
                <CustomButton
                  title="Update"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                />
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingHorizontal: wp('5%'),
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
    fontFamily: 'Poppins SemiBold',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: hp('1.5%'),
  },
  input: {
    height: 48,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#E1EBFF',
    fontFamily: 'Poppins',
  },
  errorText: {
    color: 'red',
    marginBottom: hp('1.5%'),
    fontFamily: 'Poppins',
  },
});

export default EditPracticeArea;
