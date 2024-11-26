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

const AboutUs = ({navigation}) => {
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
        title="About us"
        icon={require('../../../assets/images/back.png')}
      />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <ContentSection title="Welcome to LawWheels.club!">
          <Text style={styles.text}>
            At LawWheels.club, we're transforming the way people connect with
            legal services. Our platform is designed to make legal assistance
            accessible, convenient, and efficient for everyone. Whether you're a
            lawyer looking to grow your practice, a client in need of expert
            legal advice, or a law student eager to build your future,
            LawWheels.club is here for you.
          </Text>
          <Text style={[styles.text, {marginVertical: 8}]}>
            For lawyers, we offer a space to connect with clients, provide
            telephonic consultations, and expand your reach online. Clients can
            effortlessly find the right lawyer for their needs, access legal
            documents, and stay updated with the latest legal news and insights.
          </Text>
          <Text style={styles.text}>
            Law students, you're not left out! We provide resources, internship
            opportunities, and a place to connect with peers, making it easier
            for you to thrive in your legal studies and beyond.
          </Text>
          <Text style={[styles.text, {marginTop: 8}]}>
            At LawWheels.club, we're not just a service provider; we are a
            community. Join us and experience a simpler, smarter way to handle
            legal needs.
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
    backgroundColor: '#5F33E1',
    marginVertical: 5,
  },
});

export default AboutUs;
