import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
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

const Stack = createNativeStackNavigator();
export default function Routes() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const [role, setRole] = useState(null);
  // const {authToken} = useSelector(state => state.auth);
  const [isFirstTimeLoad, setIsFirstTimeLoad] = useState(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  // useEffect(() => {
  //   getData();
  // }, []);

  // async function getData() {
  //   const data = await AsyncStorage.getItem("isLoggedIn");
  //   setIsLoggedIn(data === "true");
  // }

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const userRole = await AsyncStorage.getItem('role');
      // const token = await AsyncStorage.removeItem('authToken');
      // const tokens = await AsyncStorage.removeItem('role');
      console.log('token', token);
      console.log('userRole', userRole);

      setRole(userRole);
      setAuthToken(token);
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
    <NavigationContainer>
      <Stack.Navigator>
        {authToken ? (
          <>
            <Stack.Screen
              name="appStack"
              component={AppStack}
              options={{headerShown: false}}
              initialParams={{role: role}} // Pass role to AppStack
            />
          </>
        ) : (
          <>
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
            />
            <Stack.Screen
              name="appStack"
              component={AppStack}
              options={{headerShown: false}}
              initialParams={{role: role}} // Pass role to AppStack
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const AuthStack = () => {
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
          <Stack.Screen
            name={"ViewSkill"}
            component={ViewSkill}
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
        </>
      )}
      <Stack.Screen name={'PrivacyPolicy'} component={PrivacyPolicy} />
      <Stack.Screen name={'ContactUs'} component={ContactUs} />
      <Stack.Screen name={'AboutUs'} component={AboutUs} />
      <Stack.Screen name={'HelpSupport'} component={HelpSupport} />
    </Stack.Navigator>
  );
};
