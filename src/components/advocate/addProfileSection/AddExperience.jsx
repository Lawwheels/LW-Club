
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
import {SelectList} from 'react-native-dropdown-select-list';
import CustomHeader from '../../../../shared/CustomHeader';
import CustomButton from '../../../../shared/CustomButton';
import {useAdvocateExperienceMutation} from '../../../redux/api/api';

const experienceValidationSchema = Yup.object().shape({
  jobTitle: Yup.string().required('Job title is required'),
  firmName: Yup.string().required('Company name is required'),
  startDate: Yup.date().nullable().required('Start date is required'),
  endDate: Yup.date().nullable(),
});

export default AddExperience = ({navigation}) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [endDate, setEndDate] = useState(null);
  

  const [advocateExperience] = useAdvocateExperienceMutation();

  const jobTitles = [
    {key: '1', value: 'Advocate'},
    {key: '2', value: 'AOR'},
    {key: '3', value: 'Senior Advocate'},
    {key: '4', value: 'Advocate General'},
    {key: '5', value: 'Additional Advocate General'},
    {key: '6', value: 'Deputy Advocate General'},
    {key: '7', value: 'Public Prosecutor'},
  ];



  return (
    <>
      <CustomHeader
        title={'Add Experience'}
        icon={require('../../../../assets/images/back.png')}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={{
            jobTitle: '',
            firmName: '',
            startDate: null,
            endDate: null,
            description: '',
            isOngoing:false,
            isRecent:false
          }}
          validationSchema={experienceValidationSchema}
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
                    titleStyle: { fontFamily: 'Poppins SemiBold' },
                    textStyle: { fontFamily: 'Poppins' },
                  });
                  setSubmitting(false); // Reset submitting state
                  return; // Exit the function
                }
              }
              const experienceToSubmit = {
                jobTitle: values.jobTitle,
                firmName: values.firmName,
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
              const response = await advocateExperience(experienceToSubmit);
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
            }  catch (error) {
              console.error('Submission error: ', error);
              const errorMsg =
                error?.response?.data?.error?.data?.message || 'Something went wrong!';
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
          }) => (
            <View style={styles.experienceItem}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Job Title<Text style={{ color: 'red' }}> *</Text></Text>
                <SelectList
                  setSelected={val => setFieldValue('jobTitle', val)}
                  data={jobTitles}
                  placeholder="Select a job title"
                  onBlur={() => handleBlur('jobTitle')}
                  fontFamily="Poppins"
                  save="value"
                  inputStyles={{color: '#8E8E8E'}}
                  boxStyles={styles.dropdown}
                  dropdownStyles={styles.dropdownBox}
                  dropdownTextStyles={styles.dropdownText}
                />
                 {errors.jobTitle && touched.jobTitle && (
                    <Text style={styles.errorText}>{errors.jobTitle}</Text>
                  )}
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
                    onValueChange={value => setFieldValue('isOngoing', value)}
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
                    onValueChange={value => setFieldValue('isRecent', value)}
                    value={values.isRecent}
                  />
                </View>
              </View> 
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Company<Text style={{ color: 'red' }}> *</Text></Text>
                <TextInput
                  placeholder="Enter Company"
                  style={styles.input}
                  value={values.firmName}
                  onChangeText={value => setFieldValue('firmName', value)}
                />
                 {errors.firmName && touched.firmName && (
                    <Text style={styles.errorText}>{errors.firmName}</Text>
                  )}
              </View>
              <View style={styles.inputContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={styles.inputLabel}>Start Date<Text style={{ color: 'red' }}> *</Text></Text>
                    <TouchableOpacity
                      style={styles.customButton}
                      onPress={() => setDatePickerVisible(true)}>
                      {values.startDate ? (
                        <Text style={styles.buttonText}>
                          {values.startDate}
                        </Text>
                      ) : (
                        <Text style={styles.buttonText}>Select Start Date</Text>
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
                     {errors.startDate && touched.startDate && (
                    <Text style={styles.errorText}>{errors.startDate}</Text>
                  )}
                  </View>

                  <View>
                    <Text style={styles.inputLabel}> Expected End Date</Text>
                    <TouchableOpacity
                      style={styles.customButton}
                      onPress={() => setEndDatePickerVisible(true)}>
                      {values.isOngoing ? (
                        <Text style={styles.buttonText}>Present</Text> // Display "Present" if ongoing is true
                      ) : values.endDate ? (
                        <Text style={styles.buttonText}>{values.endDate}</Text> // Show selected end date
                      ) : (
                        <Text style={styles.buttonText}>Select End Date</Text> // Show "Select End Date" if no end date is selected
                      )}
                    </TouchableOpacity>

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
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  placeholder="Enter Description"
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: '#E1EBFF',
                    fontFamily: 'Poppins',
                  }}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={values.description}
                  onChangeText={value => setFieldValue('description', value)}
                />
              </View>
            
              
            

              <View style={{marginTop: hp('2%')}}>
                <CustomButton
                  title="Save"
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  style={styles.saveButton}
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
