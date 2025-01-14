import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  RefreshControl,
} from 'react-native';

const MessageList = ({ messages, userId, refresh, pullMe }) => {
  const [isRefreshing, setIsRefreshing] = useState(refresh);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await pullMe(); // Call the passed pullMe function to refresh data
    setIsRefreshing(false);
  };

  const renderMessage = ({ item }) => {
    const sentByUser = item.sender?._id === userId;

    const formatTime = (isoString) => {
      if (!isoString) return '';
      const date = new Date(isoString);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    };
    // console.log('User ID:', userId);
    // console.log('Sender:', item.sender);
    // console.log('Is Sent By User:', item.sender === userId || item.sender?._id === userId);
    console.log('Created At:', item.createdAt);
    
    
    return (
      <View
        style={[
          styles.messageContainer,
          sentByUser ? styles.sentMessage : styles.receivedMessage,
        ]}>
        <View style={styles.messageBubble}>
          {item.content && (
            <View
              style={[
                sentByUser
                  ? styles.sentMessageBubble
                  : styles.receivedMessageBubble,
              ]}>
              <Text
                style={[
                  styles.messageText,
                  { color: sentByUser ? '#F3F7FF' : '#000' },
                ]}>
                {item.content}
              </Text>
            </View>
          )}
          {item.attachments && item.attachments.length > 0 && (
            <FlatList
              data={item.attachments}
              keyExtractor={(attachment) => attachment._id}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.url }}
                  style={{
                    width: 300,
                    height: 150,
                    marginTop: 10,
                    borderRadius: 10,
                  }} 
                />
              )}
            />
          )}
          <View style={styles.messageMeta}>
            <Text style={styles.messageTime}>{formatTime(item.createdAt)}</Text>
            {item.isView && (
              <Image
                source={require('../assets/images/message/mdi_ticks.png')}
                style={{ width: 14, height: 14 }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return messages.length === 0 ? (
    <View style={styles.emptyState}>
      <Text>No messages yet</Text>
    </View>
  ) : (
    <FlatList
      data={messages}
      keyExtractor={item => `${item._id}-${Math.random()}`}
      renderItem={renderMessage}
      contentContainerStyle={styles.messageList}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  messageList: {
    paddingHorizontal: 10,
    paddingTop: 10,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  sentMessage: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
  },
  avatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 10,
  },
  sentMessageBubble: {
    backgroundColor: '#294776',
    color: '#F3F7FF',
    padding: 12,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  receivedMessageBubble: {
    backgroundColor: '#E4EEFC',
    padding: 12,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  messageText: {
    fontSize: 12,
    fontFamily: 'Poppins',
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  messageTime: {
    fontSize: 12,
    color: '#555',
    marginRight: 5,
    fontFamily: 'Poppins',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default MessageList;
