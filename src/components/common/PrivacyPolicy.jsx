import React, {useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView, BackHandler} from 'react-native';
import CustomHeader from '../../../shared/CustomHeader';
import ContentSection from '../../../shared/ContentSection';

const PrivacyPolicy = ({navigation}) => {
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
        title="Privacy Policy"
        icon={require('../../../assets/images/back.png')}
      />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <ContentSection title="Your Privacy Matters to Us">
          <Text style={styles.text}>
            At LawWheels.club, we prioritize your privacy and work hard to
            protect your personal information. This Privacy Policy explains how
            we collect, use, and safeguard your data on our platform.
          </Text>
        </ContentSection>
        <ContentSection title="Information Collection and Use">
          <Text style={styles.text}>
            We collect information when you register, use our services, or
            interact with our platform. This may include personal details like
            your name, contact information, and any data you choose to provide.
            This information helps us deliver our services effectively and
            personalize your experience.
          </Text>
        </ContentSection>
        <ContentSection title="Data Security">
          <Text style={styles.text}>
            We implement strict security measures to protect your data from
            unauthorized access or disclosure. Your information is stored
            securely, and only authorized personnel have access to it.
          </Text>
        </ContentSection>
        <ContentSection title="Your Rights">
          <Text style={styles.text}>
            You have the right to access, modify, or delete your personal
            information at any time. Simply contact our support team if you wish
            to make changes.
          </Text>
        </ContentSection>
        <ContentSection title="Changes to Our Privacy Policy">
          <Text style={styles.text}>
            We may update our Privacy Policy occasionally, and any changes will
            be communicated on our platform. We encourage you to review this
            policy periodically.
          </Text>
        </ContentSection>

        <Text style={[styles.text, {marginVertical: 5}]}>
          For more details or concerns, feel free to contact us at{' '}
          <Text style={{color: 'blue'}}>privacy@lawwheels.club</Text>.
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
});

export default PrivacyPolicy;
