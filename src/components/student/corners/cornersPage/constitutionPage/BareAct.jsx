import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

const BareAct = () => {
  const navigation = useNavigation();

  return (
    <>
      <TouchableOpacity style={styles.container}>
        <Text>Preamble</Text>
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F7FF',
    paddingTop: hp('1%'),
  },
});

export default BareAct;
