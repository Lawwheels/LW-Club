import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import {Formik} from 'formik';
import {showMessage} from 'react-native-flash-message';
import * as Yup from 'yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomHeader from '../../../../shared/CustomHeader';
import CustomButton from '../../../../shared/CustomButton';
import { useStudentEducationMutation } from '../../../redux/api/api';


const educationValidationSchema = Yup.object().shape({
  school_university: Yup.string().required('School / University is required'),
  fieldOfStudy: Yup.string().required('Study field is required'),
  degreeType: Yup.string().required('Degree type is required'),
  // activities: Yup.string().required('Activities is required'),
  startDate: Yup.date().nullable().required('Start date is required'),
  endDate: Yup.date().nullable(),
});

export default StudentEducation = ({navigation}) => {
  //education state
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [endDate, setEndDate] = useState(null);

  const [studentEducation] = useStudentEducationMutation();

  return (
    <>
      <CustomHeader
        title={'Add Education'}
        icon={require('../../../../assets/images/back.png')}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={{
            school_university: '',
            fieldOfStudy: '',
            grade: '',
            activities: '',
            description: '',
            degreeType: '',
            startDate: null,
            endDate: null,
            isRecent: false,
            isOngoing: false,
          }}
          validationSchema={educationValidationSchema}
          onSubmit={async (values, {setSubmitting}) => {
            try {
              setSubmitting(true); // Set submitting to true at the start

              // Check if startDate is before endDate
              if (!values.isOngoing && values.endDate) {
                const startDate = new Date(values.startDate);
                const endDate = new Date(values.endDate);

                if (startDate > endDate) {
                  showMessage({
                    message: 'Validation Error',
                    description: 'End date must be after the start date.',
                    type: 'danger',
                    titleStyle: {fontFamily: 'Poppins SemiBold'},
                    textStyle: {fontFamily: 'Poppins'},
                  });
                  setSubmitting(false); // Reset submitting state
                  return; // Exit the function
                }
              }
              const experienceToSubmit = {
                school_university: values.school_university,
                startDate: values.startDate,
                isRecent: values.isRecent,
                isOngoing: values.isOngoing,
              };

              if (!values.isOngoing && values.endDate) {
                const isValidDate = !isNaN(new Date(values.endDate).getTime()); // Check for valid date
                if (isValidDate) {
                  experienceToSubmit.endDate = values.endDate;
                }
              }
              // Conditionally add description if it's not an empty string
              if (values.description.trim() !== '') {
                experienceToSubmit.description = values.description;
              }
              if (values.grade.trim() !== '') {
                experienceToSubmit.grade = values.grade;
              }
              if (values.fieldOfStudy.trim() !== '') {
                experienceToSubmit.fieldOfStudy = values.fieldOfStudy;
              }
              if (values.activities.trim() !== '') {
                experienceToSubmit.activities = values.activities;
              }
              if (values.degreeType.trim() !== '') {
                experienceToSubmit.degreeType = values.degreeType;
              }
              const response = await studentEducation(experienceToSubmit);
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
                navigation.navigate('ViewStudentProfile');
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
              setSubmitting(false);
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
          }) => {
            return (
              <View>
                <View style={styles.experienceItem}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>
                      School / University<Text style={{color: 'red'}}> *</Text>
                    </Text>

                    <TextInput
                      placeholder="Ex: Boston University"
                      style={styles.input}
                      value={values.school_university}
                      onBlur={() => handleBlur('school_university')}
                      onChangeText={value =>
                        setFieldValue(`school_university`, value)
                      }
                    />
                    {touched.school_university && errors.school_university && (
                      <Text style={styles.errorText}>
                        {errors.school_university}
                      </Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>
                      Degree<Text style={{color: 'red'}}> *</Text>
                    </Text>

                    <TextInput
                      placeholder="Ex: Bachelor's"
                      style={styles.input}
                      value={values.degreeType}
                      onBlur={() => handleBlur('degreeType')}
                      onChangeText={value => setFieldValue(`degreeType`, value)}
                    />
                    {touched.degreeType && errors.degreeType && (
                      <Text style={styles.errorText}>{errors.degreeType}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>
                      Study Field<Text style={{color: 'red'}}> *</Text>
                    </Text>

                    <TextInput
                      placeholder="Ex:Business"
                      style={styles.input}
                      value={values.fieldOfStudy}
                      onBlur={() => handleBlur('fieldOfStudy')}
                      onChangeText={value =>
                        setFieldValue(`fieldOfStudy`, value)
                      }
                    />
                    {touched.fieldOfStudy && errors.fieldOfStudy && (
                      <Text style={styles.errorText}>
                        {errors.fieldOfStudy}
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Grade</Text>

                    <TextInput
                      placeholder="Ex: Grade A, Excellent performance"
                      style={styles.input}
                      value={values.grade}
                      onBlur={() => handleBlur('grade')}
                      onChangeText={value => setFieldValue(`grade`, value)}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Description</Text>

                    <TextInput
                      placeholder="Enter Answer"
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        backgroundColor: '#E1EBFF',
                        fontFamily: 'Poppins',
                      }}
                      multiline={true}
                      numberOfLines={4}
                      onBlur={() => handleBlur('description')}
                      value={values.description}
                      textAlignVertical="top"
                      onChangeText={value =>
                        setFieldValue(`description`, value)
                      }
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        <Text style={styles.inputLabel}>
                          Start Date<Text style={{color: 'red'}}> *</Text>
                        </Text>
                        <TouchableOpacity
                          style={styles.customButton}
                          onPress={() => setDatePickerVisible(true)}>
                          {values.startDate ? (
                            <Text style={styles.buttonText}>
                              {values.startDate}
                            </Text>
                          ) : (
                            <Text style={styles.buttonText}>
                              Select Start Date
                            </Text>
                          )}
                        </TouchableOpacity>
                        {datePickerVisible && (
                          <DateTimePicker
                            value={date || new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                              if (event.type === 'set') {
                                const formattedDate = selectedDate
                                  .toISOString()
                                  .split('T')[0];
                                setFieldValue('startDate', formattedDate);
                                setDate(selectedDate);
                              }
                              setDatePickerVisible(false);
                            }}
                          />
                        )}
                        {touched.startDate && errors.startDate && (
                          <Text style={styles.errorText}>
                            {errors.startDate}
                          </Text>
                        )}
                      </View>

                      <View>
                        <Text style={styles.inputLabel}>
                          {' '}
                          Expected End Date
                        </Text>
                        <TouchableOpacity
                          style={styles.customButton}
                          onPress={() => setEndDatePickerVisible(true)}>
                          {values.isOngoing ? (
                            <Text style={styles.buttonText}>Present</Text> // Display "Present" if ongoing is true
                          ) : values.endDate ? (
                            <Text style={styles.buttonText}>
                              {values.endDate}
                            </Text> // Show selected end date
                          ) : (
                            <Text style={styles.buttonText}>
                              Select End Date
                            </Text> // Show "Select End Date" if no end date is selected
                          )}
                        </TouchableOpacity>

                        {/* {endDatePickerVisible &&
                          !values.isOngoing && ( // Show date picker only if ongoing is false
                            <DateTimePicker
                              value={endDate || new Date()}
                              mode="date"
                              display="default"
                              onChange={(event, selectedDate) => {
                                if (event.type === 'set') {
                                  const formattedDate = selectedDate
                                    .toISOString()
                                    .split('T')[0];
                                  setFieldValue('endDate', formattedDate); // Set end date
                                  setEndDate(selectedDate); // Update state
                                }
                                setEndDatePickerVisible(false); // Hide picker after date is selected
                              }}
                            />
                          )} */}

                        {endDatePickerVisible &&
                          !values.isOngoing && ( // Show date picker only if ongoing is false
                            <DateTimePicker
                              value={endDate || new Date()}
                              mode="date"
                              display="default"
                              onChange={(event, selectedDate) => {
                                if (event.type === 'set') {
                                  const formattedDate = selectedDate
                                    .toISOString()
                                    .split('T')[0];
                                  setFieldValue('endDate', formattedDate); // Set end date
                                  setEndDate(selectedDate); // Update state
                                }
                                setEndDatePickerVisible(false); // Hide picker after date is selected
                              }}
                            />
                          )}
                      </View>
                    </View>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Activities</Text>

                    <TextInput
                      placeholder="Enter Answer"
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        backgroundColor: '#E1EBFF',
                        fontFamily: 'Poppins',
                      }}
                      multiline={true}
                      numberOfLines={4}
                      value={values.activities}
                      textAlignVertical="top"
                      onBlur={() => handleBlur('activities')}
                      onChangeText={value => setFieldValue(`activities`, value)}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Ongoing</Text>
                    <View style={styles.switchContainer}>
                      <Text style={styles.switchText}>
                        {values.isOngoing ? 'Yes' : 'No'}
                      </Text>
                      <Switch
                        trackColor={{false: '#767577', true: '#1262D2'}}
                        thumbColor={values.isOngoing ? '#fff' : '#f4f3f4'}
                        onValueChange={value =>
                          setFieldValue('isOngoing', value)
                        }
                        value={values.isOngoing}
                      />
                    </View>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Recent</Text>
                    <View style={styles.switchContainer}>
                      <Text style={styles.switchText}>
                        {values.isRecent ? 'Yes' : 'No'}
                      </Text>
                      <Switch
                        trackColor={{false: '#767577', true: '#1262D2'}}
                        thumbColor={values.isRecent ? '#fff' : '#f4f3f4'}
                        onValueChange={value =>
                          setFieldValue('isRecent', value)
                        }
                        value={values.isRecent}
                      />
                    </View>
                  </View>
                </View>

                <CustomButton
                  title="Save"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                />
              </View>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E1EBFF',
  },
  switchText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#333',
  },
});
