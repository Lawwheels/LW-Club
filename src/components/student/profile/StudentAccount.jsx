import React,{useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import CustomHeader from '../../../../shared/CustomHeader';
import {logoutUser} from '../../../redux/reducers/auth/authSlice';
import {CommonActions} from '@react-navigation/native';
import {useGetStudentQuery} from '../../../redux/api/api';
import {handleError} from '../../../../shared/authUtils';

const StudentAccount = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const {data, error, isLoading, refetch} = useGetStudentQuery();

  const pullMe = async () => {
    try {
      setRefresh(true);
      await Promise.all([refetch()]);
    } catch (error) {
      console.error('Error during refetch:', error); // Handle errors if needed
    } finally {
      setRefresh(false); // Hide the refresh indicator after both data are fetched
    }
  };

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
    handleError(error);
    // Show the flash message
    showMessage({
      message: `An error occurred: ${error?.error}`,
      type: 'danger',
      titleStyle: {fontFamily: 'Poppins'},
      style: {backgroundColor: 'red'},
    });

    return (
      <Text
        style={{
          fontFamily: 'Poppins',
          color: 'red',
        }}>{`An error Occured ${error?.error}`}</Text>
    );
  }

  const handleLogout = async () => {
    setModalVisible(false);
    await dispatch(logoutUser()); // Clear auth state
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'authStack'}],
      }),
    );
  };
  return (
    <View style={{paddingTop: hp('2.5%'), flex: 1, backgroundColor: '#F3F7FF'}}>
      <CustomHeader
        title={'My Account'}
        icon={require('../../../../assets/images/back.png')}
      />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={pullMe} />
        }>
        {/* User Profile Section */}
        <LinearGradient
          colors={['#1262D2', '#17316D']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.profileCard}>
          <View style={styles.profileDetails}>
            <Image
              source={
                data && data?.data[0]?.profilePic && data.data[0].profilePic.url
                  ? {uri: data.data[0].profilePic.url}
                  : {
                      uri: 'https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg',
                    }
              }
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.profileName}>
                {data && data?.data[0]?.name}
              </Text>
              <Text style={styles.profileTitle}>
                {data && data?.data[0]?.email}
              </Text>
            </View>
          </View>
          {/* <TouchableOpacity style={styles.viewProfileButton}>
            <Text style={styles.viewProfileText}>
              View Your {'\n'}Social Handle
            </Text>
            <Image
              source={require('../../../assets/images/icons/arrow-right.png')} // Path to the profile image
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity> */}
        </LinearGradient>

        {/* Profile Actions */}

        <View style={styles.actionsRow}>
          <View
            style={[
              styles.cardContainer,
              {paddingHorizontal: 10, paddingVertical: 5},
            ]}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('ViewStudentProfile')}>
              <Image
                source={require('../../../../assets/images/icons/edit.png')} // Path to the profile image
                style={{width: 24, height: 24}}
              />
              <Text style={[styles.actionText, {color: '#294776'}]}>
                My Profile
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.cardContainer,
              {paddingHorizontal: 15, paddingVertical: 5},
            ]}>
            <TouchableOpacity
              style={styles.actionButton}
            //   onPress={handleLogout}
            onPress={() => setModalVisible(true)}
              >
              <Image
                source={require('../../../../assets/images/icons/logout.png')} // Path to the profile image
                style={{width: 24, height: 24}}
              />
              <Text style={[styles.actionText, {color: 'red'}]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Settings */}
        <View>
          <Text style={styles.sectionTitle}>Your App</Text>
          <View style={styles.menuItemContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              // onPress={()=>navigation.navigate("Notification")}
            >
              <Image
                source={require('../../../../assets/images/account/export.png')} // Path to the profile image
                style={{width: 24, height: 24}}
              />
              <Text style={styles.menuText}>Share The Application</Text>
              <Image
                source={require('../../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <View style={styles.horizontalLine} />
            <TouchableOpacity
              style={styles.menuItem}
              //  onPress={()=>navigation.navigate("UserBooking")}
            >
              <Image
                source={require('../../../../assets/images/account/like-shapes.png')} // Path to the profile image
                style={{width: 30, height: 30}}
              />
              <Text style={styles.menuText1}>Rate The Application</Text>
              <Image
                source={require('../../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <View style={styles.horizontalLine} />
            <View style={styles.menuItem}>
              <Image
                source={require('../../../../assets/images/account/global.png')} // Path to the profile image
                style={styles.icon}
              />
              <Text style={styles.menuText}>Language</Text>
              <Image
                source={require('../../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.menuItem}>
              <Image
                source={require('../../../../assets/images/account/setting-2.png')} // Path to the profile image
                style={styles.icon}
              />
              <Text style={styles.menuText}>Settings</Text>
              <Image
                source={require('../../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </View>
          </View>
        </View>

        {/* More Information */}
        <View>
          <Text style={styles.sectionTitle}>More Information</Text>
          <View style={styles.menuItemContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('AboutUs')}>
              <Image
                source={require('../../../../assets/images/account/info-circle.png')} // Path to the profile image
                style={styles.icon}
              />
              <Text style={styles.menuText}>About us</Text>
              <Image
                source={require('../../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <View style={styles.horizontalLine} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('ContactUs')}>
              <Image
                source={require('../../../../assets/images/account/call-incoming.png')} // Path to the profile image
                style={{width: 26, height: 26}}
              />
              <Text style={styles.menuText}>Contact us</Text>
              <Image
                source={require('../../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <View style={styles.horizontalLine} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('HelpSupport')}>
              <Image
                source={require('../../../../assets/images/account/help.png')} // Path to the profile image
                style={styles.icon}
              />
              <Text style={styles.menuText}>Help & Support</Text>
              <Image
                source={require('../../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <View style={styles.horizontalLine} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('PrivacyPolicy')}>
              <Image
                source={require('../../../../assets/images/account/policy.png')} // Path to the profile image
                style={styles.icon}
              />
              <Text style={styles.menuText}>Privacy Policy</Text>
              <Image
                source={require('../../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <View style={styles.horizontalLine} />
            <View style={styles.menuItem}>
              <Image
                source={require('../../../../assets/images/account/terms.png')} // Path to the profile image
                style={{width: 24, height: 24, marginLeft: 4}}
              />
              <Text style={styles.menuText}>Terms & Conditions</Text>
              <Image
                source={require('../../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </View>
          </View>
        </View>
      </ScrollView>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>

            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.confirmButton]}
                onPress={handleLogout}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('4%'),
    // paddingVertical:hp('3.5%')
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('4%'),
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginLeft: wp('4%'),
  },
  profileCard: {
    backgroundColor: '#4682B4',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  profileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: wp('4%'),
  },
  profileName: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins SemiBold',
    color: '#F3F7FF',
  },
  profileTitle: {
    color: '#F3F7FF',
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: wp('3.2%'),
    // width:wp('36%')
    width: wp('90%'),
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#1E90FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  viewProfileText: {
    color: '#F3F7FF',
    fontFamily: 'Poppins',
    fontSize: wp('3%'),
    fontWeight: '400',
    marginRight: 6,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
    width: '100%',
  },
  cardContainer: {
    width: '48%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 2,
    backgroundColor: '#F3F7FF',
    borderRadius: 5,
  },
  actionButton: {
    alignItems: 'center',
    padding: wp('2%'),
    marginHorizontal: wp('1%'),
  },
  actionText: {
    marginTop: hp('1.2%'),
    fontSize: wp('3.5%'),
    fontWeight: '400',
    fontFamily: 'Poppins',
  },
  sectionTitle: {
    fontSize: wp('3.5%'),
    color: '#294776',
    // fontWeight: 'bold',
    fontFamily: 'Poppins SemiBold',
    // marginVertical: 5,
  },
  menuItemContainer: {
    padding: wp('4.5%'),
    marginBottom: hp('1%'),
    // elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuText: {
    flex: 1,
    marginLeft: wp('4%'),
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins',
    fontWeight: '400',
    color: '#294776',
  },
  menuText1: {
    flex: 1,
    marginLeft: wp('3%'),
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins',
    fontWeight: '400',
    color: '#294776',
  },
  horizontalLine: {
    height: 1,
    marginVertical: hp('1.5%'),
    width: wp(82),
  },
  backIcon: {
    width: 16,
    height: 16,
    // marginRight: 18,
    marginRight: wp(3),
  },
  icon: {
    width: 27,
    height: hp('3.6%'),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: hp('2%'),
    fontFamily:'Poppins SemiBold',
    marginBottom: hp('1%'),
  },
  modalMessage: {
    fontSize: hp('1.8%'),
    textAlign: 'center',
    fontFamily:'Poppins',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#f00',
  },
  buttonText: {
    color: 'white',
    fontFamily:'Poppins SemiBold'
  },
});

export default StudentAccount;
