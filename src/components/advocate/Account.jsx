import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation, CommonActions} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import CustomHeader from '../../../shared/CustomHeader';
import navigationStrings from '../../constants/navigationStrings';
import {clearUser} from '../../redux/reducers/auth/authSlice';
import {useGetAdvocateQuery} from '../../redux/api/api';

const Account = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {data, error, isLoading} = useGetAdvocateQuery();
  console.log(data);
  console.log(error)

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
    // Show the flash message
    showMessage({
      message: `An error occurred: ${error?.error}`, 
      type: "danger", 
      titleStyle: { fontFamily: "Poppins" }, 
      style: { backgroundColor: "red" }, 
    });
  
    return <Text style={{fontFamily:'Poppins',color:'red'}}>{`An error Occured ${error?.error}`}</Text>
  }
  const handleLogout = async () => {
    try {
      // Remove authToken from AsyncStorage
      await AsyncStorage.removeItem('authToken');
      // Show a toast notification for feedback
      ToastAndroid.show('You have successfully logged out!', ToastAndroid.SHORT);
  
      // Reset navigation stack and navigate to Login screen
      navigation.navigate("Login");
    } catch (error) {
      console.error('Error logging out: ', error);
      showMessage({
        message: 'Logout failed. Please try again.',
        type: 'danger',
        titleStyle: { fontFamily: 'Poppins' },
        style: { backgroundColor: 'red' },
      });
    }
  };
  return (
    <>
      <CustomHeader
        title={'My Account'}
        icon={require('../../../assets/images/back.png')}
      />
      <ScrollView style={styles.container}>
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
                  : require('../../../assets/images/avatar.png')
              }
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.profileName}>
                {data && data?.data[0]?.name}
              </Text>
              <Text style={styles.profileTitle}>{getLastJobTitle(data)}</Text>
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
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ViewAdvocateProfile')}>
            <Image
              source={require('../../../assets/images/icons/edit.png')} // Path to the profile image
              style={{width: 24, height: 24}}
            />
            <Text style={[styles.actionText, {color: '#294776'}]}>
              My Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Image
              source={require('../../../assets/images/icons/add-square.png')} // Path to the profile image
              style={{width: 24, height: 24}}
            />
            <Text style={[styles.actionText, {color: '#294776'}]}>
              Add Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Image
              source={require('../../../assets/images/icons/logout.png')} // Path to the profile image
              style={{width: 24, height: 24}}
            />
            <Text style={[styles.actionText, {color: 'red'}]}>Logout</Text>
          </TouchableOpacity>
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
                source={require('../../../assets/images/account/export.png')} // Path to the profile image
                style={{width: 24, height: 24}}
              />
              <Text style={styles.menuText}>Share The Application</Text>
              <Image
                source={require('../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <View style={styles.horizontalLine} />
            <TouchableOpacity
              style={styles.menuItem}
              //  onPress={()=>navigation.navigate("UserBooking")}
            >
              <Image
                source={require('../../../assets/images/account/like-shapes.png')} // Path to the profile image
                style={{width: 30, height: 30}}
              />
              <Text style={styles.menuText1}>Rate The Application</Text>
              <Image
                source={require('../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <View style={styles.horizontalLine} />
            <View style={styles.menuItem}>
              <Image
                source={require('../../../assets/images/account/global.png')} // Path to the profile image
                style={styles.icon}
              />
              <Text style={styles.menuText}>Language</Text>
              <Image
                source={require('../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.menuItem}>
              <Image
                source={require('../../../assets/images/account/setting-2.png')} // Path to the profile image
                style={styles.icon}
              />
              <Text style={styles.menuText}>Settings</Text>
              <Image
                source={require('../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </View>
          </View>
        </View>

        {/* More Information */}
        <View>
          <Text style={styles.sectionTitle}>More Information</Text>
          <View style={styles.menuItemContainer}>
            <View style={styles.menuItem}>
              <Image
                source={require('../../../assets/images/account/info-circle.png')} // Path to the profile image
                style={styles.icon}
              />
              <Text style={styles.menuText}>About us</Text>
              <Image
                source={require('../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.menuItem}>
              <Image
                source={require('../../../assets/images/account/call-incoming.png')} // Path to the profile image
                style={{width: 26, height: 26}}
              />
              <Text style={styles.menuText}>Contact us</Text>
              <Image
                source={require('../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.menuItem}>
              <Image
                source={require('../../../assets/images/account/help.png')} // Path to the profile image
                style={styles.icon}
              />
              <Text style={styles.menuText}>Help & Support</Text>
              <Image
                source={require('../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.menuItem}>
              <Image
                source={require('../../../assets/images/account/policy.png')} // Path to the profile image
                style={styles.icon}
              />
              <Text style={styles.menuText}>Privacy Policy</Text>
              <Image
                source={require('../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.menuItem}>
              <Image
                source={require('../../../assets/images/account/terms.png')} // Path to the profile image
                style={{width: 24, height: 24, marginLeft: 4}}
              />
              <Text style={styles.menuText}>Terms & Conditions</Text>
              <Image
                source={require('../../../assets/images/account/arrow-right.png')} // Path to the profile image
                style={styles.backIcon}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingHorizontal: wp('4%'),
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
    marginBottom: hp('3.5%'),
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
    width:wp('36%')
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
    marginBottom: hp('1.5%'),
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('2%'),
    flex: 1,
    marginHorizontal: wp('1%'),
    // elevation: 2,
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
    marginLeft: 11,
    fontSize: 14,
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
});

export default Account;
