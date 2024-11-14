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
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {useGetUserAdvocateByIdQuery} from '../../redux/api/api';

const AdvocateDetailProfile = ({navigation, route}) => {
  const {advocateId} = route?.params || {};
  const [activeTab, setActiveTab] = useState('Professional');
  const handleGoBack = () => {
    navigation.goBack();
  };
  const {data, isLoading, error} = useGetUserAdvocateByIdQuery(advocateId);
  // console.log('userAdvocate', data);
  const advocateDetails = data?.data[0];
  console.log(advocateDetails);
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
    return <Text>An error occurred: {error.message}</Text>;
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

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={
          advocateDetails.coverPic?.url
            ? {uri: advocateDetails.coverPic.url}
            : {
                uri: 'https://plus.unsplash.com/premium_photo-1698084059560-9a53de7b816b?q=80&w=2911&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              }
        }
        style={styles.coverImage}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Image
            source={require('../../../assets/images/icons/whiteArrow.png')}
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
                : require('../../../assets/images/avatar.png')
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
                  source={require('../../../assets/images/icons/vector1.png')}
                  style={{width: 24, height: 24}}
                />
                <Text style={styles.consultButtonText}>
                  Book Your Consultancy
                </Text>
              </TouchableOpacity>
            </LinearGradient>
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
              <Text style={styles.ratingText}>5/5</Text>
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
            title="Professional Details"
            active={activeTab === 'Professional'}
            onPress={() => setActiveTab('Professional')}
          />
          <TabButton
            title="Educational Details"
            active={activeTab === 'Educational'}
            onPress={() => setActiveTab('Educational')}
          />
        </View>
        {activeTab === 'Professional' && (
          <>
            <View style={styles.detailsContainer}>
              <Text style={styles.sectionTitle}>Practice Area</Text>
              <View style={styles.practiceArea}>
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
      </View>
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
  const sortedExperiences = [...experiences].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
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
  const sortedEducations = [...educations].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
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
    marginLeft: 5,
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
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
  practiceItem: {
    backgroundColor: '#fff',
    padding: wp('2.5%'),
    borderRadius: wp('2%'),
    marginRight: wp('1.5%'),
    marginBottom: hp('1.5%'),
    fontSize: wp('2.91%'),
    fontFamily: 'Poppins',
    color: '#000',
    fontWeight: '400',
    flexBasis: '30%', // Take up roughly a third of the row
    overflow: 'hidden', // Hide overflow text
    textOverflow: 'ellipsis', // Use ellipsis for overflow text
    whiteSpace: 'nowrap',
    textAlign: 'center',
  },
  practiceAreaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow items to wrap to the next line if needed
    justifyContent: 'flex-start', // Align items to the start
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

export default AdvocateDetailProfile;
