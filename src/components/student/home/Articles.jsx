import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

const Articles = () => {
  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={{
          uri: 'https://media.istockphoto.com/id/1336154952/vector/lawyer-judge-character-illustration.jpg?s=612x612&w=0&k=20&c=JdXNftj0scrYEqVtY5bGKyZJOa9RYylwb-lcygq4nus=',
        }}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}>
        <View style={styles.overlay} />
        {/* Back Button and Bookmark */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Image
              source={require('../../../../assets/images/back.png')}
              style={{width: 22, height: 22}}
            />
          </TouchableOpacity>
          <Text style={{fontFamily: 'Poppins', fontSize: hp('2.5%')}}>
            Articles
          </Text>
          <TouchableOpacity>
            <Image
              source={require('../../../../assets/images/student/save.png')}
              style={{width: 22, height: 22}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: wp('30%'),
              }}>
              <View style={styles.footerButton}>
                <TouchableOpacity>
                  <Image
                    source={require('../../../../assets/images/student/likeImage.png')}
                    style={{width: 24, height: 24}}
                  />
                </TouchableOpacity>
                <Text style={{fontFamily: 'Poppins', fontSize: hp('1.4%'),color:'#fff'}}>
                  56.4K
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins',
                    fontSize: hp('1.3%'),
                    color: '#fff',
                    marginLeft: wp('2%'),
                  }}>
                  1 hour ago
                </Text>
              </View>
              <TouchableOpacity style={styles.footerButton}>
                <Image
                  source={require('../../../../assets/images/student/msg.png')}
                  style={{width: 24, height: 24}}
                />
                <Text style={{fontFamily: 'Poppins', fontSize: hp('1.4%'),color:'#fff'}}>
                  56.4K
                </Text>
              </TouchableOpacity>
             
            </View>
            <TouchableOpacity style={styles.footerButton}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/1358/1358023.png',
                  }}
                  style={{width: 20, height: 20}}
                />
                <Text
                  style={{
                    fontFamily: 'Poppins',
                    fontSize: hp('1.4%'),
                    marginTop: 4,
                  }}>
                  56.4K
                </Text>
              </TouchableOpacity>
          </View>
      </ImageBackground>

      {/* Main Content */}
      <View
        style={{
          backgroundColor: '#F3F7FF',
        }}>
        <View
          style={{
            backgroundColor: '#E4EEFC',
            width: wp('90%'),
            padding: wp('4%'),
            marginHorizontal: wp('5%'),
            marginVertical: hp('2%'),
            borderRadius: wp('2%'),
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.date}>Published on : 12/10/2024</Text>
            <Text
              style={{
                fontFamily: 'Poppins',
                fontSize: hp('1.6%'),
                color: '#000',
              }}>
              Views : 48
            </Text>
          </View>
          <Text style={{fontSize: hp('2%'), fontFamily: 'Poppins SemiBold'}}>
            Navigating Legal Challenges in the Digital Age
          </Text>
        </View>

        <View style={{paddingHorizontal: wp('5%')}}>
          {/* Sections */}
          <View style={styles.tag}>
            <Text style={styles.tagText}>Family</Text>
          </View>
         
          <View style={styles.headerContainer}>
            <Image
              source={{
                uri: 'https://media.istockphoto.com/id/1326920136/photo/shot-of-a-business-women-using-laptop-working-at-home-stock-photo.jpg?s=612x612&w=0&k=20&c=tDhOPNMfBUlZLy5titrUrOXfHVbhVosEoQveTwuuL1Y=',
              }}
              style={styles.avatar}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.name}>Chris Evans</Text>
              <Text style={styles.profession}>Civil Lawyer</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followText}>+ Follow</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: '#E4EEFC',
              padding: wp('4%'),
              borderRadius: wp('3%'),
              marginBottom:hp('4%')
            }}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Background</Text>
              <Text style={styles.sectionText}>
                Lorem ipsum is typically a corrupted version of De finibus
                bonorum et malorum, a 1st-century BC text.Lorem ipsum is
                typically a corrupted version of De finibus bonorum et malorum,
                a 1st-century BC text.Lorem ipsum is typically a corrupted
                version of De finibus bonorum e.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Challenges</Text>
              <Text style={styles.sectionText}>
                Lorem ipsum is typically a corrupted version of De finibus
                bonorum et malorum, a 1st-century BC text.Lorem ipsum is
                typically a corrupted version of De finibus bonorum et malorum,
                a 1st-century BC text.Lorem ipsum is typically a corrupted
                version of De finibus bonorum e.
              </Text>
              <Text style={styles.sectionText}>
                Lorem ipsum is typically a corrupted version of De finibus
                bonorum et malorum, a 1st-century BC text.Lorem ipsum is
                typically a corrupted version of De finibus bonorum et malorum,
                a 1st-century BC text.Lorem ipsum is typically a corrupted
                version of De finibus bonorum e.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Outcome</Text>
              <Text style={styles.sectionText}>
                Lorem ipsum is typically a corrupted version of De finibus
                bonorum et malorum, a 1st-century BC text.Lorem ipsum is
                typically a corrupted version of De finibus bonorum et malorum,
                a 1st-century BC text.Lorem ipsum is typically a corrupted
                version of De finibus bonorum e.
              </Text>
            </View>
          </View>
          {/* Footer */}

         
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  backgroundImage: {
    width: '100%',
    height: hp('38%'),
    borderBottomLeftRadius: wp('5%'),
    borderBottomRightRadius: wp('5%'),
  },
  imageStyle: {
    borderBottomLeftRadius: wp('5%'),
    borderBottomRightRadius: wp('5%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('4%'),
    paddingHorizontal: wp('5%'),
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomLeftRadius: wp('5%'),
    borderBottomRightRadius: wp('5%'),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
    lineHeight: 20,
  },
  profession: {
    fontSize: hp('1.6%'),
    color: '#7C7C7C',
    fontFamily: 'Poppins',
  },
  followButton: {
    backgroundColor: '#1262D2',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  followText: {
    color: '#fff',
    fontSize: hp('1.7%'),
    fontFamily: 'Poppins',
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1262D2',
  },
  tagText: {
    color: '#1262D2',
    fontSize: hp('1.5%'),
    fontFamily: 'Poppins',
  },
  date: {
    fontSize: hp('1.8%'),
    color: '#777575',
    marginBottom: hp('2%'),
    fontFamily: 'Poppins',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins SemiBold',
    marginBottom: hp('1%'),
    color: '#294776',
  },
  sectionText: {
    fontSize: hp('1.5%'),
    fontFamily: 'Poppins',
    color: '#333',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: hp('2%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.1)', // Optional for better visibility
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2%'),
  },
  footerButton: {
    alignItems: 'center',
  },
});

export default Articles;
