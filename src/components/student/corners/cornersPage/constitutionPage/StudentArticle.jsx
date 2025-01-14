import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SelectList} from 'react-native-dropdown-select-list';
import CustomHeader from '../../../../../../shared/CustomHeader';

const StudentArticle = ({route}) => {
  const {name, article, amendments} = route.params;
  const [selected, setSelected] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < article.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const data = [
    {
      key: '1',
      value: 'English',
      image: require('../../../../../../assets/images/student/global.png'),
    },
    {
      key: '2',
      value: 'Hindi',
      image: require('../../../../../../assets/images/student/global.png'),
    },
    {
      key: '3',
      value: 'Marathi',
      image: require('../../../../../../assets/images/student/global.png'),
    },
    {
      key: '4',
      value: 'Telugu',
      image: require('../../../../../../assets/images/student/global.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Student Corners'}
        icon={require('../../../../../../assets/images/back.png')}
      />
      <ScrollView
        style={{paddingHorizontal: wp('5%')}}
        showsVerticalScrollIndicator={false}>
        {/* <Text style={styles.selectedText}>
          Selected Language: {selected || 'None'}
        </Text> */}
        <SelectList
          setSelected={val => setSelected(val)}
          data={data}
          save="value"
          search={false}
          boxStyles={styles.dropdownBox}
          dropdownStyles={styles.dropdown}
          dropdownItemStyles={styles.dropdownItem}
          dropdownTextStyles={styles.dropdownText}
          renderListItem={({item}) => {
            console.log(item.image);
            return (
              <View style={styles.dropdownItem}>
                <Image source={item.image} style={styles.dropdownImage} />
                <Text style={styles.dropdownText}>{item.value}</Text>
              </View>
            );
          }}
        />
        <View style={styles.mainContainer}>
          <View style={styles.subContainer} />
          <View style={styles.subContainer1}>
            <Text
              style={{
                fontFamily: 'Poppins',
                fontSize: hp('1.5%'),
                color: '#1261D1',
              }}>
              Article {article[currentIndex].articleNumber}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins',
                fontSize: hp('1.7%'),
              }}>
              {name}
            </Text>
          </View>
          <ScrollView
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.articleContent}>
              {article[currentIndex].content}
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: 'rgba(18, 97, 209, 0.20)',
                maxWidth: wp('90%'),
                marginTop: hp('5%'),
              }}
            />
            <Text style={styles.sectionHeader}>Amendments</Text>
            {amendments.map(amendment => (
              <View
                key={amendment.amendmentNumber}
                style={styles.amendmentItem}>
                <Text style={styles.amendmentTitle}>
                  Amendment {amendment.amendmentNumber} ({amendment.date})
                </Text>
                <Text style={styles.amendmentDescription}>
                  {amendment.description}
                </Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.navButtons}>
            <TouchableOpacity
              onPress={handlePrevious}
              disabled={currentIndex === 0}
              style={[
                styles.navButton,
                currentIndex === 0 && styles.disabledButton,
              ]}>
              <Image
                source={require('../../../../../../assets/images/student/leftArrow.png')}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNext}
              disabled={currentIndex === article.length - 1}
              style={[
                styles.navButton,
                currentIndex === article.length - 1 && styles.disabledButton,
              ]}>
              <Image
                source={require('../../../../../../assets/images/student/rightArrow.png')}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F7FF',
    paddingTop: hp('2.5%'),
    // flex: 1,
  },
  selectedText: {
    fontSize: 16,
    fontFamily: 'Poppins', // Replace with your desired font
    marginBottom: hp('2%'),
  },
  dropdownBox: {
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdown: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dropdownImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'Poppins', // Replace with your desired font
  },
  mainContainer: {
    width: wp('90%'),
    height: hp('80%'),
    backgroundColor: '#fff',
    marginVertical: hp('2%'),
    borderRadius: wp('5%'),
  },
  subContainer: {
    backgroundColor: '#1261D1',
    height: hp('3%'),
    width: wp('90%'),
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
  },
  subContainer1: {
    backgroundColor: '#F3F7FF',
    maxHeight: hp('10%'),
    width: wp('90%'),
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.20)',
    padding: wp('3%'),
  },
  contentContainer: {
    flex: 1,
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('3%'),
    marginBottom: 20,
  },
  articleContent: {
    fontFamily: 'Poppins',
    fontSize: hp('1.5%'),
    lineHeight: 20,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#F3F7FF',
    padding: 10,
    borderRadius: wp('50%'),
    margin: wp('5%'),
  },
  disabledButton: {
    backgroundColor: '#B0C4DE',
  },
  sectionHeader: {
    fontFamily: 'Poppins SemiBold',
    fontSize: hp('2%'),
    marginTop: 2,
    color: '#333',
  },
  amendmentItem: {
    marginBottom: hp('2%'),
  },
  amendmentTitle: {
    fontFamily: 'Poppins',
    fontSize: hp('1.6%'),
    lineHeight: 20,
  },
  amendmentDescription: {
    fontFamily: 'Poppins',
    fontSize: hp('1.5%'),
    lineHeight: 20,
    marginTop: 5,
  },
});

export default StudentArticle;
