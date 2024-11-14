import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Svg, { G, Circle, Text as SvgText } from 'react-native-svg';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const WatchUI = () => {
  const [currentHour, setCurrentHour] = useState(9); // Start at 9 AM
  const [isAM, setIsAM] = useState(true); // Default is AM
  const [fill, setFill] = useState(0); // Initialize fill at 0%

  const formatTime = (hour, isAM) => {
    const displayHour = hour === 0 ? 12 : hour; // Convert 0 to 12 for AM/PM format
    return `${displayHour}:00 ${isAM ? 'AM' : 'PM'}`;
  };

  const handleWatchClick = () => {
    // Increase the current hour
    let nextHour = currentHour + 1;

    // Logic to toggle between AM and PM
    if (nextHour > 12) {
      nextHour = 1;
      setIsAM(!isAM); // Toggle AM/PM when it goes from 12 to 1
    }

    // Prevent going beyond 6 PM
    if (nextHour === 7 && !isAM) {
      nextHour = 6; // Reset to 6 PM
    }

    // Update the current hour
    setCurrentHour(nextHour);

    // Update fill percentage based on current hour
    // Map the hours to fill percentage:
    // 9 AM (0%) - 6 PM (100%)
    const newFill = ((nextHour - 9) / 9) * 100; // Calculate percentage based on 9 AM being 0%
    setFill(newFill);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleWatchClick} style={styles.circleContainer}>
        <AnimatedCircularProgress
          size={200}
          width={20}
          fill={fill}
          tintColor="#0067F5"
          backgroundColor="#EFF2FB"
          rotation={0}
        >
          {() => (
            <Svg height="200" width="200" viewBox="0 0 200 200">
              <SvgText
                x="100"
                y="90"
                textAnchor="middle"
                fontSize="30"
                fill="#FF8C00"
                fontWeight="bold"
              >
                {`${currentHour}:00`}
              </SvgText>
              <SvgText
                x="100"
                y="130"
                textAnchor="middle"
                fontSize="14"
                fill="#FF8C00"
              >
                {isAM ? 'AM' : 'PM'}
              </SvgText>
              {/* Clock numbers */}
              <SvgText x="100" y="40" textAnchor="middle" fontSize="20" fill="#333">12</SvgText>
              <SvgText x="160" y="105" textAnchor="middle" fontSize="20" fill="#333">3</SvgText>
              <SvgText x="100" y="170" textAnchor="middle" fontSize="20" fill="#333">6</SvgText>
              <SvgText x="40" y="105" textAnchor="middle" fontSize="20" fill="#333">9</SvgText>
              {/* Progress indicator */}
              <G rotation={((currentHour - 9) / 9) * 360 - 90} origin="100, 100">
                <Circle cx="190" cy="100" r="8" fill="#FF8C00" />
              </G>
              {/* Ticks */}
              {Array.from({ length: 12 }).map((_, index) => (
                <Circle
                  key={index}
                  cx={100 + 85 * Math.cos((index * 30 - 90) * (Math.PI / 180))}
                  cy={100 + 85 * Math.sin((index * 30 - 90) * (Math.PI / 180))}
                  r="1.5"
                  fill="#B0B0B0"
                />
              ))}
            </Svg>
          )}
        </AnimatedCircularProgress>
      </TouchableOpacity>
      <View style={styles.timeAdjustmentContainer}>
        {/* From Time Display */}
        <View style={styles.timeBox}>
          <Text style={styles.timeLabel}>From</Text>
          <Text style={styles.timeText}>{formatTime(9, true)}</Text>
        </View>
        {/* To Time Display */}
        <View style={styles.timeBox}>
          <Text style={styles.timeLabel}>To</Text>
          <Text style={styles.timeText}>{formatTime(currentHour, isAM)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeAdjustmentContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  timeBox: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  timeLabel: {
    fontSize: 14,
    color: '#333',
  },
  timeText: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default WatchUI;
