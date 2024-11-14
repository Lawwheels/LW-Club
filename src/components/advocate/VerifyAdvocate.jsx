import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  // Dimensions,
  Alert,
  Image,
  BackHandler,
  ActivityIndicator
} from 'react-native';
import {Formik} from 'formik';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import * as Yup from 'yup';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useFocusEffect} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import CustomTextInput from '../../../shared/CustomTextInput';
import CustomButton from '../../../shared/CustomButton';
import {useVerifyAdvocateMutation} from '../../redux/api/api';
import navigationStrings from '../../constants/navigationStrings';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../../shared/CustomHeader';

// const {height: screenHeight} = Dimensions.get('window');
const validationSchema = Yup.object().shape({
  barCouncilId: Yup.string()
    .required('Bar Council ID is required'),
  selectedFile: Yup.mixed().required('Council ID image is required'),
  licenseIssueDate: Yup.date().required('License issue date is required'), // New line for date validation
});

const VerifyAdvocate = ({navigation}) => {
  const [licenseIssueDate, setLicenseIssueDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [verifyAdvocate, {isLoading}] = useVerifyAdvocateMutation();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  // Function to handle file picking
  const handleFileUpload = async setFieldValue => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images], // allow only image files
      });
      // Log the entire response to see its structure
      console.log(res); // Check the structure of the response

      const {uri, name, type} = res[0];
      const file = {
        uri,
        name,
        type,
      };
      setSelectedFile(file);
      setFieldValue('selectedFile', file);
      Alert.alert('File selected', `You selected: ${name}`);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('User cancelled the picker');
      } else {
        console.error(err); // Log other errors for debugging
        Alert.alert('Error', 'An error occurred while picking the file.');
      }
    }
  };
  const handleSubmitForm = async values => {
    try {
      const formData = new FormData();

      // Append Bar Council ID
      formData.append('bar_council_license_number', values.barCouncilId);
      formData.append(
        'licenseIssueYear',
        licenseIssueDate.toISOString().split('T')[0],
      );
      // Append the selected file
      formData.append('LicensePic', {
        uri: values.selectedFile.uri,
        name: values.selectedFile.name,
        type: values.selectedFile.type,
      });

      // Send formData via your verifyAdvocate action (ensure it accepts formData)
      const res = await verifyAdvocate(formData).unwrap();
      console.log(res);
      if (res && res.success) {
        // Handle success
        showMessage({
          message: 'Success',
          description: res?.message,
          type: 'success',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
        navigation.navigate(navigationStrings.ADVOCATE_NAVIGATOR);
      } else {
        const errorMsg = res.error?.data?.message || 'Something went wrong!';
        showMessage({
          message: 'Error',
          description: errorMsg,
          type: 'danger',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
      }
    } catch (error) {
      // Handle errors
      console.log(error);
      const errorMsg =
        error?.response?.data?.error?.data?.message || 'Something went wrong!';
      showMessage({
        message: 'Error',
        description: errorMsg,
        type: 'danger',
        titleStyle: {fontFamily: 'Poppins SemiBold'},
        textStyle: {fontFamily: 'Poppins'},
      });
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || licenseIssueDate;
    setShowPicker(false);
    setLicenseIssueDate(currentDate);
  };
  return (
    <>
      <CustomHeader
        title={'Verify Advocate'}
        icon={require('../../../assets/images/back.png')}
      />
      <View style={styles.container}>
        <Formik
          initialValues={{
            barCouncilId: '',
            selectedFile: null,
            licenseIssueDate: null,
          }}
          validationSchema={validationSchema}
          onSubmit={values => handleSubmitForm(values)}>
          {({
            handleChange,
            handleSubmit,
            values,
            setFieldValue,
            errors,
            touched,
          }) => (
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              <View style={{flexGrow: 1}}>
                <Text style={styles.title}>
                  Verify your professionals{'\n'} credientials
                </Text>

                <Text style={styles.inputLabel}>Bar Council ID Number</Text>

                <CustomTextInput
                  placeholder="Ex:- BC123456789IN"
                  value={values.barCouncilId}
                  onChangeText={handleChange('barCouncilId')}
                  inputStyle={{fontFamily: 'Poppins', fontSize: 14}}
                  placeholderTextStyle={{color: '#888'}}
                  keyboardType="default"
                  backgroundColor="#fff"
                  error={touched.barCouncilId && errors.barCouncilId}
                />
                {touched.barCouncilId && errors.barCouncilId && (
                  <Text style={styles.errorText}>{errors.barCouncilId}</Text>
                )}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>License Issue Date</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowPicker(true);
                      setFieldValue('licenseIssueDate', licenseIssueDate); // Set the date in Formik
                    }}
                    style={styles.customButton}>
                    <Text style={styles.buttonText}>
                      {licenseIssueDate
                        ? licenseIssueDate.toDateString()
                        : 'Enter Issue Date'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {showPicker && (
                  <DateTimePicker
                    value={licenseIssueDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      handleDateChange(event, selectedDate);
                      setFieldValue('licenseIssueDate', selectedDate); // Update Formik field
                    }}
                  />
                )}
                {touched.licenseIssueDate && errors.licenseIssueDate && (
                  <Text style={styles.errorText}>
                    {errors.licenseIssueDate}
                  </Text>
                )}
                <Text style={styles.inputLabel}>Upload Council ID Image</Text>

                <TouchableOpacity
                  style={[
                    styles.fileUploadBox,
                    {padding: selectedFile ? null : wp('5%')},
                  ]}
                  onPress={() => handleFileUpload(setFieldValue)}>
                  <Text style={styles.fileUploadText}>
                    {selectedFile ? (
                      <View style={styles.imagePreviewContainer}>
                        <Image
                          source={{uri: selectedFile.uri}}
                          style={styles.imagePreview}
                        />
                        {/* <Text style={styles.fileUploadText}>
                      {selectedFile[0].name}
                    </Text>  */}
                      </View>
                    ) : (
                      <View style={styles.imagePreviewContainer}>
                        <Image
                          source={require('../../../assets/images/upload.png')} // Replace with your dummy image path
                          style={styles.dummyImage}
                        />
                        <Text style={styles.fileUploadText}>
                          Drag & drop files or{' '}
                          <Text style={styles.browse}>Browse</Text>
                        </Text>
                        <Text style={styles.fileSupportedText}>
                          Supported formats: JPEG, PNG
                        </Text>
                      </View>
                    )}
                  </Text>
                </TouchableOpacity>
                {touched.selectedFile && errors.selectedFile && (
                  <Text style={styles.errorText}>{errors.selectedFile}</Text>
                )}
                <View
                  style={{
                    marginTop:
                      touched.selectedFile && errors.selectedFile
                        ? null
                        : hp('5%'),
                    flexDirection: 'row',
                    justifyContent:'space-between'
                  }}>
                  <TouchableOpacity
                    style={styles.skipButton} // Add style for the skip button
                    onPress={() =>
                      navigation.navigate(navigationStrings.ADVOCATE_NAVIGATOR)
                    } // Adjust navigation as per your needs
                  >
                    <Text style={styles.skipButtonText}>Skip</Text>
                  </TouchableOpacity>
                  {/* <CustomButton
                  title="Save"
                  onPress={handleSubmit}
                  loading={isLoading}
                /> */}
                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={handleSubmit}
                    disabled={isLoading}>
                    <LinearGradient
                      colors={['#17316D', '#1262D2']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={styles.button}>
                      <View style={styles.buttonContent}>
                        {isLoading && (
                          <ActivityIndicator
                            size="small"
                            color="#fff"
                            style={styles.loader}
                          />
                        )}
                        <Text style={styles.buttonText1}>{"Save & Next"}</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAwareScrollView>
          )}
        </Formik>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    backgroundColor: '#F3F7FF',
  },

  title: {
    fontSize: wp('4%'),
    marginVertical: 15,
    fontWeight: '500',
    color: '#000',
    fontFamily: 'Poppins',
  },
  inputLabel: {
    fontSize: wp('3.5%'),
    color: '#000',
    marginBottom: 5,
    fontFamily: 'Poppins SemiBold',
  },
  customInputStyle: {
    fontFamily: 'Poppins',
  },
  customPlaceholderStyle: {
    color: '#888',
    fontFamily: 'Poppins',
  },
  fileUploadBox: {
    backgroundColor: '#fff',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#878787',
    borderRadius: wp('1.5%'),
    // padding: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: wp('5%'),
  },
  fileUploadText: {
    fontSize: wp('3%'),
    color: '#0F0F0F',
    fontFamily: 'Poppins',
  },
  browse: {
    color: '#0000FF',
  },
  fileSupportedText: {
    fontSize: wp('2.5%'),
    color: '#999',
    marginTop: 1,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  imagePreviewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('5%'),
  },
  imagePreview: {
    // width: 100,
    width: wp('90%'),
    height: hp('20%'),
    resizeMode: 'cover',
    // marginBottom: hp('1%'),
    borderRadius: wp('1.5%'),
  },
  dummyImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain', // adjust as per your needs
    marginBottom: hp('1%'),
  },
  skipButton: {
    paddingVertical: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('5%'),
    width: wp('46%'),
    borderWidth: 1,
    borderColor: '#17316D',
    borderRadius: wp('2%'),
    // backgroundColor:'red'
  },
  skipButtonText: {
    color: 'gray', // Blue color for the Skip text
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins',
  },
  errorText: {
    color: 'red',
    marginBottom: hp('1.5%'),
    fontFamily: 'Poppins',
  },
  customButton: {
    backgroundColor: '#fff', // Customize the button color
    padding: 10,
    borderRadius: wp('2%'),
    width: wp('90%'),
    marginBottom: hp('2%'),
    fontFamily: 'Poppins',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#7F7F80', // Text color
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: hp('1.5%'),
  },
  buttonWrapper: {
    borderRadius: wp('2%'),
    overflow: 'hidden',
    width: '46%',
    marginTop: hp('5%'),
  },
  button: {
    paddingVertical: hp('2%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row', // Align children horizontally
    alignItems: 'center',  // Center the items vertically
  },
  buttonText1: {
    color: '#fff',
    fontSize: wp('4%'),
    fontFamily: 'Poppins SemiBold',
    marginLeft: 10, // Add some space between the loader and the text
  },
  loader: {
    marginRight: 10, // Space between loader and text
  },
});

export default VerifyAdvocate;
