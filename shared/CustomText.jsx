import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

const CustomText = ({
  placeholder,
  value,
  onChangeText,
  style,
  inputStyle,
  placeholderTextStyle,
  keyboardType,
  backgroundColor,
  error
}) => {
  return (
    <View style={[styles.inputContainer, style, error ? styles.errorContainer : null]}>
      <TextInput
        style={[
          styles.input,
          inputStyle,
          backgroundColor ? {backgroundColor: backgroundColor} : null,
        ]}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder} 
        placeholderTextColor={placeholderTextStyle?.color || '#aaa'} 
        keyboardType={keyboardType || 'default'} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 20,
    
  },
  input: {
    height:48,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#E1EBFF',
    fontFamily: 'Poppins',
  },
});

export default CustomText;
