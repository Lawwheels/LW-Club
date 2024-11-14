import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Onboarding from 'react-native-onboarding-swiper';

export default function OnBoardingScreen({navigation}) {
  const renderImage = source => (
    <View style={styles.imageContainer}>
      <Image source={source} style={styles.image} />
    </View>
  );

  const handleDone = () => {
    navigation.navigate('authStack');
  };

  const doneButton = ({...props}) => (
    <TouchableOpacity {...props}>
      <LinearGradient
        colors={['#17316D', '#1262D2']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.nextButton}>
        <Text style={styles.buttonText}>Next</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  // Custom Dot Component
  const Dots = ({selected}) => (
    <View
      style={[styles.dot, 
        {
          backgroundColor: selected ? '#125ECA' : '#E0E0E0',
          width: selected ? wp(10) : wp(2),  // Making the active dot larger
          height: selected ? wp(2) : wp(2), // Making the active dot larger
        },
      ]}
    />
  );

  return (
    <LinearGradient
      colors={['#FFF', '#EDF4FF']}
      style={styles.container}
      locations={[0.5, 0.5]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.onboardingContainer}>
        <Onboarding
          onSkip={handleDone}
          onDone={handleDone}
          bottomBarHighlight={false}
          DoneButtonComponent={doneButton}
          NextButtonComponent={doneButton}
          SkipButtonComponent={() => null} // Hide Skip button
          showPagination
          DotComponent={Dots} // Custom Dot Component
          bottomBarHeight={70} // Control bottom bar height
          bottomBarColor="transparent"
          pages={[
            {
              backgroundColor: 'transparent',
              image: renderImage(
                require('../../../assets/images/onboarding/01.png'),
              ),
              title: (
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>
                    Find the Right Legal {'\n'}Support,{' '}
                    <Text style={{color: '#FFA800'}}>Anytime</Text>,{'\n'}
                    <Text style={{color: '#125ECA'}}>Anywhere</Text>.
                  </Text>
                  <Text style={styles.subtitleText}>
                    Whether it's advice, representation, or documents, get
                    trusted legal help at your fingertips—whenever you need it,
                    wherever you are!
                  </Text>
                </View>
              ),
            },
            {
              backgroundColor: 'transparent',
              image: renderImage(
                require('../../../assets/images/onboarding/02.png'),
              ),
              title: (
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>
                    <Text style={{color: '#125ECA'}}>Unlock</Text> Free Legal{' '}
                    {'\n'}Consultations – No Strings Attached!
                  </Text>
                  <Text style={styles.subtitleText}>
                    Get expert legal advice at no cost. Connect with top-rated
                    lawyers and get the guidance you need to make informed
                    decisions, all with zero commitment!
                  </Text>
                </View>
              ),
            },

            {
              backgroundColor: 'transparent',
              image: renderImage(
                require('../../../assets/images/onboarding/03.png'),
              ),
              title: (
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>
                    Complete {'\n'}
                    <Text style={{color: '#FFA800'}}>Transparency</Text>, Every
                    {'\n'}Step of the Way!
                  </Text>
                  <Text style={styles.subtitleText}>
                    Know exactly what you’re paying for with clear pricing,
                    secure transactions, and detailed payment history—no
                    surprises, just trust.
                  </Text>
                </View>
              ),
            },
          ]}
          paginationContainerStyle={styles.paginationContainer} 
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  onboardingContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageContainer: {
    width: wp(100),
    height: hp(40),
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  textContainer: {
    backgroundColor: '#EDF4FF',
    paddingVertical: hp(3),
    paddingHorizontal: wp(5),
    marginTop: -30,
  },
  image: {
    width: '80%',
    height: '100%',
    resizeMode: 'contain',
  },
  titleText: {
    fontSize: 28,
    textAlign: 'left',
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    color: '#222',
    marginBottom: hp(1),
    lineHeight: 45,
  },
  subtitleText: {
    fontSize: 14,
    textAlign: 'justify',
    color: '#6E6E6E',
    fontFamily: 'Poppins',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    right: 10,
    flexDirection: 'row', // Align dots in a row
    justifyContent: 'flex-start', // Align dots to the left
    zIndex: 100,
  },
});
