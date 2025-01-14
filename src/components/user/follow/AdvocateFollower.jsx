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
  useGetUserAdvocateFollowerByIdQuery,
  useUserPrivateChatMutation,
} from '../../../redux/api/api';
import {handleError} from '../../../../shared/authUtils';
import {useNavigation} from '@react-navigation/native';

const AdvocateFollower = ({route}) => {
  const {id} = route.params || {};
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false);
  const {
    data: follow,
    loading,
    error,
  } = useGetUserAdvocateFollowerByIdQuery(id);
  const [userPrivateChat] = useUserPrivateChatMutation();
  //   console.log('follow', follow);
  const following = follow?.data;
  console.log('following', following);

  const handleMessage = async id => {
    try {
      const res = await userPrivateChat({member: id}).unwrap();
      // console.log(res);

      if (res && res?.success) {
        const item = res?.transformedChats;
        // console.log('item chat conversation', item);
        navigation.navigate('ChatConversation', {
          _id: item._id,
          name: item?.chatName,
          avatar:
            item?.avatar ||
            'https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg',
          members: item?.members,
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
      handleError(error);
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

  if (loading) {
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
    return <Text>An error occurred</Text>;
  }

  const renderItem = ({item}) => {
    const {follower} = item;
    // console.log(item);
    return (
      <View style={styles.itemContainer}>
        <Image
          source={{
            uri: follower?.profilePic?.url
              ? follower?.profilePic.url
              : 'https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg',
          }}
          style={styles.itemImage}
        />
        <Text style={styles.itemName}>{follower.name}</Text>
        {/* {follower.areYouFollowng &&   <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleMessage(id)}>
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>}
       */}
        {/* <TouchableOpacity style={styles.removeButton}>
          <Text style={styles.removeText}>X</Text>
        </TouchableOpacity> */}
      </View>
    );
  };
  const pullMe = async () => {
    try {
      setRefresh(true);
      await Promise.all([refetch()]);
    } catch (error) {
      console.error('Error during refetch:', error);
    } finally {
      setRefresh(false);
    }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <View style={{paddingTop: hp('4.5%'), backgroundColor: '#F3F7FF'}}>
          <CustomHeader
            title={'Follower'}
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
    // justifyContent: 'space-between',
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
    backgroundColor: '#294776',
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
});

export default AdvocateFollower;
