import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';
import CustomHeader from '../../../../shared/CustomHeader';
import {
  useGetUserFollowingQuery,
  useUnfollowAdvocateMutation,
} from '../../../redux/api/api';
import CustomModal from '../../../../shared/CustomModal';

const Following = () => {
  const [refresh, setRefresh] = useState(false);
  const [id,setId]=useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); 

  const {
    data: followingData,
    isLoading: loading,
    error: isError,
    refetch,
  } = useGetUserFollowingQuery();
  const [ unfollowAdvocate ]=useUnfollowAdvocateMutation();
  const following = followingData?.data;
 
  // console.log('following', following);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle error state
  if (isError) {
    console.log(isError);
    return <Text>An error occurred</Text>;
  }

  const handleOpenModal = followee => {
    setId(followee._id);
    setSelectedUser(followee.name);
    setShowModal(true); // Show the modal
  };
  // console.log(id)

  const handleUnfollow = async () => {
    // console.log(id)
    try {
      const res = await unfollowAdvocate({followee: id}).unwrap();
      console.log(res);

      if (res && res?.success) {
        showMessage({
          message: 'Success',
          description: res.message,
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
      console.error('Failed to delete profile picture: ', error);

      const errorMsg =
        error?.response?.data?.error?.data?.message || 'Something went wrong!';
      showMessage({
        message: 'Error',
        description: errorMsg,
        type: 'danger',
        titleStyle: {fontFamily: 'Poppins SemiBold'},
        textStyle: {fontFamily: 'Poppins'},
      });
    } finally {
      setShowModal(false);
    }
  };

  const renderItem = ({item, index}) => {
    const {followee} = item;
    // console.log(item);
    return (
      <View style={styles.itemContainer}>
        <Image
          source={{
            uri: followee.profilePic?.url
              ? followee.profilePic.url
              : 'https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg',
          }}
          style={styles.itemImage}
        />
        <Text style={styles.itemName}>{followee.name}</Text>
        <TouchableOpacity style={styles.actionButton}  onPress={() => handleOpenModal(followee)}>
          <Text style={styles.buttonText}>Unfollow</Text>
        </TouchableOpacity>
      </View>
    );
  };
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
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <View style={{paddingTop: hp('4.5%'), backgroundColor: '#F3F7FF'}}>
          <CustomHeader
            title={'Following'}
            icon={require('../../../../assets/images/back.png')}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={pullMe} />
            }>
            <View style={styles.container}>
              <FlatList
                data={following}
                keyExtractor={item => item._id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <CustomModal
              visible={showModal}
              onConfirm={handleUnfollow}
              onCancel={() => setShowModal(false)}
              title="Unfollow"
              userName={selectedUser}
              buttonText="Unfollow"
            />
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

  itemContainer: {
    maxWidth: wp('90%'),
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Poppins SemiBold',
    marginHorizontal: 10,
  },
  actionButton: {
    maxHeight: hp('4%'),
    backgroundColor: '#007bff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  removeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 15,
    // marginLeft: 10,
  },
  removeText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: 25, // Adjust as needed
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    zIndex: 10,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
});

export default Following;
