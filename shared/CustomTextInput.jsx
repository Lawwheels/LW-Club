import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const CustomTextInput = ({
  placeholder,
  value,
  onChangeText,
  onBlur,
  style,
  inputStyle,
  placeholderTextStyle = {},
  keyboardType,
  backgroundColor,
  error, // Accept error prop
}) => {
  return (
    <View style={[styles.inputContainer, style, error ? styles.errorContainer : null]}>
      <TextInput
        style={[
          styles.input,
          inputStyle,
          backgroundColor ? { backgroundColor: backgroundColor } : null,
        ]}
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextStyle.color || '#aaa'}
        keyboardType={keyboardType || 'default'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 20, // Default margin
  },
  errorContainer: {
    marginBottom: 0, // Remove margin when there's an error
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E1EBFF',
    fontFamily: 'Poppins',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default CustomTextInput;
