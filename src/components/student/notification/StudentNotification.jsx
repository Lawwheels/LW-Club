import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import CustomHeader from '../../../../shared/CustomHeader';

const notification = [
  {
    id: '1',
    name: 'Kajal Gupta',
    avatar:
      'https://images.unsplash.com/photo-1719937206589-d13b6b008196?q=80&w=2700&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    message:
      'has booked a consultation with you. Check your appointments for more details.',
    timestamp: moment().subtract(2, 'minutes').fromNow(),
  },
  {
    id: '2',
    name: 'Kajal Gupta',
    avatar:
      'https://images.unsplash.com/photo-1719937206589-d13b6b008196?q=80&w=2700&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    message:
      'has left feedback on your recent consultation. Check the feedback section to view it.',
    timestamp: moment().subtract(2, 'minutes').fromNow(),
  },
  {
    id: '3',
    name: 'Kajal Gupta',
    avatar:
      'https://images.unsplash.com/photo-1719937206589-d13b6b008196?q=80&w=2700&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    message: 'You have a new message from Kajal Gupta. Click here to read it.',
    timestamp: moment().subtract(2, 'minutes').fromNow(),
  },
];
const notifications = [
  {
    id: '1',
    name: 'Kajal Gupta',
    avatar:
      'https://images.unsplash.com/photo-1719937206589-d13b6b008196?q=80&w=2700&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    message:
      'has booked a consultation with you. Check your appointments for more details.',
    timestamp: '07 : 30 AM',
  },
  {
    id: '2',
    name: 'Kajal Gupta',
    avatar:
      'https://images.unsplash.com/photo-1719937206589-d13b6b008196?q=80&w=2700&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    message:
      'has left feedback on your recent consultation. Check the feedback section to view it.',
    timestamp: '08 : 30 AM',
  },
  {
    id: '3',
    name: 'Kajal Gupta',
    avatar:
      'https://images.unsplash.com/photo-1719937206589-d13b6b008196?q=80&w=2700&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    message: 'You have a new message from Kajal Gupta. Click here to read it.',
    //  time: '10:00 AM',
    timestamp: '09 : 30 AM',
  },
];

const StudentNotification = () => {
  const renderNotification = ({item}) => (
    <View>
      <View style={styles.notificationContainer}>
        <Image source={{uri: item.avatar}} style={styles.avatar} />
        <View style={styles.textContainer}>
          <View style={styles.messageContainer}>
            <Text>
              <Text style={styles.name}>{item.name} </Text>
              <Text style={styles.message}>{item.message}</Text>
            </Text>
            {item.date && (
              <View style={styles.dateContainer}>
                <Image
                  source={require('../../../../assets/images/icons/note.png')}
                  style={{width: 15, height: 15}}
                  resizeMode="contain"
                />
                <Text style={styles.dateText}>{item.date}</Text>
                <Image
                  source={require('../../../../assets/images/icons/time.png')}
                  style={{width: 15, height: 15, marginLeft: 8}}
                  resizeMode="contain"
                />
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            )}
          </View>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>
      <View style={styles.horizontalLine} />
    </View>
  );

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <View style={{paddingTop: hp('4.5%'), backgroundColor: '#F3F7FF'}}>
          <CustomHeader
            title={'Notifications'}
            icon={require('../../../../assets/images/back.png')}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <FlatList
                data={notification}
                renderItem={renderNotification}
                keyExtractor={item => item.id}
                ListHeaderComponent={() => (
                  <Text style={styles.sectionTitle}>Today</Text>
                )}
                showsVerticalScrollIndicator={false}
              />
              <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={item => item.id}
                ListHeaderComponent={() => (
                  <Text style={styles.sectionTitle}>Yesterday</Text>
                )}
                showsVerticalScrollIndicator={false}
              />
              <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={item => item.id}
                ListHeaderComponent={() => (
                  <Text style={styles.sectionTitle}>13 Nov 2024</Text>
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',

    paddingHorizontal: wp('5%'),
    // paddingTop: 10,
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    // fontWeight: 'bold',
    fontFamily: 'Poppins SemiBold',
    // marginTop: hp('5%'),
    marginBottom: hp('2.5%'),
    textAlign: 'justify',
  },
  notificationContainer: {
    flexDirection: 'row',
    // marginBottom: hp('2%'),
  },
  avatar: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    marginRight: wp('4%'),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messageContainer: {
    flex: 1, // Ensure the message and date occupy available space
  },
  name: {
    fontWeight: '600',
    color: '#294776',
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins SemiBold',
  },
  message: {
    color: '#595C66',
    fontWeight: '400',
    fontFamily: 'Poppins',
    fontSize: wp('3.5%'),
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.6%'),
  },
  dateText: {
    marginLeft: wp('1.5%'),
    marginTop: hp('0.2%'),
    fontSize: wp('3%'),
    alignItems: 'center',
    fontFamily: 'Poppins',
    color: '#1262D2',
    fontWeight: '500',
  },
  timeIcon: {
    marginLeft: wp('2.5%'),
  },
  timeText: {
    marginLeft: wp('1.5%'),
    marginTop: hp('0.2%'),
    fontSize: wp('3%'),
    alignItems: 'center',
    fontFamily: 'Poppins',
    color: '#1262D2',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: wp('3%'),
    color: '#727171',
    fontFamily: 'Poppins',
    marginTop: hp('0.6%'),
    // textAlign: 'right',
  },
  horizontalLine: {
    height: 1,
    marginVertical: hp('1%'),
    width: wp('100%'),
    backgroundColor: 'rgba(114, 113, 113, 0.2)',
  },
});

export default StudentNotification;
