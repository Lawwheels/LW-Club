import React, {useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  BackHandler,
} from 'react-native';
import CustomHeader from '../../../shared/CustomHeader';
import ContentSection from '../../../shared/ContentSection';

const HelpSupport = ({navigation}) => {
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
      <CustomHeader
        title="Help & Support"
        icon={require('../../../assets/images/back.png')}
      />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <ContentSection title="Need Assistance? We’re Here to Help!">
          <Text style={styles.text}>
            LawWheels.club is dedicated to making legal services easy and
            accessible. Our Help and Support section is here to provide
            guidance, answer questions, and make sure you get the most out of
            our platform.
          </Text>
        </ContentSection>
        <ContentSection title="How Can We Assist You?">
          <View style={styles.row}>
            <View style={styles.dot} />
            <Text style={styles.text}>
              &nbsp; Need help finding a lawyer or accessing legal documents?
              Check out our FAQs, or reach out for assistance. (for user)
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.dot} />
            <Text style={styles.text}>
              &nbsp; Questions about registration or providing telephonic
              consultations? Our team is here to help you maximize your reach
              and client base. (for lawyer)
            </Text>
          </View>
          <View style={styles.row}>
            <View style={styles.dot} />
            <Text style={styles.text}>
              &nbsp; If you’re looking to connect with peers, access resources,
              or apply for internships, we are here to support your journey.
              (Student)
            </Text>
          </View>
        </ContentSection>
        <Text style={styles.text}>
          Can’t find what you’re looking for? Contact our support team at{' '}
          <Text style={{color: 'blue'}}>support@lawwheels.club</Text>.
        </Text>
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
  boldText: {
    fontSize: 16,
    fontFamily: 'PoppinsSemiBold',
    color: '#5F33E1',
  },
  row: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#1262D2',
    marginVertical: 5,
  },
});

export default HelpSupport;
