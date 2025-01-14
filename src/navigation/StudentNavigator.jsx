import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Text} from 'react-native';
import HomeIcon from '../../assets/images/icons/tabIcon/home.png';
import CalendarIcon from '../../assets/images/icons/tabIcon/calendar.png';

import ProfileIcon from '../../assets/images/icons/tabIcon/profile.png';
import SearchIcon from '../../assets/images/icons/tabIcon/searchIcon.png';
import ActiveSearch from '../../assets/images/icons/tabIcon/searchActive.png';
import ActiveHome from '../../assets/images/icons/tabIcon/activeHome.png';
import ActiveCalendar from '../../assets/images/icons/tabIcon/activeCalendar.png';
import ActiveProfile from '../../assets/images/icons/tabIcon/activeProfile.png';

import StudentHome from '../components/student/StudentHome';
import Corners from '../components/student/corners/Corners';
import StudentSearch from '../components/student/search/StudentSearch';
import StudentAccount from '../components/student/profile/StudentAccount';

const Tab = createBottomTabNavigator();

const StudentNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#294776',
        tabBarInactiveTintColor: '#000',
        tabBarStyle: {
          height: 70,
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          elevation: 10,
          backgroundColor: '#ffffff',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
      }}>
      <Tab.Screen
        name={'Home'}
        component={StudentHome}
        options={{
          headerShown: false,
          tabBarLabelStyle: {
            marginTop: 28,
            fontSize: 12,
            fontFamily: 'Poppins',
            lineHeight: 20,
            fontWeight: '400',
          },
          tabBarLabel: 'Home',

          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? ActiveHome : HomeIcon}
              style={{
                width: 26,
                height: 26,
                marginTop: 26,
                // marginRight:25,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Corners"
        component={Corners}
        options={{
          headerShown: false,
          tabBarLabelStyle: {
            marginTop: 28,
            fontSize: 12,
            fontFamily: 'Poppins',
            lineHeight: 20,
            fontWeight: '400',
          },
          tabBarLabel: 'Corners',

          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? ActiveCalendar : CalendarIcon}
              style={{
                width: 26,
                height: 26,
                marginTop: 26,
                // marginRight:25,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={StudentSearch}
        options={{
          headerShown: false,
          tabBarLabelStyle: {
            marginTop: 28,
            fontSize: 12,
            fontFamily: 'Poppins',
            lineHeight: 20,
            fontWeight: '400',
          },
          tabBarLabel: 'Search',

          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? ActiveSearch : SearchIcon}
              style={{
                width: 26,
                height: 26,
                marginTop: 26,
                // marginRight:25,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={StudentAccount}
        options={{
          headerShown: false,
          tabBarLabelStyle: {
            marginTop: 28,
            fontSize: 12,
            fontFamily: 'Poppins',
            lineHeight: 20,
            fontWeight: '400',
          },
          tabBarLabel: 'Profile',

          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? ActiveProfile : ProfileIcon}
              style={{
                width: 26,
                height: 26,
                marginTop: 26,
                // marginRight:25,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default StudentNavigator;
