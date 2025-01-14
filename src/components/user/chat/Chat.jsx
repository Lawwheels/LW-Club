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
} from 'react-native';
import debounce from 'lodash.debounce';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {
  useGetAllAcceptedChatQuery,
  useGetUserChatQuery,
  useUserPrivateChatMutation,
} from '../../../redux/api/api';
import { getSocket } from '../../../../socket';

const Chat = () => {
 
  const navigation = useNavigation();

  const {data: requests, isLoading, error, refetch} = useGetUserChatQuery();
  const chatData = requests?.chats || [];
  // console.log('userChat', chatData);
  const [userPrivateChat] = useUserPrivateChatMutation();

  const handlePress = async id => {
    // console.log('id', id);
    try {
      const response = await userPrivateChat({member: id}).unwrap(); // Fetch chat details
      // console.log('Chat Details:', response);

      if (response.success) {
        const item = response?.transformedChats;
        // console.log('item chat conversation', item);
        navigation.navigate('ChatConversation', {
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
  // const chatData = [
  //   {
  //     id: '1',
  //     name: 'Kajal Gupta',
  //     message: 'But guess what? I finally started that p...',
  //     time: '02:00 PM',
  //     avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  //     unread: 0,
  //   },
  //   {
  //     id: '2',
  //     name: 'Shivam Rajput',
  //     message: 'But guess what? I finally started that p...',
  //     time: '02:00 PM',
  //     avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  //     unread: 2,
  //   },
  //   {
  //     id: '3',
  //     name: 'Ankush Gupta',
  //     message: 'But guess what? I finally started that p...',
  //     time: '02:00 PM',
  //     avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  //     unread: 0,
  //   },
  //   {
  //     id: '4',
  //     name: 'Prakhar Kulshrestha',
  //     message: 'But guess what? I finally started that p...',
  //     time: '02:00 PM',
  //     avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
  //     unread: 0,
  //   },
  //   {
  //     id: '5',
  //     name: 'Tanu Priya',
  //     message: 'But guess what? I finally started that p...',
  //     time: '02:00 PM',
  //     avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
  //     unread: 0,
  //   },
  //   {
  //     id: '6',
  //     name: 'Yatika Singh',
  //     message: 'But guess what? I finally started that p...',
  //     time: '02:00 PM',
  //     avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
  //     unread: 0,
  //   },
  //   {
  //     id: '7',
  //     name: 'Mansi Sharma',
  //     message: 'But guess what? I finally started that p...',
  //     time: '02:00 PM',
  //     avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
  //     unread: 0,
  //   },
  //   {
  //     id: '8',
  //     name: 'Tanu Priya',
  //     message: 'But guess what? I finally started that p...',
  //     time: '02:00 PM',
  //     avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
  //     unread: 0,
  //   },
  //   {
  //     id: '9',
  //     name: 'Yatika Singh',
  //     message: 'But guess what? I finally started that p...',
  //     time: '02:00 PM',
  //     avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
  //     unread: 0,
  //   },
  //   {
  //     id: '10',
  //     name: 'Mansi Sharma',
  //     message: 'But guess what? I finally started that p...',
  //     time: '02:00 PM',
  //     avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
  //     unread: 0,
  //   },
  // ];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderChatItem = ({item}) => {
    // console.log('item', item);
    const {members} = item;
    // console.log("memebers",members)
    const memberId = members.length > 0 ? members[0]._id : null;
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handlePress(memberId)}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: item?.avatar
                ? item?.avatar
                : 'https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg',
            }}
            style={styles.avatar}
          />
          {/* <View style={styles.onlineDot} /> */}
        </View>
        <View style={styles.chatDetails}>
          <Text style={styles.chatName}>{item?.chatName}</Text>
          {/* <Text style={styles.chatMessage}>{item.message}</Text> */}
        </View>
        {/* <View style={styles.chatMeta}>
          <Text style={styles.chatTime}>{item.time}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View> */}
      </TouchableOpacity>
    );
  };

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

      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        {isLoading && <Text>Loading...</Text>}
        {/* {error && <Text>Error loading chats.</Text>} */}
        <FlatList
          data={chatData}
          keyExtractor={item => item._id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.chatList}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      {/* </ScrollView> */}
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
  searchContainer: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: '#8b8b8b',
    borderWidth: 1,
  },
  searchInput: {
    fontSize: 16,
    paddingVertical: 5,
    color: '#000',
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default Chat;
