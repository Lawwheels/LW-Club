import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
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
import CustomHeader from '../../../../../shared/CustomHeader';
import CustomButton from '../../../../../shared/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {
  useEditEducationMutation,
  useGetEducationByIdQuery,
} from '../../../../redux/api/api';

const validationSchema = Yup.object().shape({
  school_university: Yup.string().required('School / University is required'),
});

export default EditEducation = ({route}) => {
  const navigation = useNavigation();
  const {id} = route?.params || {};
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const {data, isLoading, error} = useGetEducationByIdQuery(id);
  const [editEducation] = useEditEducationMutation();
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
  console.log(data);
  // Handle error state
  if (error) {
    console.log(error);
    // Show the flash message
    showMessage({
      message: `An error occurred: ${error.message}`,
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

  // useEffect(() => {
  //     console.log('Data received:', data); // Log the received data

  //     // Function to process date
  //     const processDate = (dateData, setDateFunc) => {
  //       if (dateData && dateData.month && dateData.year) {
  //         const { month, year } = dateData;
  //         console.log('Received Month:', month, 'Year:', year);

  //         const yearNumber = Number(year);
  //         const monthIndex = monthMapping[month]; // Get month index from mapping

  //         if (monthIndex !== undefined && !isNaN(yearNumber)) {
  //           const date = new Date(yearNumber, monthIndex, 1); // Create a date object
  //           console.log('Constructed Date:', date);

  //           if (!isNaN(date.getTime())) {
  //             setDateFunc(date); // Set the date
  //             console.log('Date set:', date);
  //           } else {
  //             console.error('Invalid Date Constructed:', date);
  //             setDateFunc(null); // Handle invalid date
  //           }
  //         } else {
  //           console.error('Invalid month or year value:', month, year);
  //           setDateFunc(null); // Handle invalid month/year
  //         }
  //       } else {
  //         console.error('Month or year is missing in dateData:', dateData);
  //         setDateFunc(null); // Handle missing data
  //       }
  //     };

  //     // Process both startDate and endDate
  //     if (data && data.data) {
  //       processDate(data.data.startDate, setStartDate);
  //       processDate(data.data.endDate, setEndDate);
  //     }
  //   }, [data]);
  // console.log('stat', startDate);
  const initialValues = {
    school_university: data?.data?.school_university || '',
    fieldOfStudy: data?.data?.fieldOfStudy || '',
    grade: data?.data?.grade || '',
    activities: data?.data?.activities || '',
    degreeType: data?.data?.degreeType || '',
    description: data?.data?.description || '',
    isRecent: data?.data?.isRecent ?? false, // Ensure it's a boolean
    isOngoing: data?.data?.isOngoing ?? false,
  };

  const profileVisible = [
    {key: '1', value: 'True'},
    {key: '2', value: 'False'},
  ];

  const booleanMapping = {
    True: true,
    False: false,
  };

  return (
    <>
      <CustomHeader
        title={'Edit Education'}
        icon={require('../../../../../assets/images/back.png')}
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
            try {
              const experienceToSubmit = {
                school_university: values.school_university,
                degreeType: values.degreeType,
                grade: values.degreeType,
                activities: values.activities,
                fieldOfStudy: values.fieldOfStudy,
                description: values.description,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                isRecent: Boolean(values.isRecent), // Ensure boolean value
                isOngoing: Boolean(values.isOngoing),
                id,
              };

              // console.log('Submitting experience:', experienceToSubmit);
              const res = await editEducation(experienceToSubmit);

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
            handleSubmit,
            values,
            setFieldValue,
            errors,
            touched,
            handleBlur,
            isSubmitting,
          }) => (
            <View style={styles.experienceItem}>
              {/* Job Title */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>School / University</Text>

                <TextInput
                  placeholder="Ex: Boston University"
                  style={styles.input}
                  value={values.school_university}
                  onChangeText={value =>
                    setFieldValue(`school_university`, value)
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Degree</Text>

                <TextInput
                  placeholder="Ex: Bachelor's"
                  style={styles.input}
                  value={values.degreeType}
                  onChangeText={value => setFieldValue(`degreeType`, value)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Study Field</Text>

                <TextInput
                  placeholder="Ex:Business"
                  style={styles.input}
                  value={values.fieldOfStudy}
                  onChangeText={value => setFieldValue(`fieldOfStudy`, value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Grade</Text>

                <TextInput
                  placeholder="Ex: Grade A, Excellent performance"
                  style={styles.input}
                  value={values.grade}
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
                  {startDate ? startDate.toDateString() : 'Enter Start Date'}
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
              </View>

              {/* End Date */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>End Date</Text>
                <TouchableOpacity
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
                <SelectList
                  setSelected={val =>
                    setFieldValue('isRecent', booleanMapping[val])
                  }
                  defaultOption={{
                    key: initialValues.isRecent ? 'True' : 'False',
                    value: initialValues.isRecent ? 'True' : 'False',
                  }}
                  data={profileVisible}
                  placeholder="Select an option"
                  onBlur={() => handleBlur('isRecent')}
                  fontFamily="Poppins"
                  save="value"
                  inputStyles={{color: '#8E8E8E'}}
                  boxStyles={styles.dropdown}
                />
              </View>

              {/* Ongoing */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Ongoing</Text>
                <SelectList
                  setSelected={val =>
                    setFieldValue('isOngoing', booleanMapping[val])
                  }
                  defaultOption={{
                    key: initialValues.isOngoing ? 'True' : 'False',
                    value: initialValues.isOngoing ? 'True' : 'False',
                  }}
                  data={profileVisible}
                  placeholder="Select an option"
                  onBlur={() => handleBlur('isOngoing')}
                  fontFamily="Poppins"
                  save="value"
                  inputStyles={{color: '#8E8E8E'}}
                  boxStyles={styles.dropdown}
                />
              </View>

              {/* Submit Button */}
              <CustomButton
                title="Update"
                onPress={handleSubmit}
                loading={isSubmitting}
              />
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
    width: wp('90%'),
    backgroundColor: '#E1EBFF',
  },
  buttonText: {
    color: '#7F7F80', // Text color
    fontSize: 14,
    fontFamily: 'Poppins',
  },
});
