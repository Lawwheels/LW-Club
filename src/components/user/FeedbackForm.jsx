import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomHeader from '../../../shared/CustomHeader';

const FeedbackForm = () => {
  const [rating, setRating] = useState(4); // Default rating
  const [comment, setComment] = useState('');
  const [recommendation, setRecommendation] = useState(null); // Yes or No

  const handleRating = selectedRating => {
    setRating(selectedRating);
  };

  const handleSubmit = () => {
    // Add form submission logic here
    console.log('Feedback submitted:', {rating, comment, recommendation});
  };

  return (
    <>
      <CustomHeader
        title={'Give Your Feedback'}
        icon={require('../../../assets/images/back.png')}
      />
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <View style={styles.quoteContainer}>
            {/* Top-left quote */}
            <View style={styles.leftQuote}>
              <Image
                source={require('../../../assets/images/icons/quote-up.png')} // Replace with your image path
                style={{width: 24, height: 24}}
              />
            </View>

            {/* Image */}
            <Image
              source={require('../../../assets/images/user.png')} // Replace with your image path
              style={styles.avatar}
            />

            {/* Bottom-right quote */}
            <View style={styles.rightQuote}>
              <Image
                source={require('../../../assets/images/icons/quote-down.png')} // Replace with your image path
                style={{width: 24, height: 24}}
              />
            </View>
          </View>
          <Text style={styles.questionText}>
            How was your experience with{'\n'}
            <Text style={styles.userName}>Mr. Ankush Gupta?</Text>
          </Text>
        </View>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity
              key={star}
              style={{marginHorizontal: 6}}
              onPress={() => handleRating(star)}>
              {star >= rating ? (
                <Image
                  source={require('../../../assets/images/icons/Vector.png')}
                  style={{width: 24, height: 24}}
                />
              ) : (
                <Image
                  source={require('../../../assets/images/icons/activeStar.png')}
                  style={{width: 24, height: 24}}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.commentContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.commentLabel}>Write a comment</Text>
            <Text style={styles.maxWords}>Max 600 Words</Text>
          </View>

          <TextInput
            style={styles.commentInput}
            placeholder="Type here..."
            multiline
            numberOfLines={4}
            maxLength={600}
            value={comment}
            onChangeText={text => setComment(text)}
          />
        </View>

        <View style={styles.recommendationContainer}>
          <Text style={styles.recommendationText}>
            Would you recommend{' '}
            <Text style={styles.userName}>Mr. Ankush Gupta</Text> to your
            friends?
          </Text>
          <View style={styles.radioButtons}>
            <TouchableOpacity
              onPress={() => setRecommendation('Yes')}
              style={styles.radioOption}>
              <View style={styles.radioCircle}>
                {recommendation === 'Yes' && (
                  <View style={styles.selectedCircle} />
                )}
              </View>
              <Text style={styles.radioLabel}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRecommendation('No')}
              style={styles.radioOption}>
              <View style={styles.radioCircle}>
                {recommendation === 'No' && (
                  <View style={styles.selectedCircle} />
                )}
              </View>
              <Text style={styles.radioLabel}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
        <LinearGradient
          colors={['#1262D2', '#17316D']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.submitButton}>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit your Feedback</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F3F7FF',
  },

  userInfo: {
    alignItems: 'center',
    // marginVertical: 20,
  },
  quoteContainer: {
    position: 'relative', // Enable absolute positioning inside
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftQuote: {
    position: 'absolute',
    top: 0, // Adjust position above the image
    left: -10, // Adjust position to the left
  },
  rightQuote: {
    position: 'absolute',
    bottom: 12, // Adjust position below the image
    right: -6, // Adjust position to the right
  },
  avatar: {
    width: 87,
    height: 87,
    borderRadius: 50,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  userName: {
    fontFamily: 'Poppins SemiBold',
    // fontWeight:'600',
    color: '#294776',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  commentContainer: {
    marginVertical: 15,
  },
  commentLabel: {
    fontSize: 16,
    color: '#294776',
    marginBottom: 5,
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  commentInput: {
    fontFamily: 'Poppins',
    backgroundColor: '#E4EEFC',
    borderRadius: 10,
    padding: 15,
    height: 120,
    textAlignVertical: 'top',
  },
  maxWords: {
    // textAlign: 'right',
    color: '#7B7B7B',
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 12,
    marginTop: 5,
  },
  recommendationContainer: {
    marginVertical: 15,
  },
  recommendationText: {
    fontSize: 16,
    color: '#294776',
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  radioButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1261CF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  selectedCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#1261CF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#294776',
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins SemiBold',
  },
});

export default FeedbackForm;
