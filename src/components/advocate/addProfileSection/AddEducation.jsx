import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
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
import {SelectList} from 'react-native-dropdown-select-list';
import CustomHeader from '../../../../shared/CustomHeader';
import CustomButton from '../../../../shared/CustomButton';
import {useAdvocateEducationMutation} from '../../../redux/api/api';

const educationValidationSchema = Yup.object().shape({
  school_university: Yup.string().required('School / University is required'),
});

export default AddEducation = ({navigation}) => {
  //education state
  const [educationStartDate, setEducationStartDate] = useState([]);
  const [educationEndDate, setEducationEndDate] = useState([]);
  const [educationStartDatePicker, setEducationStartDatePicker] = useState([]);
  const [educationEndDatePicker, setEducationEndDatePicker] = useState([]);

  const [advocateEducation, {isLoading: eduLoading}] =
    useAdvocateEducationMutation();

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
        title={'Add Education'}
        icon={require('../../../../assets/images/back.png')}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={{
            educations: [
              {
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
              },
            ],
          }}
          // validationSchema={validationExperience}
          onSubmit={(values, {setSubmitting}) => {
            console.log('values', values);
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
            useEffect(() => {
              const newDatePickerVisible = Array(values.educations.length).fill(
                false,
              );
              setEducationStartDatePicker(newDatePickerVisible);
              setEducationEndDatePicker(newDatePickerVisible);
              setEducationEndDate(
                Array(values.educations.length).fill(new Date()),
              );
              setEducationStartDate(
                Array(values.educations.length).fill(new Date()),
              );
            }, [values.educations.length]);

            return (
              <FieldArray
                name="educations"
                render={arrayHelpers => (
                  <View>
                    {values.educations && values.educations.length > 0 ? (
                      values.educations.map((education, index) => {
                        return (
                          <View key={index} style={styles.experienceItem}>
                            <View style={styles.inputContainer}>
                              <Text style={styles.inputLabel}>
                                School / University
                              </Text>

                              <TextInput
                                placeholder="Ex: Boston University"
                                style={styles.input}
                                value={education.school_university}
                                onChangeText={value =>
                                  setFieldValue(
                                    `educations[${index}].school_university`,
                                    value,
                                  )
                                }
                              />
                            </View>
                            <View style={styles.inputContainer}>
                              <Text style={styles.inputLabel}>Degree</Text>

                              <TextInput
                                placeholder="Ex: Bachelor's"
                                style={styles.input}
                                value={education.degreeType}
                                onChangeText={value =>
                                  setFieldValue(
                                    `educations[${index}].degreeType`,
                                    value,
                                  )
                                }
                              />
                            </View>
                            <View style={styles.inputContainer}>
                              <Text style={styles.inputLabel}>Study Field</Text>

                              <TextInput
                                placeholder="Ex:Business"
                                style={styles.input}
                                value={education.fieldOfStudy}
                                onChangeText={value =>
                                  setFieldValue(
                                    `educations[${index}].fieldOfStudy`,
                                    value,
                                  )
                                }
                              />
                            </View>

                            <View style={styles.inputContainer}>
                              <Text style={styles.inputLabel}>Grade</Text>

                              <TextInput
                                placeholder="Ex: Grade A, Excellent performance"
                                style={styles.input}
                                value={education.grade}
                                onChangeText={value =>
                                  setFieldValue(
                                    `educations[${index}].grade`,
                                    value,
                                  )
                                }
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
                                value={education.description}
                                textAlignVertical="top"
                                onChangeText={value =>
                                  setFieldValue(
                                    `educations[${index}].description`,
                                    value,
                                  )
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
                                    Start Date
                                  </Text>

                                  <TouchableOpacity
                                    style={styles.customButton} // Custom button style
                                    onPress={() => {
                                      // Only show picker if not collapsed
                                      const newVisibilities = [
                                        ...educationStartDatePicker,
                                      ];
                                      newVisibilities[index] = true; // Show date picker for this experience
                                      setEducationStartDatePicker(
                                        newVisibilities,
                                      );
                                    }}>
                                    {education.startDate === null ? (
                                      <Text style={styles.buttonText}>
                                        Select Start Date
                                      </Text>
                                    ) : (
                                      <Text
                                        style={{
                                          fontFamily: 'Poppins',
                                          fontSize: 14,
                                        }}>{`${education.startDate}`}</Text>
                                    )}
                                  </TouchableOpacity>

                                  {educationStartDatePicker[index] && ( // Show only if collapsed is false
                                    <DateTimePicker
                                      value={
                                        educationStartDate[index] || new Date()
                                      }
                                      mode="date"
                                      display="default"
                                      onChange={(event, selectedDate) => {
                                        if (event.type === 'set') {
                                          const currentDate =
                                            selectedDate ||
                                            educationStartDate[index];
                                          // Format date to YYYY-MM-DD
                                          const formattedDate = currentDate
                                            .toISOString()
                                            .split('T')[0];

                                          // Update the field with the formatted date
                                          setFieldValue(
                                            `educations[${index}].startDate`,
                                            formattedDate,
                                          );

                                          const newDates = [
                                            ...educationStartDate,
                                          ];
                                          newDates[index] = currentDate;
                                          setEducationStartDate(newDates);
                                        }
                                        // Hide the date picker after selection
                                        const newVisibilities = [
                                          ...educationStartDatePicker,
                                        ];
                                        newVisibilities[index] = false;
                                        setEducationStartDatePicker(
                                          newVisibilities,
                                        );
                                      }}
                                    />
                                  )}
                                </View>
                                <View>
                                  <Text style={styles.inputLabel}>
                                    Expected End Date
                                  </Text>

                                  <TouchableOpacity
                                    style={styles.customButton} // Custom button style
                                    onPress={() => {
                                      // Only show picker if not collapsed
                                      const newVisibilities = [
                                        ...educationEndDatePicker,
                                      ];
                                      newVisibilities[index] = true; // Show date picker for this experience
                                      setEducationEndDatePicker(
                                        newVisibilities,
                                      );
                                    }}>
                                    {education.endDate === null ? (
                                      <Text style={styles.buttonText}>
                                        Select End Date
                                      </Text>
                                    ) : (
                                      <Text
                                        style={{
                                          fontFamily: 'Poppins',
                                          fontSize: 14,
                                        }}>{`${education.endDate}`}</Text>
                                    )}
                                  </TouchableOpacity>

                                  {educationEndDatePicker[index] && ( // Show only if collapsed is false
                                    <DateTimePicker
                                      value={
                                        educationEndDate[index] || new Date()
                                      } // Set a default value if date is null
                                      mode="date"
                                      display="default"
                                      onChange={(event, selectedDate) => {
                                        if (
                                          event.type === 'set' &&
                                          selectedDate
                                        ) {
                                          const formattedDate = selectedDate
                                            .toISOString()
                                            .split('T')[0];
                                          setFieldValue(
                                            `educations[${index}].endDate`,
                                            formattedDate,
                                          );
                                          const newDates = [
                                            ...educationEndDate,
                                          ];
                                          newDates[index] = selectedDate;
                                          setEducationEndDate(newDates);
                                        }
                                        const newVisibilities = [
                                          ...educationEndDatePicker,
                                        ];
                                        newVisibilities[index] = false;
                                        setEducationEndDatePicker(
                                          newVisibilities,
                                        );
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
                                value={education.activities}
                                textAlignVertical="top"
                                onChangeText={value =>
                                  setFieldValue(
                                    `educations[${index}].activities`,
                                    value,
                                  )
                                }
                              />
                            </View>
                            <View style={styles.inputContainer}>
                              <Text style={styles.inputLabel}>Recent</Text>
                              <SelectList
                                setSelected={val => {
                                  // Log the selected value to ensure it is coming as expected
                                  console.log('Selected value:', val);

                                  const isRecentValue = booleanMapping[val];

                                  console.log(
                                    'Mapped boolean value:',
                                    isRecentValue,
                                  );
                                  setFieldValue(
                                    `educations[${index}].isRecent`,
                                    isRecentValue,
                                  );
                                }}
                                data={profileVisible}
                                placeholder="Select a option"
                                onBlur={handleBlur(
                                  `educations[${index}].isRecent`,
                                )}
                                fontFamily="Poppins"
                                save="value"
                                inputStyles={{color: '#8E8E8E'}}
                                boxStyles={styles.dropdown}
                                dropdownStyles={styles.dropdownBox}
                                dropdownTextStyles={styles.dropdownText}
                              />
                            </View>

                            <View style={styles.inputContainer}>
                              <Text style={styles.inputLabel}>Ongoing</Text>
                              <SelectList
                                setSelected={val => {
                                  // Log the selected value to ensure it is coming as expected
                                  console.log('Selected value:', val);

                                  const isOngoingValue = booleanMapping[val];

                                  console.log(
                                    'Mapped boolean value:',
                                    isOngoingValue,
                                  );
                                  setFieldValue(
                                    `educations[${index}].isOngoing`,
                                    isOngoingValue,
                                  );
                                }}
                                data={profileVisible}
                                placeholder="Select a option"
                                onBlur={handleBlur(
                                  `educations[${index}].isOngoing`,
                                )}
                                fontFamily="Poppins"
                                save="value"
                                inputStyles={{color: '#8E8E8E'}}
                                boxStyles={styles.dropdown}
                                dropdownStyles={styles.dropdownBox}
                                dropdownTextStyles={styles.dropdownText}
                              />
                            </View>
                            {values.educations.length > 1 && (
                            <Button
                              title="Remove"
                              type="clear"
                              titleStyle={{fontFamily: 'Poppins'}}
                              buttonStyle={styles.removeButton}
                              onPress={() => arrayHelpers.remove(index)} // Remove the experience
                            />)}

                            <View style={{marginTop: hp('1%')}}>
                              <CustomButton
                                title="Save"
                                onPress={async () => {
                                  try {
                                    // Validate the current education using the schema
                                    await educationValidationSchema.validate(
                                      education,
                                      {abortEarly: false},
                                    );

                                    const educationToSubmit = {
                                      school_university:
                                        education.school_university,
                                      grade: education.grade,
                                      activities: education.activities,
                                      degreeType: education.degreeType,
                                      fieldOfStudy: education.fieldOfStudy,
                                      startDate: education.startDate,
                                      endDate: education.endDate,
                                      isRecent: education.isRecent,
                                      isOngoing: education.isOngoing,
                                      description: education.description,
                                    };
                                    console.log('save', education.isRecent);

                                    console.log(
                                      'Submitting individual experience:',
                                      educationToSubmit,
                                    );
                                    // Make the API call here
                                    const response = await advocateEducation(
                                      educationToSubmit,
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
                                      // ); 
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
                                loading={eduLoading}
                              />
                            </View>
                          </View>
                        );
                      })
                    ) : (
                      <Text>No education added</Text>
                    )}

                    <CustomButton
                      title="Add Education"
                      onPress={() =>
                        arrayHelpers.push({
                          school_university: '',
                          fieldOfStudy: '',
                          grade: '',
                          activities: '',
                          degreeType: '',
                          startDate: null,
                          endDate: null,
                          isRecent: false,
                          isOngoing: false,
                          description: '',
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
