import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import StarRating from '../../../shared/StarRating';
import {useGetReviewByIdQuery} from '../../redux/api/api';
import { handleError } from '../../../shared/authUtils';

const FeedbackCard = ({feedback}) => {
//   console.log('feed', feedback);
  const formatDate = isoDate => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={
            feedback && feedback?.client?.profilePic
              ? {uri: feedback?.client?.profilePic}
              : require('../../../assets/images/avatarImage.jpg')
          }
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.name}>{feedback.client.name}</Text>
          <View>
            <View style={styles.starRating}>
              <StarRating rating={feedback.rating} starSize={16} />
              <Text style={styles.date}>{formatDate(feedback.createdAt)}</Text>
            </View>
          </View>
        </View>
      </View>
      <Text style={styles.feedbackText}>
        {feedback?.messages?.[0]?.message
          ? feedback.messages[0].message
          : 'No comment'}
      </Text>
    </View>
  );
};

const UserAdvocateReview = ({id}) => {
  const {data, error, isLoading} = useGetReviewByIdQuery(id);
  // console.log('review', data);

  if (isLoading) {
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
    return <Text>An error occurred: {error?.message}</Text>;
  }

  const reviews = data?.data?.feedBack;

  // Check if there are no reviews
  if (!reviews || reviews.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.noReviewsText}>No reviews found</Text>
      </View>
    );
  }
  return (
    <View style={styles.conatiner}>
      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        horizontal={true}
        renderItem={({item}) => <FeedbackCard feedback={item} />}
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: '#F3F7FF',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#E4EEFC',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: Dimensions.get('window').width * 0.8,
    marginHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  headerText: {
    justifyContent: 'center',
  },
  name: {
    // fontWeight: '600',
    fontFamily: 'Poppins SemiBold',
    fontSize: 16,
    color: '#294776',
  },
  date: {
    color: '#656565',
    fontFamily: 'Poppins',
    fontSize: 12,
    margin: 4,
    justifyContent: 'center',
  },
  feedbackText: {
    marginBottom: 5,
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'justify',
    // width: wp(55),
  },

  timeAgo: {
    color: '#656565',
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '400',
  },
  starRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default UserAdvocateReview;
