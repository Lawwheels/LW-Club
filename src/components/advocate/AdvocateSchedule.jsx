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
  RefreshControl,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import CustomHeader from '../../../shared/CustomHeader';
import {useGetAdvocateSlotsQuery} from '../../redux/api/api';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

export default function AdvocateSchedule() {
  const navigation = useNavigation();
  const swiper = useRef();
  const today = new Date(); // Today's date
  const [value, setValue] = useState(today); // Default to today's date
  const [month, setMonth] = useState(moment(today).startOf('month')); // Start of the current month using moment
  const [week, setWeek] = useState(
    moment(today).diff(moment(today).startOf('month'), 'weeks'),
  ); // Current week in the month
  const [refresh, setRefresh] = useState(false);
  const [vacantCount, setVacantCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [showPicker, setShowPicker] = useState(false); // State to manage date picker visibility

  const formattedDate = moment(value).format('YYYY-MM-DD');

  // Define filters with the selected date as the default
  const filters = {
    date: formattedDate,
  };

  const {
    data: slotsData,
    error,
    isLoading,
    refetch,
  } = useGetAdvocateSlotsQuery(filters);

  // Fetch data whenever the date changes
  useEffect(() => {
    refetch();
  }, [formattedDate, refetch]);
  // console.log('slotData', slotsData);

  useEffect(() => {
    if (slotsData?.data) {
      // Calculate the total count of "Vacant" slots across all items
      const totalVacant = slotsData.data.reduce((count, item) => {
        return (
          count + item.slotes.filter(slot => slot.status === 'Vacant').length
        );
      }, 0);
      // Calculate the total count of "Upcoming" slots
      const totalUpcoming = slotsData.data.reduce((count, item) => {
        return (
          count + item.slotes.filter(slot => slot.status === 'Upcoming').length
        );
      }, 0);

      // Update the state with the total count
      setVacantCount(totalVacant);
      setUpcomingCount(totalUpcoming);
    }
  }, [slotsData]);
  // console.log(vacantCount);

  const completed = 2;
  const missed = 2;

  const total = completed + missed + upcomingCount + vacantCount;

  // Calculate fill percentage for each segment
  const completedFill = (completed / total) * 100;
  const missedFill = (missed / total) * 100;
  const upcomingFill = (upcomingCount / total) * 100;
  const vacantFill = (vacantCount / total) * 100;

  // Cumulative rotation values for each segment
  const completedRotation = 0;
  const upcomingRotation = completedFill * 3.6; // Start after completed
  const missedRotation = (completedFill + upcomingFill) * 3.6; // Start after completed + upcoming
  const vacantRotation = (completedFill + upcomingFill + missedFill) * 3.6; // Start after all previous segments

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

  const pullMe = async () => {
    try {
      setRefresh(true);
      await Promise.all([
        refetch(), // Refetch advocate data
      ]);
    } catch (error) {
      console.error('Error during refetch:', error); // Handle errors if needed
    } finally {
      setRefresh(false); // Hide the refresh indicator after both data are fetched
    }
  };

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <CustomHeader
            title={'Schedule'}
            icon={require('../../../assets/images/back.png')}
          />
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={pullMe} />
            }>
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

            <View style={[styles.picker, {marginBottom: 10}]}>
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

            <View style={styles.progressContainer}>
              <View style={styles.progressSubContainer}>
                {/* Completed Segment */}
                <AnimatedCircularProgress
                  size={100}
                  width={10}
                  fill={completedFill}
                  tintColor="#FFA800"
                  backgroundColor="transparent"
                  lineCap="round"
                  rotation={completedRotation}
                  style={StyleSheet.absoluteFill}
                />

                {/* Upcoming Segment */}
                <AnimatedCircularProgress
                  size={100}
                  width={10}
                  fill={upcomingFill}
                  tintColor="#1262D2"
                  backgroundColor="transparent"
                  lineCap="round"
                  rotation={upcomingRotation}
                  style={StyleSheet.absoluteFill}
                />

                {/* Missed Segment */}
                <AnimatedCircularProgress
                  size={100}
                  width={10}
                  fill={missedFill}
                  tintColor="#FF0043"
                  backgroundColor="transparent"
                  lineCap="round"
                  rotation={missedRotation}
                  style={StyleSheet.absoluteFill}
                />

                {/* Vacant Segment */}
                <AnimatedCircularProgress
                  size={100}
                  width={10}
                  fill={vacantFill}
                  // tintColor="#289902"
                  tintColor="#A9F490"
                  backgroundColor="transparent"
                  lineCap="round"
                  rotation={vacantRotation}
                  style={StyleSheet.absoluteFill}>
                  {() => (
                    <View style={styles.innerCircle}>
                      <Text style={styles.totalText}>Total</Text>
                      <Text style={styles.totalValue}>{total}</Text>
                    </View>
                  )}
                </AnimatedCircularProgress>
              </View>
              <View style={styles.cardContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: hp(1),
                    // width: wp('50%'),
                  }}>
                  <View style={[styles.card, {backgroundColor: '#FFECBE'}]}>
                    <Text style={styles.cardTitle}>Completed</Text>
                    <Text style={[styles.cardValue, {color: '#000'}]}>
                      {completed}
                    </Text>
                  </View>
                  <View style={[styles.card, {backgroundColor: '#A9F490'}]}>
                    <Text style={styles.cardTitle}>Vacant</Text>
                    <Text style={styles.cardValue}>{vacantCount}</Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // width: wp('50%'),
                  }}>
                  <View style={[styles.card, {backgroundColor: '#FFE1E9'}]}>
                    <Text style={styles.cardTitle}>Missed</Text>
                    <Text style={[styles.cardValue, {color: '#000'}]}>
                      {missed}
                    </Text>
                  </View>

                  <View style={[styles.card, {backgroundColor: '#DFE4FF'}]}>
                    <Text style={styles.cardTitle}>Upcoming</Text>
                    <Text style={[styles.cardValue, {color: '#000'}]}>
                      {upcomingCount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{paddingVertical: hp('0.5%')}}>
              <View style={styles.recentConsultationContainer}>
                <Text style={styles.recentConsultationTitle}>Upcoming</Text>

                {slotsData?.data?.length === 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }}>
                    <Image
                      source={require('../../../assets/images/NoResult.png')}
                      style={{width: 150, height: 150}}
                    />
                    <Text style={styles.noCreatedSlotMessage}>
                      No upcoming slot
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    horizontal
                    data={slotsData?.data}
                    keyExtractor={(item, index) => index + 1}
                    renderItem={({item}) => (
                      <>
                        {item?.slotes?.filter(
                          slot => slot.status === 'Upcoming',
                        )?.length === 0 ? (
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: wp('100%'),
                            }}>
                            <Image
                              source={require('../../../assets/images/NoResult.png')}
                              style={{width: 150, height: 150}}
                            />
                            <Text style={styles.noCreatedSlotMessage}>
                              No upcoming slot
                            </Text>
                          </View>
                        ) : (
                          item.slotes
                            .filter(slot => slot.status === 'Upcoming')
                            .map(slot => (
                              <TouchableWithoutFeedback
                                onPress={() =>
                                  navigation.navigate('ConsultationDetails', {
                                    id: slot._id,
                                  })
                                }>
                                <ImageBackground
                                  key={slot._id}
                                  source={require('../../../assets/images/consultation.png')}
                                  style={styles.consultationCard}
                                  imageStyle={styles.cardBorder}>
                                  <View style={styles.consultationHeader}>
                                    <Text
                                      style={[
                                        styles.consultantName,
                                        {color: '#1262D2'},
                                      ]}>
                                      {slot.client.name}
                                    </Text>

                                    <View
                                      style={[
                                        styles.callContainer,
                                        {borderColor: '#1262D2'},
                                      ]}>
                                      <Image
                                        source={require('../../../assets/images/schedule/upcomingIcon.png')}
                                        style={styles.callIcon}
                                        resizeMode="contain"
                                      />
                                    </View>
                                  </View>
                                  <View style={{flexDirection: 'row'}}>
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
                                      {new Date(item.date).toLocaleDateString(
                                        'en-GB',
                                        {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric',
                                        },
                                      )}
                                    </Text>
                                  </View>
                                  <View style={{flexDirection: 'row'}}>
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
                                      {Array.isArray(slot.serviceType)
                                        ? slot.serviceType.join(', ')
                                        : slot.serviceType}
                                    </Text>
                                  </View>

                                  {/* <Text style={styles.consultationDescription}>
                                  {slot.description ||
                                    'No description available'}
                                </Text> */}
                                </ImageBackground>
                              </TouchableWithoutFeedback>
                            ))
                        )}
                      </>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                )}
              </View>
            </View>

            <View style={{paddingVertical: hp('0.5%')}}>
              <View style={styles.recentConsultationContainer}>
                <Text style={styles.recentConsultationTitle}>Vacant</Text>
                {slotsData?.data?.length === 0 ? (
                  <Text style={styles.noCreatedSlotMessage}>
                    No created slot
                  </Text>
                ) : (
                  <FlatList
                    horizontal
                    data={slotsData?.data}
                    keyExtractor={(item, index) => index + 1}
                    renderItem={({item}) => {
                      return (
                        <>
                          {item?.slotes?.filter(slot => slot.status === 'Vacant')
                            ?.length === 0 ? (
                            <View
                              style={{
                                backgroundColor: '#F3F7FF',
                                borderWidth: 1,
                                borderColor: '#1262D2',
                                width: wp('90%'),
                                height: 200,
                              }}>
                              <Text style={styles.noCreatedSlotMessage}>
                                No created slot
                              </Text>
                            </View>
                          ) : (
                            item.slotes
                              .filter(slot => slot.status === 'Vacant') // Filter for vacant slots only
                              .map((slot, index) => {
                                return (
                                  <View key={index + 1}>
                                    <ImageBackground
                                      key={slot._id} // Use unique _id for each slot
                                      source={require('../../../assets/images/CompleteCard.png')}
                                      style={styles.consultationCard}
                                      imageStyle={styles.cardBorder}>
                                      <View style={styles.consultationHeader}>
                                        <Text
                                          style={[
                                            styles.consultantName,
                                            {color: '#289902'},
                                          ]}
                                        />

                                        <View
                                          style={[
                                            styles.callContainer,
                                            {borderColor: '#289902'},
                                          ]}>
                                          <Image
                                            source={require('../../../assets/images/completeCall.png')}
                                            style={styles.callIcon}
                                            resizeMode="contain"
                                          />
                                        </View>
                                      </View>
                                      <View style={{flexDirection: 'row'}}>
                                        <Image
                                          source={require('../../../assets/images/icons/note.png')}
                                          style={styles.consultIcon}
                                          resizeMode="contain"
                                        />
                                        <Text
                                          style={[
                                            styles.consultationDate,
                                            {color: '#289902'},
                                          ]}>
                                          {new Date(
                                            item.date,
                                          ).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                          })}
                                        </Text>
                                      </View>
                                      <View style={{flexDirection: 'row'}}>
                                        <Image
                                          source={require('../../../assets/images/icons/time.png')}
                                          style={styles.consultIcon}
                                          resizeMode="contain"
                                        />
                                        <Text
                                          style={[
                                            styles.consultationDate,
                                            {color: '#289902'},
                                          ]}>
                                          {Array.isArray(slot.serviceType)
                                            ? slot.serviceType.join(', ')
                                            : slot.serviceType}
                                        </Text>
                                      </View>

                                      {/* <Text style={styles.consultationDescription}>
                                  {slot.description ||
                                    'No description available'}
                                </Text> */}
                                    </ImageBackground>
                                  </View>
                                );
                              })
                          )}
                        </>
                      );
                    }}
                    showsHorizontalScrollIndicator={false}
                  />
                )}
              </View>
            </View>
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
    paddingTop: hp('4.5%'),
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
    // backgroundColor:'red'
  },
  item: {
    flex: 1,
    height: hp('7%'),
    marginHorizontal: wp('0.5%'),
    paddingVertical: hp('0.5%'),
    paddingHorizontal: 4,
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
    // backgroundColor: 'yellow',
  },
  itemWeekday: {
    fontSize: wp('3%'),
    fontWeight: '500',
    color: '#737373',
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: wp('3%'),
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    color: '#111',
  },
  recentConsultationContainer: {
    marginHorizontal: wp('5%'),
    marginVertical: hp('1.5%'),
  },
  recentConsultationTitle: {
    fontSize: wp('3.6%'),
    fontFamily: 'Poppins SemiBold',
    // fontWeight: '600',
    color: '#294776',
    marginBottom: hp('1%'),
  },
  consultationCard: {
    width: wp('70%'),
    height: hp('15%'),
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
  progressContainer: {
    flexDirection: 'row',
    marginHorizontal: wp('5%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.8%'),
    backgroundColor: '#F6F9FF',
    borderWidth: 1,
    borderColor: 'rgba(18, 98, 210, 0.40)',
    borderRadius: wp('1.5%'),
  },
  progressSubContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('1.5%'),
    width: wp('28%'),
    height: hp('13%'),
    // backgroundColor:'yellow'
  },
  innerCircle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalText: {
    fontSize: wp('3.5%'),
    color: '#000',
    fontFamily: 'Poppins',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: wp('5%'),
    // fontWeight: 'bold',
    fontFamily: 'Poppins SemiBold',
    color: '#FFA800',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp('2.5%'),
    width: wp('25%'),
    // maxHeight:hp(5),
  },
  linearGradient: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: wp('1.5%'),
    marginRight: wp('1.5%'),
  },
  cardTitle: {
    fontSize: wp('3.1%'),
    fontWeight: '600',
    fontFamily: 'Poppins',
    color: '#000',
  },
  cardValue: {
    fontSize: wp('3.1%'),
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  noCreatedSlotMessage: {
    textAlign: 'center',
    fontSize: hp('2.5%'),
    color: '#888', // Or any color of your choice
    marginBottom: 10,
    fontFamily: 'Poppins',
  },
  cardBorder: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
  },
});
