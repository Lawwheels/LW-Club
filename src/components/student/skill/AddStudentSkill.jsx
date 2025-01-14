import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import {Formik} from 'formik';
import {showMessage} from 'react-native-flash-message';
import * as Yup from 'yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../../../shared/CustomHeader';
import CustomButton from '../../../../shared/CustomButton';
import {useAdvocateSkillMutation, useStudentSkillMutation} from '../../../redux/api/api';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const skillValidationSchema = Yup.object().shape({
  skillName: Yup.string().required('Skill is required'),
});

const AddStudentSkill = ({navigation}) => {
  const [studentSkill] = useStudentSkillMutation();

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
            onSubmit={async (values, {setSubmitting,resetForm}) => {
              try {
                setSubmitting(true);
                const response = await studentSkill(values);
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
                  navigation.navigate("ViewStudentProfile")
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
              <View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Skill<Text style={{ color: 'red' }}> *</Text></Text>
                  <TextInput
                    placeholder="Enter Skill"
                    style={styles.input}
                    onBlur={() => handleBlur('skillName')}
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
                  loading={isSubmitting}
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

export default AddStudentSkill;
