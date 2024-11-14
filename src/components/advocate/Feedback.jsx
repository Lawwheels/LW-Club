import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import CustomHeader from '../../../shared/CustomHeader';

const feedbacks = [
  {
    id: '1',
    name: 'Elizabeth Olsen',
    avatar: require('../../../assets/images/avatarImage.jpg'),
    date: '28-10-2024',
    feedback:
      'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text.',
    likes: 15,
    dislikes: 0,
    timeAgo: '2m ago',
  },
  {
    id: '2',
    name: 'Elizabeth Olsen',
    avatar: require('../../../assets/images/avatarImage.jpg'),
    date: '28-10-2024',
    feedback:
      'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text.',
    likes: 15,
    dislikes: 0,
    timeAgo: '2m ago',
  },
  {
    id: '3',
    name: 'Elizabeth Olsen',
    avatar: require('../../../assets/images/avatarImage.jpg'),
    date: '28-10-2024',
    feedback:
      'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text.',
    likes: 15,
    dislikes: 0,
    timeAgo: '2m ago',
  },
  {
    id: '4',
    name: 'Elizabeth Olsen',
    avatar: require('../../../assets/images/avatarImage.jpg'),
    date: '28-10-2024',
    feedback:
      'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text.',
    likes: 15,
    dislikes: 0,
    timeAgo: '2m ago',
  },
  {
    id: '5',
    name: 'Elizabeth Olsen',
    avatar: require('../../../assets/images/avatarImage.jpg'),
    date: '28-10-2024',
    feedback:
      'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text.',
    likes: 15,
    dislikes: 0,
    timeAgo: '2m ago',
  },
];

const FeedbackCard = ({feedback}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={feedback.avatar} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{feedback.name}</Text>
          <View>
            <View style={styles.starRating}>
              <Text style={styles.stars}>★★★★★</Text>
              <Text style={styles.date}>{feedback.date}</Text>
            </View>
            <Text style={styles.feedbackText}>{feedback.feedback}</Text>
            <View style={styles.actions}>
              <View style={styles.likesDislikes}>
                <TouchableOpacity style={styles.likeButton}>
                  <Image
                    source={require('../../../assets/images/icons/like.png')}
                    style={{width: 24, height: 24}}
                  />
                  <Text style={styles.likeCount}>{feedback.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dislikeButton}>
                  <Image
                    source={require('../../../assets/images/icons/dislike.png')}
                    style={{width: 24, height: 24}}
                  />
                  <Text style={styles.dislikeCount}>{feedback.dislikes}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.timeAgo}>{feedback.timeAgo}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const Feedback = () => {
  return (
    <View style={styles.conatiner}>
      <CustomHeader
        title={'Feedbacks'}
        icon={require('../../../assets/images/back.png')}
      />
      <ScrollView>
      <FlatList
        data={feedbacks}
        keyExtractor={item => item.id}
        renderItem={({item}) => <FeedbackCard feedback={item} />}
        contentContainerStyle={styles.listContainer}
      />
      </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    marginBottom: 8,
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
    margin: 3,
  },
  feedbackText: {
    marginBottom: 10,
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '400',
    textAlign:'left',
    width:wp(70)
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likesDislikes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  likeCount: {
    marginLeft: 6,
    color: '#294776',
    fontFamily: 'Poppins',
  },
  dislikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dislikeCount: {
    marginLeft: 6,
    color: '#294776',
    fontFamily: 'Poppins',
  },
  timeAgo: {
    color: '#656565',
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '400',
  },
  starRating: {
    flexDirection: 'row',
  },
  stars: {
    color: '#FFA800', // Gold color for stars
    fontSize: 18,
    lineHeight: 22,
  },
});

export default Feedback;
