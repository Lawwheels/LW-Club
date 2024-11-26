// import React, {useState, useEffect} from 'react';
// import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
// import {Formik, FieldArray} from 'formik';
// import {showMessage} from 'react-native-flash-message';
// import * as Yup from 'yup';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {Button} from 'react-native-elements';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import CustomHeader from '../../../../shared/CustomHeader';
// import CustomButton from '../../../../shared/CustomButton';
// import {
//   useAdvocateCertificateMutation,
//   useAdvocateEducationMutation,
//   useAdvocateExperienceMutation,
//   useAdvocatePracticeAreaMutation,
//   useAdvocateSkillMutation,
//   useUpdateAdvocateBioMutation,
// } from '../../../redux/api/api';

// const skillValidationSchema = Yup.object().shape({
//   skillName: Yup.string().required('Skill is required'),
// });

// export default AddSkill = ({navigation}) => {
//   const [advocateSkill, {isLoading: skillLoading}] = useAdvocateSkillMutation();

  

//   return (
//     <>
//       <CustomHeader
//         title={'Add Skill'}
//         icon={require('../../../../assets/images/back.png')}
//       />
//       <KeyboardAwareScrollView
//         style={styles.container}
//         showsVerticalScrollIndicator={false}>
//         {/* Header */}

//         <View style={styles.accordionContent}>
//           <Formik
//             initialValues={{
//               skills: [
//                 {
//                   skillName: '',
//                 },
//               ],
//             }}
//             // validationSchema={validationExperience}
//             onSubmit={(values, {setSubmitting}) => {
//               console.log('values', values);
//             }}>
//             {({
//               // handleSubmit,
//               values,
//               setFieldValue,
//               // errors,
//               // touched,
//               // handleBlur,
//               // isSubmitting,
//             }) => {
//               return (
//                 <FieldArray
//                   name="skills"
//                   render={arrayHelpers => (
//                     <View>
//                       {values.skills && values.skills.length > 0 ? (
//                         values.skills.map((skill, index) => {
//                           return (
//                             <View key={index} style={styles.experienceItem}>
//                               <View style={styles.inputContainer}>
//                                 <Text style={styles.inputLabel}>Skill</Text>

//                                 <TextInput
//                                   placeholder="Enter Skill"
//                                   style={styles.input}
//                                   value={skill.skillName}
//                                   onChangeText={value =>
//                                     setFieldValue(
//                                       `skills[${index}].skillName`,
//                                       value,
//                                     )
//                                   }
//                                 />
//                               </View>

//                               <Button
//                                 title="Remove"
//                                 type="clear"
//                                 buttonStyle={styles.removeButton}
//                                 onPress={() => arrayHelpers.remove(index)} // Remove the experience
//                               />

//                               <CustomButton
//                                 title="Save"
//                                 onPress={async () => {
//                                   try {
//                                     // Validate the current education using the schema
//                                     await skillValidationSchema.validate(
//                                       skill,
//                                       {
//                                         abortEarly: false,
//                                       },
//                                     );

//                                     const skillToSubmit = {
//                                       skillName: skill.skillName,
//                                     };

//                                     console.log(
//                                       'Submitting individual skills',
//                                       skillToSubmit,
//                                     );
//                                     // Make the API call here
//                                     const response = await advocateSkill(
//                                       skillToSubmit,
//                                     );
//                                     console.log('API Response:', response);
//                                     if (
//                                       response?.data &&
//                                       response?.data?.success
//                                     ) {
//                                       showMessage({
//                                         message: 'Success',
//                                         description: response?.data?.message,
//                                         type: 'success',
//                                         titleStyle: {
//                                           fontFamily: 'Poppins SemiBold',
//                                         },
//                                         textStyle: {fontFamily: 'Poppins'},
//                                       });
//                                     } else {
//                                       // Handle non-successful API responses here
//                                       const errorMsg =
//                                         response.error?.data?.message ||
//                                         'Something went wrong!';
//                                       showMessage({
//                                         message: 'Error',
//                                         description: errorMsg,
//                                         type: 'danger',
//                                         titleStyle: {
//                                           fontFamily: 'Poppins SemiBold',
//                                         },
//                                         textStyle: {fontFamily: 'Poppins'},
//                                       });
//                                     }
//                                     // Show API response in alert
//                                   } catch (error) {
//                                     if (error instanceof Yup.ValidationError) {
//                                       Alert.alert(
//                                         'Validation Error',
//                                         error.errors.join(', '),
//                                       ); // Show validation errors in alert
//                                     } else {
//                                       console.error(error);
//                                       const errorMsg =
//                                         error?.response?.data?.error?.data
//                                           ?.message || 'Something went wrong!';
//                                       showMessage({
//                                         message: 'Error',
//                                         description: errorMsg,
//                                         type: 'danger',
//                                         titleStyle: {
//                                           fontFamily: 'Poppins SemiBold',
//                                         },
//                                         textStyle: {fontFamily: 'Poppins'},
//                                       });
//                                     }
//                                   }
//                                 }}
//                                 loading={skillLoading}
//                               />
//                             </View>
//                           );
//                         })
//                       ) : (
//                         <Text>No skill added</Text>
//                       )}
//                       <CustomButton
//                         title="Add Skill"
//                         onPress={() =>
//                           arrayHelpers.push({
//                             skillName: '',
//                           })
//                         }
//                       />
//                     </View>
//                   )}
//                 />
//               );
//             }}
//           </Formik>
//         </View>
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
import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import {Formik} from 'formik';
import {showMessage} from 'react-native-flash-message';
import * as Yup from 'yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../../../shared/CustomHeader';
import CustomButton from '../../../../shared/CustomButton';
import {useAdvocateSkillMutation} from '../../../redux/api/api';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const skillValidationSchema = Yup.object().shape({
  skillName: Yup.string().required('Skill is required'),
});

const AddSkill = ({navigation}) => {
  const [advocateSkill, {isLoading: skillLoading}] = useAdvocateSkillMutation();

  return (
    <>
      <CustomHeader
        title={'Add Skill'}
        icon={require('../../../../assets/images/back.png')}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        <View style={styles.accordionContent}>
          <Formik
            initialValues={{
              skillName: '',
            }}
            validationSchema={skillValidationSchema}
            onSubmit={async (values, {resetForm}) => {
              try {
                const response = await advocateSkill(values);
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
                  resetForm(); // Clear the form after successful submission
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
                console.error('Error:', error);
                Alert.alert(
                  'Error',
                  'An unexpected error occurred. Please try again.',
                );
              }
            }}>
            {({
              handleSubmit,
              values,
              setFieldValue,
              errors,
              touched,
              isSubmitting,
            }) => (
              <View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Skill</Text>
                  <TextInput
                    placeholder="Enter Skill"
                    style={styles.input}
                    value={values.skillName}
                    onChangeText={value => setFieldValue('skillName', value)}
                  />
                  {touched.skillName && errors.skillName && (
                    <Text style={styles.errorText}>{errors.skillName}</Text>
                  )}
                </View>

                <CustomButton
                  title="Save"
                  onPress={handleSubmit}
                  loading={skillLoading}
                />
              </View>
            )}
          </Formik>
        </View>
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
  errorText: {
    color: 'red',
    marginBottom: hp('1.5%'),
    fontFamily: 'Poppins',
  },
  accordionContent: {
    marginTop: hp('2%'),
  },
});

export default AddSkill;
