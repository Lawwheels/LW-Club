import React, {useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomHeader from '../../../shared/CustomHeader';
import ContentSection from '../../../shared/ContentSection';

const ContactUs = ({navigation}) => {
  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.isFocused()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F7FF" />
      <View style={{paddingTop:hp('3%')}}>
        <CustomHeader
          title="Contact us"
          icon={require('../../../assets/images/back.png')}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ContentSection title="Get in Touch with Us">
          <Text style={styles.text}>
            Have a question, or feedback, or need help with our services? We’re
            here to assist you! You can reach out to our support team by email
            at support@lawwheels.club or by phone at :--- We strive to respond
            to all inquiries as quickly as possible and are available to guide
            you with any assistance you need.
          </Text>
        </ContentSection>
        <ContentSection title="Office Address">
          <Text style={[styles.text, {marginTop: 5}]}>
            <Text style={{color: '#1262D2', fontFamily: 'Poppins SemiBold'}}>
              Register Office :
            </Text>{' '}
            210, Floor 2, 731/1, PMMM Marg Tardeo, Haji Ali, Mumbai,
            Mumbai-400034, Maharashtra.
          </Text>
          <Text style={[styles.text, {marginTop: 5}]}>
            <Text style={{color: '#1262D2', fontFamily: 'Poppins SemiBold'}}>
              Corporate Office :
            </Text>{' '}
            Surya Kiran Building, 6th Floor, Connaught Place, New Delhi, Delhi
            110001 Connect with us on social media for the latest updates and
            news.
          </Text>
        </ContentSection>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: 'gray',
    textAlign: 'justify',
  },
});

export default ContactUs;
