import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomHeader from '../../../shared/CustomHeader';
import {useGetUserSlotQuery} from '../../redux/api/api';

const {width} = Dimensions.get('window');

export default function UserSchedule() {
  const swiper = useRef();
  const today = new Date(); // Today's date
  const [value, setValue] = useState(today); // Default to today's date
  const [month, setMonth] = useState(moment(today).startOf('month')); // Start of the current month using moment
  const [week, setWeek] = useState(
    moment(today).diff(moment(today).startOf('month'), 'weeks'),
  ); // Current week in the month
  const [showPicker, setShowPicker] = useState(false); // State to manage date picker visibility

  const formattedDate = value
    ? new Date(value).toLocaleDateString('en-CA')
    : null;

  // Set up the query without conditions affecting the hook call
  const {
    data: slotsData,
    error,
    isLoading,
    refetch,
  } = useGetUserSlotQuery(formattedDate, {
    skip: !formattedDate,
  });

  const consultation = slotsData?.data || [];

  const formattedSlots = consultation.map(item => ({
    // date: new Date(item.date).toLocaleDateString(), // Format the date
    date: new Date(item.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    slots: item.slotes || [],
  }));
  // Flatten the data so each slot is an individual item with a date
  const slotData = formattedSlots.flatMap(item =>
    item.slots.map(slot => ({...slot, date: item.date})),
  );

  if (isLoading && slotsData?.data) {
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

  return (
    <>
     <StatusBar
        barStyle="light-content" // Options: 'default', 'light-content', 'dark-content'
        backgroundColor="#1262D2" // Background color for Android
      />
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <CustomHeader
            title={'Schedule'}
            icon={require('../../../assets/images/back.png')}
          />
          <ScrollView>
            {/* Month Navigation Section */}
            <View style={styles.monthHeader}>
              <TouchableOpacity onPress={() => handleMonthChange(-1)}>
                <Image
                  source={require('../../../assets/images/schedule/chevron-left.png')}
                  style={{width: 24, height: 20}}
                />
              </TouchableOpacity>
              <Text style={styles.monthTitle}>{month.format('MMMM YYYY')}</Text>
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

              {/* Calendar Icon */}
              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                style={{
                  marginRight: 20,
                  height: hp('7%'),
                  marginHorizontal: wp('1%'),
                  paddingVertical: hp('1%'),
                  paddingHorizontal: 4,
                  borderWidth: 1,
                  borderRadius: wp('1%'),
                  borderColor: '#e3e3e3',
                  // backgroundColor:'pink',
                  marginBottom: 5,
                }}>
                <Image
                  source={require('../../../assets/images/schedule/calendarIcon.png')} // Your calendar icon
                  style={{width: 24, height: 24, marginHorizontal: 5}} // Adjust the size and spacing
                />
              </TouchableOpacity>
            </View>

            <View style={{marginVertical: wp('2.5%')}}>
              <View style={styles.recentConsultationContainer}>
                <Text style={styles.recentConsultationTitle}>Upcoming</Text>
                <FlatList
                  horizontal
                  data={slotData}
                  keyExtractor={item => item._id}
                  renderItem={({item}) => {
                    return (
                      <ImageBackground
                        source={require('../../../assets/images/consultation.png')}
                        style={styles.consultationCard}
                        imageStyle={styles.cardBorder}>
                        <View style={styles.consultationHeader}>
                          <Text
                            style={[styles.consultantName, {color: '#294776'}]}>
                            {item.advocate.name}
                          </Text>
                          <View
                            style={[
                              styles.callContainer,
                              {borderColor: '#294776'},
                            ]}>
                            <Image
                              source={require('../../../assets/images/schedule/upcomingIcon.png')}
                              style={styles.callIcon}
                              resizeMode="contain"
                            />
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10,
                          }}>
                          <Image
                            source={require('../../../assets/images/icons/note.png')}
                            style={styles.consultIcon}
                            resizeMode="contain"
                          />
                          <Text
                            style={[
                              styles.consultationDate,
                              {color: '#1262D2'},
                            ]}>
                            {item.date}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 5,
                          }}>
                          <Image
                            source={require('../../../assets/images/icons/time.png')}
                            style={styles.consultIcon}
                            resizeMode="contain"
                          />
                          <Text
                            style={[
                              styles.consultationDate,
                              {color: '#1262D2'},
                            ]}>
                            {item.time}
                          </Text>
                        </View>

                        {/* Display Status */}
                        <Text style={styles.consultationDescription}>
                          {item.client_legal_issue}
                        </Text>
                      </ImageBackground>
                    );
                  }}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>

            {/* <View style={{marginVertical: hp('1%')}}>
              <View style={styles.recentConsultationContainer}>
                <Text style={styles.recentConsultationTitle}>Completed</Text>
                <FlatList
                  horizontal
                  data={consultations}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => (
                    <ImageBackground
                      // source={item.image}
                      source={require('../../../assets/images/CompleteCard.png')}
                      style={styles.consultationCard}
                      imageStyle={{borderRadius: 16}}>
                      <View style={styles.consultationHeader}>
                        <Text
                          style={[styles.consultantName, {color: '#289902'}]}>
                          {item.name}
                        </Text>
                        <View
                          style={[
                            styles.callContainer,
                            {borderColor: '#289902'},
                          ]}>
                          <Image
                            source={require('../../../assets/images/completeCall.png')} // Replace with your image path
                            style={styles.callIcon}
                            resizeMode="contain" // Adjust as per your requirement (e.g. cover, stretch)
                          />
                        </View>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          source={require('../../../assets/images/icons/note.png')} // Replace with the actual path of your calendar icon
                          style={styles.consultIcon}
                          resizeMode="contain" // Adjust as needed
                        />
                        <Text
                          style={[styles.consultationDate, {color: '#289902'}]}>
                          28th Dec, 2024
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          source={require('../../../assets/images/icons/time.png')} // Replace with the actual path of your calendar icon
                          style={styles.consultIcon}
                          resizeMode="contain" // Adjust as needed
                        />
                        <Text
                          style={[styles.consultationDate, {color: '#289902'}]}>
                          10:00 AM
                        </Text>
                      </View>
                      <Text style={styles.consultationDescription}>
                        {item.description}
                      </Text>
                    </ImageBackground>
                  )}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>

            <View style={{marginVertical: hp('1%')}}>
              <View style={styles.recentConsultationContainer}>
                <Text style={styles.recentConsultationTitle}>Missed</Text>
                <FlatList
                  horizontal
                  data={consultations}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => (
                    <ImageBackground
                    
                      source={require('../../../assets/images/schedule/missedCard.png')}
                      style={styles.consultationCard}
                      imageStyle={{borderRadius: 16}}>
                      <View style={styles.consultationHeader}>
                        <Text style={[styles.consultantName, {color: 'red'}]}>
                          {item.name}
                        </Text>
                       
                        <View
                          style={[styles.callContainer, {borderColor: 'red'}]}>
                          <Image
                            source={require('../../../assets/images/schedule/missedIcon.png')} // Replace with your image path
                            style={styles.callIcon}
                            resizeMode="contain" // Adjust as per your requirement (e.g. cover, stretch)
                          />
                        </View>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          source={require('../../../assets/images/icons/note.png')} // Replace with the actual path of your calendar icon
                          style={styles.consultIcon}
                          resizeMode="contain" // Adjust as needed
                        />
                        <Text style={[styles.consultationDate, {color: 'red'}]}>
                          28th Dec, 2024
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          source={require('../../../assets/images/icons/time.png')} // Replace with the actual path of your calendar icon
                          style={styles.consultIcon}
                          resizeMode="contain" // Adjust as needed
                        />
                        <Text style={[styles.consultationDate, {color: 'red'}]}>
                          10:00 AM
                        </Text>
                      </View>
                      <Text style={styles.consultationDescription}>
                        {item.description}
                      </Text>
                    </ImageBackground>
                  )}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View> */}
          </ScrollView>
        </View>

        {/* Modal for DateTimePicker */}
        {showPicker && (
          <DateTimePickerModal
            isVisible={showPicker}
            mode="date"
            date={value}
            onConfirm={onDateChange}
            onCancel={() => setShowPicker(false)}
            minimumDate={new Date()}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    // paddingTop:hp('0.2%')
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
    flex: 1,
    width: wp('100%'),
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
    maxWidth: wp('100%'),
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    // paddingHorizontal: wp('0.5%'),
    // backgroundColor: 'red',
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
  cardBorder: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
  },
  recentConsultationContainer: {
    marginHorizontal: wp('5%'),
  },
  recentConsultationTitle: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
    marginBottom: hp('1.2%'),
  },
  consultationCard: {
    width: wp('70%'),
    height: hp('18%'),
    marginRight: wp('5%'),
    padding: wp('2.7%'),
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: wp('5%'),
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  callContainer: {
    width: wp('12%'),
    height: hp('3.5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: '#898989',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('1.8%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  consultantName: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
  },
  consultationDate: {
    fontSize: wp('3%'),
    color: '#1262D2',
    fontFamily: 'Poppins',
    fontWeight: '500',
    marginHorizontal: wp('1.2%'),
  },
  consultationDescription: {
    fontSize: wp('2.6%'),
    color: '#5D5959',
    marginTop: hp('2%'),
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  callIcon: {
    width: wp('5%'),
    height: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  consultIcon: {
    width: 14,
    height: 14,
  },
  advocateProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginVertical: 10,
  },
});
