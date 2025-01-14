import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import {showMessage} from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomHeader from '../../../../shared/CustomHeader';
import CustomButton from '../../../../shared/CustomButton';
import {
  useBookingSlotStudentMutation,
  useGetStudentAdvocateByIdQuery,
  useSloteForStudentQuery,
} from '../../../redux/api/api';
import StarRating from '../../../../shared/StarRating';
import {useNavigation} from '@react-navigation/native';
import {handleError} from '../../../../shared/authUtils';

const {width} = Dimensions.get('window');

const AdvocateBooking = ({route}) => {
  const navigation = useNavigation();
  const {id} = route?.params || {};
  const [selectedMethod, setSelectedMethod] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [description, setDescription] = useState('');
  const swiper = useRef();
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const today = new Date(); // Today's date

  const [value, setValue] = useState(today); // Default to today's date
  const [month, setMonth] = useState(moment(today).startOf('month')); // Start of the current month using moment
  const [week, setWeek] = useState(
    moment(today).diff(moment(today).startOf('month'), 'weeks'),
  ); // Current week in the month

  console.log(id);

  const formattedDate = new Date(value).toLocaleDateString('en-CA');
  const {data, isLoading, error} = useGetStudentAdvocateByIdQuery(id);
  const {data: slotData,isLoading:loadingSlot,error:slotError} = useSloteForStudentQuery({
    advocate: id,
    date: formattedDate,
    skip: !id,
  });
  const [bookingSlotStudent] = useBookingSlotStudentMutation();
  // Assuming `slotData` is already fetched and contains the data as per your log
  const times = slotData?.data?.flatMap(slot => slot.slotes) || [];

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
  const weeks = React.useMemo(() => {
    const start = moment(month) // Ensure month is a moment object
      .startOf('month')
      .add(week, 'weeks')
      .startOf('week');
  
    return [-1, 0, 1].map(adj => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');
        return {
          weekday: date.format('ddd'), // Format weekday
          date: date.toDate(), // Convert back to native Date object for comparison later
          isDisabled: date.isBefore(today, 'day'), // Disable past dates
        };
      });
    });
  }, [week, month]);

  useEffect(() => {
    // Scroll to the current week on initial render
    if (swiper.current) {
      swiper.current.scrollTo(1, false);
    }
  }, []);

  // console.log('userAdvocate', data);
  const advocateDetails = data?.data;
  if (isLoading || loadingSlot || !data)  {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle error state
  if (error || slotError) {
    console.log(error);
    handleError(error);
    // return <Text>An error occurred: {error?.message}</Text>;
  }

  const renderServiceTypeButtons = () => {
    const serviceTypes = Array.from(
      new Set(times.flatMap(slot => slot.serviceType)), // Get unique service types
    );

    // Only render the buttons if serviceTypes has items
    return serviceTypes.length > 0 ? (
      <View>
        <Text style={styles.sectionTitle}>Choose Your Appointment Method</Text>

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
    ) : null;
  };

  // Helper functions to determine icon based on service type
  const getInactiveIcon = type => {
    switch (type) {
      case 'Audio':
        return require('../../../../assets/images/icons/callIcon.png');
      case 'Video':
        return require('../../../../assets/images/icons/videoCall.png');
      case 'Visit':
        return require('../../../../assets/images/icons/groupIcon.png');
      default:
        return null;
    }
  };

  const getActiveIcon = type => {
    switch (type) {
      case 'Audio':
        return require('../../../../assets/images/icons/call-calling.png');
      case 'Video':
        return require('../../../../assets/images/icons/video.png');
      case 'Visit':
        return require('../../../../assets/images/icons/groupIcon.png');
      default:
        return null;
    }
  };


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
    setShowPicker(false);

    if (selectedDate) {
      setValue(selectedDate);

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

  function getLastJobTitle(experiences) {
    // Check if experiences exist and are not empty
    if (experiences && experiences?.length > 0) {
      // Get the last experience in the array
      const lastExperience = experiences[experiences?.length - 1];

      // Return the jobTitle
      return lastExperience.jobTitle;
    } else {
      return 'No experiences found.'; // Return a fallback value if no experiences are present
    }
  }
  const handleSubmit = async () => {
    // Check if the user has selected a time and provided a description
    if (!selectedTime) {
      showMessage({
        message: 'Error',
        description: 'Please select a time for your appointment.',
        type: 'danger',
        titleStyle: {fontFamily: 'Poppins SemiBold'},
        textStyle: {fontFamily: 'Poppins'},
      });
      return; // Exit the function early if time is not selected
    }

    if (!description) {
      showMessage({
        message: 'Error',
        description: 'Please describe your issue.',
        type: 'danger',
        titleStyle: {fontFamily: 'Poppins SemiBold'},
        textStyle: {fontFamily: 'Poppins'},
      });
      return; // Exit the function early if description is empty
    }

    // Proceed with booking if both fields are valid
    console.log('Selected Time ID:', selectedTime); // Logs selected time ID
    setLoading(true);
    try {
      const response = await bookingSlotStudent({
        sloteId: selectedTime._id,
        client_legal_issue: description,
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
        navigation.navigate('StudentNavigator');
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
    <View style={styles.container}>
      {/* Header Section */}
      <CustomHeader
        title={'Book Your Consultation'}
        icon={require('../../../../assets/images/backImage.png')}
      />
      <ScrollView
        showsVerticalScrollIndicator={false} // Disable horizontal scroll indicator
        bounces={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={
              advocateDetails?.profilePic?.url
                ? {uri: advocateDetails.profilePic.url}
                : require('../../../../assets/images/avatar.png')
            }
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{advocateDetails?.name}</Text>
            <Text style={styles.profileTitle}>
              {getLastJobTitle(advocateDetails?.experiences)}
            </Text>
            {/* <View style={styles.rating}> */}
            <View style={styles.starRating}>
              <View style={styles.starsContainer}>
                <StarRating
                  rating={advocateDetails?.averageRating || 0}
                  starSize={16}
                />
              </View>
              <Text style={styles.ratingText}>
                {advocateDetails?.averageRating || 0}/5
              </Text>
            </View>

            {/* </View> */}
          </View>
        </View>

        {renderServiceTypeButtons()}

        {/* Date Selection */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: hp('1%'),
          }}>
          <Text style={styles.sectionTitle}>
            Select a Date {`(${formattedDate})`}
          </Text>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            // style={styles.iconContainer}
          >
            <Image
              source={require('../../../../assets/images/schedule/calendarIcon.png')} // Your calendar icon
              style={styles.calendarIcon} // Adjust the size and spacing
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
          <Text style={styles.monthTitle}>{month.format('MMMM YYYY')}</Text>
          <TouchableOpacity onPress={() => handleMonthChange(1)}>
            <Image
              source={require('../../../../assets/images/schedule/chevron-right.png')}
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
                  // const isActive =
                  //   value.toDateString() === item.date.toDateString();
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
            minimumDate={today}
          />
        )}

        {/* Time Selection */}

        <Text style={[styles.sectionTitle, {marginTop: hp('2%')}]}>
          Select a Time
        </Text>
        {times?.length === 0 ? (
          <Text style={styles.noCreatedSlotMessage}>No available slot</Text> // If no data is available
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

        <Text style={[styles.sectionTitle, {marginTop: 10}]}>
          Describe Your Legal Issue for Expert Assistance
        </Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription} // Updates the state with the new value
          placeholder="Describe your issue here..."
          multiline
          numberOfLines={4} // Set the number of visible lines
          textAlignVertical="top"
        />

        <CustomButton
          title="Book your Consultation"
          onPress={handleSubmit}
          loading={loading}
        />
      </ScrollView>
    </View>
  );
};

export default AdvocateBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingHorizontal: wp('5%'),
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1.5%'),
  },
  profileImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
  },
  profileInfo: {
    marginHorizontal: wp('5%'),
  },
  profileName: {
    fontSize: wp('4.5%'),
    marginBottom: 0,
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
    lineHeight: 20,
    paddingTop: hp('1%'),
  },
  profileTitle: {
    fontSize: wp('3.5%'),
    marginBottom: 0,
    color: '#75797E',
    fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: wp('5%'),
  },
  ratingText: {
    marginLeft: wp('1%'),
    fontFamily: 'Poppins',
    fontSize: wp('3.2%'),
    // marginTop:10,
    color: '#fff',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.2%'),
    borderRadius: wp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1262D2',
  },
  starRating: {
    flexDirection: 'row',
    marginVertical: hp('0.5%'),
    // marginHorizontal: 5,
    alignItems: 'center',
  },
  stars: {
    color: '#FFA800',
    fontSize: wp('5%'),
    lineHeight: wp('5%'),
  },
  sectionTitle: {
    fontSize: wp('4%'),
    color: '#000',
    fontFamily: 'Poppins SemiBold',
    // marginTop: 10,
  },
  appointmentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: hp('1.5%'),
  },
  methodButton: {
    width: wp('25%'),
    height: hp('6%'),
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F3F7FF',
    backgroundColor: '#1262D2',
    borderWidth: 1,
    borderColor: '#1262D2',
    borderRadius: wp('2.5%'),
  },
  selectedMethod: {
    backgroundColor: '#1262D2',
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
    width: wp('90%'),
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
    padding: hp('1%'),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp('2%'),
    margin: hp('0.5%'),
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
  input: {
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    padding: hp('2%'),
    marginVertical: hp('2%'),
    borderWidth: 1,
    borderColor: '#ddd',
    fontFamily: 'Poppins',
  },

  iconContainer: {
    paddingHorizontal: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarIcon: {
    width: wp('6%'),
    height: wp('6%'),
    marginHorizontal: wp('2%'),
  },
  noCreatedSlotMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888', // Or any color of your choice
    marginVertical: 8,
    fontFamily: 'Poppins',
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
  disabledTime: {
    backgroundColor: '#ddd', // Grey background for disabled state
    opacity: 0.5, // Reduced opacity for disabled state
  },
  disabledTimeText: {
    color: '#999', // Text color for disabled state
  },
});
