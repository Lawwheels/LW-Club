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
import CustomHeader from '../../../../shared/CustomHeader';
import {useGetStudentAdvocateFollowByIdQuery, useGetUserAdvocateFollowByIdQuery} from '../../../redux/api/api';
import { handleError } from '../../../../shared/authUtils';

const StudentAdvocateFollowing = ({route}) => {
  const {id} = route.params || {};
  const [refresh, setRefresh] = useState(false);
  const {data: follow, loading, error} = useGetStudentAdvocateFollowByIdQuery(id);

//   console.log('follow', follow);
  const following = follow?.data;
  //   console.log('following', following);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle error state
  if (error) {
    handleError(error)
    console.log(error);
    return <Text>An error occurred</Text>;
  }

  const renderItem = ({item}) => {
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
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.buttonText}>Following</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.removeButton}>
          <Text style={styles.removeText}>X</Text>
        </TouchableOpacity> */}
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
    height:hp('100%')
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
});

export default StudentAdvocateFollowing;
