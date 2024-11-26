// import React from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// const UserHome = () => {
//   return (
//     <TouchableWithoutFeedback>
//       <View style={styles.cardContainer}>
//         <View style={{flexDirection: 'row'}}>
//           <View style={styles.leftContainer}>
//             <Image
//               style={styles.circleImage}
//               source={require('../../../assets/images/user.png')}
//             />
//           </View>
//           <View style={styles.rightContainer}>
//             <View style={styles.infoContainer}>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   width: wp(65),
//                 }}>
//                 <View style={styles.lawyerDetails}>
//                   <Text style={styles.lawyerName}>Ankush Gupta</Text>
//                   <Text style={styles.lawyerTitle}>Civil Lawyer</Text>
//                   <View style={styles.locationContainer}>
//                     <Text style={styles.locationText}>
//                       Tilak Nagar, New Delhi
//                     </Text>
//                   </View>
//                 </View>
//                 <View style={styles.starRating}>
//                   <Text style={styles.stars}>★★★★★</Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </View>
//         <View style={styles.aboutContainer}>
//           <Text style={styles.aboutHeading}>About</Text>
//           <Text style={styles.aboutText}>
//             Chris Evans is a seasoned civil lawyer with over 5 years of
//             experience in specific civil law areas, e.g., contract disputes and
//             property law. Known for their strategic approach.
//           </Text>
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default UserHome;

// const styles = StyleSheet.create({
//   cardContainer: {
//     marginTop: 40,
//     borderRadius: 10,
//     backgroundColor: '#E4EEFC',
//     marginLeft: wp(6),
//     marginRight: wp(5),
//     height: hp(25),
//     padding: 10,
//     position: 'relative', // Ensure the card itself is relative for proper alignment
//   },
//   leftContainer: {
//     marginLeft: -30, // Shift left outside the card
//     marginTop: -30, // Shift upward outside the card
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//   },
//   circleImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 15,
//     borderWidth: 1,
//     borderColor: '#1262D2',
//   },
//   rightContainer: {
//     // flex: 1,
//     justifyContent: 'flex-start',
//     paddingRight: 10,
//   },

//   infoContainer: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   lawyerDetails: {
//     marginBottom: 10,
//   },
//   lawyerName: {
//     fontFamily: 'Poppins SemiBold',
//     fontSize: 18,
//     color: '#294776',
//     lineHeight: 20,
//   },
//   lawyerTitle: {
//     color: '#666667',
//     fontFamily: 'Poppins',
//     fontSize: 14,
//     lineHeight: 20,
//     // marginVertical: 5,
//   },
//   starRating: {
//     flexDirection: 'row',
//   },
//   stars: {
//     color: '#FFA800', // Gold color for stars
//     fontSize: 24,
//     lineHeight: 22,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     // marginVertical: 5,
//   },
//   locationText: {
//     color: '#294776',
//     fontFamily: 'Poppins',
//     fontWeight: '400',
//     fontSize: 12,
//   },
//   aboutContainer: {
//     marginTop: hp(3),
//     backgroundColor: '#F3F7FF',
//     padding: 10,
//     borderRadius: 5,
//   },
//   aboutHeading: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   aboutText: {
//     color: '#6B7280',
//   },
// });

import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableWithoutFeedback,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import LinearGradient from 'react-native-linear-gradient';
import {
  useGetAdviseSeekerQuery,
  useGetAllAdvocateQuery,
  useGetUserSlotQuery,
} from '../../redux/api/api';
import navigationStrings from '../../constants/navigationStrings';

const items = [
  {
    id: 1,
    name: 'Notifications',
    image: require('../../../assets/images/notification.png'),
    navigateTo: 'UserNotification',
  },
  {
    id: 2,
    name: 'Messages',
    image: require('../../../assets/images/send.png'),
    // navigateTo: 'AdvocateDetailProfile',
  },
  {
    id: 3,
    name: 'Book Consultation',
    image: require('../../../assets/images/add.png'),
    // navigateTo: 'UserBooking',
  },
  {
    id: 4,
    name: 'Feedbacks',
    image: require('../../../assets/images/message.png'),
    navigateTo: 'FeedbackForm',
  },
];

const data = [
  {
    id: '1',
    name: 'Kajal Gupta',
    profession: 'Civil Lawyer',
    status: 'On Call',
    time: 'In 15 min',
  },
  {
    id: '2',
    name: 'Rajeev Gupta',
    profession: 'Civil Lawyer',
    status: 'On Call',
  },
  {
    id: '3',
    name: 'Rohan Gupta',
    profession: 'Civil Lawyer',
    status: 'On Call',
    time: 'In 15 min',
  },
  {
    id: '4',
    name: 'Ram Gupta',
    profession: 'Civil Lawyer',
    status: 'On Call',
  },
  // Add more items as needed
];

const UserHome = ({navigation}) => {
  const {data: userData, isLoading, error} = useGetAdviseSeekerQuery();
  const {
    data: advocateData,
    isLoading: loading,
    error: isError,
  } = useGetAllAdvocateQuery({
    role: 'Advocate', // Specify the role as 'advocate'
    search: '', // Optional search term
    page: 1, // Optional page number
    resultPerPage: 20, // Optional results per page
  });
  const formattedDate = new Date()
    ? new Date().toLocaleDateString('en-CA')
    : null;
  const {data: slotsData, refetch} = useGetUserSlotQuery(formattedDate, {
    skip: !formattedDate,
  });

  const consultation = slotsData?.data || [];

  const formattedSlots = consultation.map(item => ({
    // date: new Date(item.date).toLocaleDateString(), // Format the date
    date: new Date(item.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    slots: item.slotes || [],
  }));
  // Flatten the data so each slot is an individual item with a date
  const slotData = formattedSlots.flatMap(item =>
    item.slots.map(slot => ({...slot, date: item.date})),
  );

  console.log('UserHome', slotData);

  function getLastJobTitle(experiences) {
    // Check if experiences exist and are not empty
    if (experiences && experiences?.length > 0) {
      // Get the last experience in the array
      const lastExperience = experiences[experiences?.length - 1];

      // Return the jobTitle
      return lastExperience.jobTitle;
    } else {
      return 'No experiences found.'; // Return a fallback value if no experiences are present
    }
  }
  if (isLoading || loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle error state
  if (error || isError) {
    console.log(error);
    return <Text>An error occurred: {error.message}</Text>;
  }

  // console.log('user', userData);

  const userDetails = userData?.data;

  const LawyerCard = ({name, profession, status, time}) => {
    return (
      <ImageBackground
        source={require('../../../assets/images/missed.png')}
        style={styles.advocateCard}
        imageStyle={{borderRadius: wp('5%')}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.profession}>{profession}</Text>
          </View>
          {time && (
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{time}</Text>
            </View>
          )}
        </View>
        <View style={styles.statusContainer}>
          <Image
            source={require('../../../assets/images/schedule/completedIcon.png')} // Replace with your image path
            style={{width: 15, height: 15}}
            resizeMode="contain" // Adjust as per your requirement (e.g. cover, stretch)
          />
          <Text style={styles.status}>{status}</Text>
        </View>
      </ImageBackground>
    );
  };
  return (
    <>
      <StatusBar
        barStyle="light-content" // Options: 'default', 'light-content', 'dark-content'
        backgroundColor="#1262D2" // Background color for Android
      />
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={styles.container}>
          {/* Profile Completion Section */}
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('UserProfile')}>
            <LinearGradient
              colors={['#1262D2', '#17316D']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.banner}>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>
                  Finish setting up your profile to attract more clients!
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    maxWidth: '50%',
                  }}>
                  <View style={{marginTop: hp('1%')}}>
                    <Text style={styles.greeting}>
                      <Text style={styles.userName}>
                        Hi, {userDetails?.name} !
                      </Text>
                    </Text>

                    <Text style={styles.profileComplete}>
                      <Text style={styles.percentage}>
                        Profile 60% Complete
                      </Text>
                    </Text>
                  </View>

                  {/* <TouchableOpacity style={styles.completeProfileButton}>
              <Text style={styles.completeProfileText}>Complete Profile</Text>
            </TouchableOpacity> */}
                </View>
              </View>
              <View style={styles.profileContainer}>
                <AnimatedCircularProgress
                  size={70}
                  width={3}
                  backgroundWidth={1}
                  fill={60}
                  tintColor="#1467DA"
                  backgroundColor="#000">
                  {() => (
                    <Image
                      source={
                        userDetails?.profilePic?.url
                          ? {uri: userDetails.profilePic.url}
                          : require('../../../assets/images/user1.png')
                      }
                      style={styles.profileImage}
                    />
                  )}
                </AnimatedCircularProgress>
              </View>
            </LinearGradient>
          </TouchableWithoutFeedback>
          {/* User Information */}
          {/* <View style={styles.userInfo}>
        <View>
          <Text style={styles.userName}>{userDetails?.name}</Text>
        </View>
        <Image
          source={require('../../../assets/images/icons/tabIcon/searchIcon.png')} // Path to the profile image
          style={{width: 24, height: 24}}
        />
      </View> */}
          <View style={styles.cardContainer}>
            {items.map(item => (
              <LinearGradient
                colors={['#E4EEFC', '#F3F7FF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.card}>
                <TouchableOpacity
                  key={item.id}
                  style={styles.centerContent}
                  onPress={() =>
                    item.navigateTo
                      ? navigation.navigate(item.navigateTo)
                      : console.log('No navigation available')
                  }>
                  <Image source={item.image} style={styles.iconImage} />
                  <Text style={styles.cardLabel}>{item.name}</Text>
                </TouchableOpacity>
              </LinearGradient>
            ))}
          </View>

          <View style={{marginVertical: hp('4%')}}>
            <FlatList
              data={data}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('UserReview')}>
                  <LawyerCard
                    name={item.name}
                    profession={item.profession}
                    status={item.status}
                    time={item.time}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatList}
            />
          </View>
          {advocateData?.data.map(advocate => {
            // console.log(advocate);
            return (
              <TouchableWithoutFeedback
                key={advocate._id} // Ensure to use a unique key for each advocate
                onPress={() =>
                  navigation.navigate('AdvocateDetailProfile', {
                    advocateId: advocate._id,
                  })
                }>
                <View style={styles.lawyerDetailContainer}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.leftContainer}>
                      <Image
                        style={styles.circleImage}
                        source={
                          advocate.profilePic?.url
                            ? {uri: advocate.profilePic.url}
                            : require('../../../assets/images/avatar.png')
                        }
                      />
                    </View>
                    <View style={styles.rightContainer}>
                      <View style={styles.infoContainer}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: wp(65),
                          }}>
                          <View style={styles.lawyerDetails}>
                            <Text style={styles.lawyerName}>
                              {advocate.name}
                            </Text>
                            <Text style={styles.lawyerTitle}>
                              {advocate?.specialization[0]?.name}
                            </Text>
                            {advocate.location?.city &&
                              advocate.location?.state && (
                                <View style={styles.locationContainer}>
                                  <Text style={styles.locationText}>
                                    {advocate.location.city},{' '}
                                    {advocate.location.state}
                                  </Text>
                                </View>
                              )}
                          </View>

                          <View style={styles.starRating}>
                            <View style={styles.starsContainer}>
                              {[...Array(5)].map((_, index) => (
                                <Image
                                  key={index}
                                  source={require('../../../assets/images/star.png')}
                                  style={styles.starImage}
                                />
                              ))}
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.aboutContainer}>
                    <Text style={styles.aboutHeading}>About</Text>
                    <Text style={styles.aboutText}>
                      {advocate.headLine || 'No description available.'}.
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
          {/* Recent Consultation */}
          <View style={styles.recentConsultationContainer}>
            <Text style={styles.recentConsultationTitle}>
              Upcoming Consultation
            </Text>
            {slotsData?.data?.length === 0 ||
            !slotsData?.data?.some(item =>
              item.slotes.some(slot => slot.status === 'Upcoming'),
            ) ? (
              // If there is no data or no upcoming slots, show the message
              <Text style={styles.noCreatedSlotMessage}>No Upcoming Slots</Text>
            ) : (
              <FlatList
                horizontal
                data={slotData}
                keyExtractor={item => item._id}
                renderItem={({item}) => {
                  return (
                    <TouchableWithoutFeedback
                      onPress={() =>
                        navigation.navigate(navigationStrings.USER_REVIEW, {
                          id: item._id,
                        })
                      }>
                      <ImageBackground
                        source={require('../../../assets/images/consultation.png')}
                        style={styles.consultationCard}
                        imageStyle={styles.cardBorder}>
                        <View style={styles.consultationHeader}>
                          <Text
                            style={[styles.consultantName, {color: '#294776'}]}>
                            {item.advocate.name}
                          </Text>
                          <View
                            style={[
                              styles.callContainer,
                              {borderColor: '#294776'},
                            ]}>
                            <Image
                              source={require('../../../assets/images/schedule/upcomingIcon.png')}
                              style={styles.callIcon}
                              resizeMode="contain"
                            />
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10,
                          }}>
                          <Image
                            source={require('../../../assets/images/icons/note.png')}
                            style={styles.consultIcon}
                            resizeMode="contain"
                          />
                          <Text
                            style={[
                              styles.consultationDate,
                              {color: '#1262D2'},
                            ]}>
                            {item.date}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 5,
                          }}>
                          <Image
                            source={require('../../../assets/images/icons/time.png')}
                            style={styles.consultIcon}
                            resizeMode="contain"
                          />
                          <Text
                            style={[
                              styles.consultationDate,
                              {color: '#1262D2'},
                            ]}>
                            {item.time}
                          </Text>
                        </View>

                        {/* Display Status */}
                      </ImageBackground>
                    </TouchableWithoutFeedback>
                  );
                }}
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingTop: hp('0.2%'),
  },
  banner: {
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2.5%'),
    marginVertical: hp('2%'),
    marginHorizontal: wp('5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: wp('3.5%'),
    fontWeight: '300',
    fontFamily: 'Poppins',
    marginBottom: 3,
  },
  greeting: {
    color: '#F3F7FF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins SemiBold',
  },
  profileComplete: {
    color: '#FF9500',
    fontFamily: 'Poppins',
    fontWeight: '600',
    width: wp('60%'),
  },
  percentage: {
    fontWeight: '700',
    fontSize: wp('3.1%'),
  },
  completeProfileButton: {
    backgroundColor: '#ffffff',
    padding: wp('2%'),
    maxHeight: hp('4.5%'),
    borderRadius: wp('2%'),
    marginTop: hp('2%'),
    marginHorizontal: wp('0.5%'),
  },
  completeProfileText: {
    color: '#1262D2',
    fontWeight: '600',
    fontFamily: 'Poppins',
    fontSize: wp('2.5%'),
  },
  profileContainer: {
    alignItems: 'center',
    // marginTop: 10,
  },
  profileImage: {
    width: wp('18%'),
    height: hp('10%'),
    borderRadius: wp('8%'), // Makes the image round
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('5%'),
  },
  userName: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Poppins SemiBold',
    marginBottom: 0, // Removes extra margin under the name
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('5%'),
    marginTop: hp('0.5%'),
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('1%'),
    paddingVertical: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#1467DA',
    borderRadius: wp('2%'),
    width: wp('21%'),
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: wp('5%'),
    height: hp('3%'),
    resizeMode: 'contain',
  },
  cardLabel: {
    marginTop: hp('1%'),
    fontSize: wp('2.6%'),
    color: '#294776',
    fontFamily: 'Poppins SemiBold',
    textAlign: 'center',
    lineHeight: hp('1.7%'),
  },
  heading: {
    fontSize: wp('2%'),
    fontFamily: 'Poppins SemiBold',
    // fontWeight: '600',
    color: '#294776',
    marginBottom: hp('3%'),
  },
  description: {
    fontSize: wp('3%'),
    fontFamily: 'Poppins',
    // paddingTop: 2,
  },
  recentConsultationContainer: {
    marginHorizontal: wp('5%'),
    marginVertical: hp('1.5%'),
  },
  recentConsultationTitle: {
    fontSize: wp('3.6%'),
    fontFamily: 'Poppins SemiBold',
    // fontWeight: '600',
    color: '#294776',
    marginBottom: hp('1%'),
  },
  consultationCard: {
    width: wp('70%'),
    height: hp('15%'),
    marginRight: wp('5%'),
    padding: wp('2.7%'),
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: wp('5%'),
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  callContainer: {
    width: wp('12%'),
    height: hp('3.5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: '#898989',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('1.8%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  consultantName: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
  },
  consultationDate: {
    fontSize: wp('3%'),
    color: '#1262D2',
    fontFamily: 'Poppins',
    fontWeight: '500',
    marginHorizontal: wp('1.2%'),
  },
  consultationDescription: {
    fontSize: wp('2.6%'),
    color: '#5D5959',
    marginTop: hp('2%'),
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  callIcon: {
    width: wp('5%'),
    height: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  consultIcon: {
    width: 14,
    height: 14,
  },
  flatList: {
    paddingHorizontal: wp('2.5%'),
  },
  advocateCard: {
    borderRadius: wp('2.5%'),
    padding: wp('3%'),
    marginHorizontal: wp('2%'),
    width: wp('60%'),
    height: hp('17%'),
  },
  name: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
    lineHeight: hp('4%'),
  },
  profession: {
    fontSize: wp('3.2%'),
    color: '#666667',
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  timeContainer: {
    backgroundColor: '#FFB74D',
    borderRadius: wp('1.2%'),
    padding: wp('1.2%'),
    // paddingVertical: 5,
    width: wp('18%'),
    height: hp('4%'),
    // marginTop: 10,
  },
  time: {
    fontSize: wp('3%'),
    fontFamily: 'Poppins',
    fontWeight: '400',
    color: '#fff',
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2.5%'),
  },
  status: {
    fontSize: wp('3.2%'),
    fontFamily: 'Poppins',
    fontWeight: '400',
    color: '#FFA000',
    marginLeft: wp('1%'),
  },
  lawyerDetailContainer: {
    marginVertical: hp('2%'),
    borderRadius: wp('1.5%'),
    backgroundColor: '#E4EEFC',
    marginHorizontal: wp('5%'),
    maxHeight: hp('28%'),
    padding: wp('2.5%'),
    position: 'relative', // Ensure the card itself is relative for proper alignment
  },
  leftContainer: {
    marginLeft: -25, // Shift left outside the card
    marginTop: -30, // Shift upward outside the card
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  circleImage: {
    width: wp('19'),
    height: hp('11%'),
    borderRadius: wp('4%'),
    borderWidth: 1,
    borderColor: '#1262D2',
  },
  rightContainer: {
    //     // flex: 1,
    justifyContent: 'flex-start',
    // paddingRight: wp('1%'),
  },

  infoContainer: {
    flex: 1,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
  },
  lawyerDetails: {
    marginBottom: hp('2.5%'),
  },
  lawyerName: {
    fontFamily: 'Poppins SemiBold',
    fontSize: wp('4%'),
    color: '#294776',
    lineHeight: hp('3%'),
  },
  lawyerTitle: {
    color: '#666667',
    fontFamily: 'Poppins',
    fontSize: wp('3.2%'),
    lineHeight: 20,
    // marginVertical: 5,
  },
  starRating: {
    flexDirection: 'row',
  },
  stars: {
    color: '#FFA800', // Gold color for stars
    fontSize: wp('6%'),
    lineHeight: wp('6%'),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 5,
  },
  locationText: {
    color: '#294776',
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: wp('3%'),
  },
  aboutContainer: {
    marginTop: hp('5%'),
    backgroundColor: '#F3F7FF',
    padding: wp('2.5%'),
    borderRadius: wp('1.5%'),
  },
  aboutHeading: {
    // fontWeight: 'bold',
    color: '#294776',
    marginBottom: hp('0.5%'),
    fontFamily: 'Poppins SemiBold',
  },
  aboutText: {
    fontSize: wp('3%'),
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Poppins',
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
  cardBorder: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
  },
  noCreatedSlotMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888', // Or any color of your choice
    marginVertical: 10,
    fontFamily: 'Poppins',
  },
});

export default UserHome;
