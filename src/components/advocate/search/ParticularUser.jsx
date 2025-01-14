import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import {
  useAdvocateFollowRequestMutation,
  useGetAllAdvocateByIdQuery,
  useGetUserAdvocateByIdQuery,
} from '../../../redux/api/api';
import StarRating from '../../../../shared/StarRating';
import { handleError } from '../../../../shared/authUtils';
// import UserAdvocateReview from './UserAdvocateReview';

const ParticularUser = ({navigation, route}) => {
  const {advocateId} = route?.params || {};
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState('Professional');
  const handleGoBack = () => {
    navigation.goBack();
  };
  const [advocateFollowRequest]=useAdvocateFollowRequestMutation();
  const {data, isLoading, error, refetch} =
    useGetAllAdvocateByIdQuery(advocateId);
  const pullMe = async () => {
    try {
      setRefresh(true);
      await Promise.all([
        refetch(), // Refetch advocate data
      ]);
    } catch (error) {
      console.error('Error during refetch:', error); // Handle errors if needed
    } finally {
      setRefresh(false); // Hide the refresh indicator after both data are fetched
    }
  };
  // console.log('userAdvocate', data);
  const advocateDetails = data?.data;
  // console.log(advocateDetails);
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
    return <Text>An error occurred: {error?.message}</Text>;
  }
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

  const formatDate = dateString => {
    if (!dateString) return 'N/A'; // Return 'N/A' if dateString is falsy

    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date)) return 'N/A';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const TabButton = ({title, active, onPress}) => (
    <TouchableOpacity onPress={onPress} style={styles.tabContainer}>
      <Text style={active ? styles.tabActive : styles.tabInactive}>
        {title}
      </Text>
      <View
        style={active ? styles.activeUnderline : styles.inactiveUnderline}
      />
    </TouchableOpacity>
  );

  const handleFeedback = () => {
    navigation.navigate('FeedbackForm', {id: advocateId});
  };

  const handleFollow = async advocateId => {
    try {
      const res = await advocateFollowRequest({followee: advocateId}).unwrap();
      // console.log(res);
      if (res && res?.success) {
        showMessage({
          message: 'Success',
          description: res?.message,
          type: 'success',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
      } else {
        const errorMsg = res.error?.data?.message || 'Something went wrong!';
        showMessage({
          message: 'Error',
          description: errorMsg,
          type: 'danger',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
      }
    } catch (error) {
      console.error('Failed to send connection request: ', error);
      const errorMsg =
        error?.data?.message ||
        error?.response?.data?.error?.data?.message ||
        'Something went wrong!';
      showMessage({
        message: 'Error',
        description: errorMsg,
        type: 'danger',
        titleStyle: {fontFamily: 'Poppins SemiBold'},
        textStyle: {fontFamily: 'Poppins'},
      });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={pullMe} />
      }>
      <ImageBackground
        source={
          advocateDetails?.coverPic?.url
            ? {uri: advocateDetails.coverPic.url}
            : {
                uri: 'https://plus.unsplash.com/premium_photo-1698084059560-9a53de7b816b?q=80&w=2911&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              }
        }
        style={styles.coverImage}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Image
            source={require('../../../../assets/images/icons/whiteArrow.png')}
            style={{width: 24, height: 24}}
          />
        </TouchableOpacity>

        {/* Profile Image and Consultancy Button */}
        <View style={styles.overlayContainer}>
          <Image
            style={styles.profileImage}
            source={
              advocateDetails.profilePic?.url
                ? {uri: advocateDetails.profilePic.url}
                : require('../../../../assets/images/avatar.png')
            }
          />
          <View style={{marginTop: hp(2)}}>
            <LinearGradient
              colors={['#17316D', '#1262D2']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.consultButton}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() =>
                  navigation.navigate('UserBooking', {id: advocateDetails._id})
                }>
                <Image
                  source={require('../../../../assets/images/icons/vector1.png')}
                  style={{width: 24, height: 24}}
                />
                <Text style={styles.consultButtonText}>
                  Book Your Consultancy
                </Text>
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.starRating}>
              <View style={styles.starsContainer}>
                <StarRating
                  rating={advocateDetails?.averageRating || 0}
                  starSize={18}
                />
              </View>
              <View style={{marginTop: hp('1%')}}>
                <Text style={styles.ratingText}>
                  {advocateDetails?.averageRating}/5
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={{backgroundColor: '#F3F7FF'}}>
        {/* Profile Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{advocateDetails?.name}</Text>
          <Text style={styles.role}>
            {getLastJobTitle(advocateDetails?.experiences)}
          </Text>

          <View style={{marginTop: hp(0.7), paddingHorizontal: wp(1)}}>
            <Text
              style={{
                color: '#294776',
                fontFamily: 'Poppins SemiBold',
                fontSize: wp('4.5%'),
              }}>
              Bio
            </Text>
            <Text style={styles.bio}>{advocateDetails?.headLine}</Text>
          </View>
        </View>

        <View
          style={{
            width: wp('100%'),
            marginVertical: hp(0.7),
            paddingHorizontal: wp(1),
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: wp('6%'),
          }}>
           <TouchableOpacity
              // onPress={() => navigation.navigate('UserFollowing')}
              >
              <Text style={{fontFamily: 'Poppins', alignSelf: 'center'}}>
                {/* {count?.data?.follower || 0} */} {"Count"}
              </Text>
              <Text style={{fontFamily: 'Poppins'}}>Followers</Text>
            </TouchableOpacity>

          <View>
            <TouchableOpacity
              // onPress={() => navigation.navigate('UserFollowing')}
              >
              <Text style={{fontFamily: 'Poppins', alignSelf: 'center'}}>
                {/* {count?.data?.following || 0} */} {"Count"}
              </Text>
              <Text style={{fontFamily: 'Poppins'}}>Following</Text>
            </TouchableOpacity>
            {advocateDetails?.connection === null && (
              <TouchableOpacity
                style={styles.actionButton}
                // onPress={() => handleConnection(advocateId)}
                >
                <Text style={{fontFamily: 'Poppins'}}>Connect</Text>
              </TouchableOpacity>
            )}
          </View>

          <View>
            {advocateDetails?.follow === null && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleFollow(advocateId)}
                >
                <Text style={{fontFamily: 'Poppins'}}>Follow</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
            // onPress={() => handleMessage(advocateDetails)}
            >
              <Text style={{fontFamily: 'Poppins'}}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {advocateDetails?.experience_year} years
            </Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {advocateDetails?.total_cases} Cases
            </Text>
            <Text style={styles.statLabel}>Cases</Text>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>47 Booking</Text>
            <Text style={styles.statLabel}>Session Done</Text>
          </View>
        </View>

        {/* Tabs Section */}
        <View style={styles.tabsContainer}>
          <TabButton
            title={`Professional\nDetails`}
            active={activeTab === 'Professional'}
            onPress={() => setActiveTab('Professional')}
          />
          <TabButton
            title={`Educational\nDetails`}
            active={activeTab === 'Educational'}
            onPress={() => setActiveTab('Educational')}
          />
          <TabButton
            title="Review"
            active={activeTab === 'Review'}
            onPress={() => setActiveTab('Review')}
          />
        </View>
        {activeTab === 'Professional' && (
          <>
            <View style={styles.detailsContainer}>
              <Text style={styles.sectionTitle}>Practice Area</Text>
              {/* <View style={styles.practiceArea}>
                {advocateDetails?.userPracticeAreas &&
                advocateDetails?.userPracticeAreas?.length > 0 ? (
                  <View style={styles.practiceAreaRow}>
                    {advocateDetails.userPracticeAreas.map((item, index) => (
                      <Text key={index} style={styles.practiceItem}>
                        {item.name}
                      </Text>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.notFoundMessage}>
                    No practice areas found
                  </Text>
                )}
              </View> */}

              <View style={styles.practiceArea}>
                {advocateDetails?.userPracticeAreas &&
                advocateDetails?.userPracticeAreas?.length > 0 ? (
                  <FlatList
                    data={advocateDetails.userPracticeAreas}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                      <Text style={styles.practiceItem}>{item.name}</Text>
                    )}
                    numColumns={3} // Adjust number of columns for layout
                    contentContainerStyle={styles.practiceAreaRow}
                  />
                ) : (
                  <Text style={styles.notFoundMessage}>
                    No practice areas found
                  </Text>
                )}
              </View>

              <Text style={styles.sectionTitle}>Professional Details</Text>
              <View
                style={{
                  backgroundColor: '#fff',
                  padding: wp('6.2%'),
                  borderRadius: wp('2.5%'),
                  marginBottom: hp(2),
                }}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Bar Association Number</Text>
                  <Text style={styles.detailValue}>
                    {advocateDetails.bar_council_license_number || 'N/A'}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Year Licensed</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(advocateDetails?.licenseIssueYear)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Specialization</Text>
                  <Text style={styles.detailValue}>Corporate Law</Text>
                  {/* {advocateDetails.specialization?.join(', ') || 'N/A'} */}
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Language Spoken</Text>
                  <Text style={styles.detailValue}>
                    {advocateDetails.language?.join(', ') || 'N/A'}
                  </Text>
                </View>
              </View>
              {/* Professional Experience Section */}
              <Text style={styles.sectionTitle}>Professional Experience</Text>
              {renderExperiences(advocateDetails?.experiences)}
            </View>
          </>
        )}
        {activeTab === 'Educational' && (
          <>
            <View style={styles.detailsContainer}>
              <Text style={styles.sectionTitle}>Professional Educations</Text>
              {renderEducations(advocateDetails?.educations)}
            </View>
            {/* <View style={styles.detailsContainer}>
              <Text style={styles.sectionTitle}>Certificates</Text>
              {renderCertficate(advocateDetails?.certificate)}
            </View> */}
          </>
        )}
        {/* {activeTab === 'Review' && (
          <View style={{marginTop: 10}}>
            <UserAdvocateReview id={advocateId} />
          </View>
        )} */}
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: 'blue',
          width: wp('90%'),
          height: hp('5%'),
          margin: 20,
          borderRadius: 10,
        }}
        onPress={handleFeedback}>
        <Text style={{color: '#fff', textAlign: 'center', padding: 10}}>
          Give Your feedback
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const renderExperiences = experiences => {
  if (!experiences || experiences.length === 0) {
    return <Text style={styles.noExperienceMessage}>No experience added</Text>;
  }
  function formatDate(dateString) {
    // Create a new Date object from the date string
    const date = new Date(dateString);

    // Define options for formatting
    const options = {year: 'numeric', month: 'long', day: 'numeric'};

    // Format the date using toLocaleDateString
    return date.toLocaleDateString('en-US', options);
  }
  // Sort experiences by createdAt (newest first)
  // const sortedExperiences = [...experiences].sort((a, b) => {
  //   return new Date(b.createdAt) - new Date(a.createdAt);
  // });
  const sortedExperiences = [...experiences].sort((a, b) => {
    if (a.isOngoing && !b.isOngoing) {
      return -1; // a is ongoing, so it comes before b
    } else if (!a.isOngoing && b.isOngoing) {
      return 1; // b is ongoing, so it comes before a
    }
  });

  return sortedExperiences.map((experience, index) => {
    const {
      jobTitle,
      firmName,
      startDate,
      endDate,
      isOngoing,
      isRecent,
      description,
    } = experience;

    // Format the dates
    const formattedStartDate = `${formatDate(startDate)}`;
    const formattedEndDate = isOngoing ? 'Present' : `${formatDate(endDate)}`;

    return (
      <View key={index} style={styles.experienceItem}>
        <Text style={styles.experiencePeriod}>
          {formattedStartDate} - {formattedEndDate}
        </Text>

        <Text style={styles.experienceTitle}>
          {jobTitle}, {firmName}
        </Text>

        <Text style={styles.experienceDetail}>{description}</Text>
      </View>
    );
  });
};

const renderEducations = educations => {
  if (!educations || educations.length === 0) {
    return <Text style={styles.noExperienceMessage}>No education added</Text>;
  }
  function formatDate(dateString) {
    // Create a new Date object from the date string
    const date = new Date(dateString);

    // Define options for formatting
    const options = {year: 'numeric', month: 'long', day: 'numeric'};

    // Format the date using toLocaleDateString
    return date.toLocaleDateString('en-US', options);
  }
  // Create a shallow copy and sort by createdAt (newest first)
  // const sortedEducations = [...educations].sort((a, b) => {
  //   return new Date(b.createdAt) - new Date(a.createdAt);
  // });
  const sortedEducations = [...educations].sort((a, b) => {
    if (a.isOngoing && !b.isOngoing) {
      return -1; // a is ongoing, so it comes before b
    } else if (!a.isOngoing && b.isOngoing) {
      return 1; // b is ongoing, so it comes before a
    }
  });

  return sortedEducations.map((education, index) => {
    const {
      school_university,
      degreeType,
      fieldOfStudy,
      startDate,
      endDate,
      isOngoing,
      activities,
    } = education;

    // Format the dates
    const formattedStartDate = `${formatDate(startDate)}`;
    const formattedEndDate = isOngoing ? 'Present' : `${formatDate(endDate)}`;

    return (
      <View key={education._id} style={styles.experienceItem}>
        <Text style={styles.experiencePeriod}>
          {formattedStartDate} - {formattedEndDate}
        </Text>

        {/* Display education details */}
        <Text style={styles.experienceTitle}>
          {degreeType} in {fieldOfStudy}, {school_university}
        </Text>

        <Text style={styles.experienceDetail}>
          Studied {fieldOfStudy}, with a focus on {degreeType}. Activities:{' '}
          {activities}
        </Text>
      </View>
    );
  });
};

const renderCertficate = certificates => {
  if (!certificates || certificates.length === 0) {
    return <Text style={styles.noExperienceMessage}>No certificate added</Text>;
  }

  function formatDate(dateString) {
    // Create a new Date object from the date string
    const date = new Date(dateString);

    // Define options for formatting
    const options = {year: 'numeric', month: 'long', day: 'numeric'};

    // Format the date using toLocaleDateString
    return date.toLocaleDateString('en-US', options);
  }

  // Sort experiences by createdAt (newest first)
  const sortedCertificate = [...certificates].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return sortedCertificate.map((certificate, index) => {
    const {issueDate, certificate_name, firmName, certificate_number} =
      certificate;

    // Format the dates

    return (
      <View key={index} style={styles.experienceItem}>
        <Text style={styles.experiencePeriod}>
          Issue Date: {formatDate(issueDate)}
        </Text>

        <Text style={styles.experienceTitle}>{certificate_name}</Text>
        <Text style={styles.experienceDetail}>
          Certificate Number: {certificate_number}
        </Text>

        <Text style={styles.experienceDetail}>Issued by: {firmName}</Text>
      </View>
    );
  });
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F9F9F9',
  },

  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  coverImage: {
    width: wp(100),
    height: hp(28),
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: hp('5%'),
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  overlayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: -68,
    zIndex: 1,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#1262D2',
    marginRight: wp('5%'),
  },
  consultButton: {
    paddingVertical: hp(1.5),
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  consultButtonText: {
    color: '#F3F7FF',
    fontSize: 14,
    fontFamily: 'Poppins SemiBold',
    fontWeight: '600',
    marginLeft: 10,
  },
  ratingText: {
    // marginLeft: 3,
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#fff',
    height: 23,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 12,
    justifyContent: 'flex-end',
    backgroundColor: '#1262D2',
  },
  starRating: {
    flexDirection: 'row',
    marginVertical: hp('1%'),
    marginHorizontal: 5,
    justifyContent: 'flex-end',
    marginHorizontal: wp('5%'),
  },
  stars: {
    color: '#FFA800',
    fontSize: wp('6%'),
    lineHeight: 25,
  },
  infoContainer: {
    alignItems: 'left',
    marginTop: hp('10%'),
    marginBottom: hp(2),
    paddingHorizontal: wp('5%'),
  },
  name: {
    fontSize: wp('6.5%'),
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
    lineHeight: 40,
  },
  role: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins',
    color: '#75797E',
    lineHeight: 20,
  },

  bio: {
    fontSize: wp('3.2%'),
    color: '#75797E',
    fontFamily: 'Poppins',
    fontWeight: '400',
    marginVertical: hp(0.4),
    lineHeight: 20,
    textAlign: 'justify',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: wp('5%'),
    backgroundColor: '#fff',
  },
  stat: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: wp('4%'),
    color: '#294776',
    fontFamily: 'Poppins SemiBold',
    lineHeight: 18,
  },
  statLabel: {
    fontSize: wp('4%'),
    color: '#294776',
    fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: 22,
  },
  verticalLine: {
    width: 1,
    height: 50,
    backgroundColor: '#989898',
    marginHorizontal: wp('1%'),
  },
  tabsContainer: {
    width: wp(100),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#E4EEFC',
    paddingVertical: 15,
  },
  tabContainer: {
    alignItems: 'center',
  },
  tabActive: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: '#1262D2',
    textAlign: 'center',
  },
  tabInactive: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: '#939393',
    textAlign: 'center',
  },
  activeUnderline: {
    height: 2,
    backgroundColor: '#1262D2',
    width: '100%',
    // marginTop: 5,
  },
  inactiveUnderline: {
    height: 2,
    backgroundColor: '#E4EEFC',
    width: '100%',
    marginTop: 5,
  },
  detailsContainer: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
  },
  sectionTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
    marginBottom: hp('1%'),
  },
  practiceArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: hp('2%'),
  },
  practiceAreaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  practiceItem: {
    backgroundColor: '#fff',
    padding: wp('2.5%'),
    borderRadius: wp('2%'),
    margin: wp('1%'),
    fontSize: wp('2.91%'),
    fontFamily: 'Poppins',
    color: '#000',
    fontWeight: '400',
    textAlign: 'center',
    // flex: 1,
    maxWidth: '60%', // Adjust for 3-column layout
  },
  detailItem: {
    marginBottom: hp('1%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins',
    color: '#294776',
    fontWeight: '400',
  },
  detailValue: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins',
    color: '#294776',
    fontWeight: '400',
  },
  experienceItem: {
    backgroundColor: '#fff',
    padding: wp('4.5%'),
    borderRadius: wp('4%'),
    marginBottom: hp('1%'),
  },
  experienceTitle: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
  },
  experiencePeriod: {
    fontSize: wp('4%'),
    color: '#000',
    fontFamily: 'Poppins SemiBold',
    // fontWeight:'600',
    marginVertical: 5,
  },
  experienceDetail: {
    fontSize: wp('3.5%'),
    color: '#636363',
    fontFamily: 'Poppins',
    fontWeight: '400',
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
  notFoundMessage: {
    fontSize: 16,
    color: '#888', // Example color
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
});

export default ParticularUser;
