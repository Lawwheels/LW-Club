// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   Alert,
// } from 'react-native';
// import {Formik, FieldArray} from 'formik';
// import {showMessage} from 'react-native-flash-message';
// import * as Yup from 'yup';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {Button} from 'react-native-elements';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {SelectList} from 'react-native-dropdown-select-list';
// import CustomHeader from '../../../../shared/CustomHeader';
// import CustomButton from '../../../../shared/CustomButton';
// import {useAdvocateExperienceMutation} from '../../../redux/api/api';

// const experienceValidationSchema = Yup.object().shape({
//   jobTitle: Yup.string().required('Job title is required'),
//   firmName: Yup.string().required('Firm name is required'),
//   startDate: Yup.date().nullable().required('Start date is required'),
//   endDate: Yup.date()
//     .nullable()
//     .required('Expected end date is required')
//     .min(Yup.ref('startDate'), 'End date cannot be before start date'),
// });
// export default AddExperience = ({navigation}) => {
//   const [datePickerVisible, setDatePickerVisible] = useState([]);
//   const [date, setDate] = useState([]);
//   const [endDatePickerVisible, setEndDatePickerVisible] = useState([]);
//   const [endDate, setEndDate] = useState([]);

//   const [advocateExperience] = useAdvocateExperienceMutation();

//   const jobTitles = [
//     {key: '1', value: 'Advocate'},
//     {key: '2', value: 'AOR'},
//     {key: '3', value: 'Senior Advocate'},
//     {key: '4', value: 'Advocate General'},
//     {key: '5', value: 'Additional Advocate General'},
//     {key: '6', value: 'Deputy Advocate General'},
//     {key: '7', value: 'Public Prosecutor'},
//   ];
//   const profileVisible = [
//     {key: '1', value: 'True'},
//     {key: '2', value: 'False'},
//   ];

//   const booleanMapping = {
//     True: true,
//     False: false,
//   };

//   return (
//     <>
//       <CustomHeader
//         title={'Add Experience'}
//         icon={require('../../../../assets/images/back.png')}
//       />
//       <KeyboardAwareScrollView
//         style={styles.container}
//         showsVerticalScrollIndicator={false}>
//         <Formik
//           initialValues={{
//             experiences: [
//               {
//                 jobTitle: '',
//                 firmName: '',
//                 startDate: null,
//                 endDate: null,
//                 description: '',
//                 isRecent: false,
//                 isOngoing: false,
//               },
//             ],
//           }}
//           // validationSchema={validationExperience}
//           onSubmit={(values, {setSubmitting}) => {
//             console.log('values', values);
//           }}>
//           {({
//             handleSubmit,
//             values,
//             setFieldValue,
//             errors,
//             touched,
//             handleBlur,
//             isSubmitting,
//           }) => {
//             useEffect(() => {
//               const newDatePickerVisible = Array(
//                 values.experiences.length,
//               ).fill(false);
//               setDatePickerVisible(newDatePickerVisible);
//               setEndDatePickerVisible(newDatePickerVisible);
//               setEndDate(Array(values.experiences.length).fill(new Date()));
//               setDate(Array(values.experiences.length).fill(new Date()));
//             }, [values.experiences.length]);

//             return (
//               <FieldArray
//                 name="experiences"
//                 render={arrayHelpers => (
//                   <View>
//                     {values.experiences && values.experiences.length > 0 ? (
//                       values.experiences.map((experience, index) => {
//                         return (
//                           <View key={index} style={styles.experienceItem}>
//                             <View style={styles.inputContainer}>
//                               <Text style={styles.inputLabel}>Job Title</Text>
//                               <SelectList
//                                 setSelected={val =>
//                                   setFieldValue(
//                                     `experiences[${index}].jobTitle`,
//                                     val,
//                                   )
//                                 }
//                                 data={jobTitles}
//                                 placeholder="Select a job title"
//                                 onBlur={() =>
//                                   handleBlur(`experiences[${index}].jobTitle`)
//                                 }
//                                 fontFamily="Poppins"
//                                 save="value"
//                                 inputStyles={{color: '#8E8E8E'}}
//                                 boxStyles={styles.dropdown}
//                                 dropdownStyles={styles.dropdownBox}
//                                 dropdownTextStyles={styles.dropdownText}
//                               />
//                             </View>
//                             <View style={styles.inputContainer}>
//                               <Text style={styles.inputLabel}>Company</Text>
//                               <TextInput
//                                 placeholder="Enter Company"
//                                 style={styles.input}
//                                 value={experience.firmName}
//                                 onChangeText={value =>
//                                   setFieldValue(
//                                     `experiences[${index}].firmName`,
//                                     value,
//                                   )
//                                 }
//                               />
//                             </View>
//                             <View style={styles.inputContainer}>
//                               <View
//                                 style={{
//                                   flexDirection: 'row',
//                                   justifyContent: 'space-between',
//                                 }}>
//                                 <View>
//                                   <Text style={styles.inputLabel}>
//                                     Start Date
//                                   </Text>

//                                   <TouchableOpacity
//                                     style={styles.customButton} // Custom button style
//                                     onPress={() => {
//                                       // Only show picker if not collapsed
//                                       const newVisibilities = [
//                                         ...datePickerVisible,
//                                       ];
//                                       newVisibilities[index] = true; // Show date picker for this experience
//                                       setDatePickerVisible(newVisibilities);
//                                     }}>
//                                     {experience.startDate === null ? (
//                                       <Text style={styles.buttonText}>
//                                         Select Start Date
//                                       </Text>
//                                     ) : (
//                                       <Text
//                                         style={{
//                                           fontFamily: 'Poppins',
//                                           fontSize: 14,
//                                         }}>{`${experience.startDate}`}</Text>
//                                     )}
//                                   </TouchableOpacity>

//                                   {datePickerVisible[index] && ( // Show only if collapsed is false
//                                     <DateTimePicker
//                                       value={date[index] || new Date()}
//                                       mode="date"
//                                       display="default"
//                                       onChange={(event, selectedDate) => {
//                                         if (event.type === 'set') {
//                                           const currentDate =
//                                             selectedDate || date[index];
//                                           // Format date to YYYY-MM-DD
//                                           const formattedDate = currentDate
//                                             .toISOString()
//                                             .split('T')[0];

//                                           // Update the field with the formatted date
//                                           setFieldValue(
//                                             `experiences[${index}].startDate`,
//                                             formattedDate,
//                                           );

//                                           const newDates = [...date];
//                                           newDates[index] = currentDate;
//                                           setDate(newDates);
//                                         }
//                                         // Hide the date picker after selection
//                                         const newVisibilities = [
//                                           ...datePickerVisible,
//                                         ];
//                                         newVisibilities[index] = false;
//                                         setDatePickerVisible(newVisibilities);
//                                       }}
//                                     />
//                                   )}
//                                 </View>
//                                 <View>
//                                   <Text style={styles.inputLabel}>
//                                     Expected End Date
//                                   </Text>

//                                   <TouchableOpacity
//                                     style={styles.customButton} // Custom button style
//                                     onPress={() => {
//                                       // Only show picker if not collapsed
//                                       const newVisibilities = [
//                                         ...endDatePickerVisible,
//                                       ];
//                                       newVisibilities[index] = true; // Show date picker for this experience
//                                       setEndDatePickerVisible(newVisibilities);
//                                     }}>
//                                     {experience.endDate === null ? (
//                                       <Text style={styles.buttonText}>
//                                         Select End Date
//                                       </Text>
//                                     ) : (
//                                       <Text
//                                         style={{
//                                           fontFamily: 'Poppins',
//                                           fontSize: 14,
//                                         }}>{`${experience.endDate}`}</Text>
//                                     )}
//                                   </TouchableOpacity>

//                                   {endDatePickerVisible[index] && ( // Show only if collapsed is false
//                                     <DateTimePicker
//                                       value={endDate[index] || new Date()} // Set a default value if date is null
//                                       mode="date"
//                                       display="default"
//                                       onChange={(event, selectedDate) => {
//                                         if (
//                                           event.type === 'set' &&
//                                           selectedDate
//                                         ) {
//                                           const formattedDate = selectedDate
//                                             .toISOString()
//                                             .split('T')[0];
//                                           setFieldValue(
//                                             `experiences[${index}].endDate`,
//                                             formattedDate,
//                                           );
//                                           const newDates = [...endDate];
//                                           newDates[index] = selectedDate;
//                                           setEndDate(newDates);
//                                         }
//                                         const newVisibilities = [
//                                           ...endDatePickerVisible,
//                                         ];
//                                         newVisibilities[index] = false;
//                                         setEndDatePickerVisible(
//                                           newVisibilities,
//                                         );
//                                       }}
//                                     />
//                                   )}
//                                 </View>
//                               </View>
//                             </View>
//                             <View style={styles.inputContainer}>
//                               <Text style={styles.inputLabel}>Description</Text>

//                               <TextInput
//                                 placeholder="Enter Answer"
//                                 style={{
//                                   padding: 12,
//                                   borderRadius: 10,
//                                   backgroundColor: '#E1EBFF',
//                                   fontFamily: 'Poppins',
//                                 }}
//                                 multiline={true}
//                                 numberOfLines={4}
//                                 value={experience.description}
//                                 textAlignVertical="top"
//                                 onChangeText={value =>
//                                   setFieldValue(
//                                     `experiences[${index}].description`,
//                                     value,
//                                   )
//                                 }
//                               />
//                             </View>
//                             <View style={styles.inputContainer}>
//                               <Text style={styles.inputLabel}>Recent</Text>
//                               <SelectList
//                                 setSelected={val => {
//                                   console.log('Selected value:', val);
//                                   const isRecentValue = booleanMapping[val];
//                                   console.log(
//                                     'Mapped boolean value:',
//                                     isRecentValue,
//                                   );
//                                   setFieldValue(
//                                     `experiences[${index}].isRecent`,
//                                     isRecentValue,
//                                   );
//                                 }}
//                                 data={profileVisible}
//                                 placeholder="Select a option"
//                                 onBlur={handleBlur(
//                                   `experiences[${index}].isRecent`,
//                                 )}
//                                 fontFamily="Poppins"
//                                 save="value"
//                                 inputStyles={{color: '#8E8E8E'}}
//                                 boxStyles={styles.dropdown}
//                                 dropdownStyles={styles.dropdownBox}
//                                 dropdownTextStyles={styles.dropdownText}
//                               />
//                             </View>

//                             <View style={styles.inputContainer}>
//                               <Text style={styles.inputLabel}>Ongoing</Text>
//                               <SelectList
//                                 setSelected={val => {
//                                   // Log the selected value to ensure it is coming as expected
//                                   console.log('Selected value:', val);

//                                   const isOngoingValue = booleanMapping[val];

//                                   console.log(
//                                     'Mapped boolean value:',
//                                     isOngoingValue,
//                                   );
//                                   setFieldValue(
//                                     `experiences[${index}].isOngoing`,
//                                     isOngoingValue,
//                                   );
//                                 }}
//                                 data={profileVisible}
//                                 placeholder="Select a option"
//                                 onBlur={handleBlur(
//                                   `experiences[${index}].isOngoing`,
//                                 )}
//                                 fontFamily="Poppins"
//                                 save="value"
//                                 inputStyles={{color: '#8E8E8E'}}
//                                 boxStyles={styles.dropdown}
//                                 dropdownStyles={styles.dropdownBox}
//                                 dropdownTextStyles={styles.dropdownText}
//                               />
//                             </View>
//                             {values.experiences.length > 1 && (
//                               <Button
//                                 title="Remove"
//                                 type="clear"
//                                 titleStyle={{fontFamily: 'Poppins'}}
//                                 buttonStyle={styles.removeButton}
//                                 onPress={() => arrayHelpers.remove(index)}
//                               />
//                             )}

//                             <CustomButton
//                               title="Save"
//                               onPress={async () => {
//                                 try {
//                                   // Validate the current experience using the schema
//                                   await experienceValidationSchema.validate(
//                                     experience,
//                                     {abortEarly: false},
//                                   );

//                                   const experienceToSubmit = {
//                                     jobTitle: experience.jobTitle,
//                                     firmName: experience.firmName,
//                                     startDate: experience.startDate,
//                                     endDate: experience.endDate,
//                                     isRecent: experience.isRecent,
//                                     isOngoing: experience.isOngoing,
//                                     description: experience.description,
//                                   };

//                                   const response = await advocateExperience(
//                                     experienceToSubmit,
//                                   );
//                                   console.log('API Response:', response);
//                                   if (
//                                     response?.data &&
//                                     response?.data?.success
//                                   ) {
//                                     showMessage({
//                                       message: 'Success',
//                                       description: response?.data?.message,
//                                       type: 'success',
//                                       titleStyle: {
//                                         fontFamily: 'Poppins SemiBold',
//                                       },
//                                       textStyle: {fontFamily: 'Poppins'},
//                                     });
//                                     navigation.navigate('ViewAdvocateProfile');
//                                   } else {
//                                     // Handle non-successful API responses here
//                                     const errorMsg =
//                                       response.error?.data?.message ||
//                                       'Something went wrong!';

//                                     showMessage({
//                                       message: 'Error',
//                                       description: errorMsg,
//                                       type: 'danger',
//                                       titleStyle: {
//                                         fontFamily: 'Poppins SemiBold',
//                                       },
//                                       textStyle: {fontFamily: 'Poppins'},
//                                     });
//                                   }
//                                 } catch (error) {
//                                   if (error instanceof Yup.ValidationError) {
//                                     Alert.alert(
//                                       'Validation Error',
//                                       error.errors.join('\n'),
//                                     ); // Show validation errors in alert
//                                   } else {
//                                     console.error(error);
//                                     const errorMsg =
//                                       error?.response?.data?.error?.data
//                                         ?.message || 'Something went wrong!';
//                                     showMessage({
//                                       message: 'Error',
//                                       description: errorMsg,
//                                       type: 'danger',
//                                       titleStyle: {
//                                         fontFamily: 'Poppins SemiBold',
//                                       },
//                                       textStyle: {fontFamily: 'Poppins'},
//                                     });
//                                   }
//                                 }
//                               }}
//                             />
//                           </View>
//                         );
//                       })
//                     ) : (
//                       <Text>No experiences added</Text>
//                     )}
//                     <CustomButton
//                       title="Add Experience"
//                       onPress={() =>
//                         arrayHelpers.push({
//                           jobTitle: '',
//                           firmName: '',
//                           startDate: null,
//                           endDate: null,
//                           isRecent: false,
//                           isOngoing: false,
//                           description: '',
//                         })
//                       }
//                     />
//                   </View>
//                 )}
//               />
//             );
//           }}
//         </Formik>
//       </KeyboardAwareScrollView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F3F7FF',
//     paddingHorizontal: wp('5%'),
//   },
//   inputLabel: {
//     fontSize: 14,
//     color: '#000',
//     marginBottom: 5,
//     fontFamily: 'Poppins SemiBold',
//   },
//   dropdown: {
//     // marginVertical: hp('1%'),
//     borderColor: '#fff',
//     backgroundColor: '#E1EBFF',
//     borderRadius: wp('3%'),
//   },
//   dropdownBox: {
//     marginVertical: 2,
//     borderColor: '#fff',
//     backgroundColor: '#E1EBFF',
//     borderRadius: wp('3%'),
//   },
//   dropdownText: {
//     color: '#8E8E8E',
//     fontSize: wp('3.73%'),
//     fontWeight: '400',
//     marginVertical: 2,
//   },
//   errorText: {
//     color: 'red',
//     marginBottom: hp('1.5%'),
//     fontFamily: 'Poppins',
//   },
//   inputContainer: {
//     position: 'relative',
//     width: '100%',
//     marginBottom: hp('1.5%'),
//   },
//   input: {
//     height: 48,
//     padding: 12,
//     borderRadius: 10,
//     backgroundColor: '#E1EBFF',
//     fontFamily: 'Poppins',
//   },
//   customButton: {
//     backgroundColor: '#007BFF', // Customize the button color
//     padding: 10,
//     borderRadius: wp('2%'),
//     alignItems: 'center',
//     width: wp('40%'),
//     backgroundColor: '#E1EBFF',
//   },
//   buttonText: {
//     color: '#7F7F80', // Text color
//     fontSize: 14,
//     fontFamily: 'Poppins',
//   },
//   styleDropdownMenu: {
//     borderWidth: 0, // Remove underline from dropdown menu
//     backgroundColor: '#E1EBFF',
//     borderRadius: wp('3%'),
//   },
//   styleInputGroup: {
//     borderWidth: 0,
//     borderBottomWidth: 0,
//     borderRadius: wp('3%'),
//     backgroundColor: '#E1EBFF',
//   },
//   styleDropdownMenuSubsection: {
//     borderWidth: 0, // Remove underline from dropdown menu subsection
//     borderBottomWidth: 0,
//     backgroundColor: '#E1EBFF',
//     borderRadius: wp('3%'),
//   },
//   styleMainWrapper: {
//     borderColor: '#fff',
//     backgroundColor: '#E1EBFF',
//     borderRadius: wp('3%'),
//     paddingHorizontal: 10,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 10,
//   },
//   tab: {
//     // backgroundColor: COLORS.background,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 20,
//     marginRight: 5,
//     marginTop: 3,
//     marginBottom: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   tabText: {
//     color: '#000',
//     fontSize: 13,
//     fontFamily: 'Poppins',
//   },
//   removeButton: {
//     marginLeft: 5,
//     padding: 5,
//     marginTop: -5,
//     borderRadius: 10,
//   },
//   removeButtonText: {
//     fontSize: 16,
//     color: '#000',
//   },
// });

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
  firmName: Yup.string().required('Firm name is required'),
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
                <Text style={styles.inputLabel}>Job Title</Text>
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
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Company</Text>
                <TextInput
                  placeholder="Enter Company"
                  style={styles.input}
                  value={values.firmName}
                  onChangeText={value => setFieldValue('firmName', value)}
                />
              </View>
              <View style={styles.inputContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={styles.inputLabel}>Start Date</Text>
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
              {/* </View> */}
              {/* <View style={styles.inputContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.inputLabel}>Ongoing</Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#1262D2'}}
                    thumbColor={isOngoing ? '#fff' : '#f4f3f4'}
                    value={isOngoing}
                    onValueChange={value =>
                      handleSwitchChange('isOngoing', value)
                    }
                  />
                </View>
              </View> */}
              {/* <View style={styles.inputContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.inputLabel}>Is Recent</Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#1262D2'}}
                    thumbColor={isRecent ? '#fff' : '#f4f3f4'}
                    value={isRecent}
                    onValueChange={value =>
                      handleSwitchChange('isRecent', value)
                    }
                  />
                </View>
              </View> */}
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
