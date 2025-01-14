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
import {useGetAdvocateReviewQuery} from '../../redux/api/api';
import {handleError} from '../../../shared/authUtils';

const feedbacks = [
  {
    id: '1',
    name: 'Elizabeth Olsen',
    avatar: require('../../../assets/images/avatarImage.jpg'),
    date: '28-10-2024',
    feedback:
      'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text.',
    timeAgo: '2m ago',
  },
  {
    id: '2',
    name: 'Elizabeth Olsen',
    avatar: require('../../../assets/images/avatarImage.jpg'),
    date: '28-10-2024',
    feedback:
      'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text.',
    timeAgo: '2m ago',
  },
  {
    id: '3',
    name: 'Elizabeth Olsen',
    avatar: require('../../../assets/images/avatarImage.jpg'),
    date: '28-10-2024',
    feedback:
      'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text.',
    timeAgo: '2m ago',
  },
  {
    id: '4',
    name: 'Elizabeth Olsen',
    avatar: require('../../../assets/images/avatarImage.jpg'),
    date: '28-10-2024',
    feedback:
      'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text.',
    timeAgo: '2m ago',
  },
  {
    id: '5',
    name: 'Elizabeth Olsen',
    avatar: require('../../../assets/images/avatarImage.jpg'),
    date: '28-10-2024',
    feedback:
      'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text.',
    timeAgo: '2m ago',
  },
];

const FeedbackCard = ({feedback}) => {
  console.log('feed', feedback);
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
              ? {uri: feedback.client.profilePic}
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
            {/* <Text style={styles.feedbackText}>{feedback.feedback}</Text> */}
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

const Reviews = () => {
  const {data, error, isLoading} = useGetAdvocateReviewQuery();

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
    // return <Text>An error occurred: {error?.message}</Text>;
  }
  return (
    <View style={styles.conatiner}>
      {/* <FlatList
        data={data?.data?.feedBack}
        keyExtractor={item => item.id}
        horizontal={true}
        renderItem={({item}) => <FeedbackCard feedback={item} />}
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
      /> */}
      <FlatList
        data={data?.data?.feedBack}
        keyExtractor={item => item.id}
        horizontal={true}
        renderItem={({item}) => <FeedbackCard feedback={item} />}
        contentContainerStyle={
          data?.data?.feedBack?.length === 0
            ? [styles.listContainer, styles.emptyContainer]
            : styles.listContainer
        }
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.noResultContainer}>
            <Text style={styles.noResultText}>No result found</Text>
          </View>
        )}
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
  noResultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    flex:1
  },
  noResultText: {
    color: '#888',
    fontSize: 16,
    fontFamily:'Poppins'
  },
});

export default Reviews;
