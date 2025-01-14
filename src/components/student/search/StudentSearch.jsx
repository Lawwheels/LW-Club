import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  useGetAllStudentUserQuery,
  useStudentSendRequestMutation,
} from '../../../redux/api/api';
import StudentSearchFilter from './StudentSearchFilter';


const commonIssues = [
  {id: '1', title: 'Contract Disputes', icon: 'gavel'},
  {id: '2', title: 'Property Disputes', icon: 'home'},
  {id: '3', title: 'Divorce and Family Law', icon: 'family-restroom'},
  {id: '4', title: 'Contract Disputes', icon: 'gavel'},
  {id: '5', title: 'Property Disputes', icon: 'home'},
];

// Search bar component
const SearchBar = ({searchQuery, setSearchQuery, openFilterModal}) => {
  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.searchContainer}>
      <TouchableOpacity onPress={handleGoBack}>
        <Image
          source={require('../../../../assets/images/back.png')}
          style={{width: 24, height: 24}}
          resizeMode="contain" // Adjust as needed
        />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          style={styles.searchInput}
          placeholderTextColor="#999" // You can customize the placeholder color here
        />
        <Image
          source={require('../../../../assets/images/icons/tabIcon/searchIcon.png')}
          style={styles.searchIcon}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity onPress={openFilterModal}>
        <Image
          source={require('../../../../assets/images/icons/tabIcon/filterIcon.png')}
          style={{width: 30, height: 30}}
          resizeMode="contain" // Adjust as needed
        />
      </TouchableOpacity>
    </View>
  );
};

// Common Issues section
const CommonIssues = () => {
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Common Legal Issues</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SearchCategory')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={commonIssues}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={styles.commonIssueCard}>
            <Image
              source={{
                uri: 'https://plus.unsplash.com/premium_photo-1698084059560-9a53de7b816b?q=80&w=2911&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              }} // Path to the profile image
              style={{
                width: wp('27.5%'),
                height: hp('10%'),
                alignSelf: 'center',
                borderTopLeftRadius: wp('1%'),
                borderTopRightRadius: hp('1%'),
              }}
            />
            <Text style={styles.commonIssueText}>{item.title}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

// Recent Lawyers section
const RecentLawyers = ({lawyersData, searchQuery, sendRequest, navigation}) => {
  const lawyers = lawyersData?.data || [];

  const filteredLawyers = searchQuery
    ? lawyers
        .filter(
          lawyer =>
            lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            lawyer?.connection?.status !== 'accepted', // Exclude "accepted" status
        )
        .slice(0, 4) // Limit to the first 4 lawyers
    : lawyers
        .filter(lawyer => lawyer?.connection?.status !== 'accepted') // Exclude "accepted" status
        .slice(0, 4); // Limit to the first 4 lawyers

  const handleConnect = async userId => {
    try {
      const res = await sendRequest({userId: userId}).unwrap();
      console.log(res);
      if (res && res?.success) {
        showMessage({
          message: 'Success',
          description: res?.message,
          type: 'success',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
        navigation.navigate('StudentNavigator');
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
    } finally {
    }
  };
  return (
    <View style={{marginTop: hp('3%')}}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('ViewAllUserList')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginHorizontal: wp('5%')}}>
        <FlatList
          data={filteredLawyers}
          numColumns={2}
          renderItem={({item, index}) => {
            const isPending = item?.connection?.status === 'pending';
            const isLastCard =
              filteredLawyers.length % 2 !== 0 &&
              index === filteredLawyers.length - 1;
            console.log(item.specialization[0].name);
            return (
              <TouchableOpacity
                style={[
                  styles.lawyerCard,
                  isLastCard && {flex: 0.45}, // Adjust width for the last card if odd
                ]}
                onPress={() =>
                  navigation.navigate('StudentAdvocateProfile', {
                    advocateId: item._id,
                  })
                }>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{
                      uri:
                        item?.profilePic?.url ||
                        'https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg',
                    }}
                    style={styles.avatar}
                  />
                  {/* {item.isVerified && (
                    <Image
                      source={require('../../../assets/images/verifyIcon.png')}
                      style={styles.verifyIcon}
                    />
                  )} */}
                </View>
                <Text style={styles.lawyerName}>{item.name}</Text>
                <Text style={styles.lawyerExperience}>
                  {/* {item.experience_year} */}
                  {item.specialization[0].name}
                </Text>

                {/* {item.location && (
                  <Text style={styles.lawyerLocation}>
                    <Image
                      source={require('../../../../assets/images/icons/locationIcon.png')}
                      style={{width: 18, height: 18, marginRight: 10}}
                    />
                    {`${item.location.city} ${item.location.state}, ${item.location.country}`}
                  </Text>
                )} */}
                {item.connection === null ? (
                  <TouchableOpacity
                    style={styles.connectButton}
                    onPress={() => handleConnect(item._id)}>
                    <Text style={styles.connectButtonText}>Connect</Text>
                  </TouchableOpacity>
                ) : null}
                {isPending && (
                  <View style={[styles.pendingButton, {flexDirection: 'row'}]}>
                    <Image
                      source={require('../../../../assets/images/clock.png')}
                      style={{width: 18, height: 18, marginRight: 10}}
                    />
                    <Text
                      style={{
                        fontFamily: 'Poppins',
                        fontSize: 14,
                        color: '#8e8e8e',
                      }}>
                      Pending
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item._id}
        />
      </View>
    </View>
  );
};

// Main Component
const StudentSearch = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({}); // To hold the applied filters
  const [refresh,setRefresh]=useState(false);

  const {data, isLoading, isError, refetch} = useGetAllStudentUserQuery({
    role: 'Advocate',
    search: '',
    page: 1,
    resultPerPage: 20,
  });
  const [studentSendRequest] = useStudentSendRequestMutation();
  // Function to open the filter modal
  const openFilterModal = () => setFilterModalVisible(true);

  // Function to close the filter modal
  const closeFilterModal = () => setFilterModalVisible(false);

  // Function to apply filters
  const applyFilters = newFilters => {
    setFilters(newFilters);
    console.log('Filters applied:', newFilters);
  };

  const pullMe = async () => {
    try {
      setRefresh(true);
      await Promise.all([
        refetch(),
      
      ]);
    } catch (error) {
      console.error('Error during refetch:', error); // Handle errors if needed
    } finally {
      setRefresh(false); // Hide the refresh indicator after both data are fetched
    }
  };
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to fetch user requests.</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          openFilterModal={openFilterModal}
        />
        <KeyboardAwareScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}  refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={pullMe} />
          }>
          <CommonIssues />
          <RecentLawyers
            searchQuery={searchQuery}
            lawyersData={data}
            sendRequest={studentSendRequest}
            navigation={navigation}
          />
        </KeyboardAwareScrollView>
        <StudentSearchFilter
          visible={filterModalVisible}
          onClose={closeFilterModal}
          applyFilters={applyFilters} // Pass function to apply filters
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingTop: wp('5%'),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp('1%'),
    padding: wp('4%'),
    marginTop: wp('1%'),
  },
  inputContainer: {
    flex: 1,
    height: hp('6.75%'), // Adjust the height as needed
    backgroundColor: '#F3F7FF',
    borderWidth: 1,
    borderColor: '#294776',
    borderRadius: wp('4.5%'),
    position: 'relative', // Position relative for the icon
    marginHorizontal: wp('1%'),
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingLeft: wp('5%'),
    color: '#000',
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins',
  },
  searchIcon: {
    position: 'absolute',
    right: 10, // Adjust the right position of the icon
    top: '50%', // Center vertically
    transform: [{translateY: -12}], // Adjust as needed to center the icon
    width: 24,
    height: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
    paddingHorizontal: wp('5%'),
  },
  sectionTitle: {
    fontSize: wp('4%'),
    // fontWeight: 'bold',
    fontFamily: 'Poppins SemiBold',
  },
  viewAll: {
    fontSize: wp('3.7%'),
    color: '#294776',
    fontFamily: 'Poppins',
    fontWeight: '500',
  },
  commonIssueCard: {
    backgroundColor: '#E4EEFC',
    borderRadius: wp('1%'),
    marginLeft: wp('4%'),
  },
  commonIssueText: {
    paddingHorizontal: wp('3.2%'),
    paddingVertical: hp('1.5%'),
    // marginTop: 5,
    fontSize: wp('3%'),
    textAlign: 'center',
    fontFamily: 'Poppins',
    width: wp(28),
    // backgroundColor:'pink'
  },
  lawyerCard: {
    flex: 1,
    backgroundColor: '#E4EEFC',
    borderRadius: wp('3.75%'),
    padding: wp('4.5%'),
    margin: wp('2.5%'),
  },
  avatarContainer: {
    position: 'relative', // Parent container for avatar and verify icon
  },
  avatar: {
    width: wp('17%'),
    height: hp('9%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1.25%'),
    alignSelf: 'center',
  },
  verifyIcon: {
    width: wp('5%'),
    height: hp('3%'),
    position: 'absolute',
    bottom: 8,
    right: 20,
  },
  lawyerName: {
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
    textAlign: 'center',
  },
  lawyerProfession: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: wp('3%'),
    color: '#1262D2',
  },
  lawyerExperience: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: wp('3%'),
    color: '#1262D2',
    textAlign: 'center',
  },
  lawyerLocation: {
    flexDirection: 'row',
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: wp('3%'),
    color: '#1262D2',
    lineHeight: 20,
  },
  connectButton: {
    marginTop: 10,
    backgroundColor: '#007BFF', // Button color
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  pendingButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#8e8e8e',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default StudentSearch;
