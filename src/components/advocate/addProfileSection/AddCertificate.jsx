import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Formik, FieldArray} from 'formik';
import {showMessage} from 'react-native-flash-message';
import * as Yup from 'yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import CustomHeader from '../../../../shared/CustomHeader';
import CustomButton from '../../../../shared/CustomButton';
import {useAdvocateCertificateMutation} from '../../../redux/api/api';

const certificateValidationSchema = Yup.object().shape({
  firmName: Yup.string().required('Company name is required'),
  certificate_name: Yup.string().required('Certificate name is required'),
  certificate_number: Yup.string().required('Certificate number is required'),
  issueDate: Yup.date().nullable().required('Issue date is required'),
});

export default AddCertificate = ({navigation}) => {
  const [issueDate, setIssueDate] = useState(new Date());
  const [issueDatePicker, setIssueDatePicker] = useState(false);

  const [advocateCertificate] = useAdvocateCertificateMutation();

  return (
    <>
      <CustomHeader
        title={'Add Certificate'}
        icon={require('../../../../assets/images/back.png')}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={{
            firmName: '',
            certificate_number: '',
            certificate_name: '',
            issueDate: null,
          }}
          validationSchema={certificateValidationSchema}
          onSubmit={async (values, {setSubmitting}) => {
            try {
              const certificateToSubmit = {
                firmName: values.firmName,
                certificate_name: values.certificate_name,
                certificate_number: values.certificate_number,
                issueDate: values.issueDate,
              };

              const response = await advocateCertificate(certificateToSubmit);
              console.log('API Response:', response);

              if (response?.data?.success) {
                showMessage({
                  message: 'Success',
                  description: response?.data?.message,
                  type: 'success',
                  titleStyle: {
                    fontFamily: 'Poppins SemiBold',
                  },
                  textStyle: {fontFamily: 'Poppins'},
                });
                navigation.navigate('ViewAdvocateProfile');
              } else {
                const errorMsg =
                  response.error?.data?.message || 'Something went wrong!';
                showMessage({
                  message: 'Error',
                  description: errorMsg,
                  type: 'danger',
                  titleStyle: {
                    fontFamily: 'Poppins SemiBold',
                  },
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
            handleSubmit,
            values,
            setFieldValue,
            errors,
            touched,
            handleBlur,
            isSubmitting,
          }) => (
            <View style={styles.experienceItem}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Company Name<Text style={{ color: 'red' }}> *</Text></Text>

                <TextInput
                  placeholder="Enter Name"
                  style={styles.input}
                  value={values.firmName}
                  onBlur={() => handleBlur('firmName')}
                  onChangeText={value => setFieldValue(`firmName`, value)}
                />
                  {errors.firmName && touched.firmName && (
                  <Text style={styles.errorText}>{errors.firmName}</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Certificate Name<Text style={{ color: 'red' }}> *</Text></Text>

                <TextInput
                  placeholder="Enter Answer"
                  style={styles.input}
                  value={values.certificate_name}
                  onBlur={() => handleBlur('certificate_name')}
                  onChangeText={value =>
                    setFieldValue(`certificate_name`, value)
                  }
                />
                   {errors.certificate_name && touched.certificate_name && (
                  <Text style={styles.errorText}>{errors.certificate_name}</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Certificate Number<Text style={{ color: 'red' }}> *</Text></Text>

                <TextInput
                  placeholder="Enter Answer"
                  style={styles.input}
                  value={values.certificate_number}
                  onBlur={() => handleBlur('certificate_number')}
                  onChangeText={value =>
                    setFieldValue(`certificate_number`, value)
                  }
                />
                   {errors.certificate_number && touched.certificate_number && (
                  <Text style={styles.errorText}>{errors.certificate_number}</Text>
                )}
              </View>
              <View>
                <Text style={styles.inputLabel}>Issue Date<Text style={{ color: 'red' }}> *</Text></Text>
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={() => setIssueDatePicker(true)}>
                  {values.issueDate ? (
                    <Text style={styles.buttonText}>{values.issueDate}</Text>
                  ) : (
                    <Text style={styles.buttonText}>Select Issue Date</Text>
                  )}
                </TouchableOpacity>
                {issueDatePicker && (
                  <DateTimePicker
                    value={issueDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      if (event.type === 'set') {
                        const formattedDate = selectedDate
                          .toISOString()
                          .split('T')[0];
                        setFieldValue('issueDate', formattedDate);
                        setIssueDate(selectedDate);
                      }
                      setIssueDatePicker(false);
                    }}
                  />
                )}
                 {errors.issueDate && touched.issueDate && (
                  <Text style={styles.errorText}>{errors.issueDate}</Text>
                )}
              </View>

              <View style={{marginTop: hp('2%')}}>
                <CustomButton
                  title="Save"
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                
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
  errorText: {
    color: 'red',
    marginTop: hp('1%'),
    fontFamily: 'Poppins',
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
  customButton: {
    backgroundColor: '#007BFF', // Customize the button color
    padding: 10,
    borderRadius: wp('2%'),
    alignItems: 'center',
    width: wp('40%'),
    backgroundColor: '#E1EBFF',
  },
  buttonText: {
    color: '#7F7F80', // Text color
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  styleDropdownMenu: {
    borderWidth: 0, // Remove underline from dropdown menu
    backgroundColor: '#E1EBFF',
    borderRadius: wp('3%'),
  },
  styleInputGroup: {
    borderWidth: 0,
    borderBottomWidth: 0,
    borderRadius: wp('3%'),
    backgroundColor: '#E1EBFF',
  },
  styleDropdownMenuSubsection: {
    borderWidth: 0, // Remove underline from dropdown menu subsection
    borderBottomWidth: 0,
    backgroundColor: '#E1EBFF',
    borderRadius: wp('3%'),
  },
  styleMainWrapper: {
    borderColor: '#fff',
    backgroundColor: '#E1EBFF',
    borderRadius: wp('3%'),
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tab: {
    // backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 5,
    marginTop: 3,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    color: '#000',
    fontSize: 13,
    fontFamily: 'Poppins',
  },
  removeButton: {
    marginLeft: 5,
    padding: 5,
    marginTop: -5,
    borderRadius: 10,
  },
  removeButtonText: {
    fontSize: 16,
    color: '#000',
  },
  customButton: {
    backgroundColor: '#007BFF', // Customize the button color
    padding: 10,
    borderRadius: wp('2%'),
    width: wp('90%'),
    backgroundColor: '#E1EBFF',
  },
});
