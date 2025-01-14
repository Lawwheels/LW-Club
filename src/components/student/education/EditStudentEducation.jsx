import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Switch,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import {SelectList} from 'react-native-dropdown-select-list';
import CustomHeader from "../../../../shared/CustomHeader";
import CustomButton from '../../../../shared/CustomButton';
import {useNavigation} from '@react-navigation/native';
import { handleError } from '../../../../shared/authUtils';
import { useEditStudentEducationMutation, useGetStudentEducationByIdQuery } from '../../../redux/api/api';

const validationSchema = Yup.object().shape({
  school_university: Yup.string().required('School / University is required'),
  fieldOfStudy: Yup.string().required('Study field is required'),
  degreeType: Yup.string().required('Degree type is required'),
  startDate: Yup.date().nullable().required('Start date is required'),
  endDate: Yup.date().nullable(),
});
export default EditStudentEducation = ({route}) => {
  const navigation = useNavigation();
  const {id} = route?.params || {};
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const {data, isLoading, error} = useGetStudentEducationByIdQuery(id);
  const [editStudentEducation] = useEditStudentEducationMutation();
  useEffect(() => {
    if (data && data.data) {
      const date = new Date(data.data.startDate);
      const endDate = new Date(data.data.endDate);

      // Update state directly if the date is valid
      if (!isNaN(date.getTime())) {
        setStartDate(date);
      }
      if (!isNaN(endDate.getTime())) {
        setEndDate(endDate);
      }
    }
  }, [data]);

  if (isLoading || !data) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  // console.log(data);
  // Handle error state
  if (error) {
    console.log("editeducation",error);
    handleError(error);
    showMessage({
      message: `An error occurred: ${error?.message}`,
      type: 'danger',
      titleStyle: {fontFamily: 'Poppins'},
      style: {backgroundColor: 'red'},
    });

    return null;
  }

  const handleDateChange = (event, selectedDate) => {
    setDatePickerVisible(false);
    if (event.type === 'set' && selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDate = (event, selectedDate) => {
    setEndDatePickerVisible(false);
    if (event.type === 'set' && selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const initialValues = {
    school_university: data?.data?.school_university || '',
    fieldOfStudy: data?.data?.fieldOfStudy || '',
    grade: data?.data?.grade || '',
    activities: data?.data?.activities || '',
    degreeType: data?.data?.degreeType || '',
    description: data?.data?.description || '',
    isRecent: data?.data?.isRecent || false, // Ensure it's a boolean
    isOngoing: data?.data?.isOngoing || false,
    startDate: data?.data?.startDate || null,
    endDate: data?.data?.endDate || null,
  };

  return (
    <>
      <CustomHeader
        title={'Edit Education'}
        icon={require('../../../../assets/images/back.png')}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={async (values, {setSubmitting}) => {
            setSubmitting(true); // Set submitting to true at the start
            const startDateISO = startDate.toISOString().split('T')[0];
            const endDateISO = values.endDate ? new Date(values.endDate).toISOString().split('T')[0] : null;
        
            // Validate if endDate is after startDate
            if (!values.isOngoing && endDateISO) {
              const startDateObj = new Date(startDateISO);
              const endDateObj = new Date(endDateISO);
              if (endDateObj <= startDateObj) {
                showMessage({
                  message: 'Error',
                  description: 'End date must be after the start date.',
                  type: 'danger',
                  titleStyle: { fontFamily: 'Poppins SemiBold' },
                  textStyle: { fontFamily: 'Poppins' },
                });
                setSubmitting(false);
                return; // Halt submission
              }
            }
            try {
              const experienceToSubmit = {
                school_university: values.school_university,
                startDate: startDateISO,
                // endDate: endDate.toISOString().split('T')[0],
                isRecent: values.isRecent,
                isOngoing: values.isOngoing,
                id,
              };
          
              if (!values.isOngoing && values.endDate) {
                experienceToSubmit.endDate = endDateISO;
              }
          
             
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

              console.log('Submitting experience:', experienceToSubmit);
              const res = await editStudentEducation(experienceToSubmit);
              console.log(res);
              if (res && res?.data && res?.data?.success) {
                showMessage({
                  message: 'Success',
                  description: res?.data?.message,
                  type: 'success',
                  titleStyle: {fontFamily: 'Poppins SemiBold'},
                  textStyle: {fontFamily: 'Poppins'},
                });
                navigation.navigate('ViewStudentProfile');
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
            handleSubmit,
            values,
            setFieldValue,
            errors,
            touched,
            handleBlur,
            isSubmitting,
          }) => {
            console.log(errors);
            return (
              <View style={styles.experienceItem}>
                {/* Job Title */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>School / University</Text>

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
                  <Text style={styles.inputLabel}>Degree</Text>

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
                  <Text style={styles.inputLabel}>Study Field</Text>

                  <TextInput
                    placeholder="Ex:Business"
                    style={styles.input}
                    value={values.fieldOfStudy}
                    onBlur={() => handleBlur('fieldOfStudy')}
                    onChangeText={value => setFieldValue(`fieldOfStudy`, value)}
                  />
                  {touched.fieldOfStudy && errors.fieldOfStudy && (
                    <Text style={styles.errorText}>{errors.fieldOfStudy}</Text>
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
                    onBlur={() => handleBlur('activities')}
                    textAlignVertical="top"
                    onChangeText={value => setFieldValue(`activities`, value)}
                  />
                </View>

                {/* Start Date */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Start Date</Text>
                  <TouchableOpacity
                    style={styles.customButton}
                    onPress={() => setDatePickerVisible(true)}>
                    <Text style={styles.buttonText}>
                      {startDate
                        ? startDate.toDateString()
                        : 'Enter Start Date'}
                    </Text>
                  </TouchableOpacity>
                  {datePickerVisible && (
                    <DateTimePicker
                      value={startDate}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                  {touched.startDate && errors.startDate && (
                    <Text style={styles.errorText}>{errors.startDate}</Text>
                  )}
                </View>

                {/* End Date */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Expected End Date</Text>
                  {/* <TouchableOpacity
                    style={styles.customButton}
                    onPress={() => setEndDatePickerVisible(true)}>
                    <Text style={styles.buttonText}>
                      {endDate ? endDate.toDateString() : 'Enter Start Date'}
                    </Text>
                  </TouchableOpacity>
                  {endDatePickerVisible && (
                    <DateTimePicker
                      value={endDate}
                      mode="date"
                      display="default"
                      onChange={handleEndDate}
                    />
                  )} */}
                   <TouchableOpacity
                          style={styles.customButton}
                          onPress={() => setEndDatePickerVisible(true)}>
                          {values.isOngoing ? (
                            <Text style={styles.buttonText}>Present</Text> // Display "Present" if ongoing is true
                          ) : values.endDate ? (
                            <Text style={styles.buttonText}>
                              {new Date(values.endDate).toDateString()}
                              {/* {new Date(values.endDate).toISOString().split('T')[0]}  */}
                            </Text> // Show selected end date
                          ) : (
                            <Text style={styles.buttonText}>
                              Select End Date
                            </Text> // Show "Select End Date" if no end date is selected
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

                {/* Description */}
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
                    value={values.description}
                    onChangeText={value => setFieldValue('description', value)}
                    textAlignVertical="top"
                  />
                </View>

                {/* Recent */}
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
                {/* Ongoing */}
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

                {/* Submit Button */}
                <CustomButton
                  title="Update"
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
    width: wp('90%'),
    backgroundColor: '#E1EBFF',
  },
  buttonText: {
    color: '#7F7F80', // Text color
    fontSize: 14,
    fontFamily: 'Poppins',
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
