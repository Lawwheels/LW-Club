
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  BackHandler,
  FlatList,
} from 'react-native';
import Toast from 'react-native-toast-message';
import CalendarPicker from 'react-native-calendar-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';
import {SelectList} from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomHeader from '../../../shared/CustomHeader';
import CustomButton from '../../../shared/CustomButton';
import {useCreateTimeSlotMutation} from '../../redux/api/api';
import { handleError } from '../../../shared/authUtils';

const durationOptions = [
  {key: '15', value: '15'},
  {key: '20', value: '20'},
  {key: '25', value: '25'},
  {key: '30', value: '30'},
  {key: '35', value: '35'},
];

const CalendarComponent = ({navigation, route}) => {
  const minDate = new Date(); // Today
  const maxDate = new Date(2035, 6, 3);
  const [selectedStartDate, setSelectedStartDate] = useState('YYYY-MM-DD');
  const [selectedEndDate, setSelectedEndDate] = useState('YYYY-MM-DD');

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [duration, setDuration] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState([]);

  const [createTimeSlot] = useCreateTimeSlotMutation();

  const toggleMethod = method => {
    if (method === 'Visit') {
      // If "Visit" is selected, deselect "Audio" and "Video" and toggle "Visit"
      if (selectedMethod.includes('Visit')) {
        setSelectedMethod(selectedMethod.filter(m => m !== 'Visit'));
      } else {
        setSelectedMethod(['Visit']);
      }
    } else {
      // If "Audio" or "Video" is selected, deselect "Visit" and toggle the respective method
      setSelectedMethod(prev => {
        if (prev.includes(method)) {
          return prev.filter(m => m !== method);
        }
        return [...prev.filter(m => m !== 'Visit'), method];
      });
    }
  };
  console.log(selectedStartDate)
  console.log(selectedEndDate)

  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.isFocused()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  const onDateChange = (date, type) => {
    // console.log(JSON.stringify(date));
    const newDate = JSON.stringify(date);
    const newDate1 = newDate.substring(1, newDate.length - 1);
    const dates = newDate1.split('T');
    const date1 = dates[0].split('-');
    const day = date1[2];
    const month = date1[1];
    const year = date1[0];
    // console.log(day + '-' + month + '-' + year);
    if (type === 'END_DATE') {
      if (day === undefined) {
        setSelectedEndDate(selectedStartDate); // Set selectedEndDate to selectedStartDate if it's undefined
      } else {
        setSelectedEndDate(year + '-' + month + '-' + day);
      }
    } else {
      setSelectedStartDate(year + '-' + month + '-' + day);
      setSelectedEndDate(year + '-' + month + '-' + day); // Set selectedEndDate to selectedStartDate when starting
    }
  };

  const handleStartTimeChange = (event, selectedDate) => {
    const currentTime = selectedDate || startTime;
    setShowStartTimePicker(false);
    setStartTime(currentTime);
  };

  const handleEndTimeChange = (event, selectedDate) => {
    const currentTime = selectedDate || endTime;
    setShowEndTimePicker(false);
    setEndTime(currentTime);
  };

  const createTimeSlots = () => {
    if (!startTime || !endTime || !duration) {
      Toast.show({
        type: 'error',
        text1: 'Please select start time, end time, and duration.',
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    let start = new Date(startTime);
    const end = new Date(endTime);
    const slots = [];
    const durationInMinutes = parseInt(duration, 10);

    while (start < end) {
      const endSlot = new Date(start.getTime() + durationInMinutes * 60000);
      if (endSlot <= end) {
        slots.push({start: new Date(start), end: endSlot});
      }
      start = endSlot;
    }

    setTimeSlots(slots);
  };

  const handleSubmit = async () => {
    try {
      // Check if start date and end date are selected
      if (
        selectedStartDate === 'YYYY-MM-DD' ||
        selectedEndDate === 'YYYY-MM-DD'
      ) {
        showMessage({
          message: 'Please select both start date and end date.',
          type: 'danger',
          icon: 'auto',
          autoHide: true,
        });
        return; // Exit the function early if dates are not selected
      }
      if (!duration) {
        Toast.show({
          type: 'error',
          text1: 'Please select duration.',
          visibilityTime: 2000,
          autoHide: true,
        });
        return;
      }

      createTimeSlots(); // Assuming this function creates the time slots
      // Check if any time slots are selected

      if (selectedSlots.length === 0) {
        showMessage({
          message: 'Please select at least one time slot.',
          type: 'danger',
          icon: 'auto',
          autoHide: true,
        });
        return;
      }
      if (selectedMethod.length === 0) {
        showMessage({
          message: 'Please select at least one method.',
          type: 'danger',
          icon: 'auto',
          autoHide: true,
        });
        return;
      }
      setLoading(true);

      const formattedTimeSlots = selectedSlots.map(index => {
        const slot = timeSlots[index];
        const endTime = formatTime(slot.end); // Ensure you define formatTime elsewhere
        return `${endTime}`;
      });

      const body = {
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        times: formattedTimeSlots,
        serviceType: selectedMethod,
        timeInMin: duration,
      };

      console.log(body);

      // Uncomment and implement your dispatch logic
      const res = await createTimeSlot(body);
      // console.log(res);

      if (res && res?.data?.success) {
        showMessage({
          message: res?.data?.message,
          type: 'success',
          icon: 'auto',
          autoHide: true,
        });
        navigation.navigate('AdvocateNavigator');
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
      handleError(error)
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

  const formatTime = time => {
    if (!time) return '';
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSlotSelect = index => {
    setSelectedSlots(prevSelectedSlots => {
      if (prevSelectedSlots.includes(index)) {
        return prevSelectedSlots.filter(slot => slot !== index);
      } else {
        return [...prevSelectedSlots, index];
      }
    });
  };

  // console.log(selectedMethod);
  return (
    <View style={styles.container}>
      <View style={{paddingTop: hp('4.5%')}}>
        <CustomHeader
          title={'Set your availability'}
          icon={require('../../../assets/images/back.png')}
        />
        <Text style={styles.subHeader}>
          Set your availability to receive{'\n'}service requests
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginHorizontal: wp('4%')}}>
          <View style={{width: '100%'}}>
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              minDate={minDate}
              maxDate={maxDate}
              todayBackgroundColor="#1262D2"
              selectedDayColor="#FF9500"
              selectedDayTextColor="#FFFFFF"
              onDateChange={onDateChange}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: hp('2%'),
              }}>
              <View>
                <Text style={styles.inputLabel}>Start Date</Text>
                <View style={styles.dateContainer}>
                  <Text style={styles.buttonText}>{selectedStartDate}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.inputLabel}>End Date</Text>
                <View style={styles.dateContainer}>
                  <Text style={styles.buttonText}>{selectedEndDate }</Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.inputLabel}>Add Availability</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: wp('90%'),
            }}>
            <>
              <TouchableOpacity
                onPress={() => setShowStartTimePicker(true)}
                style={styles.customButton}>
                <View style={styles.timeContainer}>
                  <View style={styles.timeMainContainer}>
                    <Text style={styles.dateText}>From</Text>
                    <Text style={styles.timeText}>
                      {startTime ? formatTime(startTime) : 'Start Time'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              {showStartTimePicker && (
                <DateTimePicker
                  value={startTime || new Date()}
                  mode="time"
                  display="default"
                  onChange={handleStartTimeChange}
                />
              )}
            </>
            <>
              <TouchableOpacity
                onPress={() => setShowEndTimePicker(true)}
                style={styles.customButton}>
                <View style={styles.timeContainer}>
                  <View style={styles.timeMainContainer}>
                    <Text style={styles.dateText}>To</Text>
                    <Text style={styles.timeText}>
                      {endTime ? formatTime(endTime) : 'End Time'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              {showEndTimePicker && (
                <DateTimePicker
                  value={endTime || new Date()}
                  mode="time"
                  display="default"
                  onChange={handleEndTimeChange}
                />
              )}
            </>
          </View>
          <View style={{marginTop: hp('2%')}}>
            <Text style={styles.inputLabel}>Duration (minutes)</Text>
            <SelectList
              setSelected={setDuration}
              data={durationOptions}
              save="value"
              placeholder="Select Duration (minutes)"
              inputStyles={{fontSize: 12}}
              fontFamily="Poppins"
            />

            {timeSlots.length > 0 && (
              <View style={styles.timeSlotList}>
                {/* {timeSlots.map((slot, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeSlotItem,
                      selectedSlots.includes(index)
                        ? styles.selectedSlot
                        : styles.unselectedSlot,
                    ]}
                    onPress={() => handleSlotSelect(index)}>
                    <Text
                      style={
                        selectedSlots.includes(index)
                          ? styles.selectedSlotText
                          : styles.unselectedSlotText
                      }>
                      
                      {formatTime(slot.end)}
                    </Text>
                  </TouchableOpacity>
                ))} */}
                <FlatList
                  data={timeSlots}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={3} // Ensures 3 columns per row
                  columnWrapperStyle={{
                    justifyContent: 'space-between',
                    marginVertical: 2,
                  }} // Adjust row style
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      style={[
                        styles.timeSlotItem,
                        selectedSlots.includes(index)
                          ? styles.selectedSlot
                          : styles.unselectedSlot,
                      ]}
                      onPress={() => handleSlotSelect(index)}>
                      <Text
                        style={
                          selectedSlots.includes(index)
                            ? styles.selectedSlotText
                            : styles.unselectedSlotText
                        }>
                        {formatTime(item.end)}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          <View style={{marginTop: hp('2%')}}>
            <Text style={styles.inputLabel}>Select Mode</Text>
            <View style={styles.appointmentMethod}>
              {/* Audio Option */}
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  selectedMethod.includes('Audio') && styles.selectedMethod,
                ]}
                onPress={() => toggleMethod('Audio')}>
                <Image
                  source={
                    selectedMethod.includes('Audio')
                      ? require('../../../assets/images/icons/callIcon.png') // Icon when active
                      : require('../../../assets/images/icons/call-calling.png') // Icon when inactive
                  }
                  style={{width: 20, height: 20}}
                />
              </TouchableOpacity>

              {/* Video Option */}
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  selectedMethod.includes('Video') && styles.selectedMethod,
                ]}
                onPress={() => toggleMethod('Video')}>
                <Image
                  source={
                    selectedMethod.includes('Video')
                      ? require('../../../assets/images/icons/videoCall.png') // Icon when active
                      : require('../../../assets/images/icons/video.png') // Icon when inactive
                  }
                  style={{width: 24, height: 24}}
                />
              </TouchableOpacity>

              {/* Visit Option */}
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  selectedMethod.includes('Visit') && styles.selectedMethod,
                ]}
                onPress={() => toggleMethod('Visit')}>
                <Image
                  source={
                    selectedMethod.includes('Visit')
                      ? require('../../../assets/images/icons/visit.png') // Icon when active
                      : require('../../../assets/images/icons/visitIcon.png') // Icon when inactive
                  }
                  style={{width: 24, height: 24}}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{marginTop: hp('4%')}}>
            <CustomButton
              title={'Create Time Slot'}
              onPress={handleSubmit}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CalendarComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
    fontFamily: 'Poppins',
  },
  timePickerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  timePickerText: {
    color: '#333',
    fontSize: 16,
  },

  timeSlotList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: hp('2%'),
  },
  timeSlotItem: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderRadius: 5,
  },
  selectedSlot: {
    backgroundColor: '#1262D2',
  },
  unselectedSlot: {
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
  },
  selectedSlotText: {
    color: 'white',
    fontFamily: 'Poppins',
  },
  unselectedSlotText: {
    color: 'black',
    fontFamily: 'Poppins',
  },
  indicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: '#F3F7FF',
  },
  subHeader: {
    fontSize: 16,
    fontFamily: 'Poppins',
    lineHeight: 22,
    textAlign: 'center',
    // marginBottom: 20,
    color: '#fff',
    backgroundColor: '#1262D2',
    width: wp(100),
    height: hp('10%'),
    padding: 15,
    fontWeight: '500',
  },
  highlight: {
    color: '#F29F05',
  },
  customButton: {
    backgroundColor: '#F3F7FF',
    width: wp('50%'),
  },
  buttonText: {
    color: '#7F7F80', // Text color
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  inputLabel: {
    fontSize: wp('3.5%'),
    color: '#000',
    marginBottom: 5,
    fontFamily: 'Poppins SemiBold',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Poppins',
  },
  ampmText: {
    fontSize: 12,
    color: '#1262D2',
    fontFamily: 'Poppins',
  },
  timeMainContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 10,
    width: wp('42%'),
    justifyContent: 'space-between',
  },
  dateText: {
    color: '#929499',
    fontFamily: 'Poppins',
    marginRight: 5,
    fontSize: 12,
  },
  ampmContainer: {
    borderColor: '#929499',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  dateContainer: {
    backgroundColor: '#DFECFF',
    padding: 10,
    borderRadius: wp('2%'),
    width: wp('43%'),
    fontFamily: 'Poppins',
  },
  appointmentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginVertical: 10,
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
});
