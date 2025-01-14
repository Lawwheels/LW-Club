
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
        {/* Left Section: Back Button */}
        {icon ? (
          <TouchableOpacity onPress={handleGoBack} style={styles.backButtonContainer}>
            <Image source={icon} style={styles.back} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} /> // Placeholder to maintain layout consistency
        )}

        {/* Center Section: Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Right Section: Invisible View to balance layout */}
        <View style={styles.placeholder} />
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    height: hp(6),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F7FF",
    elevation: 0.1,
    paddingHorizontal: wp("2.5%"),
  },
  backButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 40, 
  },
  back: {
    width: 24,
    height: 24,
  },
  titleContainer: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: 40, 
  },
  title: {
    fontSize: wp("4.5%"),
    fontFamily: "Poppins SemiBold",
  },
});
