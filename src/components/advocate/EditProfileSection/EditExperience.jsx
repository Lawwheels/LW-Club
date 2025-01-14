import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Switch,
  RefreshControl
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
import CustomHeader from '../../../../shared/CustomHeader';
import CustomButton from '../../../../shared/CustomButton';
import {
  useEditExperienceMutation,
  useGetExperienceByIdQuery,
} from '../../../redux/api/api';
import {useNavigation} from '@react-navigation/native';
import { handleError } from '../../../../shared/authUtils';

const validationSchema = Yup.object().shape({
  jobTitle: Yup.string().required('Job title is required'),
  firmName: Yup.string().required('Firm name is required'),
  startDate: Yup.date().nullable().required('Start date is required'),
  endDate: Yup.date().nullable(),
});


export default EditExperience = ({route}) => {
  const navigation = useNavigation();
  const {id} = route?.params || {};
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [refresh,setRefresh]=useState(false);

  const {data, isLoading, error,refetch} = useGetExperienceByIdQuery(id);
  const [editExperience] = useEditExperienceMutation();

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

  console.log(endDate)
  if (!startDate || !endDate) {
    return <Text>Loading dates...</Text>;
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

  // const initialValues = {
  //   jobTitle: data?.data?.jobTitle || '',
  //   firmName: data?.data?.firmName || '',
  //   description: data?.data?.description || '',
  //   isRecent: data?.data?.isRecent ?? false,
  //   isOngoing: data?.data?.isOngoing ?? false,
  // };
  const pullMe = async () => {
    try {
      setRefresh(true);
      await Promise.all([
        refetch(), // Refetch advocate data
      ]);
    } catch (error) {
      handleError(error);
      console.error('Error during refetch:', error); // Handle errors if needed
    } finally {
      setRefresh(false); // Hide the refresh indicator after both data are fetched
    }
  };

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
        title={'Edit Experience'}
        icon={require('../../../../assets/images/back.png')}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={pullMe} />
        }>
        <Formik
          initialValues={{
            jobTitle: data?.data?.jobTitle || '',
            firmName: data?.data?.firmName || '',
            description: data?.data?.description || '',
            isRecent: data?.data?.isRecent ?? false,
            isOngoing: data?.data?.isOngoing ?? false,
            startDate: data?.data?.startDate || null,
            endDate: data?.data?.endDate || null,
          }}
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
                  titleStyle: {fontFamily: 'Poppins SemiBold'},
                  textStyle: {fontFamily: 'Poppins'},
                });
                setSubmitting(false);
                return; // Halt submission
              }
            }
            try {
              const experienceToSubmit = {
                jobTitle: values.jobTitle,
                firmName: values.firmName,
                startDate: startDateISO,
                isRecent: values.isRecent,
                isOngoing: values.isOngoing,
                id,
              };

              if (!values.isOngoing && values.endDate) {
                experienceToSubmit.endDate = endDateISO;
              }

              // Conditionally add description if it's not an empty string
              if (values.description.trim() !== '') {
                experienceToSubmit.description = values.description;
              }

              console.log('Submitting experience:', experienceToSubmit);
              const res = await editExperience(experienceToSubmit);
              console.log(res);
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
          }) => { console.log(errors)
            return(
           
            <View style={styles.experienceItem}>
              {/* Job Title */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Job Title<Text style={{color: 'red'}}> *</Text>
                </Text>
                <SelectList
                  setSelected={val => setFieldValue('jobTitle', val)}
                  data={jobTitles}
                  defaultOption={{
                    key: values.jobTitle,
                    value: values.jobTitle,
                  }}
                  placeholder="Select a job title"
                  onBlur={() => handleBlur('jobTitle')}
                  fontFamily="Poppins"
                  save="value"
                  inputStyles={{color: '#8E8E8E'}}
                  boxStyles={styles.dropdown}
                />
                {touched.jobTitle && errors.jobTitle && (
                  <Text style={styles.errorText}>{errors.jobTitle}</Text>
                )}
              </View>

              {/* Company Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Company<Text style={{color: 'red'}}> *</Text>
                </Text>
                <TextInput
                  placeholder="Enter Company"
                  style={styles.input}
                  value={values.firmName}
                  onChangeText={value => setFieldValue('firmName', value)}
                />
                {touched.firmName && errors.firmName && (
                  <Text style={styles.errorText}>{errors.firmName}</Text>
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
                <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Expected End Date</Text>
              {/* End Date */}
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
              {/* <View style={styles.inputContainer}>
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
              </View> */}

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
              {/* <View style={styles.inputContainer}>
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
              </View> */}
              

              {/* Ongoing */}
              {/* <View style={styles.inputContainer}>
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
              </View> */}
            

              <View style={{marginTop: hp('2%')}}>
                <CustomButton
                  title="Update"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                />
              </View>
            </View>
          )}}
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
