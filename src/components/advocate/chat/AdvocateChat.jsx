import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import debounce from 'lodash.debounce';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {
  useGetAdvocateChatQuery,
  usePrivateChatMutation,
} from '../../../redux/api/api';
import {handleError} from '../../../../shared/authUtils';

const AdvocateChat = () => {
  const navigation = useNavigation();

  const {data: requests, isLoading, error, refetch} = useGetAdvocateChatQuery();
  const chatData = requests?.chats || [];
  // console.log('chatData', chatData);

  const [privateChat] = usePrivateChatMutation();

  const handleGoBack = () => {
    navigation.goBack();
  };
  const handlePress = async id => {
    // console.log("handlePress",id)
    try {
      const response = await privateChat({member: id}).unwrap();
      // console.log('Chat Details:', response);
      if (response.success) {
        const item = response?.transformedChats;

        navigation.navigate('AdvocateChatConversation', {
          _id: item._id,
          name: item?.chatName,
          avatar:
            item?.avatar ||
            'https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg',
          members: item?.members,
        });
      }
    } catch (err) {
      console.error('Error fetching chat details:', err);
      const errorMsg =
        err?.response?.data?.error?.data?.message || 'Something went wrong!';
      showMessage({
        message: 'Error',
        description: errorMsg,
        type: 'danger',
        titleStyle: {fontFamily: 'Poppins SemiBold'},
        textStyle: {fontFamily: 'Poppins'},
      });
    }
  };
  const renderChatItem = ({item}) => {
    const {members} = item;
    const memberId = members.length > 0 ? members[0]._id : null;
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handlePress(memberId)}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: members[0]?.avatar
                ? members[0]?.avatar
                : 'https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg',
            }}
            style={styles.avatar}
          />
          {/* <View style={styles.onlineDot} /> */}
        </View>
        <View style={styles.chatDetails}>
          <Text style={styles.chatName}>{members[0]?.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle error state
  if (error) {
    console.log("advocateChat",error);
    handleError(error);
    return <Text>An error occurred: {error?.data}</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image
            source={require('../../../../assets/images/back.png')}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity>
          <Image
            source={require('../../../../assets/images/icons/tabIcon/searchIcon.png')}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
      </View>

      <View>
        <FlatList
          data={chatData}
          keyExtractor={item => item._id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.chatList}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
  },
  header: {
    height: hp(9),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingVertical: 10,
    backgroundColor: '#F3F7FF',
    elevation: 0.1,
    paddingHorizontal: wp('4%'),
  },
  headerTitle: {
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins SemiBold',
    color: '#000',
  },
  chatList: {
    paddingHorizontal: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineDot: {
    width: 12,
    height: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    position: 'absolute',
    bottom: 2,
    right: 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatDetails: {
    flex: 1,
    marginLeft: 10,
  },
  chatName: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
  },
  chatMessage: {
    fontSize: wp('3.2%'),
    color: '#555',
    fontFamily: 'Poppins',
  },
  chatMeta: {
    alignItems: 'flex-end',
  },
  chatTime: {
    fontSize: 12,
    color: '#7C7C7C',
    fontFamily: 'Poppins',
  },
  unreadBadge: {
    backgroundColor: '#007BFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 5,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default AdvocateChat;
