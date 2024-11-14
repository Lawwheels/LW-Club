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
});

export default AddCertificate = ({navigation}) => {
  const [issueDate, setIssueDate] = useState([]);
  const [issueDatePicker, setIssueDatePicker] = useState([]);

  const [advocateCertificate, {isLoading: certificateLoading}] =
    useAdvocateCertificateMutation();

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
            certificates: [
              {
                firmName: '',
                certificate_number: '',
                certificate_name: '',
                issueDate: null,
              },
            ],
          }}
          // validationSchema={validationExperience}
          onSubmit={(values, {setSubmitting}) => {
            console.log('values', values);
          }}>
          {({
            // handleSubmit,
            values,
            setFieldValue,
            // errors,
            // touched,
            // handleBlur,
            // isSubmitting,
          }) => {
            useEffect(() => {
              const newDatePickerVisible = Array(
                values.certificates.length,
              ).fill(false);
              setIssueDatePicker(newDatePickerVisible);
              setIssueDate(Array(values.certificates.length).fill(new Date()));
            }, [values.certificates.length]);
            return (
              <FieldArray
                name="certificates"
                render={arrayHelpers => (
                  <View>
                    {values.certificates && values.certificates.length > 0 ? (
                      values.certificates.map((certificate, index) => {
                        return (
                          <View key={index} style={styles.experienceItem}>
                            <View style={styles.inputContainer}>
                              <Text style={styles.inputLabel}>
                                Company Name
                              </Text>

                              <TextInput
                                placeholder="Enter Name"
                                style={styles.input}
                                value={certificate.firmName}
                                onChangeText={value =>
                                  setFieldValue(
                                    `certificates[${index}].firmName`,
                                    value,
                                  )
                                }
                              />
                            </View>
                            <View style={styles.inputContainer}>
                              <Text style={styles.inputLabel}>
                                Certificate Name
                              </Text>

                              <TextInput
                                placeholder="Enter Answer"
                                style={styles.input}
                                value={certificate.certificate_name}
                                onChangeText={value =>
                                  setFieldValue(
                                    `certificates[${index}].certificate_name`,
                                    value,
                                  )
                                }
                              />
                            </View>
                            <View style={styles.inputContainer}>
                              <Text style={styles.inputLabel}>
                                Certificate Number
                              </Text>

                              <TextInput
                                placeholder="Enter Answer"
                                style={styles.input}
                                value={certificate.certificate_number}
                                onChangeText={value =>
                                  setFieldValue(
                                    `certificates[${index}].certificate_number`,
                                    value,
                                  )
                                }
                              />
                            </View>

                            <View style={styles.inputContainer}>
                              <Text style={styles.inputLabel}>Issue Date</Text>
                              <TouchableOpacity
                                style={{
                                  backgroundColor: '#007BFF', // Customize the button color
                                  padding: 10,
                                  borderRadius: wp('2%'),
                                  width: wp('85%'),
                                  backgroundColor: '#E1EBFF',
                                }} // Custom button style
                                onPress={() => {
                                  // Only show picker if not collapsed
                                  const newVisibilities = [...issueDatePicker];
                                  newVisibilities[index] = true; // Show date picker for this experience
                                  setIssueDatePicker(newVisibilities);
                                }}>
                                {certificate.issueDate === null ? (
                                  <Text style={styles.buttonText}>
                                    Select Issue Date
                                  </Text>
                                ) : (
                                  <Text
                                    style={{
                                      fontFamily: 'Poppins',
                                      fontSize: 14,
                                    }}>{`${certificate.issueDate}`}</Text>
                                )}
                              </TouchableOpacity>

                              {issueDatePicker[index] && ( // Show only if collapsed is false
                                <DateTimePicker
                                  value={issueDate[index]}
                                  mode="date"
                                  display="default"
                                  onChange={(event, selectedDate) => {
                                    if (event.type === 'set') {
                                      const currentDate =
                                        selectedDate || issueDate[index];
                                      // Format date to YYYY-MM-DD
                                      const formattedDate = currentDate
                                        .toISOString()
                                        .split('T')[0];

                                      // Update the field with the formatted date
                                      setFieldValue(
                                        `certificates[${index}].issueDate`,
                                        formattedDate,
                                      );

                                      const newDates = [...issueDate];
                                      newDates[index] = currentDate;
                                      setIssueDate(newDates);
                                    }
                                    // Hide the date picker after selection
                                    const newVisibilities = [
                                      ...issueDatePicker,
                                    ];
                                    newVisibilities[index] = false;
                                    setIssueDatePicker(newVisibilities);
                                  }}
                                />
                              )}
                            </View>
                            {values.certificates.length > 1 && (
                            <Button
                              title="Remove"
                              type="clear"
                              titleStyle={{fontFamily: 'Poppins'}}
                              buttonStyle={styles.removeButton}
                              onPress={() => arrayHelpers.remove(index)} // Remove the experience
                            />)}

                            <CustomButton
                              title="Save"
                              onPress={async () => {
                                try {
                                  // Validate the current education using the schema
                                  await certificateValidationSchema.validate(
                                    certificate,
                                    {
                                      abortEarly: false,
                                    },
                                  );

                                  const certificateToSubmit = {
                                    firmName: certificate.firmName,
                                    certificate_name:
                                      certificate.certificate_name,
                                    certificate_number:
                                      certificate.certificate_number,
                                    issueDate: certificate.issueDate,
                                  };

                                  console.log(
                                    'Submitting individual certificate',
                                    certificateToSubmit,
                                  );
                                  // Make the API call here
                                  const response = await advocateCertificate(
                                    certificateToSubmit,
                                  );
                                  console.log('API Response:', response);
                                  if (
                                    response?.data &&
                                    response?.data?.success
                                  ) {
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
                                    // Handle non-successful API responses here
                                    const errorMsg =
                                      response.error?.data?.message ||
                                      'Something went wrong!';

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
                                  // Show API response in alert
                                } catch (error) {
                                  if (error instanceof Yup.ValidationError) {
                                    // Alert.alert(
                                    //   'Validation Error',
                                    //   error.errors.join(', '),
                                    // ); // Show validation errors in alert
                                    showMessage({
                                      message: 'Validation Error',
                                      description: error.errors.join(', '), // Joins all errors into a single string
                                      type: 'danger', // You can change the type to 'success', 'warning', etc.
                                      titleStyle: {
                                        fontFamily: 'Poppins SemiBold',
                                      },
                                      textStyle: {fontFamily: 'Poppins'},
                                    });
                                  } else {
                                    console.error(error);
                                    const errorMsg =
                                      error?.response?.data?.error?.data
                                        ?.message || 'Something went wrong!';

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
                                }
                              }}
                              loading={certificateLoading}
                            />
                          </View>
                        );
                      })
                    ) : (
                      <Text>No certificate added</Text>
                    )}
                    <CustomButton
                      title="Add Certificate"
                      onPress={() =>
                        arrayHelpers.push({
                          firmName: '',
                          certificate_name: '',
                          certificate_number: '',
                          issueDate: null,
                        })
                      }
                    />
                  </View>
                )}
              />
            );
          }}
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
    marginBottom: hp('1.5%'),
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
});
