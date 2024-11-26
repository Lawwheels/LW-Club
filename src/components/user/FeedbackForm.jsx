import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {showMessage} from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import {
  useGetUserAdvocateByIdQuery,
  useGiveAdvocateReviewMutation,
} from '../../redux/api/api';
import CustomHeader from '../../../shared/CustomHeader';

const FeedbackForm = ({route}) => {
  const {id} = route.params || {};
  const [loading, setLoading] = useState(false);

  const {data, isLoading, error} = useGetUserAdvocateByIdQuery(id);
  const [giveAdvocateReview] = useGiveAdvocateReviewMutation();

  const advocateDetails = data?.data[0];
  // console.log(advocateDetails);

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
    return <Text>An error occurred: {error.message}</Text>;
  }
  const handleRating = star => {
    // Toggle the star: if clicked on the current rating, reset it; otherwise, set the new rating
    setRating(prevRating => (prevRating === star ? 0 : star));
  };
  // console.log('feedback', rating);
  const validationSchema = Yup.object().shape({
    rating: Yup.number()
      .min(1, 'Please select at least one star')
      .max(5, 'Maximum 5 stars allowed')
      .required('Rating is required'),
    comment: Yup.string()
      .max(600, 'Maximum 600 characters allowed')
      .optional('Comment is required'),
  });

  const handleSubmit = async (values, {resetForm}) => {
    setLoading(true);
    try {
      const payload = {
        rating: values.rating,
        advocate: id,
      };
  
      // Only include `message` if it's not empty after trimming
      if (values.comment.trim() !== '') {
        payload.message = values.comment;
      }
  
      const response = await giveAdvocateReview(payload);
      console.log('Feedback response:', response);
      if (response?.data?.success) {
        showMessage({
          message: 'Success',
          description: response?.data?.message,
          type: 'success',
        });
        resetForm();
      } else {
        const errorMsg =
          response.error?.data?.message || 'Something went wrong!';
        showMessage({
          message: 'Error',
          description: errorMsg,
          type: 'danger',
        });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showMessage({
        message: 'Error',
        description: 'Something went wrong!',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
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
              source={
                advocateDetails.profilePic?.url
                  ? {uri: advocateDetails.profilePic.url}
                  : require('../../../assets/images/avatar.png')
              }
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
            <Text style={styles.userName}>{advocateDetails?.name}?</Text>
          </Text>
        </View>

        {/* <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity
              key={star}
              style={{marginHorizontal: 6}}
              onPress={() => handleRating(star)}>
              {star > rating ? (
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
        </View> */}

        {/* <View style={styles.recommendationContainer}>
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
        </View> */}
        {/* <LinearGradient
          colors={['#1262D2', '#17316D']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.submitButton}>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit your Feedback</Text>
          </TouchableOpacity>
        </LinearGradient> */}
        <Formik
          initialValues={{rating: 0, comment: ''}}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({
            values,
            handleChange,
            handleSubmit,
            setFieldValue,
            errors,
            touched,
          }) => (
            <>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity
                    key={star}
                    style={{marginHorizontal: 6}}
                    onPress={() => setFieldValue('rating', star)}>
                    <Image
                      source={
                        star > values.rating
                          ? require('../../../assets/images/icons/Vector.png') // Unfilled star
                          : require('../../../assets/images/icons/activeStar.png') // Filled star
                      }
                      style={{width: 24, height: 24}}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {touched.rating && errors.rating && (
                <Text style={styles.errorText}>{errors.rating}</Text>
              )}

              <View style={styles.commentContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Type here..."
                  multiline
                  maxLength={600}
                  value={values.comment}
                  onChangeText={handleChange('comment')}
                />
              </View>
              {touched.comment && errors.comment && (
                <Text style={styles.errorText}>{errors.comment}</Text>
              )}

              <LinearGradient
                colors={['#1262D2', '#17316D']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.submitButton}>
                <TouchableOpacity onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>
                  {loading ? 'Submitting...' : 'Submit your Feedback'}
                </Text>
                </TouchableOpacity>
              </LinearGradient>
            </>
          )}
        </Formik>
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
  errorText: {
    color: 'red',
    fontFamily:'Poppins'
  },
});

export default FeedbackForm;
