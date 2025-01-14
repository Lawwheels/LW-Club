import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
  RefreshControl,
  ImageBackground,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

const articles = [
  {
    id: 1,
    title: 'Constitutional Law of India: An Overview',
    description:
      'Dive into comprehensive study material, including textbooks, previous year question papers, the Constitution of India, and insightful articles.',
    author: 'Ankush Gupta',
    date: 'Feb 28, 2024',
    category: 'Category',
    views: '224k',
  },
  {
    id: 2,
    title: 'Constitutional Law of India: An Overview',
    description:
      'Dive into comprehensive study material, including textbooks, previous year question papers, the Constitution of India, and insightful articles.',
    author: 'Author Name',
    date: 'Feb 20, 2024',
    category: 'Category',
    views: '224k',
  },
];

const LegalTextBook = ({navigation}) => {
  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={articles}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.articleCard}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.imagePlaceholder}>
                  <Image
                    source={{
                      uri: 'https://images.pexels.com/photos/4050347/pexels-photo-4050347.jpeg?cs=srgb&dl=pexels-vlada-karpovich-4050347.jpg&fm=jpg',
                    }}
                    style={{
                      width: wp('27%'),
                      height: hp('20%'),
                      borderTopRightRadius: wp('2%'),
                      borderBottomRightRadius: wp('2%'),
                    }}
                  />
                  {/* <View style={styles.overlayContainer}> */}
                    {/* First Slanting Line */}
                    {/* <View style={styles.slantingLine} /> */}

                    {/* Second Slanting Line */}
                    {/* <View style={[styles.slantingLine, styles.secondLine]} /> */}
                  {/* </View> */}
                </View>
                <View
                  style={{
                    width: wp('55%'),
                    marginLeft: wp('2%'),
                    paddingHorizontal: wp('2%'),
                  }}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.category}>{item.category}</Text>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        source={require('../../../../../assets/images/student/download.png')}
                        style={{
                          width: 12,
                          height: 10,
                          marginRight: wp('1%'),
                          marginTop: hp('0.2%'),
                        }}
                      />
                      <Text style={styles.views}>{item.views}</Text>
                    </View>
                  </View>
                  <Text style={styles.articleTitle}>{item.title}</Text>
                  <Text style={styles.articleDescription}>
                    {item.description}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          source={require('../../../../../assets/images/student/global.png')}
                          style={styles.globalIcon}
                        />
                        <Text
                          style={{fontSize: hp('1.2%'), fontFamily: 'Poppins'}}>
                          English
                        </Text>
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{fontSize: hp('1.2%'), fontFamily: 'Poppins'}}>
                          By
                        </Text>
                        <Text style={styles.authorName}>Ankush Gupta</Text>
                      </View>
                    </View>
                    <LinearGradient
                      colors={['#1261D1', '#093F6B']}
                      style={styles.gradientBackground}>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={require('../../../../../assets/images/student/receive-square.png')}
                          style={{
                            width: 12,
                            height: 10,
                            marginRight: 5,
                          }}
                        />
                        <Text
                          style={{
                            color: '#fff',
                            fontFamily: 'Poppins',
                            fontSize: hp('1.2%'),
                          }}>
                          Download
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F7FF',
    paddingTop: hp('1%'),
  },
  articleCard: {
    backgroundColor: '#E4EEFC',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    marginVertical: hp('1%'),
    width: wp('90%'),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  category: {
    backgroundColor: '#1261D1',
    color: '#FFF',
    fontSize: hp('1.4%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('5%'),
    fontFamily: 'Poppins',
  },
  views: {
    fontSize: hp('1.4%'),
    color: '#1262D2',
    fontFamily: 'Poppins',
  },
  articleTitle: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins SemiBold',
    color: '#000',
  },
  articleDescription: {
    fontSize: hp('1.2%'),
    fontFamily: 'Poppins',
    color: '#8C8C8C',
    // marginBottom: 8,
  },
  authorName: {
    fontSize: hp('1.4%'),
    marginLeft: 2,
    fontFamily: 'Poppins SemiBold',
  },
  imagePlaceholder: {
    width: wp('27%'),
    height: hp('20%'),
    borderTopRightRadius: wp('2%'),
    borderBottomRightRadius: wp('2%'),
    backgroundColor: '#D3D3D3',
    position: 'relative',
    // marginBottom: hp('2%'),
  },
  globalIcon: {
    width: 12,
    height: 11,
    marginRight: wp('1%'),
    marginTop: hp('0.2%'),
  },
  gradientBackground: {
    width: wp('20%'),
    height: hp('4.5%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  slantingLine: {
    position: 'absolute',
    width: 60,
    height: 2,
    backgroundColor: 'black',
    transform: [{rotate: '-45deg'}],
    top: 20,
    left: 0,
  },
  secondLine: {
    transform: [{rotate: '-45deg'}],
    top: 10,
    left: 10,
  },
  slantingText: {
    color: 'white',
    fontSize: 12,
    position: 'absolute',
    top: -15,
    left: 0,
  },
});

export default LegalTextBook;
