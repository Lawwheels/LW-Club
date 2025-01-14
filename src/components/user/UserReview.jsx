import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';
import {
  useCancelSlotMutation,
  useGetUserSlotByIdQuery,
} from '../../redux/api/api';
import RescheduleModal from './RescheduleModal';
import {useNavigation} from '@react-navigation/native';
import StarRating from '../../../shared/StarRating';
import { handleError } from '../../../shared/authUtils';

const UserReview = ({route}) => {
  const {id} = route?.params;
  const navigation = useNavigation();
  const [cancelVisible, setCancelVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState([]);
  const [advocateId, setAdvocateId] = useState(null);

  const {data, error, isLoading} = useGetUserSlotByIdQuery(id);
  const [cancelSlot] = useCancelSlotMutation();

  console.log('SlotId', id);
  const handleGoBack = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    console.log(error);
    handleError(error);
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'red'}}>Error loading booking details.</Text>
      </View>
    );
  }
  const openModal = advocateId => {
    setAdvocateId(advocateId);
    setModalVisible(true); // Show modal when reschedule button is pressed
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = {day: '2-digit', month: 'short', year: 'numeric'};
    return date.toLocaleDateString('en-GB', options).replace(',', '');
  }

  function formatTime(timeString, durationMinutes = 0) {
    const [hours, minutes] = timeString?.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);

    // Add duration to calculate "To" time if provided
    const targetDate = new Date(startDate.getTime() + durationMinutes * 60000);

    // Format hours and minutes in hh:mm AM/PM format
    let formattedHours = targetDate.getHours();
    const formattedMinutes = targetDate
      .getMinutes()
      .toString()
      .padStart(2, '0');
    const ampm = formattedHours >= 12 ? 'PM' : 'AM';
    formattedHours = formattedHours % 12 || 12; // Convert 24-hour to 12-hour format
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  const TimeSection = ({startTime, duration}) => {
    const fromTimeFormatted = formatTime(startTime);
    const toTimeFormatted = formatTime(startTime, duration);

    return (
      <View>
        <Text style={styles.title}>Time</Text>
        <View style={styles.timeContainer}>
          <View style={styles.timeBox}>
            <Text style={styles.timeText}>From</Text>
            <Text style={styles.time}>{fromTimeFormatted}</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeText}>To</Text>
            <Text style={styles.time}>{toTimeFormatted}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderServiceTypeButtons = () => {
    const serviceTypes = Array.from(
      new Set([data?.data || []]?.flatMap(slot => slot?.serviceType || [])), // Get unique service types
    );

    // Only render the buttons if serviceTypes has items
    return serviceTypes.length > 0 ? (
      <View>
        <Text style={styles.title}>Appointment Mode</Text>
        <View>
          <View style={styles.appointmentMethod}>
            {serviceTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.methodButton, selectedMethod.includes(type)]}
                // onPress={() => toggleMethod(type)}
              >
                <Image
                  source={
                    selectedMethod.includes(type)
                      ? getActiveIcon(type) // Show active icon for selected methods
                      : getInactiveIcon(type) // Show inactive icon otherwise
                  }
                  style={{width: 24, height: 24}}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    ) : null;
  };

  const getInactiveIcon = type => {
    switch (type) {
      case 'Audio':
        return require('../../../assets/images/icons/callIcon.png');
      case 'Video':
        return require('../../../assets/images/icons/videoCall.png');
      case 'Visit':
        return require('../../../assets/images/icons/groupIcon.png');
      default:
        return null;
    }
  };

  const getActiveIcon = type => {
    switch (type) {
      case 'Audio':
        return require('../../../assets/images/icons/call-calling.png');
      case 'Video':
        return require('../../../assets/images/icons/video.png');
      case 'Visit':
        return require('../../../assets/images/icons/groupIcon.png');
      default:
        return null;
    }
  };

  const handleCancel = async () => {
    try {
      const res = await cancelSlot({sloteId: id}).unwrap();
      console.log(res);

      if (res && res?.success) {
        showMessage({
          message: 'Success',
          description: res.message,
          type: 'success',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
      } else {
        const errorMsg = res.error?.data?.message || 'Something went wrong!';
        showMessage({
          message: 'Error',
          description: errorMsg,
          type: 'danger',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
      }
    } catch (error) {
      console.error('Failed to delete profile picture: ', error);
      const errorMsg =
        error?.response?.data?.error?.data?.message || 'Something went wrong!';
      showMessage({
        message: 'Error',
        description: errorMsg,
        type: 'danger',
        titleStyle: {fontFamily: 'Poppins SemiBold'},
        textStyle: {fontFamily: 'Poppins'},
      });
    } finally {
      setCancelVisible(false);
    }
  };
  return (
    <>
      {/* <CustomHeader
        title={'Details'}
        icon={require('../../../assets/images/back.png')}
      /> */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={{marginTop: hp('1.6%')}}>
          <Image
            source={require('../../../assets/images/back.png')}
            style={styles.back}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>{'Details'}</Text>
        </View>
        <TouchableOpacity
          style={{marginTop: hp('1.6%')}}
          onPress={() => setCancelVisible(true)}>
          <Text
            style={{
              color: 'red',
              borderWidth: 1,
              borderColor: 'red',
              textAlign: 'center',
              width: wp('20%'),
              height: hp('4%'),
              padding: 5,
              borderRadius: 10,
              fontFamily: 'Poppins',
            }}>
            {'Cancel'}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          {/* Profile Header */}
          <View style={styles.subContainer}>
            <View style={styles.profileSection}>
              <Image
                source={
                  data?.data?.advocate?.avatar
                    ? {uri: data?.data?.advocate?.avatar}
                    : require('../../../assets/images/user.png')
                }
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>
                {data && data?.data?.advocate?.name}
              </Text>
              <View style={styles.starRating}>
                <View style={styles.starsContainer}>
                  {/* {[...Array(5)].map((_, index) => (
                    <Image
                      key={index}
                      source={require('../../../assets/images/star.png')}
                      style={styles.starImage}
                    />
                  ))} */}
                  <StarRating
                    rating={data?.data?.advocate?.averageRating || 0}
                    starSize={18}
                  />
                </View>
              </View>
            </View>

            {/* Details Section */}
            <View style={styles.detailsSection}>
              {data && data?.data && (
                <>
                  <Text style={styles.title}>Bio</Text>
                  <Text style={styles.description}>
                    {data?.data?.advocate?.headLine}
                  </Text>
                </>
              )}

              {/* <Text style={styles.title}>Profession</Text>
              <Text style={styles.description}>Teacher by profession</Text> */}
              {data && data?.data && (
                <>
                  <Text style={styles.title}>Date</Text>
                  <Text style={styles.description}>
                    {formatDate(data?.data?.date)}
                  </Text>
                </>
              )}
              {data && data?.data && (
                <TimeSection
                  startTime={data?.data?.time}
                  duration={data?.data?.timeInMin}
                />
              )}

              {/* Appointment Mode */}
              {renderServiceTypeButtons()}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.rescheduleButton}
                  onPress={() => openModal(data?.data?.advocate?._id)}>
                  <Text style={[styles.buttonText, {color: '#000'}]}>
                    Reschedule
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.callButton}>
                  <Text style={[styles.buttonText, {color: '#fff'}]}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <RescheduleModal
            id={id}
            advocateId={advocateId}
            modalVisible={modalVisible}
            closeModal={closeModal}
            setModalVisible={setModalVisible}
          />
          <Modal
            transparent={true}
            animationType="slide"
            visible={cancelVisible}
            onRequestClose={() => setCancelVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.deleteContent}>
                <Text style={styles.deleteTitle}>{'Confirm Cancel'}</Text>
                <Text style={styles.modalMessage}>
                  Are you sure you want to cancel this slot?
                </Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleCancel}>
                    <Text style={styles.buttonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setCancelVisible(false)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingTop: hp('8%'),
    height: hp('92%'),
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    borderRadius: wp('1%'),
    backgroundColor: '#E1EBFF',
  },
  profileSection: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: hp('2.5%'),
    zIndex: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#1262D2',
    borderRadius: 50,
    position: 'absolute', // Absolute positioning for overlapping effect
    top: -50, // Half of the image height to position it halfway outside the container
  },
  profileName: {
    fontSize: wp('4%'),
    color: '#294776',
    fontFamily: 'Poppins SemiBold',
    marginTop: hp('8.2%'),
    lineHeight: hp('2.5%'),
  },
  starRating: {
    flexDirection: 'row',
    marginVertical: hp('1%'),
    marginHorizontal: 5,
  },
  stars: {
    color: '#FFA800',
    fontSize: wp('6%'),
    lineHeight: hp('4%'),
  },
  detailsSection: {
    backgroundColor: '#F3F7FF',
    borderRadius: wp('1%'),
    paddingVertical: hp('1.9%'),
    paddingHorizontal: wp('4%'),
  },
  title: {
    fontSize: wp('3.5%'),
    color: '#000307',
    fontFamily: 'Poppins SemiBold',
    marginBottom: hp('0.5%'),
  },
  description: {
    fontSize: wp('3.2%'),
    fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: hp('2%'),
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  timeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: '#F3F7FF',
    borderRadius: wp('1.5%'),
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.40)',
    marginHorizontal: 5,
  },
  timeText: {
    fontSize: wp('3.2%'),
    color: '#929499',
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  time: {
    fontSize: wp('3.2%'),
    color: '#000',
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  appointmentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: hp('1.5%'),
  },
  methodButton: {
    width: wp(20),
    height: hp(5),
    paddingHorizontal: wp(10),
    paddingVertical: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1262D2',
    borderWidth: 1,
    borderColor: '#1262D2',
    borderRadius: wp('1.5%'),
  },
  selectedMethod: {
    backgroundColor: '#1262D2',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    marginVertical: hp('4%'),
  },
  rescheduleButton: {
    flex: 1,
    alignItems: 'center',
    padding: wp('3.2%'),
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 6,
    width: wp(35),
    height: hp('6.5%'),
  },
  callButton: {
    flex: 1,
    alignItems: 'center',
    padding: wp('3.2%'),
    backgroundColor: '#1262D2',
    borderRadius: wp('1.5%'),
    marginHorizontal: 5,
    width: wp(35),
    height: hp('6.5%'),
  },
  sectionTitle: {
    fontSize: wp('4%'),
    color: '#000',
    fontFamily: 'Poppins SemiBold',
    // marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins SemiBold',
  },
  starsContainer: {
    flexDirection: 'row',
    // marginRight: 5, // Adjust as needed
  },
  header: {
    height: hp(9),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3F7FF',
    // backgroundColor:'red',
    elevation: 0.1,
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.5%'),
  },
  back: {
    width: wp('6%'),
    height: hp('4%'),
  },
  titleContainer: {
    flex: 1, // Let the title take up the remaining space
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: wp('4.5%'),
    marginLeft: 45,
    textAlign: 'center',
    fontFamily: 'Poppins SemiBold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalMessage: {
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  deleteContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Poppins SemiBold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
});

export default UserReview;
