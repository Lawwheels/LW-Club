import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';
import DocumentPicker from 'react-native-document-picker';
import CustomHeader from '../../../shared/CustomHeader';
import {
  useDeleteUserProfilePicMutation,
  useGetAdviseSeekerQuery,
  useUserProfilePicMutation,
} from '../../redux/api/api';
import CustomDeleteModal from '../../../shared/CustomDeleteModal';
import {useNavigation} from '@react-navigation/native';

const UserProfile = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const {data: userData, isLoading, error} = useGetAdviseSeekerQuery();
  const [userProfilePic] = useUserProfilePicMutation();

  const [deleteUserProfilePic] = useDeleteUserProfilePicMutation();
  const userDetails = userData?.data;
  if (isLoading) {
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
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

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

      const response = await userProfilePic(formData).unwrap();
      console.log('userPic', response);
      if (response && response?.success) {
        showMessage({
          message: 'Success',
          description: response?.message,
          type: 'success',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
      } else {
        const errorMsg =
          response.error?.data?.message || 'Something went wrong!';
        showMessage({
          message: 'Error',
          description: errorMsg,
          type: 'danger',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
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
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
      }
    }
  };
  const handleDeleteProfilePic = async () => {
    try {
      const res = await deleteUserProfilePic().unwrap();
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
  return (
    <>
      <CustomHeader
        title={'My Profile'}
        icon={require('../../../assets/images/back.png')}
      />
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          {/* Profile Header */}

          <View style={styles.subContainer}>
            <View style={styles.profileSection}>
              <Image
                source={
                  userDetails &&
                  userDetails.profilePic &&
                  userDetails?.profilePic?.url
                    ? {uri: userDetails?.profilePic?.url}
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

              <Text style={styles.profileName}>{userDetails?.name}</Text>
            </View>

            {/* Details Section */}
            <View style={styles.detailsSection}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <Text style={styles.title}>Contact Number</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={require('../../../assets/images/profile/callImage.png')}
                      style={{width: 22, height: 24}}
                    />
                    <Text
                      style={[
                        styles.description,
                        {fontSize: wp('4%'), marginLeft: wp(3)},
                      ]}>
                      91+{userDetails?.mobileNumber}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditUserProfile')}>
                  <Image
                    source={require('../../../assets/images/editIcon.png')}
                    style={{width: 20, height: 20}}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.title}>Email Address</Text>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../assets/images/profile/mail.png')}
                  style={{width: 24, height: 24}}
                />
                <Text
                  style={[
                    styles.description,
                    {fontSize: wp('4%'), marginLeft: wp(3)},
                  ]}>
                  {userDetails?.email}
                </Text>
              </View>
              {userDetails?.headLine && (
                <>
                  <Text style={styles.title}>Bio</Text>
                  <Text
                    style={[
                      styles.description,
                      {textAlign: 'justify', fontSize: 14},
                    ]}>
                    {userDetails?.headLine}
                  </Text>
                </>
              )}
              {userDetails?.location?.city && (
                <>
                  <Text style={styles.title}>Address</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={require('../../../assets/images/profile/location.png')}
                      style={{width: 24, height: 24}}
                    />
                    <Text
                      style={[
                        styles.description,
                        {fontSize: wp('4%'), marginLeft: wp(3)},
                      ]}>
                             {`${userDetails.location.city}, ${userDetails.location.state}, ${userDetails.location.country}`}
                    </Text>
                  </View>
                </>
              )}

              {userDetails?.profession_nun_user && (
                <>
                  <Text style={styles.title}>Profession</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={require('../../../assets/images/profile/profession.png')}
                      style={{width: 24, height: 24}}
                    />
                    <Text
                      style={[
                        styles.description,
                        {fontSize: wp('4%'), marginLeft: wp(3)},
                      ]}>
                      {userDetails?.profession_nun_user}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide">
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
                    : userDetails?.profilePic?.url
                    ? {uri: userDetails.profilePic.url} // Use profile picture URL if available
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
        <CustomDeleteModal
          visible={deleteModal}
          onConfirm={handleDeleteProfilePic}
          onCancel={() => setDeleteModal(false)}
          title="Profile Image" // Dynamic title
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingTop: hp('10%'),
    height:hp('82%')
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    borderRadius: wp('1%'),
    backgroundColor: '#E1EBFF',
  },
  profileSection: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: hp('4%'),
    zIndex: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#1262D2',
    borderRadius: 50,
    alignSelf: 'center',
    position: 'absolute', // Absolute positioning for overlapping effect
    top: -50, // Half of the image height to position it halfway outside the container
  },
  profileName: {
    fontSize: wp('4%'),
    color: '#294776',
    fontFamily: 'Poppins SemiBold',
    marginTop: hp('5%'),
    lineHeight: 20,
  },
  detailsSection: {
    backgroundColor: '#F3F7FF',
    borderRadius: wp('1%'),
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  title: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins SemiBold',
    marginBottom: 8,
  },
  description: {
    // fontSize: 14,
    color: '#294776',
    fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: wp('4%'),
    color: '#000',
    fontFamily: 'Poppins SemiBold',
    // marginTop: 10,
  },
  editButton: {
    // position: 'absolute',
    right: -28,
    top: 12,
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
});

export default UserProfile;
