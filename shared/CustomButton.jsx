import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

const CustomButton = ({
  title,
  onPress,
  loading = false, // New prop to control loading state
  gradientColors = ['#17316D', '#1262D2'],
}) => {
  return (
    <TouchableOpacity style={styles.buttonWrapper} onPress={onPress} disabled={loading}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}>
        <View style={styles.buttonContent}>
          {loading && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: wp('2%'),
    overflow: 'hidden',
    marginBottom: hp('5%'),
    width: '100%',
  },
  button: {
    paddingVertical: hp('2%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row', // Align children horizontally
    alignItems: 'center',  // Center the items vertically
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontFamily: 'Poppins SemiBold',
    marginLeft: 10, // Add some space between the loader and the text
  },
  loader: {
    marginRight: 10, // Space between loader and text
  },
});

export default CustomButton;
