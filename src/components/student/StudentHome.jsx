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
import LegalDictionary from './home/LegalDictionary';
import StarRating from '../../../shared/StarRating';
import {
  useGetAllStudentUserQuery,
  useGetStudentQuery,
  useGetStudentSlotQuery,
} from '../../redux/api/api';
import {handleError} from '../../../shared/authUtils';

const items = [
  {
    id: 1,
    name: 'View Invitation',
    image: require('../../../assets/images/notification.png'),
    // navigateTo: 'AllUserRequest',
  },
  {
    id: 2,
    name: 'Notifications\n',
    // name: 'Messages\n',
    // image: require('../../../assets/images/send.png'),
    image: require('../../../assets/images/notification.png'),
    navigateTo: 'StudentNotification',
  },
  {
    id: 3,
    name: 'Feedback',
    image: require('../../../assets/images/add.png'),
    navigateTo: 'Feedback',
  },
  {
    id: 4,
    name:'Chat\n',
    image: require('../../../assets/images/message.png'),
    // navigateTo: 'StudentChat'
  },
];

const StudentHome = ({navigation}) => {
  const [refresh, setRefresh] = useState(false);

  const {data: userData, isLoading, error, refetch} = useGetStudentQuery();
  const {
    data: advocateData,
    isLoading: loading,
    error: isError,
    refetch: refetchAdvocateData,
  } = useGetAllStudentUserQuery({
    role: 'Advocate',
    search: '',
    page: 1,
    resultPerPage: 500,
  });
  // console.log('student', advocateData);
  const userDetails = userData?.data[0];
  const formattedDate = new Date()
  ? new Date().toLocaleDateString('en-CA')
  : null;
const {data: slotsData, refetch:refetchSlot} = useGetStudentSlotQuery(formattedDate, {
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
const slotData = formattedSlots?.flatMap(item =>
  item.slots.map(slot => ({...slot, date: item.date})),
);

  const pullMe = async () => {
    try {
      setRefresh(true);
      await Promise.all([
        refetch(),
        refetchSlot(),
        refetchAdvocateData(),
      ]);
    } catch (error) {
      console.error('Error during refetch:', error); // Handle errors if needed
    } finally {
      setRefresh(false); // Hide the refresh indicator after both data are fetched
    }
  };

  if (isLoading || loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle error state
  if (error || isError) {
    const errorLog=error || isError;
    handleError(errorLog);
    console.log(error);
    return <Text>An error occurred: {error?.message}</Text>;
  }

  const data = [
    {
      id: '1',
      category: 'Category',
      description:
        'Secondary school law:dsajirau fdoakdsa Secondary school law:dsajirau fdoakdsa',
      location: 'Delhi High Court',
      date: 'Feb 19, 2024',
    },
    {
      id: '2',
      category: 'Category',
      description: 'Primary school law:description here',
      location: 'Mumbai High Court',
      date: 'Mar 10, 2024',
    },
    // Add more items as needed
  ];

  //   const advocateData = {
  //     data: [
  //       {
  //         _id: '1',
  //         name: 'Ankush Gupta',
  //         title: 'Civil Lawyer',
  //         location: 'Lucknow, Uttar Pradesh',
  //         rating: 4.5,
  //         url: 'https://t4.ftcdn.net/jpg/02/95/96/79/360_F_295967926_T2nUnmhQc00dwwp3KsvJSPHMP2xhekry.jpg',
  //         headLine: 'Experienced civil lawyer with 10+ years of practice.',
  //       },
  //       {
  //         _id: '2',
  //         name: 'Priya Sharma',
  //         title: 'Criminal Lawyer',
  //         location: 'Delhi, India',
  //         rating: 4.8,
  //         url: 'https://media.istockphoto.com/id/1326920136/photo/shot-of-a-business-women-using-laptop-working-at-home-stock-photo.jpg?s=612x612&w=0&k=20&c=tDhOPNMfBUlZLy5titrUrOXfHVbhVosEoQveTwuuL1Y=',
  //         headLine:
  //           'Dedicated to criminal justice with a track record of success.',
  //       },
  //       {
  //         _id: '3',
  //         name: 'Rahul Verma',
  //         title: 'Corporate Lawyer',
  //         location: 'Mumbai, Maharashtra',
  //         rating: 4.2,
  //         url: 'https://t4.ftcdn.net/jpg/02/95/96/79/360_F_295967926_T2nUnmhQc00dwwp3KsvJSPHMP2xhekry.jpg',
  //         headLine: 'Specialist in corporate law and legal compliance.',
  //       },
  //       {
  //         _id: '4',
  //         name: 'Sneha Reddy',
  //         title: 'Family Lawyer',
  //         location: 'Hyderabad, Telangana',
  //         rating: 4.6,
  //         url: 'https://media.istockphoto.com/id/1326920136/photo/shot-of-a-business-women-using-laptop-working-at-home-stock-photo.jpg?s=612x612&w=0&k=20&c=tDhOPNMfBUlZLy5titrUrOXfHVbhVosEoQveTwuuL1Y=',
  //         headLine: 'Expert in family law, custody, and marital disputes.',
  //       },
  //       {
  //         _id: '5',
  //         name: 'Arjun Mehta',
  //         title: 'Property Lawyer',
  //         location: 'Bangalore, Karnataka',
  //         rating: 4.9,
  //         url: 'https://t4.ftcdn.net/jpg/02/95/96/79/360_F_295967926_T2nUnmhQc00dwwp3KsvJSPHMP2xhekry.jpg',
  //         headLine: 'Helping businesses protect their intellectual property.',
  //       },
  //     ],
  //   };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('LegalUpdate')}>
      <View
        style={{
          flexDirection: 'row',
          maxWidth: wp('100%'),
          //   backgroundColor: 'yellow',
          alignItems: 'flex-start',
        }}>
        <View style={styles.imagePlaceholder} />
        <View style={{marginLeft: wp('2.5%')}}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  const LawyerCard = ({item}) => {
    return (
      <>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('StudentAdvocateProfile', {
              advocateId: item._id,
            })
          }>
          <View style={styles.cardContainer}>
            {/* Background Image */}
            <ImageBackground
              // source={{uri: "https://t3.ftcdn.net/jpg/02/03/20/66/360_F_203206616_G4fxzVYG6Q19PfoBTGf8tTh83KwRg5Sn.jpg"}}
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
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={pullMe} />
        }>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('StudentBio')}
        >
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
                  <Text style={styles.greeting}>Hi, {userDetails?.name}!</Text>

                  <Text style={styles.profileComplete}>
                    <Text style={styles.percentage}>Profile 60% Complete</Text>
                  </Text>
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
        <View style={styles.cardContainerData}>
          {items.map(item => (
            <LinearGradient
              key={item.id} // Move the key to the outermost element
              colors={['#E4EEFC', '#F3F7FF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.cardData}>
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
        <View>
          <Text style={styles.headingText}>Legal Updates</Text>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
        <View style={styles.header}>
          <View
            // source={{
            //   uri: 'https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg',
            // }}
            style={styles.icon}
          />
          <Text style={styles.headerText}>
            Access expert legal insights from top advocates, all in one place.
            Connect, read, and consult with ease for the best legal solutions.
          </Text>
        </View>
        <View style={{marginHorizontal: wp('5%')}}>
          <LegalDictionary />
        </View>
        <View>
          <FlatList
            data={advocateData?.data}
            keyExtractor={item => item._id}
            renderItem={({item}) => <LawyerCard item={item} />}
            contentContainerStyle={styles.listContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={[styles.recentConsultationContainer,{marginBottom:hp('4%')}]}>
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
                        navigation.navigate("BookingView", {
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingTop:hp('2.5%')
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
  headingText: {
    fontSize: hp('2%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('0.5%'),
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
  },
  listContainer: {
    paddingHorizontal: wp('5%'),
  },
  card: {
    backgroundColor: '#E8F1FF',
    borderRadius: wp('1%'),
    padding: wp('4%'),
    marginRight: wp('4%'),
    width: wp('74%'),
  },
  imagePlaceholder: {
    width: wp('15%'),
    height: hp('8%'),
    borderRadius: 10,
    backgroundColor: '#D3D3D3',
    marginBottom: hp('2%'),
  },
  category: {
    fontSize: hp('1.5%'),
    fontWeight: '600',
    color: '#1A73E8',
    marginBottom: hp('0.8%'),
    fontFamily: 'Poppins',
  },
  description: {
    fontSize: hp('1.4%'),
    fontWeight: '400',
    color: '#000',
    maxWidth: wp('50%'),
    fontFamily: 'Poppins',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: hp('1.4%'),
    color: '#7A7A7A',
    fontFamily: 'Poppins',
  },
  date: {
    fontSize: hp('1.4%'),
    color: '#7A7A7A',
    fontFamily: 'Poppins',
  },
  header: {
    backgroundColor: '#FEEBC8',
    padding: wp('4%'),
    borderRadius: wp('1%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('2%'),
    marginHorizontal: wp('5%'),
  },
  icon: {
    width: wp('14%'),
    height: hp('7%'),
    marginRight: wp('3%'),
    backgroundColor: '#D3D3D3',
    borderRadius: wp('1%'),
  },
  headerText: {
    flex: 1,
    fontSize: hp('1.4%'),
    color: '#4A5568',
    fontFamily: 'Poppins',
  },
  cardContainer: {
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
  recentConsultationContainer: {
    marginHorizontal: wp('5%'),
    marginVertical: hp('0.2%'),
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
  cardContainerData: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Ensures cards wrap if there's not enough space
    justifyContent: 'space-between',
    marginHorizontal: wp('5%'),
    marginTop: hp('0.5%'),
  },
  cardData: {
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

export default StudentHome;
