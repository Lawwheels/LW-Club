import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { widthPercentageToDP as wp,heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { showMessage } from 'react-native-flash-message';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomHeader from '../../../../../shared/CustomHeader';
import CustomButton from '../../../../../shared/CustomButton';
import { useNavigation } from '@react-navigation/native';
import {
  useEditCertificateMutation,
  useGetCertificateByIdQuery,
} from '../../../../redux/api/api';

const validationSchema = Yup.object().shape({
  firmName: Yup.string().required('Company name is required'),
});

const EditCertificate = ({ route }) => {
  const navigation = useNavigation();
  const { id } = route?.params || {};

  const [issueDate, setIssueDate] = useState(new Date());
  const [showIssueDatePicker, setShowIssueDatePicker] = useState(false);

  const { data, isLoading, error } = useGetCertificateByIdQuery(id);
  const [editCertificate] = useEditCertificateMutation();

  useEffect(() => {
    if (data && data.data) {
      const date = new Date(data.data.issueDate);
      if (!isNaN(date.getTime())) {
        setIssueDate(date);
      }
    }
  }, [data]);

  const handleDateChange = (event, selectedDate) => {
    setShowIssueDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      setIssueDate(selectedDate);
    }
  };

  const handleSubmission = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const experienceToSubmit = {
        firmName: values.firmName,
        certificate_name: values.certificate_name,
        certificate_number: values.certificate_number,
        issueDate: issueDate.toISOString().split('T')[0],
        id,
      };

      const res = await editCertificate(experienceToSubmit);

      if (res && res.data && res.data.success) {
        showMessage({
          message: 'Success',
          description: res.data.message,
          type: 'success',
          titleStyle: { fontFamily: 'Poppins SemiBold' },
          textStyle: { fontFamily: 'Poppins' },
        });
        navigation.navigate('ViewAdvocateProfile');
      } else {
        const errorMsg = res.error?.data?.message || 'Something went wrong!';
        showMessage({
          message: 'Error',
          description: errorMsg,
          type: 'danger',
          titleStyle: { fontFamily: 'Poppins SemiBold' },
          textStyle: { fontFamily: 'Poppins' },
        });
      }
    } catch (error) {
      console.error('Submission error: ', error);
      const errorMsg = error?.response?.data?.error?.data?.message || 'Something went wrong!';
      showMessage({
        message: 'Error',
        description: errorMsg,
        type: 'danger',
        titleStyle: { fontFamily: 'Poppins SemiBold' },
        textStyle: { fontFamily: 'Poppins' },
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    console.log(error);
    showMessage({
      message: `An error occurred: ${error.message}`,
      type: 'danger',
      titleStyle: { fontFamily: 'Poppins' },
      style: { backgroundColor: 'red' },
    });
    return null;
  }

  return (
    <>
      <CustomHeader
        title={'Edit Certificate'}
        icon={require('../../../../../assets/images/back.png')}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={{
            firmName: data.data.firmName || '',
            certificate_number: data.data.certificate_number || '',
            certificate_name: data.data.certificate_name || '',
          }}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmission}>
          {({ handleSubmit, values, setFieldValue, isSubmitting }) => (
            <View style={styles.experienceItem}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Company Name</Text>
                <TextInput
                  placeholder="Enter Name"
                  style={styles.input}
                  value={values.firmName}
                  onChangeText={value => setFieldValue('firmName', value)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Certificate Name</Text>
                <TextInput
                  placeholder="Enter Name"
                  style={styles.input}
                  value={values.certificate_name}
                  onChangeText={value => setFieldValue('certificate_name', value)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Certificate Number</Text>
                <TextInput
                  placeholder="Enter Number"
                  style={styles.input}
                  value={values.certificate_number}
                  onChangeText={value => setFieldValue('certificate_number', value)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Issue Date</Text>
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={() => setShowIssueDatePicker(true)}>
                  <Text style={styles.buttonText}>
                    {issueDate.toISOString().split('T')[0] || 'Select Issue Date'}
                  </Text>
                </TouchableOpacity>
                {showIssueDatePicker && (
                  <DateTimePicker
                    value={issueDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>
              <View style={{marginVertical:hp('3%')}}> 
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
  inputLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
    fontFamily: 'Poppins SemiBold',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: wp('3%'),
  },
  input: {
    height: 48,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#E1EBFF',
    fontFamily: 'Poppins',
  },
  customButton: {
    backgroundColor: '#E1EBFF',
    padding: 10,
    borderRadius: wp('2%'),
    width: wp('90%'),
  },
  buttonText: {
    color: '#7F7F80',
    fontSize: 14,
    fontFamily: 'Poppins',
  },
});

export default EditCertificate;
