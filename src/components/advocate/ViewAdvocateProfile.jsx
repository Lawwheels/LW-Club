import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';
import DocumentPicker from 'react-native-document-picker';
import {
  useAdvocateCoverPicMutation,
  useAdvocateProfilePicMutation,
  useAdvocateProfileVisibleMutation,
  useDeleteAdvocateCoverPicMutation,
  useDeleteAdvocateProfilePicMutation,
  useGetAdvocateQuery,
  useGetCertificateQuery,
  useDeleteExperienceMutation,
  useDeleteEducationMutation,
  useDeleteCertificateMutation,
} from '../../redux/api/api';
import CustomDeleteModal from '../../../shared/CustomDeleteModal';
import navigationStrings from '../../constants/navigationStrings';

const ViewAdvocateProfile = ({navigation}) => {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Professional');
  const [isModalVisible, setModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCoverImage, setIsCoverImage] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [deleteCoverModal, setDeleteCoverModal] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);
  const [deleteModalEducation, setDeleteModalEducation] = useState(false);
  const [selectedEducationId, setSelectedEducationId] = useState(null);
  const [deleteModalCertificate, setDeleteModalCertificate] = useState(false);
  const [selectedCertificateId, setSelectedCertificateId] = useState(null);
  const [dropdownVisibleIndex, setDropdownVisibleIndex] = useState(null);

  const toggleDropdown = (index) => {
    setDropdownVisibleIndex(dropdownVisibleIndex === index ? null : index);
  };

  const [dropdownVisibleCertificate, setDropdownVisibleCertificate] = useState(null);

  const toggleDropdownCertificate = (index) => {
    setDropdownVisibleCertificate(dropdownVisibleCertificate === index ? null : index);
  };
  const {data, error, isLoading} = useGetAdvocateQuery();
  console.log('data', data);
  // console.log(data?.data[0]?.specialization);
  const {
    data: certificateData,
    error: isError,
    isLoading: certificateLoading,
  } = useGetCertificateQuery();
  const [advocateProfilePic] = useAdvocateProfilePicMutation();
  const [advocateCoverPic] = useAdvocateCoverPicMutation();
  const [deleteAdvocateCoverPic] = useDeleteAdvocateCoverPicMutation();
  const [deleteAdvocateProfilePic] = useDeleteAdvocateProfilePicMutation();
  const [advocateProfileVisible] = useAdvocateProfileVisibleMutation();
  const [deleteExperience] = useDeleteExperienceMutation();

  const [deleteEducation] = useDeleteEducationMutation();

  const [deleteCertificate] = useDeleteCertificateMutation();

  const handleDeleteCertificate = async () => {
    try {
      const res = await deleteCertificate({id: selectedCertificateId}).unwrap();
      console.log(res);

      if (res && res?.success) {
        showMessage({
          message: 'Success',
          description: res.message,
          type: 'success',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
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
      console.error('Failed to delete profile picture: ', error);
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
      setDeleteModalCertificate(false);
    }
  };

  // Function to open delete modal with the specific experience ID
  const openDeleteModalCertificate = certificateId => {
    setSelectedCertificateId(certificateId);
    setDeleteModalCertificate(true);
  };

  const handleDeleteEducation = async () => {
    try {
      const res = await deleteEducation({id: selectedEducationId}).unwrap();
      console.log(res);

      if (res && res?.success) {
        showMessage({
          message: 'Success',
          description: res.message,
          type: 'success',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
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
      console.error('Failed to delete profile picture: ', error);
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
      setDeleteModalEducation(false);
    }
  };

  // Function to open delete modal with the specific education ID
  const openDeleteModalEducation = educationId => {
    setSelectedEducationId(educationId);
    setDeleteModalEducation(true);
  };

  useEffect(() => {
    if (data?.data?.[0]?.isProfileVisible !== undefined) {
      setIsProfileVisible(data.data[0].isProfileVisible);
    }
    if (error) {
      showMessage({
        message: 'Error',
        description: 'Failed to fetch user data.',
        type: 'danger',
      });
    }
  }, [data, error]);
  // Handle loading state
  // console.log('certificate', certificateData);
  if (isLoading || certificateLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle error state
  if (error) {
    console.log(error);
    return <Text>An error occurred: {error.message}</Text>;
  }

  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images], // allow only image files
      });
      console.log(res); // Log the response to check structure

      const {uri, name, type} = res[0];
      const file = {uri, name, type};

      setSelectedFile(file.uri);
      // Create FormData to send to API
      const formData = new FormData();
      formData.append('ProfilePic', {
        uri,
        name,
        type,
      });

      const response = await advocateProfilePic(formData).unwrap();
      console.log('advocatePic', response);
      if (response && response?.success) {
        Alert.alert(`${response?.message}`, `Uploaded: ${name}`);
        console.log('Upload success:', data);
      } else {
        const errorMsg =
          response.error?.data?.message || 'Something went wrong!';
        Alert.alert('Error', errorMsg);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled the picker');
      } else {
        const errorMsg =
          error?.response?.data?.error?.data?.message ||
          'Something went wrong!';
        Alert.alert('Error', errorMsg);
      }
    }
  };

  const handleCoverImage = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images], // allow only image files
      });
      console.log(res); // Log the response to check structure

      const {uri, name, type} = res[0];
      const file = {uri, name, type};

      setCoverFile(file.uri);
      // Create FormData to send to API
      const formData = new FormData();
      formData.append('CoverPic', {
        uri,
        name,
        type,
      });

      const response = await advocateCoverPic(formData).unwrap();
      console.log('coverPic', response);
      if (response && response?.success) {
        showMessage({
          message: 'Success',
          description: `${response?.message}`,
          type: 'success',

          titleStyle: {fontFamily: 'Poppins'}, // Custom heading style
          textStyle: {fontFamily: 'Poppins'},
        });
        console.log('Upload success:', data);
      } else {
        const errorMsg =
          response.error?.data?.message || 'Something went wrong!';
        showMessage({
          message: 'Error',
          description: errorMsg,
          type: 'danger',

          titleStyle: {fontFamily: 'Poppins'}, // Custom heading style
          textStyle: {fontFamily: 'Poppins'},
        });
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled the picker');
      } else {
        const errorMsg =
          error?.response?.data?.error?.data?.message ||
          'Something went wrong!';
        showMessage({
          message: 'Error',
          description: errorMsg,
          type: 'danger',

          titleStyle: {fontFamily: 'Poppins'}, // Custom heading style
          textStyle: {fontFamily: 'Poppins'},
        });
      }
    } finally {
      setIsCoverImage(false);
    }
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const openCoverModal = () => setIsCoverImage(true);
  const closeCoverModal = () => setIsCoverImage(false);

  // const toggleSwitch = async () => {
  //   const newVisibility = !isProfileVisible;
  //   setIsProfileVisible(newVisibility);

  //   try {
  //     // Call the API with the updated visibility value
  //     const res = await advocateProfileVisible({
  //       isProfileVisible: newVisibility,
  //     });
  //     console.log(res);

  //     if (res && res?.data?.success) {
  //       // Success message
  //       showMessage({
  //         message: 'Success',
  //         description: res?.data?.message,
  //         type: 'success',
  //         titleStyle: {fontFamily: 'Poppins SemiBold'},
  //         textStyle: {fontFamily: 'Poppins'},
  //       });
  //     } else {
  //       const errorMsg = res.error?.data?.message || 'Something went wrong!';
  //       setIsProfileVisible(false); // Revert state back to false if there's an error

  //       // Handle specific error messages and navigate accordingly
  //       if (errorMsg === 'NOEXPERIENCE!' || errorMsg === 'NOEDUCATION!') {
  //         showMessage({
  //           message: 'Incomplete Profile',
  //           description:
  //             'Please complete your profile experience and education.',
  //           type: 'warning',
  //           titleStyle: {fontFamily: 'Poppins SemiBold'},
  //           textStyle: {fontFamily: 'Poppins'},
  //         });
  //         navigation.navigate('AdvocateProfile'); // Navigate to AdvocateProfile
  //       } else if (errorMsg === 'NOLICENSE!') {
  //         showMessage({
  //           message: 'License Verification Needed',
  //           description:
  //             'Please verify your license to make your profile visible.',
  //           type: 'warning',
  //           titleStyle: {fontFamily: 'Poppins SemiBold'},
  //           textStyle: {fontFamily: 'Poppins'},
  //         });
  //         navigation.navigate('VerifyAdvocate'); // Navigate to VerifyAdvocate
  //       } else {
  //         // General error message
  //         showMessage({
  //           message: 'Error',
  //           description: errorMsg,
  //           type: 'danger',
  //           titleStyle: {fontFamily: 'Poppins SemiBold'},
  //           textStyle: {fontFamily: 'Poppins'},
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     const errorMsg =
  //       error?.response?.data?.error?.data?.message || 'Something went wrong!';
  //     setIsProfileVisible(false); // Revert state back to false in case of exception
  //     showMessage({
  //       message: 'Error',
  //       description: errorMsg,
  //       type: 'danger',
  //       titleStyle: {fontFamily: 'Poppins SemiBold'},
  //       textStyle: {fontFamily: 'Poppins'},
  //     });
  //   }
  // };
  const toggleSwitch = async () => {
    const newVisibility = !isProfileVisible;
    setIsProfileVisible(newVisibility);
  
    try {
      // Call the API with the updated visibility value
      const res = await advocateProfileVisible({
        isProfileVisible: newVisibility,
      });
      console.log(res);
  
      if (res && res?.data?.success) {
        // Success message
        showMessage({
          message: 'Success',
          description: res?.data?.message,
          type: 'success',
          titleStyle: { fontFamily: 'Poppins SemiBold' },
          textStyle: { fontFamily: 'Poppins' },
        });
      } else {
        const errorMsg = res.error?.data?.message || 'Something went wrong!';
        setIsProfileVisible(false); // Revert state back to false if there's an error
  
        // Handle specific error messages and navigate accordingly
        if (errorMsg === 'NOEXPERIENCE!') {
          showMessage({
            message: 'Incomplete Profile',
            description: 'Please add your experience to complete your profile.',
            type: 'warning',
            titleStyle: { fontFamily: 'Poppins SemiBold' },
            textStyle: { fontFamily: 'Poppins' },
          });
          navigation.navigate('AddExperience'); // Navigate to AddExperience screen
        } else if (errorMsg === 'NOEDUCATION!') {
          showMessage({
            message: 'Incomplete Profile',
            description: 'Please add your education to complete your profile.',
            type: 'warning',
            titleStyle: { fontFamily: 'Poppins SemiBold' },
            textStyle: { fontFamily: 'Poppins' },
          });
          navigation.navigate('AddEducation'); // Navigate to AddEducation screen
        } else if (errorMsg === 'NOLICENSE!') {
          showMessage({
            message: 'License Verification Needed',
            description: 'Please verify your license to make your profile visible.',
            type: 'warning',
            titleStyle: { fontFamily: 'Poppins SemiBold' },
            textStyle: { fontFamily: 'Poppins' },
          });
          navigation.navigate('VerifyAdvocate'); // Navigate to VerifyAdvocate screen
        } else {
          // General error message
          showMessage({
            message: 'Error',
            description: errorMsg,
            type: 'danger',
            titleStyle: { fontFamily: 'Poppins SemiBold' },
            textStyle: { fontFamily: 'Poppins' },
          });
        }
      }
    } catch (error) {
      console.log(error);
      const errorMsg =
        error?.response?.data?.error?.data?.message || 'Something went wrong!';
      setIsProfileVisible(false); // Revert state back to false in case of exception
      showMessage({
        message: 'Error',
        description: errorMsg,
        type: 'danger',
        titleStyle: { fontFamily: 'Poppins SemiBold' },
        textStyle: { fontFamily: 'Poppins' },
      });
    }
  };
  
  const handleGoBack = () => {
    navigation.goBack();
  };

  const TabButton = ({title, active, onPress}) => (
    <TouchableOpacity onPress={onPress} style={styles.tabContainer}>
      <Text style={active ? styles.tabActive : styles.tabInactive}>
        {title}
      </Text>
      <View
        style={active ? styles.activeUnderline : styles.inactiveUnderline}
      />
    </TouchableOpacity>
  );
  function getLastJobTitle(userData) {
    // Check if experiences exist and are not empty
    if (
      userData?.data[0]?.experiences &&
      userData?.data[0]?.experiences?.length > 0
    ) {
      // Get the last experience in the array
      const lastExperience =
        userData?.data[0]?.experiences[
          userData?.data[0]?.experiences?.length - 1
        ];

      // Return the jobTitle
      return lastExperience.jobTitle;
    } else {
      return 'No experiences found.'; // Return a fallback value if no experiences are present
    }
  }

  const handleDeleteProfilePic = async () => {
    try {
      const res = await deleteAdvocateProfilePic().unwrap();
      console.log(res);

      if (res && res?.success) {
        showMessage({
          message: 'Success',
          description: res.message,
          type: 'success',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
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
      console.error('Failed to delete profile picture: ', error);
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
      setDeleteModal(false);
      setModalVisible(false);
    }
  };

  const handleDeleteCoverPic = async () => {
    try {
      const res = await deleteAdvocateCoverPic().unwrap();
      console.log(res);

      if (res && res?.success) {
        showMessage({
          message: 'Success',
          description: res.message,
          type: 'success',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
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
      console.error('Failed to delete profile picture: ', error);
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
      setDeleteCoverModal(false);
      setIsCoverImage(false);
    }
  };
  const formatDate = dateString => {
    if (!dateString) return 'N/A'; // Return 'N/A' if dateString is falsy

    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date)) return 'N/A';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDeleteExperience = async () => {
    try {
      const res = await deleteExperience({id: selectedExperienceId}).unwrap();
      console.log(res);

      if (res && res?.success) {
        showMessage({
          message: 'Success',
          description: res.message,
          type: 'success',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
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
      console.error('Failed to delete profile picture: ', error);
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
      setDeleteModalVisible(false);
    }
  };

  // Function to open delete modal with the specific experience ID
  const openDeleteModal = experienceId => {
    setSelectedExperienceId(experienceId);
    setDeleteModalVisible(true);
  };
  return (
    <>
      <ScrollView style={styles.container}>
        <ImageBackground
          source={
            data && data?.data[0]?.coverPic && data?.data[0]?.coverPic?.url
              ? {uri: data?.data[0]?.coverPic?.url}
              : {
                  uri: 'https://plus.unsplash.com/premium_photo-1698084059560-9a53de7b816b?q=80&w=2911&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                }
          }
          style={styles.coverImage}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Image
              source={require('../../../assets/images/icons/whiteArrow.png')}
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity>

          {/* Profile Image and Consultancy Button */}
          <View style={styles.overlayContainer}>
            <View style={styles.profileContainer}>
              <Image
                source={
                  data &&
                  data?.data[0]?.profilePic &&
                  data?.data[0]?.profilePic?.url
                    ? {uri: data?.data[0]?.profilePic?.url}
                    : require('../../../assets/images/avatar.png')
                }
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.editButton} onPress={openModal}>
                <Image
                  source={require('../../../assets/images/edit-2.png')}
                  style={{width: 20, height: 20}}
                />
              </TouchableOpacity>
            </View>

            <View style={{marginTop: hp(2)}}>
              <View style={styles.starRating}>
                {/* <Text style={styles.stars}>★★★★★</Text> */}
                <View style={styles.starsContainer}>
                  {[...Array(5)].map((_, index) => (
                    <Image
                      key={index}
                      source={require('../../../assets/images/star.png')}
                      style={styles.starImage}
                    />
                  ))}
                </View>
                <Text style={styles.ratingText}>5/5</Text>
              </View>
            </View>
          </View>

          {/* Update Cover Image Label */}
          <TouchableOpacity
            style={styles.updateCoverLabel}
            onPress={openCoverModal}>
            <Image
              source={require('../../../assets/images/icons/edit.png')} // Path to the profile image
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
        </ImageBackground>
        <View style={{backgroundColor: '#F3F7FF'}}>
          {/* Profile Info Section */}
          <View style={styles.infoContainer}>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.name}>{data && data?.data[0]?.name}</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('UpdateBio')}>
                  <Image
                    source={require('../../../assets/images/icons/edit.png')} // Path to the profile image
                    style={{
                      width: 18,
                      height: 18,
                      marginTop: 10,
                      marginLeft: 5,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.role}>{getLastJobTitle(data)}</Text>

              {data && data?.data[0]?.headLine && (
                <View style={{marginTop: hp(0.7), paddingHorizontal: wp(1)}}>
                  <Text
                    style={{
                      color: '#294776',
                      fontFamily: 'Poppins SemiBold',
                      fontSize: wp('4.5%'),
                    }}>
                    Bio
                  </Text>
                  <Text style={styles.bio}>
                    {data && data?.data[0]?.headLine}
                  </Text>
                </View>
              )}
            </View>
            <View>
              <Switch
                trackColor={{false: '#767577', true: '#1262D2'}}
                thumbColor={isProfileVisible ? '#ffffff' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isProfileVisible}
              />
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {data && data.data[0]?.experience_year
                  ? `${data.data[0].experience_year} years`
                  : '0 years'}
              </Text>

              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.verticalLine} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {data && data.data[0]?.total_cases
                  ? `${data.data[0].total_cases} Cases`
                  : '0 Cases'}
              </Text>

              <Text style={styles.statLabel}>Cases</Text>
            </View>
            <View style={styles.verticalLine} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>47 Booking</Text>
              <Text style={styles.statLabel}>Session Done</Text>
            </View>
          </View>

          {/* Tabs Section */}
          <View style={styles.tabsContainer}>
            <TabButton
              title="Professional Details"
              active={activeTab === 'Professional'}
              onPress={() => setActiveTab('Professional')}
            />
            <TabButton
              title="Educational Details"
              active={activeTab === 'Educational'}
              onPress={() => setActiveTab('Educational')}
            />
          </View>
          {activeTab === 'Professional' && (
            <>
              <View style={styles.detailsContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: hp('3%'),
                  }}>
                  <Text style={styles.sectionTitle}>Practice Area</Text>
                  {/* <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {data && data?.data[0]?.userPracticeAreas?.length !== 0 ? (
                      <TouchableOpacity
                        style={{marginRight: 5}}
                        onPress={() =>
                          navigation.navigate(
                            navigationStrings.VIEW_ALL_PRACTICE_AREA,
                          )
                        }>
                        <Image
                          source={require('../../../assets/images/icons/edit.png')} // Path to the profile image
                          style={{width: 22, height: 22}}
                        />
                      </TouchableOpacity>
                    ) : null}

                    <TouchableOpacity
                      onPress={() => navigation.navigate('AdvocateProfile')}>
                      <Image
                        source={require('../../../assets/images/icons/add-square.png')} // Path to the profile image
                        style={{width: 22, height: 22}}
                      />
                    </TouchableOpacity>
                  </View> */}
                </View>

                <View style={styles.practiceArea}>
                  {data &&
                  data.data[0]?.userPracticeAreas &&
                  data.data[0].userPracticeAreas?.length > 0 ? (
                    <View style={styles.practiceAreaRow}>
                      {data.data[0].userPracticeAreas.map((item, index) => (
                        <Text key={index} style={styles.practiceItem}>
                          {item.name}
                        </Text>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.notFoundMessage}>
                      No practice areas found
                    </Text>
                  )}
                </View>

                <Text style={styles.sectionTitle}>Professional Details</Text>
                <View
                  style={{
                    backgroundColor: '#fff',
                    padding: wp('6.2%'),
                    borderRadius: wp('2.5%'),
                    marginBottom: hp(2),
                  }}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>
                      Bar Association Number
                    </Text>
                    <Text style={styles.detailValue}>
                      {' '}
                      {(data && data?.data[0]?.bar_council_license_number) ||
                        'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Year Licensed</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(data?.data[0]?.licenseIssueYear)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Specialization</Text>
                    <Text style={styles.detailValue}>
                      {' '}
                      {(data && data?.data[0]?.specialization[0]?.name) ||
                        'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Language Spoken</Text>
                    <Text style={styles.detailValue}>
                      {(data && data?.data[0]?.language?.join(', ')) || 'N/A'}
                    </Text>
                  </View>
                </View>
                {/* Professional Experience Section */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.sectionTitle}>
                    Professional Experience
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('AddExperience')}>
                      <Image
                        source={require('../../../assets/images/icons/add-square.png')} // Path to the profile image
                        style={{width: 22, height: 22}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {renderExperiences(
                  data && data?.data[0]?.experiences,
                  navigation,
                  openDeleteModal,
                  dropdownVisibleIndex, setDropdownVisibleIndex,toggleDropdown
                )}
                <CustomDeleteModal
                  visible={deleteModalVisible}
                  onConfirm={handleDeleteExperience}
                  onCancel={() => setDeleteModalVisible(false)}
                  title="Experience"
                />
                <View
                  style={{
                    marginTop: hp('3%'),
                  }}>
                  <Text style={styles.sectionTitle}>Specialization</Text>
                </View>
                <View style={styles.practiceArea}>
                  {data &&
                  data.data[0]?.specialization &&
                  data.data[0].specialization?.length > 0 ? (
                    <View style={styles.practiceAreaRow}>
                      {data.data[0].specialization.map((item, index) => {
                        // console.log(item);
                        return (
                          <Text key={index} style={styles.practiceItem}>
                            {item.name}
                          </Text>
                        );
                      })}
                    </View>
                  ) : (
                    <Text style={styles.notFoundMessage}>
                      No specialization found
                    </Text>
                  )}
                </View>
              </View>
            </>
          )}
          {activeTab === 'Educational' && (
            <>
              <View style={{padding: wp('5%')}}>
                {/* Advocate skills */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: hp('3%'),
                  }}>
                  <Text style={styles.sectionTitle}>Skills</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {data && data?.data[0]?.userSkills?.length !== 0 ? (
                      <TouchableOpacity
                        style={{marginRight: 5}}
                        onPress={() =>
                          navigation.navigate(
                            navigationStrings.VIEW_ALL_PRACTICE_AREA,
                          )
                        }>
                        <Image
                          source={require('../../../assets/images/icons/edit.png')} // Path to the profile image
                          style={{width: 22, height: 22}}
                        />
                      </TouchableOpacity>
                    ) : null}

                    <TouchableOpacity
                      onPress={() => navigation.navigate('AddSkill')}>
                      <Image
                        source={require('../../../assets/images/icons/add-square.png')} // Path to the profile image
                        style={{width: 22, height: 22}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.practiceArea}>
                  {data &&
                  data.data[0]?.userSkills &&
                  data.data[0].userSkills?.length > 0 ? (
                    <View style={styles.practiceAreaRow}>
                      {data.data[0].userSkills.map((item, index) => {
                        // console.log(item);
                        return (
                          <Text key={index} style={styles.practiceItem}>
                            {item.skillName}
                          </Text>
                        );
                      })}
                    </View>
                  ) : (
                    <Text style={styles.notFoundMessage}>No skills found</Text>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.sectionTitle}>Educational Details</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('AddEducation')}>
                      <Image
                        source={require('../../../assets/images/icons/add-square.png')} // Path to the profile image
                        style={{width: 22, height: 22}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {renderEducations(
                  data && data?.data[0]?.educations,
                  navigation,
                  openDeleteModalEducation,
                  dropdownVisibleIndex,setDropdownVisibleIndex, toggleDropdown
                )}
                <CustomDeleteModal
                  visible={deleteModalEducation}
                  onConfirm={handleDeleteEducation}
                  onCancel={() => setDeleteModalEducation(false)}
                  title="Education"
                />
              </View>
              <View style={{paddingHorizontal: wp('5%')}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.sectionTitle}>Certificates</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('AddCertificate')}>
                      <Image
                        source={require('../../../assets/images/icons/add-square.png')} // Path to the profile image
                        style={{width: 22, height: 22}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {renderCertificate(
                  certificateData && certificateData?.data,
                  navigation,
                  openDeleteModalCertificate,
                  dropdownVisibleCertificate,setDropdownVisibleCertificate, toggleDropdownCertificate
                )}
                <CustomDeleteModal
                  visible={deleteModalCertificate}
                  onConfirm={handleDeleteCertificate}
                  onCancel={() => setDeleteModalCertificate(false)}
                  title="Certificate"
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          <View style={styles.modalContent}>
            <Image
              source={
                selectedFile
                  ? {uri: selectedFile} // Use selected file if it exists
                  : data && data?.data[0]?.profilePic?.url
                  ? {uri: data.data[0].profilePic.url} // Use profile picture URL if available
                  : require('../../../assets/images/avatar.png') // Default avatar image if none are available
              }
              style={{width: 200, height: 200, borderRadius: 100}} // Adjust styles as needed
            />
          </View>

          {/* Bottom Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={handleFileUpload}>
              <Image
                source={require('../../../assets/images/edit-2.png')}
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: 'center',
                  marginBottom: 5,
                }}
              />
              <Text style={styles.modalButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFileUpload}>
              <Image
                source={require('../../../assets/images/add-square.png')}
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: 'center',
                  marginBottom: 5,
                }}
              />
              <Text style={styles.modalButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteModal(true)}>
              <Image
                source={require('../../../assets/images/trash.png')}
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: 'center',
                  marginBottom: 5,
                }}
              />
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        animationType="slide"
        visible={deleteModal}
        onRequestClose={() => setDeleteModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.deleteContent}>
            <Text style={styles.deleteTitle}>Delete Profile Picture</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete your profile picture?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleDeleteProfilePic}>
                <Text style={styles.buttonText}>Yes, Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setDeleteModal(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={isCoverImage} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeCoverModal}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          <View style={styles.modalContent}>
            <Image
              source={
                coverFile
                  ? {uri: coverFile} // Use selected file if it exists
                  : data && data?.data[0]?.coverPic?.url
                  ? {uri: data.data[0].coverPic.url} // Use profile picture URL if available
                  : {
                      uri: 'https://plus.unsplash.com/premium_photo-1698084059560-9a53de7b816b?q=80&w=2911&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    } // Default avatar image if none are available
              }
              style={{width: 300, height: 250, borderRadius: 10}} // Adjust styles as needed
            />
          </View>

          {/* Bottom Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={handleCoverImage}>
              <Image
                source={require('../../../assets/images/edit-2.png')}
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: 'center',
                  marginBottom: 5,
                }}
              />
              <Text style={styles.modalButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCoverImage}>
              <Image
                source={require('../../../assets/images/add-square.png')}
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: 'center',
                  marginBottom: 5,
                }}
              />
              <Text style={styles.modalButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteCoverModal(true)}>
              <Image
                source={require('../../../assets/images/trash.png')}
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: 'center',
                  marginBottom: 5,
                }}
              />
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CustomDeleteModal
        visible={deleteCoverModal}
        onConfirm={handleDeleteCoverPic}
        onCancel={() => setDeleteCoverModal(false)}
        title="Cover Image" // Dynamic title
      />
    </>
  );
};

// const renderExperiences = experiences => {
//   if (!experiences || experiences.length === 0) {
//     return <Text style={styles.noExperienceMessage}>No experience added</Text>;
//   }
//   function formatDate(dateString) {
//     // Create a new Date object from the date string
//     const date = new Date(dateString);

//     // Define options for formatting
//     const options = {year: 'numeric', month: 'long', day: 'numeric'};

//     // Format the date using toLocaleDateString
//     return date.toLocaleDateString('en-US', options);
//   }
//   // Sort experiences by createdAt (newest first)
//   const sortedExperiences = [...experiences].sort((a, b) => {
//     return new Date(b.createdAt) - new Date(a.createdAt);
//   });

//   return sortedExperiences.map((experience, index) => {
//     const {
//       jobTitle,
//       firmName,
//       startDate,
//       endDate,
//       isOngoing,
//       isRecent,
//       description,
//     } = experience;

//     // Format the dates
//     const formattedStartDate = `${formatDate(startDate)}`;
//     const formattedEndDate = isOngoing ? 'Present' : `${formatDate(endDate)}`;

//     return (
//       <View key={index} style={styles.experienceItem}>
//         <Text style={styles.experiencePeriod}>
//           {formattedStartDate} - {formattedEndDate}
//         </Text>

//         <Text style={styles.experienceTitle}>
//           {jobTitle}, {firmName}
//         </Text>

//         <Text style={styles.experienceDetail}>{description}</Text>
//       </View>
//     );
//   });
// };

const renderExperiences = (experiences, navigation, openDeleteModal, dropdownVisibleIndex,setDropdownVisibleIndex, toggleDropdown) => {

  // Sort experiences by createdAt (newest first)
  const sortedExperiences = [...experiences].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  function formatDate(dateString) {
    // Create a new Date object from the date string
    const date = new Date(dateString);

    // Define options for formatting
    const options = {year: 'numeric', month: 'long', day: 'numeric'};

    // Format the date using toLocaleDateString
    return date.toLocaleDateString('en-US', options);
  }
  return sortedExperiences.map((experience, index) => {
    const {
      _id,
      jobTitle,
      firmName,
      startDate,
      endDate,
      isOngoing,
      isRecent,
      description,
    } = experience;

    // Format the dates
    const formattedStartDate = `${formatDate(startDate)}`;
    const formattedEndDate = isOngoing ? 'Present' : `${formatDate(endDate)}`;

    return (
      <View key={index} style={styles.experienceItem}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.experiencePeriod}>
            {formattedStartDate} - {formattedEndDate}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => toggleDropdown(index)}>
              <Image
                source={require('../../../assets/images/3dots.png')} // Replace with the 3-dot icon
                style={{width: 22, height: 22}}
              />
            </TouchableOpacity>
            {dropdownVisibleIndex === index && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  // style={{marginRight: 5}}
                  // onPress={() => navigation.navigate('EditExperience', {id: _id})}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setDropdownVisibleIndex(null);
                    navigation.navigate('EditExperience', {id: _id});
                  }}>
                  <Image
                    source={require('../../../assets/images/icons/edit.png')} // Path to the profile image
                    style={{width: 22, height: 22}}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => {
                    setDropdownVisibleIndex(null);
                    openDeleteModal(_id);
                  }}
                  // onPress={() => openDeleteModal(_id)}
                >
                  <Image
                    source={require('../../../assets/images/icons/trash.png')} // Path to the profile image
                    style={{width: 22, height: 22}}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.experienceTitle}>
          {jobTitle}, {firmName}
        </Text>

        <Text style={styles.experienceDetail}>{description}</Text>
      </View>
    );
  });
};
// const renderEducations = educations => {
//   if (!educations || educations.length === 0) {
//     return <Text style={styles.noExperienceMessage}>No education added</Text>;
//   }
//   function formatDate(dateString) {
//     // Create a new Date object from the date string
//     const date = new Date(dateString);

//     // Define options for formatting
//     const options = {year: 'numeric', month: 'long', day: 'numeric'};

//     // Format the date using toLocaleDateString
//     return date.toLocaleDateString('en-US', options);
//   }
//   // Create a shallow copy and sort by createdAt (newest first)
//   const sortedEducations = [...educations].sort((a, b) => {
//     return new Date(b.createdAt) - new Date(a.createdAt);
//   });

//   return sortedEducations.map((education, index) => {
//     const {
//       school_university,
//       degreeType,
//       fieldOfStudy,
//       startDate,
//       endDate,
//       isOngoing,
//       activities,
//     } = education;

//     // Format the dates
//     const formattedStartDate = `${formatDate(startDate)}`;
//     const formattedEndDate = isOngoing ? 'Present' : `${formatDate(endDate)}`;

//     return (
//       <View key={education._id} style={styles.experienceItem}>
//         <Text style={styles.experiencePeriod}>
//           {formattedStartDate} - {formattedEndDate}
//         </Text>

//         {/* Display education details */}
//         <Text style={styles.experienceTitle}>
//           {degreeType} in {fieldOfStudy}, {school_university}
//         </Text>

//         <Text style={styles.experienceDetail}>
//           Studied {fieldOfStudy}, with a focus on {degreeType}. Activities:{' '}
//           {activities}
//         </Text>
//       </View>
//     );
//   });
// };
const renderEducations = (educations, navigation, openDeleteModalEducation, dropdownVisibleIndex, setDropdownVisibleIndex,toggleDropdown) => {
 
  if (!educations || educations.length === 0) {
    return <Text style={styles.noExperienceMessage}>No education added</Text>;
  }
  function formatDate(dateString) {
    // Create a new Date object from the date string
    const date = new Date(dateString);

    // Define options for formatting
    const options = {year: 'numeric', month: 'long', day: 'numeric'};

    // Format the date using toLocaleDateString
    return date.toLocaleDateString('en-US', options);
  }
  // Create a shallow copy and sort by createdAt (newest first)
  const sortedEducations = [...educations].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return sortedEducations.map((education, index) => {
    const {
      _id,
      school_university,
      degreeType,
      fieldOfStudy,
      startDate,
      endDate,
      isOngoing,
      activities,
      description,
    } = education;

    // Format the dates
    const formattedStartDate = `${formatDate(startDate)}`;

    const formattedEndDate = isOngoing ? 'Present' : `${formatDate(endDate)}`;

    return (
      <View key={_id} style={styles.experienceItem}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.experiencePeriod}>
            {formattedStartDate} - {formattedEndDate}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => toggleDropdown(index)}>
              <Image
                source={require('../../../assets/images/3dots.png')} // Replace with the 3-dot icon
                style={{width: 22, height: 22}}
              />
            </TouchableOpacity>
            {dropdownVisibleIndex === index && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  // style={{marginRight: 5}}
                  // onPress={() => navigation.navigate('EditEducation', {id: _id})}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setDropdownVisibleIndex(null);
                    navigation.navigate('EditEducation', {id: _id});
                  }}>
                  <Image
                    source={require('../../../assets/images/icons/edit.png')} // Path to the profile image
                    style={{width: 22, height: 22}}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => {
                    setDropdownVisibleIndex(null);
                    openDeleteModalEducation(_id);
                  }}
                  //  onPress={() => openDeleteModalEducation(_id)}
                >
                  <Image
                    source={require('../../../assets/images/icons/trash.png')} // Path to the profile image
                    style={{width: 22, height: 22}}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        {/* Display education details */}
        <Text style={styles.experienceTitle}>
          {degreeType} in {fieldOfStudy}, {school_university}
        </Text>

        <Text style={styles.experienceDetail}>
          Studied {fieldOfStudy}, with a focus on {degreeType}. Activities:{' '}
          {activities}
        </Text>
      </View>
    );
  });
};
// const renderCertficate = certificates => {
//   if (!certificates || certificates.length === 0) {
//     return <Text style={styles.noExperienceMessage}>No certificate added</Text>;
//   }

//   function formatDate(dateString) {
//     // Create a new Date object from the date string
//     const date = new Date(dateString);

//     // Define options for formatting
//     const options = {year: 'numeric', month: 'long', day: 'numeric'};

//     // Format the date using toLocaleDateString
//     return date.toLocaleDateString('en-US', options);
//   }

//   // Sort experiences by createdAt (newest first)
//   const sortedCertificate = [...certificates].sort((a, b) => {
//     return new Date(b.createdAt) - new Date(a.createdAt);
//   });

//   return sortedCertificate.map((certificate, index) => {
//     const {issueDate, certificate_name, firmName, certificate_number} =
//       certificate;

//     // Format the dates

//     return (
//       <View key={index} style={styles.experienceItem}>
//         <Text style={styles.experiencePeriod}>
//           Issue Date: {formatDate(issueDate)}
//         </Text>

//         <Text style={styles.experienceTitle}>{certificate_name}</Text>
//         <Text style={styles.experienceDetail}>
//           Certificate Number: {certificate_number}
//         </Text>
//         <Text style={styles.experienceDetail}>Issued by: {firmName}</Text>
//       </View>
//     );
//   });
// };

const renderCertificate = (
  certificates,
  navigation,
  openDeleteModalCertificate,
  dropdownVisibleCertificate, setDropdownVisibleCertificate,toggleDropdownCertificate
) => {

  if (!certificates || certificates.length === 0) {
    return <Text style={styles.noExperienceMessage}>No certificate added</Text>;
  }
  function formatDate(dateString) {
    // Create a new Date object from the date string
    const date = new Date(dateString);

    // Define options for formatting
    const options = {year: 'numeric', month: 'long', day: 'numeric'};

    // Format the date using toLocaleDateString
    return date.toLocaleDateString('en-US', options);
  }

  // Sort experiences by createdAt (newest first)
  const sortedCertificate = [...certificates].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return sortedCertificate.map((certificate, index) => {
    const {_id, issueDate, certificate_name, firmName, certificate_number} =
      certificate;

    return (
      <View key={_id} style={styles.experienceItem}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.experiencePeriod}>
            Issue Date: {formatDate(issueDate)}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => toggleDropdownCertificate(index)}>
              <Image
                source={require('../../../assets/images/3dots.png')}
                style={{width: 22, height: 22}}
              />
            </TouchableOpacity>
            {dropdownVisibleCertificate === index && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  // style={{marginRight: 5}}
                  // onPress={() => navigation.navigate('EditCertificate', {id: _id})}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setDropdownVisibleCertificate(null);
                    navigation.navigate('EditCertificate', {id: _id});
                  }}>
                  <Image
                    source={require('../../../assets/images/icons/edit.png')} // Path to the profile image
                    style={{width: 22, height: 22}}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  // onPress={() => openDeleteModalCertificate(_id)}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setDropdownVisibleCertificate(null);
                    openDeleteModalCertificate(_id);
                  }}>
                  <Image
                    source={require('../../../assets/images/icons/trash.png')} // Path to the profile image
                    style={{width: 22, height: 22}}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.experienceTitle}>{certificate_name}</Text>
        <Text style={styles.experienceDetail}>
          Certificate Number: {certificate_number}
        </Text>

        <Text style={styles.experienceDetail}>Issued by: {firmName}</Text>
      </View>
    );
  });
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F9F9F9',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  coverImage: {
    width: wp(100),
    height: hp(28),
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: hp('5%'),
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  overlayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: -68,
    zIndex: 1,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#1262D2',
  },
  consultButton: {
    paddingVertical: hp(1.5),
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  consultButtonText: {
    color: '#F3F7FF',
    fontSize: 14,
    fontFamily: 'Poppins SemiBold',
    fontWeight: '600',
    marginLeft: 10,
  },
  ratingText: {
    // marginLeft: 2,
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: hp('0.2%'),
    borderRadius: 12,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#1262D2',
  },
  starRating: {
    flexDirection: 'row',
    marginVertical: hp('1%'),
    marginHorizontal: 5,
    justifyContent: 'flex-end',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 5, // Adjust as needed
  },
  starImage: {
    width: 18, // Adjust to your image size
    height: 18, // Adjust to your image size
    marginRight: 2,
  },
  infoContainer: {
    alignItems: 'left',
    marginTop: hp('12%'),
    marginBottom: hp(2),
    paddingHorizontal: wp('5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: wp('6.5%'),
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
    lineHeight: 40,
  },
  role: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins',
    color: '#75797E',
    lineHeight: 20,
  },

  bio: {
    fontSize: wp('3.2%'),
    color: '#75797E',
    fontFamily: 'Poppins',
    fontWeight: '400',
    marginVertical: hp(0.4),
    lineHeight: 20,
    textAlign: 'justify',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: wp('5%'),
    backgroundColor: '#fff',
  },
  stat: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: wp('4%'),
    color: '#294776',
    fontFamily: 'Poppins SemiBold',
    lineHeight: 18,
  },
  statLabel: {
    fontSize: wp('4%'),
    color: '#294776',
    fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: 22,
  },
  verticalLine: {
    width: 1,
    height: 50,
    backgroundColor: '#989898',
    marginHorizontal: wp('1%'),
  },
  tabsContainer: {
    width: wp(100),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#E4EEFC',
    paddingVertical: 15,
  },
  tabContainer: {
    alignItems: 'center',
  },
  tabActive: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: '#1262D2',
    textAlign: 'center',
  },
  tabInactive: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: '#939393',
    textAlign: 'center',
  },
  activeUnderline: {
    height: 2,
    backgroundColor: '#1262D2',
    width: '100%',
    // marginTop: 5,
  },
  inactiveUnderline: {
    height: 2,
    backgroundColor: '#E4EEFC',
    width: '100%',
    marginTop: 5,
  },
  detailsContainer: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
  },
  sectionTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
    marginBottom: hp('1%'),
  },
  practiceArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: hp('2%'),
  },
  practiceItem: {
    backgroundColor: '#fff',
    padding: wp('2%'),
    height: hp('4.2%'),
    borderRadius: wp('2%'),
    marginRight: wp('1.5%'),
    marginBottom: hp('1.5%'),
    fontSize: wp('2.91%'),
    fontFamily: 'Poppins',
    color: '#000',
    fontWeight: '400',
    // flexBasis: '30%', // Take up roughly a third of the row
    // overflow: 'hidden', // Hide overflow text
    // textOverflow: 'ellipsis', // Use ellipsis for overflow text
    // whiteSpace: 'nowrap',
    textAlign: 'center',
  },
  practiceAreaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow items to wrap to the next line if needed
    justifyContent: 'flex-start', // Align items to the start
  },

  detailItem: {
    marginBottom: hp('1%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins',
    color: '#294776',
    fontWeight: '400',
  },
  detailValue: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins',
    color: '#294776',
    fontWeight: '400',
  },
  experienceItem: {
    backgroundColor: '#fff',
    padding: wp('4.5%'),
    borderRadius: wp('4%'),
    marginBottom: hp('1%'),
    position: 'relative',
  },
  experienceTitle: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
  },
  experiencePeriod: {
    fontSize: wp('4%'),
    color: '#000',
    fontFamily: 'Poppins SemiBold',
    width: wp('70%'),
    marginVertical: 5,
  },
  experienceDetail: {
    fontSize: wp('3.5%'),
    color: '#636363',
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  profileContainer: {
    position: 'relative', // To allow absolute positioning of the edit button
    width: 100, // Adjust to fit your layout
    height: 100,
    marginRight: wp('20%'),
  },

  editButton: {
    position: 'absolute',
    right: -8,
    bottom: 5,
    backgroundColor: '#00000080', // Semi-transparent background for visibility
    borderRadius: 12,
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {fontSize: 18, color: '#000'},
  modalContent: {
    alignItems: 'center',
    padding: 20,
  },
  modalImage: {width: 200, height: 200, borderRadius: 100},
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: hp('8%'),
    paddingBottom: 10,
  },
  modalButtonText: {color: '#fff', fontSize: 18, fontFamily: 'Poppins'},
  modalMessage: {
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  deleteContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Poppins SemiBold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  updateCoverLabel: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  updateCoverText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
  noExperienceMessage: {
    fontSize: 16,
    color: '#888', // Example color
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  notFoundMessage: {
    fontSize: 16,
    color: '#888', // Example color
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  dropdown: {
    position: 'absolute',
    top: 25, // Adjust as needed
    right: 0,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 5,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    zIndex: 10,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
});

export default ViewAdvocateProfile;
