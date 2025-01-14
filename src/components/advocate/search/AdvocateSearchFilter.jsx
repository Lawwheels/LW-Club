import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {SelectList} from 'react-native-dropdown-select-list';
import CustomButton from '../../../../shared/CustomButton';

const AdvocateSearchFilter = ({visible, onClose, applyFilters}) => {
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(null);
  const [yearsOfExperience, setYearsOfExperience] = useState({min: 5, max: 15});
  const [expertise, setExpertise] = useState('');
  
  const data = [
    {key: '1', value: 'Family Law'},
    {key: '2', value: 'Corporate Law'},
    {key: '3', value: 'Intellectual Property'},
    {key: '4', value: 'Criminal Law'},
    {key: '5', value: 'Tax Law'},
  ];

  const locationData = [
    {key: '1', value: 'Delhi'},
    {key: '2', value: 'Noida'},
  ];

  const handleApplyFilters = () => {
    const filters = {
      location,
      rating,
      yearsOfExperience,
      expertise,
    };
    applyFilters(filters);
    onClose();
  };

  const handleValuesChange = values => {
    setYearsOfExperience({min: values[0], max: values[1]});
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.resetButton} onPress={onClose}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filter</Text>

          {/* Location */}
          <Text style={styles.label}>Location</Text>
          <SelectList
            setSelected={val => setLocation(val)}
            data={locationData}
            fontFamily="Poppins"
            save="value"
            inputStyles={{color: '#8E8E8E'}}
            boxStyles={styles.dropdown}
            dropdownStyles={styles.dropdownBox}
            dropdownTextStyles={styles.dropdownText}
            searchPlaceholder="Search"
            placeholder="Select Option"
          />

          {/* Rating */}
          <Text style={styles.label}>Filter By Rating</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map(num => (
              <TouchableOpacity
                key={num}
                onPress={() => setRating(num)}
                style={styles.starButton}>
                {rating >= num ? (
                  <Image
                    source={require('../../../../assets/images/icons/activeStar.png')}
                    style={{width: 24, height: 24}}
                  />
                ) : (
                  <Image
                    source={require('../../../../assets/images/icons/nonActiveStar.png')}
                    style={{width: 24, height: 24}}
                  />
                )}
                <Text
                  style={{
                    fontFamily: 'Poppins',
                    fontWeight: '400',
                    fontSize: wp('4%'),
                  }}>
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Years of Experience</Text>
          <View style={styles.experienceRange}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TextInput
                style={styles.experienceInput}
                placeholder="Min"
                value={yearsOfExperience.min.toString()}
                onChangeText={text =>
                  setYearsOfExperience({
                    ...yearsOfExperience,
                    min: parseInt(text) || 0,
                  })
                }
              />
              <Text
                style={{
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  fontWeight: '400',
                }}>
                to
              </Text>
              <TextInput
                style={styles.experienceInput}
                placeholder="Max"
                value={yearsOfExperience.max.toString()}
                onChangeText={text =>
                  setYearsOfExperience({
                    ...yearsOfExperience,
                    max: parseInt(text) || 0,
                  })
                }
              />
            </View>

            <View style={styles.sliderContainer}>
              <MultiSlider
                values={[yearsOfExperience.min, yearsOfExperience.max]}
                min={0}
                max={30}
                step={1}
                onValuesChange={handleValuesChange}
                selectedStyle={{backgroundColor: '#003366'}}
                unselectedStyle={{backgroundColor: '#A9A9A9'}}
                markerStyle={{
                  backgroundColor: '#294776',
                  height: 15,
                  width: 15,
                }}
                containerStyle={{height: 40}}
              />

              {/* Values below the slider */}
              <View style={styles.valuesContainer}>
                <Text style={[styles.sliderValueLabel, styles.minValueLabel]}>
                  {yearsOfExperience.min}
                </Text>
                <Text style={[styles.sliderValueLabel, styles.maxValueLabel]}>
                  {yearsOfExperience.max}
                </Text>
                <Text style={styles.maxText}>MAX</Text>
              </View>
            </View>
          </View>

          {/* Expertise */}
          <Text style={styles.label}>Area Of Expertise</Text>
          <SelectList
            setSelected={val => setExpertise(val)}
            data={data}
            fontFamily="Poppins"
            save="value"
            inputStyles={{color: '#8E8E8E'}}
            boxStyles={styles.dropdown}
            dropdownStyles={styles.dropdownBox}
            dropdownTextStyles={styles.dropdownText}
            searchPlaceholder="Search"
            placeholder="Select Option"
          />

          <View style={{marginTop: hp('3%')}}>
            <CustomButton title="Apply Filter" onPress={handleApplyFilters} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'relative',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: wp('1%'),
    padding: wp('5%'),
  },
  resetButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    zIndex: 1,
  },
  resetText: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    color: '#294776',
    fontSize: wp('3.73%'),
  },
  modalTitle: {
    fontSize: wp('5%'),
    // fontWeight: 'bold',
    marginBottom: hp('5%'),
    fontFamily: 'Poppins SemiBold',
    textAlign: 'center',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    padding: wp('1%'),
    marginBottom: hp('5%'),
  },
  dropdown: {
    marginVertical: hp('1%'),
    borderColor: '#fff',
    backgroundColor: '#E4EEFC',
    borderRadius: wp('3%'),
  },
  dropdownBox: {
    marginVertical: 2,
    borderColor: '#fff',
    backgroundColor: '#E4EEFC',
    borderRadius: wp('3%'),
  },
  dropdownText: {
    color: '#8E8E8E',
    fontSize: wp('3.73%'),
    fontWeight: '400',
    marginVertical: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('3%'),
  },
  experienceRange: {
    width: wp(81),
    height: hp(19),
    marginBottom: hp('3%'),
    backgroundColor: '#E4EEFC',
    borderRadius: wp('4%'),
    padding: wp('5%'),
  },
  experienceInput: {
    // width: 50,
    textAlign: 'center',
    backgroundColor: '#F3F7FF',
    borderRadius: wp('3%'),
    padding: wp('1%'),
    width: wp(18),
    fontFamily: 'Poppins',
    fontSize: wp('3.73%'),
  },
  label: {
    fontFamily: 'Poppins',
    color: '#294776',
    fontSize: wp('3.73%'),
    fontWeight: '500',
    marginVertical: 3,
  },
  starButton: {
    width: wp(14),
    height: hp(9),
    borderRadius: wp('3%'),
    backgroundColor: '#E4EEFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 60,
  },
  valuesContainer: {
    position: 'absolute',
    top: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderValueLabel: {
    fontSize: wp('3.73%'),
    fontFamily: 'Poppins',
    color: '#000',
  },
  minValueLabel: {
    position: 'absolute',
    left: 0,
  },
  maxValueLabel: {
    position: 'absolute',
    right: 40,
  },
  maxText: {
    position: 'absolute',
    right: 0,
    fontSize: wp('3.73%'),
    fontFamily: 'Poppins',
    color: '#000',
  },
});

export default AdvocateSearchFilter;
