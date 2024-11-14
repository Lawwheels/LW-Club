
import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from "react-native";

const CustomHeader = ({ title, icon }) => {
  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView>
    <View style={styles.header}>
      <TouchableOpacity onPress={handleGoBack} style={{marginTop:hp('1.6%')}}>
        <Image source={icon} style={styles.back} />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
    </SafeAreaView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    height: hp(9),
    flexDirection: "row",
    justifyContent:'space-between',
    backgroundColor: "#F3F7FF",
    // backgroundColor:'red',
    elevation: 0.1,
    paddingHorizontal: wp('2.5%'),  
    paddingVertical: hp('0.5%'),   
  },
  back: {
    width: wp('6%'),
    height: hp('4%'),
  },
  titleContainer: {
    flex: 1, // Let the title take up the remaining space
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: wp('4.5%'),
    // fontWeight: "600",
    fontFamily: "Poppins SemiBold",
  },
});
