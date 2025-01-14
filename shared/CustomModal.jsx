import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const CustomModal = ({visible, onConfirm, onCancel, title,buttonText,userName}) => (
  <Modal
    transparent={true}
    animationType="slide"
    visible={visible}
    onRequestClose={onCancel}>
    <View style={styles.modalContainer}>
      <View style={styles.deleteContent}>
        <Text style={styles.deleteTitle}>{title || 'Confirm Unfollow'}</Text>
        <Text style={styles.modalMessage}>
          Are you sure you want to unfollow{' '}
          {userName ? `${userName.toLowerCase()}` : 'this item'}?
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default CustomModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalMessage: {
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  deleteContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Poppins SemiBold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
});
