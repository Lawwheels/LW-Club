import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {getSocket} from '../../../../socket';
import {
  useAdvocateChatImageMutation,
  useGetAdvocateChatByIdQuery,
  useGetAdvocateChatQuery,
} from '../../../redux/api/api';
import { showMessage } from 'react-native-flash-message';
import {handleError} from '../../../../shared/authUtils';
import MessageList from '../../../../shared/MessageList';

const AdvocateChatConversation = ({navigation, route}) => {
  const {_id, name, avatar, members} = route.params; // Access the _id here
  // console.log('Chat ID:', _id);
  // console.log('members', members);
  const socket = getSocket();
  

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [refresh,setRefresh]=useState(false);
  const [page, setPage] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const {data, isLoading, error, refetch} = useGetAdvocateChatByIdQuery({
    id: _id, // Chat ID in params
    page: page,
  });

  const [advocateChatImage] = useAdvocateChatImageMutation();

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
        const response = await advocateChatImage(formData).unwrap();
        console.log('response', response);
        if (response && response.success) {
console.log("attachment",response.message.attachments)
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
        error?.response?.data?.error?.data?.message || 'Something went wrong!';
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
 
  // useEffect(() => {
  //   if (socket) {
  //     // Listen for new messages from the socket
  //     socket.on('NEW_MESSAGE', (newData) => {
  //       console.log("newDataFromAdvocate",newData)
  //       const normalizedMessage = {
  //         _id: newData.chatId,
  //         // chat: newData.message?.chat,
  //         content: newData.message?.content || null,
  //         attachments: newData.message?._doc?.attachments || [],
  //         createdAt: newData.message?._doc?.createdAt,
  //         sender: newData?.message?.sender?._id,
  //         isView: false, // Add default values if missing
  //       };
  //     console.log("new",normalizedMessage)
  //       setMessages((prevMessages) => [...prevMessages, normalizedMessage]);
  //     });
  //   }

  //   // Cleanup on component unmount
  //   return () => {
  //     if (socket) {
  //       socket.off('NEW_MESSAGE'); // Remove socket listener
  //     }
  //   };
  // }, [_id, socket]);
  useEffect(() => {
    if (socket) {
      socket.on('NEW_MESSAGE', (newData) => {
        console.log("newDataFromAdvocate", newData);
        const normalizedMessage = {
          _id: newData.chatId,
          content: newData.message?.content || null,
          attachments: newData.message?._doc?.attachments || [], // Ensure it's an array
          createdAt: newData.message?.createdAt || new Date().toISOString(),
          sender: newData?.message?.sender?._id,
          isView: newData?.message?.isView || false,

        };
        console.log("Normalized Message", normalizedMessage);
        setMessages(prevMessages => [...prevMessages, normalizedMessage]);
      });
    }
  
    return () => {
      if (socket) {
        socket.off('NEW_MESSAGE'); // Cleanup listener
      }
    };
  }, [socket]);
  
  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages); // Set API messages initially
    }
  }, [data?.messages]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

 

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle error state
  if (error) {
    console.log('advocateChatConversation', error);
    handleError(error);
    return <Text>An error occurred: {error?.data}</Text>;
  }
 
  const submitHandler = () => {
    if (!message.trim()) return; // Ensure the message is not empty

    // Emitting the message to the server
    if (socket && socket.emit) {
      socket.emit('NEW_MESSAGE', {chatId: _id, members, content: message});
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../../assets/images/back.png')}
            style={styles.icon}
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
              style={styles.icon}
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

      <MessageList messages={messages} userId={data?.userId} refresh={refresh} pullMe={pullMe} />

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

export default AdvocateChatConversation;
