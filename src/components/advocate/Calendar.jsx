// // import React, {useState} from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   FlatList,
// //   StyleSheet,
// //   Image,
// // } from 'react-native';
// // import {
// //   widthPercentageToDP as wp,
// //   heightPercentageToDP as hp,
// // } from 'react-native-responsive-screen';
// // import DateTimePicker from '@react-native-community/datetimepicker';
// // import {AnimatedCircularProgress} from 'react-native-circular-progress';
// // import CustomHeader from '../../../shared/CustomHeader';

// // const Calendar = () => {
// //   const [fromTime, setFromTime] = useState('09:00 AM');
// //   const [toTime, setToTime] = useState('12:00 PM');
// //   const [timeBlocks, setTimeBlocks] = useState([]);
// //   const [startTime, setStartTime] = useState(null);
// //   const [endTime, setEndTime] = useState(null);
// //   const [availableTime, setAvailableTime] = useState(0); // For circular progress
// //   const [showStartTimePicker, setShowStartTimePicker] = useState(false);
// //   const [showEndTimePicker, setShowEndTimePicker] = useState(false);

// //   const addTimeBlock = () => {
// //     setTimeBlocks([...timeBlocks, {from: fromTime, to: toTime}]);
// //     calculateAvailableTime();
// //   };

// //   const handleStartTimeChange = (event, selectedDate) => {
// //     const currentTime = selectedDate || startTime;
// //     setShowStartTimePicker(false);
// //     if (currentTime) {
// //       setStartTime(currentTime);
// //       setFromTime(formatTime(currentTime));
// //     }
// //   };

// //   const handleEndTimeChange = (event, selectedDate) => {
// //     const currentTime = selectedDate || endTime;
// //     setShowEndTimePicker(false);
// //     if (currentTime) {
// //       setEndTime(currentTime);
// //       setToTime(formatTime(currentTime));
// //     }
// //   };

// //   const formatTime = time => {
// //     if (!time) return '';
// //     const hours = time.getHours().toString().padStart(2, '0');
// //     const minutes = time.getMinutes().toString().padStart(2, '0');
// //     return `${hours}:${minutes}`;
// //   };

// //   const calculateAvailableTime = () => {
// //     if (startTime && endTime) {
// //       const diffInMs = endTime - startTime;
// //       const diffInHours = Math.max(diffInMs / (1000 * 60 * 60), 0);
// //       setAvailableTime(diffInHours);
// //     }
// //   };
// //   const calculateRotation = (time) => {
// //     const hours = time.getHours() % 12;
// //     const minutes = time.getMinutes();
// //     return (hours * 30) + (minutes * 0.5) - 90; // Subtract 90 to start at the top
// //   };

// //   return (
// //     <>
// //       <CustomHeader
// //         title={'Set your availability'}
// //         icon={require('../../../assets/images/back.png')}
// //       />
// //       <View style={styles.container}>
// //         <Text style={styles.subHeader}>
// //           Set your availability for <Text style={styles.highlight}>Monday</Text>{' '}
// //           to{'\n'} receive service request
// //         </Text>

// //         {/* Circular Time Indicator */}
// //         <View style={{padding: 20}}>
// //           <View style={styles.circleContainer}>
// //             {/* <AnimatedCircularProgress
// //               size={150}
// //               width={15}
// //               fill={(availableTime / 12) * 100} // Assumes 12 hours max
// //               tintColor="#0067F5"
// //               backgroundColor="#EFF2FB"
// //             >
// //               {() => (
// //                 <>
// //                   <Text style={styles.circleText}>{availableTime} hr</Text>
// //                   <Text style={styles.circleSubText}>Available time</Text>
// //                 </>
// //               )}
// //             </AnimatedCircularProgress> */}
// //                <AnimatedCircularProgress
// //           size={200}
// //           width={20}
// //           fill={(availableTime / 12) * 100}
// //           tintColor="#0067F5"
// //           backgroundColor="#EFF2FB"
// //           rotation={-90}
// //         >
// //           {() => (
// //             <>
// //               <Text style={styles.circleText}>
// //                 {availableTime ? `${availableTime} hr` : '0 hr'}
// //               </Text>
// //               <Text style={styles.circleSubText}>
// //                 {startTime && endTime
// //                   ? `${formatTime(startTime)} - ${formatTime(endTime)}`
// //                   : 'Available time'}
// //               </Text>
// //             </>
// //           )}
// //         </AnimatedCircularProgress>

// //         {/* Clock numbers */}
// //         <Text style={[styles.clockText, { transform: [{ rotate: `${0}deg` }] }]}>12</Text>
// //         <Text style={[styles.clockText, { transform: [{ rotate: `${90}deg` }] }]}>3</Text>
// //         <Text style={[styles.clockText, { transform: [{ rotate: `${180}deg` }] }]}>6</Text>
// //         <Text style={[styles.clockText, { transform: [{ rotate: `${270}deg` }] }]}>9</Text>

// //         {/* Start and End Time Markers */}
// //         {startTime && (
// //           <Image
// //             source={require('../../../assets/images/icons/clock-plus.png')}
// //             style={[
// //               styles.cornerIcon,
// //               { transform: [{ rotate: `${calculateRotation(startTime)}deg` }] },
// //             ]}
// //           />
// //         )}
// //         {endTime && (
// //           <Image
// //             source={require('../../../assets/images/clock-check.png')}
// //             style={[
// //               styles.cornerIcon,
// //               { transform: [{ rotate: `${calculateRotation(endTime)}deg` }] },
// //             ]}
// //           />
// //         )}

// //         {/* Gray lines for minor ticks */}
// //         {Array.from({ length: 12 }).map((_, index) => (
// //           <View
// //             key={index}
// //             style={[
// //               styles.grayTick,
// //               { transform: [{ rotate: `${index * 30}deg` }] },
// //             ]}
// //           />
// //         ))}
// //       </View>

// //           {/* Time Picker */}
// //           <View style={styles.timePicker}>
// //             <View style={{marginTop: 10}}>
// //               <Text style={{fontFamily: 'Poppins', fontSize: 14}}>
// //                 Start Time
// //               </Text>
// //               <TouchableOpacity
// //                 style={styles.timePickerButton}
// //                 onPress={() => setShowStartTimePicker(true)}>
// //                 <Text style={styles.timePickerText}>
// //                   {startTime ? formatTime(startTime) : 'Select Start Time'}
// //                 </Text>
// //               </TouchableOpacity>
// //               {showStartTimePicker && (
// //                 <DateTimePicker
// //                   value={startTime || new Date()}
// //                   mode="time"
// //                   display="default"
// //                   onChange={handleStartTimeChange}
// //                 />
// //               )}
// //             </View>
// //             <View style={{marginTop: 10}}>
// //               <Text style={{fontFamily: 'Poppins', fontSize: 14}}>
// //                 End Time
// //               </Text>
// //               <TouchableOpacity
// //                 style={styles.timePickerButton}
// //                 onPress={() => setShowEndTimePicker(true)}>
// //                 <Text style={styles.timePickerText}>
// //                   {endTime ? formatTime(endTime) : 'Select End Time'}
// //                 </Text>
// //               </TouchableOpacity>
// //               {showEndTimePicker && (
// //                 <DateTimePicker
// //                   value={endTime || new Date()}
// //                   mode="time"
// //                   display="default"
// //                   onChange={handleEndTimeChange}
// //                 />
// //               )}
// //             </View>
// //             <TouchableOpacity style={styles.addButton} onPress={addTimeBlock}>
// //               <Text style={styles.addButtonText}>Add</Text>
// //             </TouchableOpacity>
// //           </View>

// //           {/* List of Added Time Blocks */}
// //           <FlatList
// //             data={timeBlocks}
// //             keyExtractor={(item, index) => index.toString()}
// //             renderItem={({item}) => (
// //               <View style={styles.timeBlock}>
// //                 <Text style={styles.timeBlockText}>
// //                   From {item.from} To {item.to}
// //                 </Text>
// //                 <Text style={styles.availableText}>
// //                   Available for {availableTime} hrs
// //                 </Text>
// //               </View>
// //             )}
// //           />

// //           {/* Buttons */}
// //           <View style={styles.bottomButtons}>
// //             <TouchableOpacity style={styles.dayOffButton}>
// //               <Text style={styles.dayOffButtonText}>Set Day Off</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity style={styles.saveButton}>
// //               <Text style={styles.saveButtonText}>Save Availability</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </View>
// //     </>
// //   );
// // };

// // new code

// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Image,
// } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import LinearGradient from 'react-native-linear-gradient';
// import Svg, {Text as SvgText} from 'react-native-svg';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import {Swipeable} from 'react-native-gesture-handler';
// import {AnimatedCircularProgress} from 'react-native-circular-progress';
// import CustomHeader from '../../../shared/CustomHeader';

// const Calendar = () => {
//   const [fromTime, setFromTime] = useState('09:00 AM');
//   const [toTime, setToTime] = useState('12:00 PM');
//   const [timeBlocks, setTimeBlocks] = useState([]);
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);
//   const [availableTime, setAvailableTime] = useState(0);
//   const [showStartTimePicker, setShowStartTimePicker] = useState(false);
//   const [showEndTimePicker, setShowEndTimePicker] = useState(false);
//   const [showDayOffMessage, setShowDayOffMessage] = useState(false);

//   const addTimeBlock = () => {
//     setTimeBlocks([...timeBlocks, {from: fromTime, to: toTime}]);
//     calculateAvailableTime();
//   };

//   const handleStartTimeChange = (event, selectedDate) => {
//     const currentTime = selectedDate || startTime;
//     setShowStartTimePicker(false);
//     if (currentTime) {
//       setStartTime(currentTime);
//       setFromTime(formatTime(currentTime));
//     }
//   };

//   const handleEndTimeChange = (event, selectedDate) => {
//     const currentTime = selectedDate || endTime;
//     setShowEndTimePicker(false);
//     if (currentTime) {
//       setEndTime(currentTime);
//       setToTime(formatTime(currentTime));
//     }
//   };

//   const formatTime = time => {
//     if (!time) return '';
//     const hours = time.getHours().toString().padStart(2, '0');
//     const minutes = time.getMinutes().toString().padStart(2, '0');
//     return `${hours}:${minutes}`;
//   };

//   const calculateAvailableTime = () => {
//     if (startTime && endTime) {
//       const diffInMs = endTime - startTime;
//       const diffInHours = Math.max(diffInMs / (1000 * 60 * 60), 0);
//       setAvailableTime(diffInHours);
//     }
//   };

//   const calculateRotation = time => {
//     const hours = time.getHours() % 12;
//     const minutes = time.getMinutes();
//     return hours * 30 + minutes * 0.5 - 90;
//   };

//   const handleWatchClick = () => {
//     const defaultFromTime = new Date();
//     defaultFromTime.setHours(9, 0); // 9:00 AM

//     const defaultToTime = new Date();
//     defaultToTime.setHours(12, 0); // 12:00 PM

//     setStartTime(defaultFromTime);
//     setEndTime(defaultToTime);
//     setFromTime(formatTime(defaultFromTime));
//     setToTime(formatTime(defaultToTime));

//     calculateAvailableTime();
//   };

//   const handleDayOffPress = () => {
//     setShowDayOffMessage(true);
//   };

//   const rightSwipe = () => {
//     return (
//       <View>
//         <Text>Delete</Text>
//       </View>
//     );
//   };
//   return (
//     <>
//       <CustomHeader
//         title={'Set your availability'}
//         icon={require('../../../assets/images/back.png')}
//       />
//       <View style={styles.container}>
//         <Text style={styles.subHeader}>
//           Set your availability for <Text style={styles.highlight}>Monday</Text>{' '}
//           to{'\n'} receive service request
//         </Text>

//         <TouchableOpacity
//           onPress={handleWatchClick}
//           style={styles.circleContainer}>
//           <AnimatedCircularProgress
//             size={200}
//             width={20}
//             fill={(availableTime / 12) * 100}
//             tintColor="#0067F5"
//             backgroundColor="#EFF2FB"
//             rotation={-90}>
//             {() => (
//               <>
//                 <Svg height="200" width="200" viewBox="0 0 200 200">
//                   {/* <Text style={styles.circleText}>
//                     {availableTime ? `${availableTime} hr` : '0 hr'}
//                   </Text> */}
//                   <SvgText
//                     x="100"
//                     y="90"
//                     textAnchor="middle"
//                     fontSize="30"
//                     fill="#FF8C00"
//                     fontWeight="bold">
//                     {availableTime ? `${availableTime} hr` : '0 hr'}
//                   </SvgText>
//                   {/* <Text style={styles.circleSubText}>
//                     {startTime && endTime
//                       ? `${formatTime(startTime)} - ${formatTime(endTime)}`
//                       : 'Available time'}
//                   </Text> */}

//                   <SvgText
//                     x="100"
//                     y="130"
//                     textAnchor="middle"
//                     fontSize="14"
//                     fill="#FF8C00">
//                     {startTime && endTime
//                       ? `${formatTime(startTime)} - ${formatTime(endTime)}`
//                       : 'Available time'}
//                   </SvgText>

//                   <SvgText
//                     x="100"
//                     y="40"
//                     textAnchor="middle"
//                     fontSize="20"
//                     fill="#333">
//                     12
//                   </SvgText>
//                   <SvgText
//                     x="160"
//                     y="105"
//                     textAnchor="middle"
//                     fontSize="20"
//                     fill="#333">
//                     3
//                   </SvgText>
//                   <SvgText
//                     x="100"
//                     y="170"
//                     textAnchor="middle"
//                     fontSize="20"
//                     fill="#333">
//                     6
//                   </SvgText>
//                   <SvgText
//                     x="40"
//                     y="105"
//                     textAnchor="middle"
//                     fontSize="20"
//                     fill="#333">
//                     9
//                   </SvgText>
//                 </Svg>
//               </>
//             )}
//           </AnimatedCircularProgress>

//           {/* Start and End Time Markers */}
//           {/* {startTime && (
//             <Image
//               source={require('../../../assets/images/icons/clock-plus.png')}
//               style={[
//                 styles.cornerIcon,
//                 {transform: [{rotate: `${calculateRotation(startTime)}deg`}]},
//               ]}
//             />
//           )}
//           {endTime && (
//             <Image
//               source={require('../../../assets/images/clock-check.png')}
//               style={[
//                 styles.cornerIcon,
//                 {transform: [{rotate: `${calculateRotation(endTime)}deg`}]},
//               ]}
//             />
//           )} */}
//         </TouchableOpacity>

//         <View style={styles.appointmentMode}>
//           <TouchableOpacity
//             style={[styles.modeButton, {backgroundColor: '#1262D2'}]}>
//             <Image
//               source={require('../../../assets/images/icons/callIcon.png')}
//               style={{width: 24, height: 24}}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.modeButton, {backgroundColor: '#1262D2'}]}>
//             <Image
//               source={require('../../../assets/images/icons/videoCall.png')}
//               style={{width: 24, height: 24}}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.modeButton, {backgroundColor: '#E1E9FC'}]}>
//             <Image
//               source={require('../../../assets/images/icons/groupIcon.png')}
//               style={{width: 24, height: 24}}
//             />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.timePicker}>
//           <View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 borderColor: 'rgba(0, 0, 0, 0.40)',
//                 borderWidth: 1,
//                 borderRadius: 10,
//                 width: wp(32),
//               }}>
//               <Text
//                 style={{
//                   fontFamily: 'Poppins',
//                   fontSize: 14,
//                   padding: 10,
//                   marginVertical: 5,
//                 }}>
//                 From
//               </Text>
//               <TouchableOpacity
//                 style={styles.timePickerButton}
//                 onPress={() => setShowStartTimePicker(true)}>
//                 <Text style={styles.timePickerText}>
//                   {startTime ? formatTime(startTime) : 'Select Time'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//             {showStartTimePicker && (
//               <DateTimePicker
//                 value={startTime || new Date()}
//                 mode="time"
//                 display="default"
//                 onChange={handleStartTimeChange}
//               />
//             )}
//           </View>
//           <View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 borderColor: 'rgba(0, 0, 0, 0.40)',
//                 borderWidth: 1,
//                 borderRadius: 10,
//                 width: wp(32),
//               }}>
//               <Text
//                 style={{
//                   fontFamily: 'Poppins',
//                   fontSize: 14,
//                   padding: 10,
//                   marginVertical: 5,
//                 }}>
//                 To
//               </Text>
//               <TouchableOpacity
//                 style={styles.timePickerButton}
//                 onPress={() => setShowEndTimePicker(true)}>
//                 <Text style={styles.timePickerText}>
//                   {endTime ? formatTime(endTime) : 'Select Time'}
//                 </Text>
//               </TouchableOpacity>
//               {showEndTimePicker && (
//                 <DateTimePicker
//                   value={endTime || new Date()}
//                   mode="time"
//                   display="default"
//                   onChange={handleEndTimeChange}
//                 />
//               )}
//             </View>
//           </View>
//           {/* <TouchableOpacity style={styles.addButton} onPress={addTimeBlock}>
//             <Text style={styles.addButtonText}>Add</Text>
//           </TouchableOpacity> */}
//           <LinearGradient
//             colors={['#1262D2', '#17316D']}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}
//             style={styles.addButtonContainer}>
//             <TouchableOpacity style={styles.addButton} onPress={addTimeBlock}>
//               <Image
//                 source={require('../../../assets/images/icons/plus.png')} // Path to the profile image
//                 style={{width: 14, height: 14}}
//               />
//               <Text style={styles.addButtonText}>Add</Text>
//             </TouchableOpacity>
//           </LinearGradient>
//         </View>
//         <Swipeable renderRightActions={rightSwipe}>
//           <View>
//             <FlatList
//               data={timeBlocks}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({item}) => (
//                 <View
//                   style={{
//                     paddingHorizontal: 20,
//                     flexDirection: 'row',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                   }}>
//                   <Image
//                     source={require('../../../assets/images/icons/arrow.png')} // Path to the profile image
//                     style={{width: 24, height: 24}}
//                   />
//                   <View style={styles.timeBlock}>
//                     <Text style={styles.timeBlockText}>
//                       From {item.from} To {item.to}
//                     </Text>
//                     <Text style={styles.availableText}>
//                       Available for {availableTime} hrs
//                     </Text>
//                   </View>
//                 </View>
//               )}
//             />
//           </View>
//         </Swipeable>
//         <View style={styles.bottomButtons}>
//           <TouchableOpacity
//             style={styles.dayOffButton}
//             onPress={handleDayOffPress}>
//             <Text style={styles.dayOffButtonText}>Set Day Off</Text>
//           </TouchableOpacity>
//           <LinearGradient
//             colors={['#1262D2', '#17316D']}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}
//             style={styles.saveButton}>
//             <TouchableOpacity>
//               <Text style={styles.saveButtonText}>Save Availability</Text>
//             </TouchableOpacity>
//           </LinearGradient>
//         </View>

//         {showDayOffMessage && (
//           <Text style={styles.dayOffMessage}>
//             <Text style={styles.redSign}>*</Text>
//             You won’t receive any service requests if you set Day Off.
//           </Text>
//         )}
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // padding: 20,
//     backgroundColor: '#F3F7FF',
//   },
//   subHeader: {
//     fontSize: 16,
//     fontFamily: 'Poppins',
//     lineHeight: 22,
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#fff',
//     backgroundColor: '#1262D2',
//     width: wp(100),
//     height: hp(8),
//     padding: 15,
//     fontWeight: '500',
//   },
//   svgOverlay: {
//     position: 'absolute', // Overlay on top of the circular progress
//     top: 0,
//     left: 0,
//   },
//   highlight: {
//     color: '#F29F05',
//   },
//   circleContainer: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   circleText: {
//     position: 'absolute',
//     top: '40%',
//     left: '50%',
//     transform: [{translateX: -50}, {translateY: -50}],
//     fontSize: 30,
//     color: '#FF8C00',
//     fontWeight: 'bold',
//   },
//   circleSubText: {
//     position: 'absolute',
//     top: '55%',
//     left: '50%',
//     transform: [{translateX: -50}, {translateY: -50}],
//     fontSize: 14,
//     color: '#FF8C00',
//   },
//   cornerIcon: {
//     width: 24,
//     height: 24,
//     position: 'absolute',
//   },
//   clockText: {
//     fontSize: 16,
//     color: '#000',
//     position: 'absolute',
//     fontFamily: 'Poppins',
//     fontWeight: '600',
//   },
//   circle: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     backgroundColor: '#EFF2FB',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 5,
//     borderColor: '#0067F5',
//   },
//   timePicker: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     paddingHorizontal: 20,
//     width: wp(100),
//   },
//   timePickerButton: {
//     backgroundColor: '#F3F7FF',
//     // borderWidth: 1,
//     // borderColor: 'rgba(0, 0, 0, 0.40)',
//     // borderRadius: 10,
//     paddingVertical: 10,
//     marginVertical: 5,
//   },
//   timePickerText: {
//     color: '#333',
//     fontSize: 14,
//     fontFamily: 'Poppins',
//   },
//   timeInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#CBD5E1',
//     padding: 10,
//     borderRadius: 10,
//     marginHorizontal: 5,
//     backgroundColor: '#fff',
//   },
//   appointmentMode: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 16,
//   },
//   modeButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderRadius: 10,
//     marginHorizontal: 10,
//     width: wp(15),
//   },
//   addButtonContainer: {
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   addButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: wp(16),
//     // height:hp(6)
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontFamily: 'Poppins SemiBold',
//     marginLeft: 5,
//     marginTop: 2,
//   },
//   timeBlock: {
//     flex: 1,
//     marginLeft: 20,
//     padding: 15,
//     backgroundColor: '#E9F0FF',
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   timeBlockText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   availableText: {
//     color: '#6B7280',
//     fontSize: 12,
//   },
//   bottomButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 10,
//     marginHorizontal: 20,
//   },
//   dayOffButton: {
//     padding: 15,
//     borderRadius: 10,
//     flex: 1,
//     marginRight: 10,
//     borderColor: '#000',
//     borderWidth: 1,
//   },
//   dayOffButtonText: {
//     textAlign: 'center',
//     fontSize: 14,
//     fontFamily: 'Poppins SemiBold',
//     color: '#000',
//   },
//   saveButton: {
//     padding: 15,
//     borderRadius: 10,
//     flex: 1,
//     marginLeft: 10,
//   },
//   saveButtonText: {
//     textAlign: 'center',
//     color: '#fff',
//     fontSize: 14,
//     fontFamily: 'Poppins SemiBold',
//     // fontWeight: 'bold',
//   },
//   dayOffMessage: {
//     color: '#000',
//     fontSize: 14,
//     marginVertical: 10,
//     textAlign: 'center',
//     fontFamily: 'Poppins',
//   },
//   redSign: {
//     color: '#FF0000',
//     fontSize: 18,
//     marginRight: 5,
//   },
// });

// export default Calendar;

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
import { useCreateTimeSlotMutation } from '../../redux/api/api';

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

  const [createTimeSlot]=useCreateTimeSlotMutation();

  const toggleMethod = method => {
    if (selectedMethod.includes(method)) {
      setSelectedMethod(selectedMethod.filter(item => item !== method));
    } else {
      setSelectedMethod([...selectedMethod, method]);
    }
  };

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
    console.log(JSON.stringify(date));
    const newDate = JSON.stringify(date);
    const newDate1 = newDate.substring(1, newDate.length - 1);
    const dates = newDate1.split('T');
    const date1 = dates[0].split('-');
    const day = date1[2];
    const month = date1[1];
    const year = date1[0];
    console.log(day + '-' + month + '-' + year);
    if (type == 'END_DATE') {
      if (day == undefined) {
        setSelectedEndDate('YYYY-MM-DD');
      } else {
        setSelectedEndDate(year + '-' + month + '-' + day);
      }
    } else {
      setSelectedStartDate(year + '-' + month + '-' + day);
      setSelectedEndDate('YYYY-MM-DD');
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

  // const handleSubmit = async () => {
  //   try {
  //     createTimeSlots();
  //     if (selectedSlots.length === 0) {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Please select at least one time slot.',
  //         visibilityTime: 2000,
  //         autoHide: true,
  //       });
  //       return;
  //     }
  //     setLoading(true);

  //     const formattedTimeSlots = selectedSlots.map(index => {
  //       const slot = timeSlots[index];
  //       // const startTime = formatTime(slot.start);
  //       const endTime = formatTime(slot.end);
  //       return `${endTime}`
  //     });

  //     const body = {
  //       startDate: selectedStartDate,
  //       endDate: selectedEndDate,
  //       times: formattedTimeSlots,
  //       // id,
  //     };

  //     console.log(body)

  //     // const res = await dispatch(addTimeSlot(body));
  //     console.log(res);

  //     if (res.success) {
  //       Toast.show({
  //         type: 'success',
  //         text1: res.message,
  //         visibilityTime: 2000,
  //         autoHide: true,
  //       });
  //     }
  //   } catch (error) {
  //     // If an error occurs during the process, show an error message
  //     Toast.show({
  //       type: 'error',
  //       text1: error.message || 'Something went wrong.',
  //       visibilityTime: 2000,
  //       autoHide: true,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        serviceType:selectedMethod,
        timeInMin:duration
      };

      console.log(body);

      // Uncomment and implement your dispatch logic
      const res = await createTimeSlot(body);
      console.log(res);

      if (res && res?.data?.success) {
        showMessage({
          message: res?.data?.message,
          type: 'success',
          icon: 'auto',
          autoHide: true,
        });
        // navigation.navigate("TabNavigator")
      }else {
        const errorMsg =
          res.error?.data?.message || 'Something went wrong!';
        showMessage({
          message: 'Error',
          description: errorMsg,
          type: 'danger',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.data?.message || 'Something went wrong!';
      showMessage({
        message: 'Error',
        description: errorMsg,
        type: 'danger',
        titleStyle: { fontFamily: 'Poppins SemiBold' },
        textStyle: { fontFamily: 'Poppins' },
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

  console.log(selectedMethod);
  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Set your availability'}
        icon={require('../../../assets/images/back.png')}
      />
      <Text style={styles.subHeader}>
        Set your availability for <Text style={styles.highlight}>Monday</Text>{' '}
        to{'\n'} receive service request
      </Text>
      <ScrollView>
        <View style={{marginHorizontal: wp('4%')}}>
          <View style={{width: '100%'}}>
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              minDate={minDate}
              maxDate={maxDate}
              todayBackgroundColor="blue"
              selectedDayColor="#1262D2"
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
                  <Text style={styles.buttonText}>{selectedEndDate}</Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.inputLabel}>Add Availability</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <TouchableOpacity
                onPress={() => setShowStartTimePicker(true)}
                style={styles.customButton}>
                <View style={styles.timeContainer}>
                  <View style={styles.timeMainContainer}>
                    <Text style={styles.dateText}>From</Text>
                    <Text style={styles.timeText}>
                      {startTime ? formatTime(startTime) : 'Select Start Time'}
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
            </View>
            <View>
              <TouchableOpacity
                onPress={() => setShowEndTimePicker(true)}
                style={styles.customButton}>
                <View style={styles.timeContainer}>
                  <View style={styles.timeMainContainer}>
                    <Text style={styles.dateText}>To</Text>
                    <Text style={styles.timeText}>
                      {endTime ? formatTime(endTime) : 'Select End Time'}
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
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={styles.inputLabel}>Duration (minutes)</Text>
            <SelectList
              setSelected={setDuration}
              data={durationOptions}
              save="value"
              placeholder="Select Duration (minutes)"
              boxStyles={styles.dropdown}
              fontFamily="Poppins"
            />
          </View>

          {timeSlots.length > 0 && (
            <View style={styles.timeSlotList}>
              {timeSlots.map((slot, index) => (
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
                    {/* {formatTime(slot.start)} - {formatTime(slot.end)} */}
                    {formatTime(slot.end)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.inputLabel}>Select Mode</Text>
          <View style={styles.appointmentMethod}>
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
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>

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
            <TouchableOpacity
              style={[
                styles.methodButton,
                selectedMethod.includes('Visit') && styles.selectedMethod,
              ]}
              onPress={() => toggleMethod('Visit')}>
              {/* <FontAwesome name="users" size={24} color={selectedMethod === 'inperson' ? 'white' : 'black'} /> */}
              <Image
                source={require('../../../assets/images/icons/groupIcon.png')}
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
          </View>
          <CustomButton
            title={
              loading ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.indicator}
                />
              ) : (
                'Create Time Slots'
              )
            }
            onPress={handleSubmit}
          />
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
  dropdown: {
    marginVertical: 5,
  },
  timeSlotList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  timeSlotItem: {
    width: '30%',
    marginVertical: 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 20,
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
    padding: 8,
    borderRadius: wp('2%'),
    width: wp('47%'),
    fontFamily: 'Poppins',
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
    width: wp('40%'),
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
});
