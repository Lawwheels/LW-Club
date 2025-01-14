import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';
import {
  useAcceptRequestMutation,
  // useAdvocateFollowRequestMutation,
  useGetAllUserRequestQuery,
} from '../../redux/api/api';
import {useNavigation} from '@react-navigation/native';
import CustomHeader from '../../../shared/CustomHeader';

const AllUserRequest = () => {
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false);

  // Fetch user requests based on status
  const {
    data: requests,
    isLoading,
    isError,
    refetch,
  } = useGetAllUserRequestQuery({status:'pending'});
  const [acceptRequest] = useAcceptRequestMutation();
  // const [advocateFollowRequest] = useAdvocateFollowRequestMutation();

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

  // console.log('requests', requests);

  const handleAccept = async (id, isAccepted) => {
    try {
      const res = await acceptRequest({
        connectId: id,
        accept: isAccepted,
      }).unwrap();
      console.log(res);

      if (res && res?.success) {
        showMessage({
          message: 'Success',
          description: res.message,
          type: 'success',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
        navigation.navigate('AdvocateNavigator');
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
      console.error('Failed to accept request: ', error);
      const errorMsg =
        error?.response?.data?.error?.data?.message || 'Something went wrong!';
      showMessage({
        message: 'Error',
        description: errorMsg,
        type: 'danger',
        titleStyle: {fontFamily: 'Poppins SemiBold'},
        textStyle: {fontFamily: 'Poppins'},
      });
    }
  };
  const renderRequest = ({item}) => {
    // console.log(item);
    function formatDate(dateString) {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      // Parse the input date
      const date = new Date(dateString);

      // Extract day, month, and year
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      // Return the formatted string
      return `${day} ${month} ${year}`;
    }
    return (
      <View style={styles.requestCard}>
        {/* User Information */}
        <View style={styles.userInfoContainer}>
          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.userName}>{item.sender.name}</Text>
              <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
            </View>

            <Text style={styles.userDetail}>
              {item.sender.profession_nun_user || '-'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={() => handleAccept(item._id, true)}>
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAccept(item._id, true)}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
    <View style={styles.container}>
      <CustomHeader
        title={'View Invitation'}
        icon={require('../../../assets/images/back.png')}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={pullMe} />
        }>
        <View style={{flex: 1}}>
          {requests?.data && requests.data.length > 0 ? (
            <FlatList
              data={requests.data}
              renderItem={renderRequest}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Image
                source={require('../../../assets/images/no-request.png')} // Replace with your image path
                style={styles.emptyImage}
              />
              <Text style={styles.emptyText}>No requests found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AllUserRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingTop: hp('2.5%'),
  },
  tabsContainer: {
    width: wp(100),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: hp('0.5%'),
  },
  tabContainer: {
    padding: wp('3%'),
    width: wp('50%'),
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
    marginTop: 5,
  },
  inactiveUnderline: {
    height: 2,
    // backgroundColor: '#E4EEFC',
    width: '100%',
    marginTop: 5,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
  requestCard: {
    padding: 15,
    backgroundColor: '#E4EEFC',
    borderRadius: 10,
    // marginVertical: hp('2%'),
    elevation: 2,
  },
  userInfoContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Poppins SemiBold',
    color: '#17316D',
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    color: '#1262D2',
    marginVertical: 5,
  },
  userDetail: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#333',
    lineHeight: 20,
  },
  buttonContainer: {
    // width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  declineButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: hp('1%'),
    borderRadius: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  declineText: {
    color: '#555',
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#1262D2',
    paddingVertical: hp('1%'),
    borderRadius: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptText: {
    color: '#fff',
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: wp('90%'),
    height: hp('59%'),
    // marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#76AFFF',
    textAlign: 'center',
    fontFamily:'Poppins'
  },
});
