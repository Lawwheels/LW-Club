import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator,SafeAreaView,StyleSheet,Platform,StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from '../screen/Login';
import Register from '../screen/Register';
import OtpScreen from '../screen/OtpScreen';
import RoleSelect from '../screen/RoleSelect';
import VerifyAdvocate from '../components/advocate/VerifyAdvocate';
import TabNavigator from '../navigation/TabNavigator';
import Notification from '../components/advocate/Notification';
import AdvocateProfile from '../components/advocate/AdvocateProfile';
import Calendar from '../components/advocate/Calendar';
import Feedback from '../components/advocate/Feedback';
import BookConsultation from '../components/user/BookConsultation';
import SearchCategory from '../components/user/SearchCategory';
import FeedbackForm from '../components/user/FeedbackForm';
import UserNavigator from '../navigation/UserNavigator';
import UserReview from '../components/user/UserReview';
import AdvocateDetailProfile from '../components/user/AdvocateDetailProfile';
import navigationStrings from '../constants/navigationStrings';
import ViewAdvocateProfile from '../components/advocate/ViewAdvocateProfile';
import ViewAllExperience from '../components/advocate/EditProfileSection/ViewAllExperience';
import EditExperience from '../components/advocate/EditProfileSection/EditExperience';
import EditPracticeArea from '../components/advocate/EditProfileSection/practiceAreas/EditPracticeArea';
import ViewAllPracticeArea from '../components/advocate/EditProfileSection/practiceAreas/ViewAllPracticeArea';
import ViewAllEducation from '../components/advocate/EditProfileSection/EditEducation/ViewAllEducation';
import EditEducation from '../components/advocate/EditProfileSection/EditEducation/EditEducation';
import ViewAllCertificate from '../components/advocate/EditProfileSection/EditCertificate/ViewAllCertificate';
import EditCertificate from '../components/advocate/EditProfileSection/EditCertificate/EditCertificate';
import AdvocateSlots from '../components/advocate/AdvocateSlots';
import EditUserProfile from '../components/user/EditUserProfile';
import UpdateBio from '../components/advocate/addProfileSection/UpdateBio';
import AddEducation from '../components/advocate/addProfileSection/AddEducation';
import AddExperience from '../components/advocate/addProfileSection/AddExperience';
import AddCertificate from '../components/advocate/addProfileSection/AddCertificate';
import AddSkill from '../components/advocate/addProfileSection/AddSkill';
import UserProfile from '../components/user/UserProfile';
import ConsultationDetails from '../components/advocate/ConsultationDetails';
import OnBoardingScreen from '../components/onboarding/OnboardingScreen';
import UserAccount from '../components/user/UserAccount';
import UserNotification from '../components/user/UserNotification';
import PrivacyPolicy from '../components/common/PrivacyPolicy';
import ContactUs from '../components/common/ContactUs';
import AboutUs from '../components/common/AboutUs';
import HelpSupport from '../components/common/HelpSupport';
import ViewSkill from '../components/advocate/EditProfileSection/EditSkill/ViewSkill';
import Reviews from '../components/advocate/Reviews';
import UserHome from '../components/user/UserHome';
import Chat from '../components/user/chat/Chat';
import ChatConversation from '../components/user/chat/ChatConversation';
import AllUserRequest from '../components/advocate/AllUserRequest';
import AdvocateChat from '../components/advocate/chat/AdvocateChat';
import AdvocateChatConversation from '../components/advocate/chat/AdvocateChatConversation';
import AdvocateSearch from '../components/advocate/search/AdvocateSearch';
import ViewAllUsers from '../components/advocate/search/ViewAllUsers';
import ParticularUser from '../components/advocate/search/ParticularUser';
import Following from '../components/user/follow/Following';
import AdvocateFollowing from '../components/user/follow/AdvocateFollowing';
import AdvocateFollower from '../components/user/follow/AdvocateFollower';
import {navigationRef} from '../navigation/navigationRef';
import StudentNavigator from './StudentNavigator';
import LegalUpdate from '../components/student/home/LegalUpdate';
import Articles from '../components/student/home/Articles';
import Preamble from '../components/student/corners/cornersPage/constitutionPage/Preamble';
import StudentArticle from '../components/student/corners/cornersPage/constitutionPage/StudentArticle';
import BareAct from '../components/student/corners/cornersPage/constitutionPage/BareAct';
import Blogs from '../components/student/corners/cornersPage/Blogs';
import StudentAdvocateProfile from '../components/student/home/StudentAdvocateProfile';
import ViewAllUserList from '../components/student/search/ViewAllUserList';
import ViewStudentProfile from '../components/student/profile/ViewStudentProfile';
import StudentBio from '../components/student/profile/StudentBio';
import StudentEducation from '../components/student/education/StudentEducation';
import EditStudentEducation from '../components/student/education/EditStudentEducation';
import AddStudentSkill from '../components/student/skill/AddStudentSkill';
import ViewStudentSkill from '../components/student/skill/ViewStudentSkill';
import AddStudentCertificate from '../components/student/certificate/AddStudentCertificate';
import EditStudentCertificate from '../components/student/certificate/EditStudentCertificate';
import AdvocateBooking from '../components/student/booking/AdvocateBooking';
import BookingView from '../components/student/booking/BookingView';
import SearchAllAdvocateList from '../components/user/SearchAllAdvocateList';
import StudentNotification from '../components/student/notification/StudentNotification';
import StudentChatConversation from '../components/student/chat/StudentChatConversation';
import StudentChat from '../components/student/chat/StudentChat';
import StudentAdvocateFollower from '../components/student/follow/StudentAdvocateFollower';
import StudentAdvocateFollowing from '../components/student/follow/StudentAdvocateFollowing';
import FeedbackAdvocate from '../components/student/feedback/FeedbackAdvocate';
import MyFollowers from '../components/advocate/follow/MyFollowers';
import MyFollowings from '../components/advocate/follow/MyFollowings';
import StudentFollower from '../components/student/follow/StudentFollower';
import StudentFollowing from '../components/student/follow/StudentFollowing';

const Stack = createNativeStackNavigator();
export default function Routes() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const [refreshToken,setRefreshToken]=useState(null);
  const [role, setRole] = useState(null);
  const [isFirstTimeLoad, setIsFirstTimeLoad] = useState(null);

  const extraPadding = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstTimeLoad(true);
      } else {
        setIsFirstTimeLoad(false);
      }
    });
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const userRole = await AsyncStorage.getItem('role');
      // const token = await AsyncStorage.removeItem('authToken');
      // const tokens = await AsyncStorage.removeItem('role');
      console.log('token', token);
      console.log('userRole', userRole);

      setRole(userRole);
      setAuthToken(token);
      // setRefreshToken(refreshToken);
      setIsLoading(false);
    };

    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    // <SafeAreaView style={[styles.safeArea , {paddingTop: extraPadding}]}>
    <SafeAreaView style={styles.safeArea}>
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {authToken && (
          <Stack.Screen
            name="appStack"
            component={AppStack}
            options={{headerShown: false}}
            initialParams={{role: role}}
          />
        )}
        {isFirstTimeLoad && (
          <Stack.Screen
            name="OnBoardingScreen"
            component={OnBoardingScreen}
            options={{headerShown: false}}
          />
        )}
        <Stack.Screen
          name="authStack"
          component={AuthStack}
          options={{headerShown: false}}
          initialParams={{role: role}}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaView>
  );
}

const AuthStack = ({route}) => {
  const role = route?.params?.role;
  console.log('role123' + role);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <>
        <Stack.Screen name={navigationStrings.LOGIN} component={Login} />
       
        <Stack.Screen
          name={navigationStrings.OTP_SCREEN}
          component={OtpScreen}
        />
        <Stack.Screen name={navigationStrings.REGISTER} component={Register} />
        <Stack.Screen
          name={navigationStrings.ROLE_SELECT}
          component={RoleSelect}
        />
        
        <Stack.Screen
          name="appStack"
          component={AppStack}
          options={{headerShown: false}}
          initialParams={{role: role}} // Pass role to AppStack
        />
      </>
    </Stack.Navigator>
  );
};

const AppStack = ({route}) => {
  const role = route?.params?.role;
  console.log('role123' + role);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {role === 'Advocate' && (
        <>
          <Stack.Screen
            name={navigationStrings.VERIFY_ADVOCATE}
            component={VerifyAdvocate}
          />
          <Stack.Screen
            name={'ConsultationDetails'}
            component={ConsultationDetails}
          />
          <Stack.Screen
            name={'ViewAdvocateProfile'}
            component={ViewAdvocateProfile}
          />
          <Stack.Screen
            name={navigationStrings.ADVOCATE_NAVIGATOR}
            component={TabNavigator}
          />
          <Stack.Screen
            name={navigationStrings.NOTIFICATION}
            component={Notification}
          />
          <Stack.Screen
            name={navigationStrings.ADVOCATE_PROFILE}
            component={AdvocateProfile}
          />
          <Stack.Screen
            name={navigationStrings.ADVOCATE_AVAILABILITY}
            component={Calendar}
          />
          <Stack.Screen
            name={navigationStrings.FEEDBACK}
            component={Feedback}
          />
          <Stack.Screen
            name={navigationStrings.VIEW_ALL_EXPERIENCE}
            component={ViewAllExperience}
          />
          <Stack.Screen
            name={navigationStrings.EDIT_EXPERIENCE}
            component={EditExperience}
          />
          <Stack.Screen
            name={navigationStrings.EDIT_PRACTICE_AREA}
            component={EditPracticeArea}
          />
          <Stack.Screen
            name={navigationStrings.VIEW_ALL_PRACTICE_AREA}
            component={ViewAllPracticeArea}
          />
          <Stack.Screen
            name={'ViewAllEducation'}
            component={ViewAllEducation}
          />
          <Stack.Screen name={'EditEducation'} component={EditEducation} />
          <Stack.Screen
            name={'ViewAllCertificate'}
            component={ViewAllCertificate}
          />
          <Stack.Screen name={'EditCertificate'} component={EditCertificate} />
          <Stack.Screen name={'AdvocateSlots'} component={AdvocateSlots} />
          <Stack.Screen name={'UpdateBio'} component={UpdateBio} />
          <Stack.Screen name={'AddEducation'} component={AddEducation} />
          <Stack.Screen name={'AddExperience'} component={AddExperience} />
          <Stack.Screen name={'AddCertificate'} component={AddCertificate} />
          <Stack.Screen name={'AddSkill'} component={AddSkill} />
          <Stack.Screen name={'ViewSkill'} component={ViewSkill} />
          <Stack.Screen name={'AdvocateReviews'} component={Reviews} />
          <Stack.Screen name={'AllUserRequest'} component={AllUserRequest} />
          <Stack.Screen name={'AdvocateSearch'} component={AdvocateSearch} />
          <Stack.Screen name={'AdvocateChat'} component={AdvocateChat} />
          <Stack.Screen name={'ViewAllUsers'} component={ViewAllUsers} />
          <Stack.Screen name={'ParticularUser'} component={ParticularUser} />
          <Stack.Screen
            name={'AdvocateChatConversation'}
            component={AdvocateChatConversation}
          />
          <Stack.Screen
            name={'MyFollowers'}
            component={MyFollowers}
          />
           <Stack.Screen
            name={'MyFollowings'}
            component={MyFollowings}
          />
        </>
      )}
      {role === 'Nun' && (
        <>
          <Stack.Screen
            name={navigationStrings.USER_NAVIGATOR}
            component={UserNavigator}
          />
          <Stack.Screen name={'EditUserProfile'} component={EditUserProfile} />

          <Stack.Screen name={'UserAccount'} component={UserAccount} />
          <Stack.Screen name={'UserProfile'} component={UserProfile} />
          <Stack.Screen
            name={'UserNotification'}
            component={UserNotification}
          />
          <Stack.Screen
            name={navigationStrings.USER_BOOKING}
            component={BookConsultation}
          />
          <Stack.Screen
            name={navigationStrings.SEARCH_CATEGORY}
            component={SearchCategory}
          />
          <Stack.Screen
            name={navigationStrings.FEEDBACK_FORM}
            component={FeedbackForm}
          />

          <Stack.Screen
            name={navigationStrings.USER_REVIEW}
            component={UserReview}
          />
          <Stack.Screen
            name={navigationStrings.ADVOCATE_DETAIL_PROFILE}
            component={AdvocateDetailProfile}
          />
          <Stack.Screen name={'UserHome'} component={UserHome} />
          <Stack.Screen name={'UserChat'} component={Chat} />
          <Stack.Screen
            name={'ChatConversation'}
            component={ChatConversation}
          />
           <Stack.Screen
            name={"UserFollowing"}
            component={Following}
          />
          <Stack.Screen
            name={"Following"}
            component={AdvocateFollowing}
          />
            <Stack.Screen
            name={"Follower"}
            component={AdvocateFollower}
          />
           <Stack.Screen name={'SearchAllAdvocateList'} component={SearchAllAdvocateList} /> 
        </>
      )} 
      {role === 'Student' && (
        <>
        <Stack.Screen name={'StudentNavigator'} component={StudentNavigator} /> 
        <Stack.Screen name={'LegalUpdate'} component={LegalUpdate} /> 
        <Stack.Screen name={'Articles'} component={Articles} /> 
        <Stack.Screen name={'StudentBio'} component={StudentBio} /> 
        <Stack.Screen name={'Preamble'} component={Preamble} /> 
        <Stack.Screen name={'StudentArticle'} component={StudentArticle} /> 
        <Stack.Screen name={'StudentAdvocateProfile'} component={StudentAdvocateProfile} /> 
        <Stack.Screen name={'ViewAllUserList'} component={ViewAllUserList} /> 
        <Stack.Screen name={'ViewStudentProfile'} component={ViewStudentProfile} /> 
        <Stack.Screen name={'StudentEducation'} component={StudentEducation} /> 
        <Stack.Screen name={'EditStudentEducation'} component={EditStudentEducation} /> 
        <Stack.Screen name={'AddStudentSkill'} component={AddStudentSkill} /> 
        <Stack.Screen name={'ViewStudentSkill'} component={ViewStudentSkill} /> 
        <Stack.Screen name={'AddStudentCertificate'} component={AddStudentCertificate} /> 
        <Stack.Screen name={'EditStudentCertificate'} component={EditStudentCertificate} /> 
        <Stack.Screen name={'AdvocateBooking'} component={AdvocateBooking} /> 
        <Stack.Screen name={'BookingView'} component={BookingView} /> 
        <Stack.Screen name={'StudentNotification'} component={StudentNotification} /> 
        <Stack.Screen name={'StudentChat'} component={StudentChat} /> 
        <Stack.Screen name={'StudentChatConversation'} component={StudentChatConversation} /> 
        <Stack.Screen name={'StudentAdvocateFollower'} component={StudentAdvocateFollower} /> 
        <Stack.Screen name={'StudentAdvocateFollowing'} component={StudentAdvocateFollowing} /> 
        <Stack.Screen name={'FeedbackAdvocate'} component={FeedbackAdvocate} /> 
        <Stack.Screen
            name={'StudentFollowers'}
            component={StudentFollower}
          />
           <Stack.Screen
            name={'StudentFollowings'}
            component={StudentFollowing}
          />
        </>
      )}
      <Stack.Screen name={'PrivacyPolicy'} component={PrivacyPolicy} />
      <Stack.Screen name={'ContactUs'} component={ContactUs} />
      <Stack.Screen name={'AboutUs'} component={AboutUs} />
      <Stack.Screen name={'HelpSupport'} component={HelpSupport} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F7FF', 
  },
});