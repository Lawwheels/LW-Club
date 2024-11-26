
// components/ContentSection.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ContentSection = ({ title, children }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins SemiBold",
    color: "#1262D2",
    // marginVertical: 10,
  },
});

export default ContentSection;
