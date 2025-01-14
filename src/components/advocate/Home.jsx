import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  RefreshControl,
  ImageBackground,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {
  useGetAdvocateQuery,
  useGetAdvocateSlotsQuery,
} from '../../redux/api/api';
import StarRating from '../../../shared/StarRating';
import { handleError } from '../../../shared/authUtils';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Home = ({navigation}) => {
  const [refresh, setRefresh] = useState(false);
  const {
    data,
    error,
    isLoading,
    refetch: refetchAdvocateData,
  } = useGetAdvocateQuery();
  const {data: slotsData, refetch} = useGetAdvocateSlotsQuery({});

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const pullMe = async () => {
    try {
      setRefresh(true);
      await Promise.all([
        refetchAdvocateData(),
        refetch(), // Refetch advocate data
      ]);
    } catch (error) {
      handleError(error);
      console.error('Error during refetch:', error); // Handle errors if needed
    } finally {
      setRefresh(false); // Hide the refresh indicator after both data are fetched
    }
  };

  // if (isLoading) {
  //   return (
  //     <View style={styles.shimmerContainer}>
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           justifyContent: 'space-between',
  //           maxWidth: '90%',
  //         }}>
  //         <View style={{width:'70%'}}>
  //           <ShimmerPlaceholder style={[styles.shimmerText,{width:'70%'}]} />
  //           <ShimmerPlaceholder style={styles.shimmerText} />
  //         </View>
  //         <ShimmerPlaceholder
  //           style={{width: 70, height: 70, borderRadius: 50}}
  //         />
  //          </View>
  //         <View>
  //           <ShimmerPlaceholder style={[styles.shimmerText]} />
  //           <ShimmerPlaceholder style={[styles.shimmerText]} />
  //         </View>

  //     </View>
  //   );
  // }

  // Handle error state
  if (error) {
    console.log(error)
    handleError(error)
    return <Text>An error occurred: {error?.data}</Text>
  }

  const items = [
    {
      id: 1,
      name: 'View Invitation',
      image: require('../../../assets/images/notification.png'),
      navigateTo: 'AllUserRequest',
    },
    {
      id: 2,
      name: 'Notifications\n',
      // name: 'Messages\n',
      // image: require('../../../assets/images/send.png'),
      image: require('../../../assets/images/notification.png'),
      navigateTo: 'Notification',
    },
    {
      id: 3,
      name: 'Add Availability',
      image: require('../../../assets/images/add.png'),
      navigateTo: 'AdvocateAvailability',
    },
    {
      id: 4,
      name:'Chat\n',
      image: require('../../../assets/images/message.png'),
      // navigateTo: 'AdvocateChat'
    },
  ];

  const cards = [
    {
      id: 1,
      title: 'Total',
      number: '0',
      description: 'Appointments',
      color: '#FF00AA',
      backgroundImage: require('../../../assets/images/completed.png'),
      icon: require('../../../assets/images/icons/tick.png'), // Replace with your icon
    },
    {
      id: 2,
      title: 'Completed',
      number: '0',
      description: 'Appointments',
      color: '#1467DA',
      backgroundImage: require('../../../assets/images/upcoming.png'),
      icon: require('../../../assets/images/icons/tick-circle.png'),
    },
    {
      id: 3,
      title: 'Upcoming',
      number: '0',
      description: 'Appointments',
      color: '#FFA500',
      backgroundImage: require('../../../assets/images/missed.png'),
      icon: require('../../../assets/images/icons/upcomingIcon.png'),
    },
    {
      id: 4,
      title: 'Missed',
      number: '0',
      description: 'Appointments',
      color: '#FF0043',
      backgroundImage: require('../../../assets/images/total.png'),
      icon: require('../../../assets/images/icons/infoCrcle.png'), // Replace with your icon
    },
  ];

  return (
    <>
      <StatusBar
        barStyle="dark-content" // Options: 'default', 'light-content', 'dark-content'
        backgroundColor="#F3F7FF" // Background color for Android
      />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={pullMe} />
        }>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('UpdateBio')}>
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
                    Hi, {data && data?.data[0]?.name} !
                  </Text>

                  <Text style={styles.profileComplete}>
                    <Text style={styles.percentage}>Profile 60% Complete</Text>
                  </Text>
                </View>

                <View style={{marginTop: hp('2.3%')}}>
                  <StarRating rating={data?.data[0]?.averageRating || 0} />
                </View>
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
                      data &&
                      data?.data[0]?.profilePic &&
                      data.data[0].profilePic.url
                        ? {uri: data.data[0].profilePic.url}
                        : require('../../../assets/images/avatar.png')
                    } // Path to the profile image
                    style={styles.profileImage}
                  />
                )}
              </AnimatedCircularProgress>
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
        {/* <View style={styles.cardContainer}>
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
        </View> */}
        <View style={styles.cardContainer}>
          {items.map(item => (
            <LinearGradient
              key={item.id} // Move the key to the outermost element
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
                <View style={styles.iconContainer}>
                  <Image source={item.image} style={styles.iconImage} />
                </View>
                <Text style={styles.cardLabel}>{item.name}</Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.statsContainer}>
          <Text style={styles.heading}>Appointment Stats</Text>
          <View style={styles.statsSubContainer}>
            {cards.map(card => (
              <ImageBackground
                key={card.id}
                source={card.backgroundImage} // Set your background image here
                style={styles.statsCard}
                resizeMode="cover" // Adjust the resize mode as needed
                imageStyle={{borderRadius: 20}}>
                <Image source={card.icon} style={styles.icon} />
                <View style={styles.cardContent}>
                  <Text style={styles.statsTitle}>{card.number}</Text>

                  {/* <View style={{flexDirection: 'row'}}> */}
                  <Text style={[styles.number, {color: card.color}]}>
                    {card.title}
                  </Text>
                  {/* <Text
                    style={[
                      styles.description,
                      {color: card.color, marginLeft: 2},
                    ]}>
                    {card.description}
                  </Text>
                </View> */}
                </View>
              </ImageBackground>
            ))}
          </View>
        </View>

        {/* Recent Consultation */}
        <View style={styles.recentConsultationContainer}>
          <Text style={styles.recentConsultationTitle}>
            Upcoming Consultation
          </Text>
          <View style={{paddingVertical: hp('0.5%')}}>
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
                data={slotsData?.data}
                keyExtractor={item => item._id}
                renderItem={({item}) => (
                  <>
                    {item?.slotes
                      .filter(slot => slot.status === 'Upcoming')
                      .map(slot => (
                        <TouchableWithoutFeedback
                          onPress={() =>
                            navigation.navigate('ConsultationDetails', {
                              id: slot._id,
                            })
                          }>
                          <ImageBackground
                            key={slot._id}
                            source={require('../../../assets/images/consultation.png')}
                            style={styles.consultationCard}
                            imageStyle={styles.cardBorder}>
                            <View style={styles.consultationHeader}>
                              <Text
                                style={[
                                  styles.consultantName,
                                  {color: '#1262D2'},
                                ]}>
                                {slot.client.name}
                              </Text>

                              <View
                                style={[
                                  styles.callContainer,
                                  {borderColor: '#1262D2'},
                                ]}>
                                <Image
                                  source={require('../../../assets/images/schedule/upcomingIcon.png')}
                                  style={styles.callIcon}
                                  resizeMode="contain"
                                />
                              </View>
                            </View>
                            <View style={{flexDirection: 'row'}}>
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
                                {new Date(item.date).toLocaleDateString(
                                  'en-GB',
                                  {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  },
                                )}
                              </Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
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
                                {Array.isArray(slot.serviceType)
                                  ? slot.serviceType.join(', ')
                                  : slot.serviceType}
                              </Text>
                            </View>
                          </ImageBackground>
                        </TouchableWithoutFeedback>
                      ))}
                  </>
                )}
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#F3F7FF',
    // paddingTop: hp('4.5%'),
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
    lineHeight: 24,
  },
  greeting: {
    color: '#F3F7FF',
    fontSize: 16,
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
    marginHorizontal: wp('5%'),
  },
  userName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#294776',
    fontFamily: 'Poppins SemiBold',
    marginBottom: 0, // Removes extra margin under the name
  },
  userId: {
    fontSize: wp('3%'),
    color: '#6D6A6A',
    marginTop: 0, // Ensures no space from the top
    lineHeight: 12, // Matches font size for tight spacing
  },
  heading: {
    fontSize: wp('3.6%'),
    fontFamily: 'Poppins SemiBold',
    // fontWeight: '600',
    color: '#294776',
    marginVertical: hp('1.2%'),
  },
  statsContainer: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
  },
  statsSubContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsCard: {
    width: wp('43%'),
    height: hp('15%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    // alignItems:'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardBorder: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
  },
  icon: {
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
  },
  cardContent: {
    marginTop: 'auto',
  },
  number: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins SemiBold',
    fontWeight: '600',
  },
  statsTitle: {
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
  },
  description: {
    fontSize: wp('3%'),
    fontFamily: 'Poppins',
    // paddingTop: 2,
  },
  recentConsultationContainer: {
    marginHorizontal: wp('5%'),
    marginVertical: hp('0.5%'),
  },
  recentConsultationTitle: {
    fontSize: wp('3.6%'),
    fontFamily: 'Poppins SemiBold',
    // fontWeight: '600',
    color: '#294776',
    marginBottom: hp('1%'),
  },
  consultationCard: {
    width: wp('69%'),
    height: hp('15%'),
    marginRight: wp('5%'),
    padding: wp('2.7%'),
    justifyContent: 'space-between',
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: wp('5%'),
    marginBottom: hp('2%'),
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
  noCreatedSlotMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888', // Or any color of your choice
    marginVertical: 10,
    fontFamily: 'Poppins',
  },
  shimmerBox: {
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2.5%'),
    marginVertical: hp('2%'),
    marginHorizontal: wp('5%'),
  },
  shimmerText: {
    // width: '70%',
    height: 20,
    borderRadius: 4,
    marginBottom: 10,
  },
  shimmerContainer: {
    maxWidth: '90%',
    margin: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Ensures cards wrap if there's not enough space
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
  iconContainer: {
    alignItems: 'center', // Center the icon horizontally
    justifyContent: 'center', // Center the icon vertically
    width: wp('5%'), // Maintain consistent spacing for icons
    height: hp('3%'),
    marginBottom: hp('0.5%'), // Space between icon and text
  },
  iconImage: {
    width: '100%', // Full width of the container
    height: '100%', // Full height of the container
    resizeMode: 'contain',
  },
  cardLabel: {
    fontSize: wp('2.6%'),
    color: '#294776',
    fontFamily: 'Poppins SemiBold',
    textAlign: 'center',
    lineHeight: hp('1.7%'),
  },
});

export default Home;
