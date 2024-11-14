import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomHeader from '../../../shared/CustomHeader';

const {width} = Dimensions.get('window');
const reduceWidth = width - 40;

const BookingDetails = () => {
  const swiper = useRef();
  const [value, setValue] = useState(new Date());
  const [week, setWeek] = useState(0);
  const [month, setMonth] = useState(moment());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(['phone', 'video']);

  const toggleMethod = method => {
    if (selectedMethod.includes(method)) {
      setSelectedMethod(selectedMethod.filter(item => item !== method));
    } else {
      setSelectedMethod([...selectedMethod, method]);
    }
  };

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

  const weeks = React.useMemo(() => {
    const start = moment(month)
      .startOf('month')
      .add(week, 'weeks')
      .startOf('week');
    return [-1, 0, 1].map(adj => {
      return Array.from({length: 7}).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');
        return {
          weekday: date.format('ddd'),
          date: date.toDate(),
        };
      });
    });
  }, [week, month]);

  // Update month and reset week when month changes
  const handleMonthChange = direction => {
    const newMonth = moment(month).add(direction, 'months');
    setMonth(newMonth);
    setWeek(0);
    swiper.current.scrollTo(1, false);
  };

  const onDateChange = selectedDate => {
    setShowPicker(false); // Close the picker modal

    if (selectedDate) {
      setValue(selectedDate); // Update the selected date

      // Update the month based on the selected date
      const newMonth = moment(selectedDate).startOf('month');
      setMonth(newMonth);

      // Calculate the new week based on the selected date
      const newWeek = moment(selectedDate).diff(
        moment(newMonth).startOf('month'),
        'weeks',
      );
      setWeek(newWeek >= 0 ? newWeek : 0); // Avoid setting a negative week value
    }
  };

  const openConfirmationModal = () => {
    setModalVisible(false); // Close the reschedule modal
    setConfirmationVisible(true); // Open the confirmation modal
  };

  // Function to close the confirmation modal
  const closeConfirmationModal = () => setConfirmationVisible(false);

  return (
    <>
      <CustomHeader
        title={'Booking details'}
        icon={require('../../../assets/images/back.png')}
      />
      <View style={styles.container}>
        {/* Profile Header */}

        <View style={styles.subContainer}>
          <View style={styles.profileSection}>
            <Image
              source={require('../../../assets/images/user.png')}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>Ankush Gupta</Text>
            <View style={styles.starRating}>
              <Text style={styles.stars}>★★★★★</Text>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <Text style={styles.title}>Client's Legal Concern</Text>
            <Text style={styles.description}>
              Chris Evans is a seasoned civil lawyer with over 5 years of
              experience in specific civil law area.
            </Text>

            <Text style={styles.title}>Profession</Text>
            <Text style={styles.description}>Teacher by profession</Text>

            <Text style={styles.title}>Date</Text>
            <Text style={styles.description}>28th December, 2024</Text>

            {/* Time Section */}
            <Text style={styles.title}>Time</Text>
            <View style={styles.timeContainer}>
              <View style={styles.timeBox}>
                <Text style={styles.timeText}>From</Text>
                <Text style={styles.time}>09:00 AM</Text>
              </View>
              <View style={styles.timeBox}>
                <Text style={styles.timeText}>To</Text>
                <Text style={styles.time}>05:00 PM</Text>
              </View>
            </View>

            {/* Appointment Mode */}
            <Text style={styles.title}>Appointment Mode</Text>
            <View style={styles.appointmentMethod}>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  selectedMethod.includes('phone') && styles.selectedMethod,
                ]}
                onPress={() => toggleMethod('phone')}>
                <Image
                  source={
                    selectedMethod.includes('phone')
                      ? require('../../../assets/images/icons/callIcon.png') // Icon when active
                      : require('../../../assets/images/icons/call-calling.png') // Icon when inactive
                  }
                  style={{width: 24, height: 24}}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  selectedMethod.includes('video') && styles.selectedMethod,
                ]}
                onPress={() => toggleMethod('video')}>
                <Image
                  source={
                    selectedMethod.includes('video')
                      ? require('../../../assets/images/icons/videoCall.png') // Icon when active
                      : require('../../../assets/images/icons/video.png') // Icon when inactive
                  }
                  style={{width: 24, height: 24}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  selectedMethod.includes('inperson') && styles.selectedMethod,
                ]}
                onPress={() => toggleMethod('inperson')}>
                {/* <FontAwesome name="users" size={24} color={selectedMethod === 'inperson' ? 'white' : 'black'} /> */}
                <Image
                  source={require('../../../assets/images/icons/groupIcon.png')}
                  style={{width: 24, height: 24}}
                />
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.rescheduleButton}
                onPress={openModal}>
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
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Reschedule</Text>
              <Text style={styles.sectionTitle}>Select a Date</Text>
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

              {/* Swiper for Weekly Dates */}
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
                        const isActive =
                          value.toDateString() === item.date.toDateString();
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

                {/* Calendar Icon */}
                <TouchableOpacity onPress={() => setShowPicker(true)}>
                  <Image
                    source={require('../../../assets/images/schedule/calendarIcon.png')} // Your calendar icon
                    style={{width: 24, height: 24, marginHorizontal: 5}} // Adjust the size and spacing
                  />
                </TouchableOpacity>
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
        </Modal>

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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingTop: 50,
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#E1EBFF',
  },
  profileSection: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 16,
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
    fontSize: 16,
    color: '#294776',
    fontFamily: 'Poppins SemiBold',
    marginTop: 60,
    lineHeight: 20,
  },
  starRating: {
    flexDirection: 'row',
    marginVertical: 0,
    marginHorizontal: 5,
  },
  stars: {
    color: '#FFA800',
    fontSize: 24,
    lineHeight: 24,
  },
  detailsSection: {
    backgroundColor: '#F3F7FF',
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontSize: 14,
    color: '#000307',
    fontFamily: 'Poppins SemiBold',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#F3F7FF',
    borderRadius: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.40)',
    marginHorizontal: 5,
  },
  timeText: {
    fontSize: 12,
    color: '#929499',
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  time: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  appointmentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  methodButton: {
    width: wp(20),
    height: hp(5),
    paddingHorizontal: wp(10),
    paddingVertical: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F7FF',
    borderWidth: 1,
    borderColor: '#1262D2',
    borderRadius: 10,
  },
  selectedMethod: {
    backgroundColor: '#1262D2',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    marginVertical: 20,
  },
  rescheduleButton: {
    // flex: 1,
    alignItems: 'center',
    padding: 12,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 6,
    width: wp(35),
    height: hp(5),
  },
  callButton: {
    // flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1262D2',
    borderRadius: 10,
    // marginHorizontal: 5,
    width: wp(35),
    height: hp(5),
  },
  buttonText: {
    // color: '#FFF',
    // fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Poppins SemiBold',
  },
  sectionTitle: {
    fontSize: 16,
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
    width: wp(80),
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    // alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins SemiBold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins SemiBold',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
  },
  picker: {
    // flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    // flex: 1,
    height: 50,
    // marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    // borderWidth: 1,
    borderRadius: 8,
    // borderColor: '#e3e3e3',
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemRow: {
    width: reduceWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  itemWeekday: {
    fontSize: 12,
    fontWeight: '500',
    color: '#737373',
    fontFamily: 'Poppins',
    // marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
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
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
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
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitleText: {
    fontSize: 18,
    color: '#294776',
    fontFamily: 'Poppins SemiBold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default BookingDetails;
