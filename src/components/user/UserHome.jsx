import React, {useState, useEffect} from 'react';
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
  RefreshControl,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {getSocket} from '../../../socket';
import {
  useGetAdviseSeekerQuery,
  useGetAllAdvocateQuery,
  useGetUserSlotQuery,
} from '../../redux/api/api';
import navigationStrings from '../../constants/navigationStrings';
import StarRating from '../../../shared/StarRating';
import {handleError} from '../../../shared/authUtils';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const items = [
  {
    id: 1,
    name: 'Notifications\n',
    image: require('../../../assets/images/notification.png'),
    navigateTo: 'UserNotification',
  },
  {
    id: 2,
    name: 'Messages\n',
    image: require('../../../assets/images/send.png'),
    // navigateTo: 'UserChat',
  },
  {
    id: 3,
    name: 'Book Consultation',
    image: require('../../../assets/images/add.png'),
    // navigateTo: 'UserBooking',
  },
  {
    id: 4,
    name: 'Check Feedbacks',
    image: require('../../../assets/images/message.png'),
    // navigateTo: 'FeedbackForm',
  },
];

const data = [
  {
    id: 1,
    name: 'Kajal Gupta',
    profession: 'Civil Lawyer',
    status: 'On Call',
    time: 'In 15 min',
  },
  {
    id: 2,
    name: 'Rajeev Gupta',
    profession: 'Civil Lawyer',
    status: 'On Call',
  },
  {
    id: 3,
    name: 'Rohan Gupta',
    profession: 'Civil Lawyer',
    status: 'On Call',
    time: 'In 15 min',
  },
  {
    id: 4,
    name: 'Ram Gupta',
    profession: 'Civil Lawyer',
    status: 'On Call',
  },
  // Add more items as needed
];

const UserHome = ({navigation}) => {
  const [refresh, setRefresh] = useState(false);
  const {
    data: userData,
    isLoading,
    error,
    refetch: refetchAdviseData,
  } = useGetAdviseSeekerQuery();
  const {
    data: advocateData,
    isLoading: loading,
    error: isError,
    refetch: refetchAdvocateData,
  } = useGetAllAdvocateQuery({
    role: 'Advocate',
    search: '',
    page: 1,
    resultPerPage: 20,
  });
  // console.log("advocateData",advocateData)
  const formattedDate = new Date()
    ? new Date().toLocaleDateString('en-CA')
    : null;
  const {data: slotsData, refetch} = useGetUserSlotQuery(formattedDate, {
    skip: !formattedDate,
  });

  const consultation = slotsData?.data || [];

  const socket = getSocket();
  // console.log("socket",socket)

  const pullMe = async () => {
    try {
      setRefresh(true);
      await Promise.all([
        refetchAdviseData(),
        refetchAdvocateData(),
        refetch(), // Refetch advocate data
      ]);
    } catch (error) {
      console.error('Error during refetch:', error); // Handle errors if needed
    } finally {
      setRefresh(false); // Hide the refresh indicator after both data are fetched
    }
  };

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

  // console.log('UserHome', slotData);
  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.isFocused()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

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
    handleError(error);
    handleError(isError);
    console.log(error);
    // return <Text>An error occurred: {error?.message}</Text>;
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

  const LawyerCardData = ({item}) => {
    return (
      <>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('AdvocateDetailProfile', {
              advocateId: item._id,
            })
          }>
          <View style={styles.cardContainerData}>
            {/* Background Image */}
            <ImageBackground
              source={
                item?.profilePic?.url
                  ? {uri: item?.profilePic.url}
                  : {
                      uri: 'https://t3.ftcdn.net/jpg/02/03/20/66/360_F_203206616_G4fxzVYG6Q19PfoBTGf8tTh83KwRg5Sn.jpg',
                    }
              }
              style={styles.imageBackground}
              imageStyle={{
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 15,
                borderBottomLeftRadius: 15,
              }}>
              <View style={styles.cardWrapper}>
                {/* Tilted Background */}
                <View style={styles.tiltedBackground} />

                {/* Content Section */}
                <View style={styles.cardContent}>
                  <View style={styles.starBadge}>
                    <View style={styles.star}>
                      <StarRating
                        rating={item?.rating?.averageRating || 0}
                        starSize={10}
                      />
                    </View>
                  </View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.profession}>
                    {item?.specialization[0]?.name}
                  </Text>
                  {item?.location?.city && item?.location?.state && (
                    <Text style={styles.location}>
                      {item?.location.city}, {item.location.state}
                    </Text>
                  )}
                </View>
              </View>
            </ImageBackground>
          </View>
        </TouchableWithoutFeedback>
      </>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F7FF" />
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={pullMe} />
          }>
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
                          : {
                              uri: 'https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg',
                            }
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
              key={item.id}
                colors={['#E4EEFC', '#F3F7FF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.card}>
                <TouchableOpacity
                
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

          <View style={{marginVertical: hp('1.5%')}}>
            <FlatList
              data={data}
              renderItem={({item}) => (
                <TouchableOpacity
                // onPress={() => navigation.navigate('UserReview')}
                >
                  <LawyerCard
                    name={item.name}
                    profession={item.profession}
                    status={item.status}
                    time={item.time}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatList}
            />
          </View>
          <View>
            <FlatList
              data={advocateData?.data}
              keyExtractor={item => item._id}
              renderItem={({item}) => <LawyerCardData item={item} />}
              contentContainerStyle={styles.listContainer}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Recent Consultation */}
          <View style={styles.recentConsultationContainer}>
            <Text style={styles.recentConsultationTitle}>
              Upcoming Consultation
            </Text>
            {slotsData?.data?.length === 0 ||
            !slotsData?.data?.some(item =>
              item.slotes.some(slot => slot.status === 'Upcoming'),
            ) ? (
              <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: wp('100%'),
              }}>
              <Image
                source={require('../../../assets/images/NoResult.png')}
                style={{width: 150, height: 150}}
              />
              <Text style={styles.noCreatedSlotMessage}>
                No upcoming slot
              </Text>
            </View>
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
                            {item?.advocate?.name}
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
                            {item?.date}
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
                            {item?.time}
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
    paddingTop: hp('2.5%'),
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
    paddingVertical: hp('1%'),
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
    marginBottom: hp('4%'),
  },
  recentConsultationTitle: {
    fontSize: wp('3.6%'),
    fontFamily: 'Poppins SemiBold',
    // fontWeight: '600',
    color: '#294776',
    // marginBottom: hp('1%'),
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
    height: hp('15%'),
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
  starsContainer: {
    flexDirection: 'row',
    marginRight: 5, // Adjust as needed
  },
  cardBorder: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
  },
  noCreatedSlotMessage: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888', // Or any color of your choice
    marginVertical: 10,
    fontFamily: 'Poppins',
  },
  actionContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007bff',
    fontFamily: 'Poppins',
  },
  circleImage1: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cardContainerData: {
    width: wp('47%'),
    height: hp('27%'),
    // backgroundColor:'yellow',
    backgroundColor: '#DEEEFF',
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    borderBottomLeftRadius: wp('2%'),
    borderBottomRightRadius: wp('2%'),
    alignSelf: 'center',
    marginVertical: hp('2%'),
    marginRight: wp('4%'),
    // marginBottom: hp('4%'),
  },
  imageBackground: {
    width: '100%',
    height: hp('20%'),
  },

  starBadge: {
    alignSelf: 'flex-end',
    marginVertical: 4,
  },
  star: {
    //  backgroundColor:'red',
    position: 'absolute',
    top: -10,
    right: -8,
    paddingVertical: 2,
  },
  cardWrapper: {
    width: wp('48%'),
    height: hp('12%'),
    position: 'relative',
  },
  tiltedBackground: {
    position: 'absolute',
    top: 100,
    left: 0,
    width: '98%',
    height: '80%',
    // backgroundColor:'red',
    backgroundColor: '#DEEEFF',
    borderTopLeftRadius: wp('6.5%'),
    borderTopRightRadius: wp('5%'),
    borderBottomLeftRadius: wp('1.5%'),
    borderBottomRightRadius: wp('7.5%'),
    transform: [{rotate: '-8deg'}], // Tilt the background
  },
  cardContent: {
    position: 'absolute',
    top: 100,
    left: 0,
    width: '100%',
    height: '100%',
    padding: wp('4%'),
    justifyContent: 'center',
    backgroundColor: 'transparent', // Ensure the background remains tilted
  },
  name: {
    marginTop: hp('2%'),
    color: '#294776',
    fontFamily: 'Poppins SemiBold',
    fontSize: hp('2%'),
  },
  profession: {
    color: '#7D7D7D',
    fontFamily: 'Poppins',
    fontSize: hp('1.5%'),
  },
  location: {
    color: '#294776',
    fontFamily: 'Poppins',
    fontSize: hp('1.5%'),
  },
  listContainer: {
    paddingHorizontal: wp('5%'),
  },
});

export default UserHome;
