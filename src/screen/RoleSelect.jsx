import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  // Dimensions,
  Modal,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../shared/CustomButton';
import LinearGradient from 'react-native-linear-gradient';
import navigationStrings from '../constants/navigationStrings';
import {useRoleMutation} from '../redux/api/api';
import {setUser} from '../redux/reducers/auth/authSlice';
import {useNavigation} from '@react-navigation/native';

// const {height: screenHeight} = Dimensions.get('window');

const OptionCard = ({option, description, isSelected, onPress}) => (
  <TouchableOpacity
    style={[
      styles.optionCard,
      isSelected && styles.selectedCard,
      {ibackgroundColor: isSelected ? 'rgba(18, 98, 210, 0.10)' : '#fff'},
    ]}
    onPress={onPress}>
    <View style={styles.radioButtonContainer}>
      <View
        style={[
          styles.radioButton,
          {
            borderColor: isSelected ? '#1262D2' : '#B3B8C3',
            borderWidth: isSelected ? 4 : 1,
          },
        ]}>
        {isSelected && <View style={styles.radioButtonInner} />}
      </View>
      <View style={{paddingHorizontal: 10}}>
        <Text style={[styles.optionText, isSelected && styles.selectedOption]}>
          {option}
        </Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const RoleSelect = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [role] = useRoleMutation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const options = [
    {
      option: 'Advise seeker',
      description: 'Need of legal advice: seeking answers and solutions.',
    },
    {
      option: 'Advocate',
      description: 'A defender of justice, guidance, and legal expertise.',
    },
    {
      option: 'Student',
      description:
        'Connect with top advocates. Learn, grow, and thrive in law.',
    },
  ];



  const handleRoleSelection = option => {
    setSelectedOption(option);
  };

  const handleGetStarted = async () => {
    if (!selectedOption) {
      setIsModalVisible(true);
      return;
    }
    const roleToSend =
      selectedOption === 'Advise seeker' ? 'Nun' : selectedOption;

    await AsyncStorage.setItem('role', roleToSend);

    try {
      const res = await role({role: roleToSend});
      if (res && res?.data?.success) {
        const newRole = res?.data?.data.role;
        dispatch(setUser({role: newRole}));
        ToastAndroid.show(
          res?.data?.message || 'Role selected successfully!',
          ToastAndroid.SHORT,
        );
       
          navigation.navigate("appStack",{role:roleToSend});
        
      } else {
        ToastAndroid.show(
          'Failed to select role. Please try again.',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      console.error(error);
      ToastAndroid.show(
        'An error occurred. Please try again.',
        ToastAndroid.SHORT,
      );
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };
  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#17316D', '#1262D2']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.background}>
        {/* Slanting Lines Overlay */}
        <View style={styles.lineOverlay}>
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </View>

        {/* Login Section */}
        <View style={styles.loginContainer}>
          <View style={styles.loginLine} />
          <View style={styles.content}>
            <Text style={styles.loginTitle}>What Best Defines You? </Text>
            {options.map((item, index) => (
              <OptionCard
                key={index}
                option={item.option}
                description={item.description}
                isSelected={selectedOption === item.option}
                // onPress={() => setSelectedOption(item.option)}
                onPress={() => handleRoleSelection(item.option)}
              />
            ))}

            <CustomButton title="Get Started" onPress={handleGetStarted} />
          </View>
        </View>
      </LinearGradient>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Please select an option.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  lineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: '160%',
    height: hp(12),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transform: [{rotate: '-45deg'}],
    marginBottom: hp(25),
  },
  loginContainer: {
    backgroundColor: '#E1EBFF', // Light blue background
    paddingHorizontal: wp('5%'),
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius:wp('5%'),
    width: '100%',
    maxWidth: '100%',
    position: 'absolute',
    height: '74%',
    maxHeight: '74%',
    // height: screenHeight * 0.49,
    bottom: 0, // To adjust position from bottom
  },
  loginLine: {
    width: wp('16%'),
    height: hp('0.5%'),
    backgroundColor: '#000',
    alignSelf: 'center',
    marginBottom: hp('1%'),
  },
  loginTitle: {
    fontSize: wp('4%'),
    marginVertical: hp('1.5%'),
    fontWeight: '500',
    color: '#000',
    fontFamily: 'Poppins',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    marginBottom: hp('0.5%'),
  },
  radioButton: {
    height: hp('3%'),
    width: wp('6%'),
    borderRadius: wp('5%'),
    marginTop: hp('0.5%'),
  },
  radioButtonInner: {
    height: hp('1.8%'),
    width: wp('3%'),
    borderRadius: wp('2%'),
    backgroundColor: '#E1EBFF',
  },
  optionCard: {
    borderWidth: 1,
    borderColor: '#B3B8C3',
    padding: wp('5%'),
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
  },
  selectedCard: {
    borderColor: '#1262D2',
  },
  heading: {
    fontSize: wp('5%'),
    marginBottom: hp('5%'),
    textAlign: 'center',
    color: '#000',
    fontFamily: 'Poppins SemiBold',
  },
  optionText: {
    fontSize: wp('4%'),
    color: '#294776',
    fontFamily: 'Poppins SemiBold',
  },
  selectedOption: {
    color: '#294776',
  },
  description: {
    fontSize: wp('3.2%'),
    color: '#504F4F',
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBox: {
    backgroundColor: 'white',
    padding: wp('8%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    width: wp('80%'),
  },
  modalText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins', // Set your font family here
    color: '#333',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  modalButton: {
    padding: wp('2.5%'),
    backgroundColor: '#1467DA',
    borderRadius: wp('1%'),
  },
  modalButtonText: {
    color: 'white',
    fontSize: wp('4%'),
    fontFamily: 'Poppins', // Set your font family here
  },
  content: {
    width: '100%',
    flexGrow: 1,
  },
});

export default RoleSelect;
