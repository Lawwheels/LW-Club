import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  useGetAdviseSeekerQuery,
  useGetUserChatByIdQuery,
  useUserChatImageMutation,
} from '../../../redux/api/api';
import MessageList from '../../../../shared/MessageList';
import {getSocket} from '../../../../socket';

const ChatConversation = ({navigation, route}) => {
  const {_id, name, avatar, members} = route.params;
  // console.log('Chat ID:', _id);
  const socket = getSocket();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const {data, isLoading, error, refetch} = useGetUserChatByIdQuery({
    id: _id, // Chat ID in params
    page: page,
  });
  const {
    data: userData,
    isLoading: loading,
    error: isError,
    refetch: refetchAdviseData,
  } = useGetAdviseSeekerQuery();
  const [userChatImage] = useUserChatImageMutation();
  console.log("userData",userData)
  const id = userData?.data?._id;

console.log("id",id)
  // On receiving new messages from the API, update the message list

  const handleAttachmentPress = async () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 10, // Allows selecting up to 10 images
    };

    const result = await launchImageLibrary(options);
    if (!result.didCancel && result.assets) {
      const imagesToUpload = result.assets.map(asset => ({
        uri: asset.uri,
        type: asset.type, // Image type (e.g., 'image/jpeg')
        name: asset.fileName, // Image file name
      }));
      console.log('Selected Images:', imagesToUpload);
      try {
        // Upload images using the API
        const formData = new FormData();
        for (let i = 0; i < imagesToUpload.length; i++) {
          formData.append('attachments', imagesToUpload[i]); // Append each image to form data
        }
        formData.append('chatId', _id);
        const response = await userChatImage(formData).unwrap();
        console.log('response', response);

        if (response && response.success) {
          // const imageUrls = response.message.attachments.map(img => img.url); // Extract URLs
          // if (socket && socket.emit) {
          //   socket.emit('NEW_MESSAGE', {
          //     chatId: _id,
          //     members,
          //     content: null, // No text content, only images
          //     attachments: imageUrls, // Include uploaded image URLs
          //   });

          //   // Add images to the message state
          //   setMessages(prevMessages => [
          //     ...prevMessages,
          //     {
          //       chatId: _id,
          //       members,
          //       content: null,
          //       attachments: imageUrls, // Entire array of images
          //       // sender: userData?.data?._id, // Current user ID
          //       createdAt: new Date().toISOString(),
          //     },
          //   ]);
          // }
          showMessage({
            message: 'Success',
            // description: "Image",
            type: 'success',
            titleStyle: {fontFamily: 'Poppins SemiBold'},
            textStyle: {fontFamily: 'Poppins'},
          });
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        const errorMsg =
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
    }
  };

  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages); // Set API messages initially
    }
  }, [data?.messages]);

  useEffect(() => {
    if (!socket || !socket.connected) {
      console.error('Socket is not ready yet');
      return;
    }
    const handleNewMessage = newData => {
      console.log('newData', newData);
      const normalizedMessage = {
        _id: newData.chatId,
        content: newData.message?.content || null,
        attachments: newData.message?._doc?.attachments || [], // Ensure it's an array
        createdAt: newData.message?.createdAt || new Date().toISOString(),
        sender: newData?.message?.sender?._id,
        isView: newData?.message?.isView || false,
        socketId: newData?.socketId || null,
      };
      console.log('new', normalizedMessage);
      setMessages(prevMessages => [...prevMessages, normalizedMessage]);
    };

    socket.on('NEW_MESSAGE', handleNewMessage);

    return () => {
      socket.off('NEW_MESSAGE', handleNewMessage);
    };
  }, [_id, socket]);
  const submitHandler = () => {
    if (!message.trim()) return; // Ensure the message is not empty

    // Emitting the message to the server
    if (socket && socket.emit) {
      socket.emit('NEW_MESSAGE', {chatId: _id, members, content: message});
      // Append the new message to the current list of messages
      setMessages(prevMessages => [
        ...prevMessages,
        {chatId: _id, members, content: message}, // Add new message to the state
      ]);
    } else {
      console.log('Socket is not initialized');
    }
    setMessage(''); // Clear the message input
  };

  const messageOnChange = text => {
    setMessage(text); // Directly use the text argument

    // if (!IamTyping) {
    //   socket.emit('START_TYPING', { members, chatId: });
    //   setIamTyping(true);
    // }

    // if (typingTimeout.current) clearTimeout(typingTimeout.current);

    // typingTimeout.current = setTimeout(() => {
    //   socket.emit('STOP_TYPING', { members, chatId });
    //   setIamTyping(false);
    // }, 2000);
  };

  // const startTypingListener = useCallback(
  //   (data) => {
  //     if (data.chatId !== chatId) return;

  //     setUserTyping(true);
  //   },
  //   [chatId]
  // );
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../../assets/images/back.png')}
            style={{width: 24, height: 24}}
          />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Image source={{uri: avatar}} style={styles.avatar} />
          <Text style={styles.chatName}>{name}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image
              source={require('../../../../assets/images/message/callImage.png')}
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft: 15}}>
            <Image
              source={require('../../../../assets/images/message/videoCall.png')}
              style={{width: 30, height: 24}}
            />
          </TouchableOpacity>
        </View>
      </View>
      <MessageList
        messages={messages}
        userId={id}
        refresh={refresh}
        pullMe={pullMe}
     
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Write your message here..."
            value={message}
            onChangeText={messageOnChange}
          />
          <TouchableOpacity
            onPress={handleAttachmentPress}
            style={styles.attachmentIcon}>
            <Image
              source={require('../../../../assets/images/message/attachment.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={submitHandler} style={styles.sendButton}>
          <Image
            source={require('../../../../assets/images/message/sendIcon.png')}
            style={styles.sendButton}
          />
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F3F7FF',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatName: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
    fontFamily: 'Poppins SemiBold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#F3F7FF',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative', // Allows positioning the attachment icon inside
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    borderRadius: 15,
    height: 45,
    fontFamily: 'Poppins',
    fontSize: 12,
    padding: 10,
    paddingRight: 40, // Space for the attachment icon
    borderWidth: 1,
    borderColor: '#646464',
  },
  attachmentIcon: {
    position: 'absolute',
    right: 10, // Position inside the input field
    top: '50%',
    transform: [{translateY: -12}], // Center vertically
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  sendIcon: {
    width: 40,
    height: 40,
  },
});

export default ChatConversation;
