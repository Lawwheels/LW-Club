// RescheduleModal.js
import React, {useState, useRef, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import Swiper from 'react-native-swiper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import {
  useRescheduleSlotStudentMutation,
  useSloteForStudentQuery,
} from '../../../redux/api/api';
import {handleError} from '../../../../shared/authUtils';
const {width} = Dimensions.get('window');

const RescheduleModal = ({
  id,
  advocateId,
  modalVisible,
  closeModal,
  setModalVisible,
}) => {
  const swiper = useRef(null);

  const today = new Date(); // Today's date
  const [value, setValue] = useState(today); // Default to today's date
  const [month, setMonth] = useState(moment(today).startOf('month')); // Start of the current month using moment
  const [week, setWeek] = useState(
    moment(today).diff(moment(today).startOf('month'), 'weeks'),
  ); // Current week in the month
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const formattedDate = new Date(value).toLocaleDateString('en-CA');
  const {data: slotData} = useSloteForStudentQuery({
    advocate: advocateId,
    date: formattedDate,
  });

  //   console.log(slotData);
  //   console.log('ScheduleTime', selectedTime);
  //   console.log(id);
  //   const {data, error, isLoading} = useGetUserSlotByIdQuery(id);
  const times = slotData?.data?.flatMap(slot => slot.slotes) || [];

  const [rescheduleSlotStudent] = useRescheduleSlotStudentMutation();

  //   console.log('slot', times);

  const weeks = React.useMemo(() => {
    const start = moment(month) // Ensure month is a moment object
      .startOf('month')
      .add(week, 'weeks')
      .startOf('week');

    return [-1, 0, 1].map(adj => {
      return Array.from({length: 7}).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');
        return {
          weekday: date.format('ddd'), // Format weekday
          date: date.toDate(), // Convert back to native Date object for comparison later
        };
      });
    });
  }, [week, month]);
  //   console.log('reschdeuleModal', data);
  useEffect(() => {
    // Scroll to the current week on initial render
    if (swiper.current) {
      swiper.current.scrollTo(1, false);
    }
  }, []);

  const handleMonthChange = direction => {
    const newMonth = moment(month).add(direction, 'months'); // Use moment to add months
    setMonth(newMonth); // Set month as moment object
    setWeek(0); // Reset the week to 0
    swiper.current.scrollTo(1, false);
  };

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
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

  //   const closeConfirmationModal = () => setConfirmationVisible(false);
  const closeConfirmationModal = async () => {
    if (!selectedTime) {
      showMessage({
        message: 'Error',
        description: 'Please select at least one slot.',
        type: 'danger',
        titleStyle: {fontFamily: 'Poppins SemiBold'},
        textStyle: {fontFamily: 'Poppins'},
      });
      return;
    }

    setLoading(true);
    try {
      const response = await rescheduleSlotStudent({
        newSloteId: selectedTime._id,
        oldSloteId: id,
      }); // Send the ID here
      console.log('Booking slot response:', response);
      if (response && response?.data?.success) {
        showMessage({
          message: 'Success',
          description: response?.data?.message,
          type: 'success',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
        setConfirmationVisible(false);
      } else {
        const errorMsg =
          response.error?.data?.message || 'Something went wrong!';
        showMessage({
          message: 'Error',
          description: errorMsg,
          type: 'danger',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
      }
    } catch (error) {
    //   handleError(error);
      console.error('Error booking slot:', error);
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
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
              <Image
                source={require('../../../../assets/images/icons/close.png')} // Replace with your close icon
                style={styles.closeIconImage}
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Reschedule</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.sectionTitle}>Select a Date</Text>
                <TouchableOpacity onPress={() => setShowPicker(true)}>
                  <Image
                    source={require('../../../../assets/images/schedule/calendarIcon.png')}
                    style={{width: 24, height: 24, marginHorizontal: 5}}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.monthHeader}>
                <TouchableOpacity onPress={() => handleMonthChange(-1)}>
                  <Image
                    source={require('../../../../assets/images/schedule/chevron-left.png')}
                    style={{width: 24, height: 20}}
                  />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>
                  {month.format('MMMM YYYY')}
                </Text>
                <TouchableOpacity onPress={() => handleMonthChange(1)}>
                  <Image
                    source={require('../../../../assets/images/schedule/chevron-right.png')}
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
              {times?.length === 0 ? (
                <Text style={styles.noCreatedSlotMessage}>
                  No available slot, please select another date
                </Text> // If no data is available
              ) : (
                <FlatList
                  numColumns={2}
                  data={times}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={[
                        styles.timeItem,
                        selectedTime === item && styles.selectedTime,
                        item.isBooked && styles.disabledTime, // Apply disabled style
                      ]}
                      onPress={() => !item.isBooked && setSelectedTime(item)} // Prevent selection if booked
                      disabled={item.isBooked} // Disable if isBooked is true
                    >
                      <Text
                        style={
                          selectedTime === item
                            ? styles.selectedTimeText
                            : item.isBooked
                            ? styles.disabledTimeText
                            : styles.timeText
                        }>
                        {item.time}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item._id} // Use unique key
                />
              )}
              {times?.length === 0 ? null : (
                <LinearGradient
                  colors={['#1262D2', '#17316D']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.closeButton}>
                  <TouchableOpacity onPress={openConfirmationModal}>
                    <Text style={styles.buttonText}>Reschedule</Text>
                  </TouchableOpacity>
                </LinearGradient>
              )}
            </ScrollView>
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
              source={require('../../../../assets/images/lawyer.png')} // replace with the correct path to your image
              style={{width: wp(30), height: hp(30), alignSelf: 'center'}}
            />
            <Text style={styles.modalTitleText}>
              Are you sure you want to reschedule this appointment?
            </Text>
            <Text style={styles.modalText}>
              Rescheduling will notify the client, and the current booking time
              will be changed.
            </Text>
            {/* Cancel and Confirm Buttons */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setConfirmationVisible(false)}>
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
    </>
  );
};

export default RescheduleModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingTop: hp('8%'),
    height: hp('92%'),
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
    position: 'relative',
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
  noCreatedSlotMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888', // Or any color of your choice
    marginVertical: 8,
    fontFamily: 'Poppins',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10, // Ensure it appears above other elements
  },
  closeIconImage: {
    width: 24,
    height: 24,
  },
  disabledTime: {
    backgroundColor: '#ddd', // Grey background for disabled state
    opacity: 0.5, // Reduced opacity for disabled state
  },
  disabledTimeText: {
    color: '#999', // Text color for disabled state
  },
});
