import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomHeader from '../../../shared/CustomHeader';
import {useGetAdvocateSlotByIdQuery} from '../../redux/api/api';

const {width} = Dimensions.get('window');

const ConsultationDetails = ({route}) => {
  const {id} = route?.params || {};
  const swiper = useRef();
  const today = new Date(); // Today's date
  const [value, setValue] = useState(today); // Default to today's date
  const [month, setMonth] = useState(moment(today).startOf('month')); // Start of the current month using moment
  const [week, setWeek] = useState(
    moment(today).diff(moment(today).startOf('month'), 'weeks'),
  ); // Current week in the month
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState([]);
  const {data: consult, error, isLoading} = useGetAdvocateSlotByIdQuery(id);

  console.log('consult', consult);

  if (isLoading || !consult) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    console.log(error);
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'red'}}>Error loading consultation details.</Text>
      </View>
    );
  }

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const times = [
    '09:00 AM-10:00AM',
    '10:00 AM-11:00AM',
    '11:00 AM-12:00PM',
    '01:00 PM-02:00PM',
    '05:00 PM-06:00PM',
    '06:00 AM-07:00PM',
    '09:00 PM-10:00PM',
    '03:00 PM-04:00PM',
  ];

  // const weeks = React.useMemo(() => {
  //   const start = moment(month) // Ensure month is a moment object
  //     .startOf('month')
  //     .add(week, 'weeks')
  //     .startOf('week');

  //   return [-1, 0, 1].map(adj => {
  //     return Array.from({length: 7}).map((_, index) => {
  //       const date = moment(start).add(adj, 'week').add(index, 'day');
  //       return {
  //         weekday: date.format('ddd'), // Format weekday
  //         date: date.toDate(), // Convert back to native Date object for comparison later
  //       };
  //     });
  //   });
  // }, [week, month]);

  // useEffect(() => {
  //   // Scroll to the current week on initial render
  //   if (swiper.current) {
  //     swiper.current.scrollTo(1, false);
  //   }
  // }, []);

  // const handleMonthChange = direction => {
  //   const newMonth = moment(month).add(direction, 'months'); // Use moment to add months
  //   setMonth(newMonth); // Set month as moment object
  //   setWeek(0); // Reset the week to 0
  //   swiper.current.scrollTo(1, false);
  // };

  // const isSameDate = (date1, date2) => {
  //   return (
  //     date1.getFullYear() === date2.getFullYear() &&
  //     date1.getMonth() === date2.getMonth() &&
  //     date1.getDate() === date2.getDate()
  //   );
  // };

  // const onDateChange = selectedDate => {
  //   setShowPicker(false); // Close the picker modal

  //   if (selectedDate) {
  //     setValue(selectedDate); // Update the selected date

  //     // Update the month based on the selected date
  //     const newMonth = moment(selectedDate).startOf('month');
  //     setMonth(newMonth);

  //     // Calculate the new week based on the selected date
  //     const newWeek = moment(selectedDate).diff(
  //       moment(newMonth).startOf('month'),
  //       'weeks',
  //     );
  //     setWeek(newWeek >= 0 ? newWeek : 0); // Avoid setting a negative week value
  //   }
  // };

  const openConfirmationModal = () => {
    setModalVisible(false); // Close the reschedule modal
    setConfirmationVisible(true); // Open the confirmation modal
  };

  // Function to close the confirmation modal
  const closeConfirmationModal = () => setConfirmationVisible(false);

  const renderServiceTypeButtons = () => {
    const serviceTypes = Array.from(
      new Set([consult?.data || []]?.flatMap(slot => slot?.serviceType || [])), // Get unique service types
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

  // Helper functions to determine icon based on service type
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

  return (
    <>
      <CustomHeader
        title={'Details'}
        icon={require('../../../assets/images/back.png')}
      />
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          {/* Profile Header */}

          <View style={styles.subContainer}>
            <View style={styles.profileSection}>
              <Image
                source={
                  consult?.data?.client?.avatar
                    ? {uri: consult?.data?.client?.avatar}
                    : require('../../../assets/images/user.png')
                }
                style={styles.profileImage}
              />

              <Text style={styles.profileName}>
                {consult && consult?.data?.client?.name}
              </Text>
              {/* <View style={styles.starRating}>
                <View style={styles.starsContainer}>
                  {[...Array(5)].map((_, index) => (
                    <Image
                      key={index}
                      source={require('../../../assets/images/star.png')}
                      style={styles.starImage}
                    />
                  ))}
                </View>
              </View> */}
            </View>

            {/* Details Section */}
            <View style={styles.detailsSection}>
              {consult && consult?.data && (
                <>
                  <Text style={styles.title}>Client's Legal Concern</Text>
                  <Text style={styles.description}>
                    {consult?.data?.client_legal_issue}
                  </Text>
                </>
              )}
              {/* <Text style={styles.title}>Profession</Text>
              <Text style={styles.description}>Teacher by profession</Text> */}

              {consult && consult?.data && (
                <View>
                  <Text style={styles.title}>Date</Text>
                  <Text style={styles.description}>
                    {formatDate(consult?.data?.date)}
                  </Text>
                </View>
              )}

              {consult && consult?.data && (
                <TimeSection
                  startTime={consult?.data?.time}
                  duration={consult?.data?.timeInMin}
                />
              )}

              {/* Appointment Mode */}
              {renderServiceTypeButtons()}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.rescheduleButton}
                  // onPress={openModal}
                  >
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
          {/* <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Reschedule</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.sectionTitle}>Select a Date</Text>
                
                  <TouchableOpacity onPress={() => setShowPicker(true)}>
                    <Image
                      source={require('../../../assets/images/schedule/calendarIcon.png')} // Your calendar icon
                      style={{width: 24, height: 24, marginHorizontal: 5}} // Adjust the size and spacing
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.monthHeader}>
                  <TouchableOpacity onPress={() => handleMonthChange(-1)}>
                    <Image
                      source={require('../../../assets/images/schedule/chevron-left.png')}
                      style={{width: 24, height: 20}}
                    />
                  </TouchableOpacity>
                  <Text style={styles.monthTitle}>
                    {month.format('MMMM YYYY')}
                  </Text>
                  <TouchableOpacity onPress={() => handleMonthChange(1)}>
                    <Image
                      source={require('../../../assets/images/schedule/chevron-right.png')}
                      style={{width: 24, height: 20}}
                    />
                  </TouchableOpacity>
                </View>

   
                <View style={styles.picker}>
                  <Swiper
                    index={1}
                    ref={swiper}
                    loop={false}
                    showsPagination={false}
                    onIndexChanged={ind => {
                      if (ind === 1) return;
                      setTimeout(() => {
                        const newIndex = ind - 1;
                        const newWeek = week + newIndex;
                        setWeek(newWeek);
                        setValue(moment(value).add(newIndex, 'week').toDate());
                        swiper.current.scrollTo(1, false);
                      }, 100);
                    }}>
                    {weeks.map((dates, index) => (
                      <View style={styles.itemRow} key={index}>
                        {dates.map((item, dateIndex) => {
                          const isActive = isSameDate(value, item.date);
                          const isSaturday = item.weekday === 'Sat';
                          const isSunday = item.weekday === 'Sun';
                          return (
                            <TouchableWithoutFeedback
                              key={dateIndex}
                              onPress={() => setValue(item.date)}>
                              <View
                                style={[
                                  styles.item,
                                  isActive && {
                                    backgroundColor: '#1262D2',
                                    borderColor: '#1262D2',
                                  },
                                  (isSaturday || isSunday) && {
                                    marginRight: isSaturday ? 15 : 0,
                                  },
                                ]}>
                                <Text
                                  style={[
                                    styles.itemWeekday,
                                    isActive && {color: '#fff'},
                                  ]}>
                                  {item.weekday}
                                </Text>
                                <Text
                                  style={[
                                    styles.itemDate,
                                    isActive && {color: '#fff'},
                                  ]}>
                                  {item.date.getDate()}
                                </Text>
                              </View>
                            </TouchableWithoutFeedback>
                          );
                        })}
                      </View>
                    ))}
                  </Swiper>
                </View>

                {showPicker && (
                  <DateTimePickerModal
                    isVisible={showPicker}
                    mode="date"
                    date={value}
                    onConfirm={onDateChange}
                    onCancel={() => setShowPicker(false)}
                  />
                )}

                <Text style={[styles.sectionTitle, {marginVertical: 5}]}>
                  Select a Time
                </Text>
                <FlatList
                  numColumns={2}
                  data={times}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={[
                        styles.timeItem,
                        selectedTime === item && styles.selectedTime,
                      ]}
                      onPress={() => setSelectedTime(item)}>
                      <Text
                        style={
                          selectedTime === item
                            ? styles.selectedTimeText
                            : styles.timeText
                        }>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item}
                />
                <LinearGradient
                  colors={['#1262D2', '#17316D']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.closeButton}>
                  <TouchableOpacity onPress={openConfirmationModal}>
                    <Text style={styles.buttonText}>Reshedule</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </Modal> */}

          <Modal
            visible={confirmationVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={closeConfirmationModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Image at the top */}
                <Image
                  source={require('../../../assets/images/lawyer.png')} // replace with the correct path to your image
                  style={{width: wp(30), height: hp(30), alignSelf: 'center'}}
                />
                <Text style={styles.modalTitleText}>
                  Are you sure you want to reschedule this appointment?
                </Text>
                <Text style={styles.modalText}>
                  Rescheduling will notify the client, and the current booking
                  time will be changed.
                </Text>
                {/* Cancel and Confirm Buttons */}
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={closeConfirmationModal}>
                    <Text
                      style={{
                        fontFamily: 'Poppins',
                        fontWeight: '400',
                        fontSize: 14,
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <LinearGradient
                    colors={['#1262D2', '#17316D']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.confirmButton}>
                    <TouchableOpacity onPress={closeConfirmationModal}>
                      <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                  </LinearGradient>
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
    // backgroundColor: '#F3F7FF',
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
  buttonText: {
    fontSize: wp('3.73%'),
    fontFamily: 'Poppins SemiBold',
  },
  sectionTitle: {
    fontSize: wp('4%'),
    color: '#000',
    fontFamily: 'Poppins SemiBold',
    // marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: wp('95%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: wp('5%'),
    backgroundColor: '#FFF',
    borderRadius: wp('1%'),
    // alignItems: 'center',
  },
  modalTitle: {
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins SemiBold',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  modalText: {
    fontSize: wp('4%'),
    fontWeight: '400',
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginBottom: hp('5%'),
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('2%'),
    borderRadius: wp('1.5%'),
    marginVertical: hp('4%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins SemiBold',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
  },
  monthTitle: {
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
  },

  picker: {
    // flex: 1,
    width: wp('95%'),
    maxHeight: hp('10%'),
    paddingVertical: hp('1%'),
    // paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    height: hp('7%'),
    marginHorizontal: wp('1%'),
    paddingVertical: hp('0.5%'),
    // paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: wp('1%'),
    borderColor: '#e3e3e3',
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemRow: {
    width: width, // Adjust width here to leave space for calendar icon
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: wp('3%'),
  },
  itemWeekday: {
    fontSize: wp('3%'),
    fontWeight: '500',
    color: '#737373',
    fontFamily: 'Poppins',
    // marginBottom: 4,
  },
  itemDate: {
    fontSize: wp('3%'),
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    color: '#111',
  },
  selectedDate: {
    backgroundColor: '#1262D2',
  },
  dateText: {
    color: 'black',
  },
  selectedDateText: {
    color: 'white',
  },
  timeItem: {
    padding: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp('1%'),
    margin: 5,
    flex: 1,
    alignItems: 'center',
  },
  selectedTime: {
    backgroundColor: '#1262D2',
  },
  timeText: {
    color: 'black',
    fontFamily: 'Poppins',
  },
  selectedTimeText: {
    color: 'white',
    fontFamily: 'Poppins',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    padding: hp('1.5%'),
    marginRight: wp('1.5%'),
    borderRadius: wp('1.5%'),
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    padding: hp('1.5%'),
    borderRadius: wp('1.5%'),
    alignItems: 'center',
  },
  modalTitleText: {
    fontSize: 18,
    color: '#294776',
    fontFamily: 'Poppins SemiBold',
    marginBottom: 10,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 5, // Adjust as needed
  },
  starImage: {
    width: 18, // Adjust to your image size
    height: 18, // Adjust to your image size
    marginRight: 2,
  },
});

export default ConsultationDetails;
