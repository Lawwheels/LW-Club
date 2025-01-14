import React, {useState, useEffect} from 'react';
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

const cardWidth = wp('100%') / 2 - wp('0.5%');
const cardHeight = hp('100%') / 2 - hp('22%');

const data = [
  {
    id: '1',
    title: `Email Marketing`,
    subtitle: 'Revolut is looking for Email Marketing to help team ma ...',
  },
  {
    id: '2',
    title: 'Brand Designer',
    subtitle: 'Revolut is looking for Email Marketing to help team ma ...',
  },
  {
    id: '3',
    title: `Email Marketing`,
    subtitle: 'Revolut is looking for Email Marketing to help team ma ...',
  },
  {
    id: '4',
    title: 'Brand Designer',
    subtitle: 'Revolut is looking for Email Marketing to help team ma ...',
  },
];

const Jobs = ({navigation}) => {
  const renderItem = ({item}) => (
    <>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.gradientBackground}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../../../../assets/images/student/logo.png')}
                style={{width: wp('10%'), height: hp('5%')}}
              />
              <View style={styles.buttonContainer}>
                <Text
                  style={[
                    styles.itemText,
                    {flex: 1, textAlign: 'center', fontSize: hp('1.6%')},
                  ]}>
                  Full Time
                </Text>
              </View>
            </View>
            <View style={{marginTop: hp('3%')}}>
              <Text style={[styles.itemText, {fontSize: hp('1.8%')}]}>
                {item.title}
              </Text>
              <Text
                style={{
                  color: '#515B6F',
                  fontFamily: 'Poppins',
                  fontSize: hp('1.6%'),
                }}>
                Revolut . Madrid, Spain
              </Text>
              <Text style={styles.subtitleText}>{item.subtitle}</Text>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={[
                    styles.extraContainer,
                    {backgroundColor: 'rgba(235, 133, 51, 0.10)'},
                  ]}>
                  <Text
                    style={{
                      fontSize: hp('1.5%'),
                      fontFamily: 'Poppins',
                      textAlign: 'center',
                      color: '#FFB836',
                    }}>
                    Marketing
                  </Text>
                </View>
                <View
                  style={[
                    styles.extraContainer,
                    {
                      backgroundColor: 'rgba(86, 205, 173, 0.10)',
                      marginLeft: 3,
                    },
                  ]}>
                  <Text
                    style={{
                      fontSize: hp('1.5%'),
                      fontFamily: 'Poppins',
                      textAlign: 'center',
                      color: '#56CDAD',
                    }}>
                    Design
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            // contentContainerStyle={styles.listContainer}
            showsHorizontalScrollIndicator={false}
          />
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
  },
  gradientBackground: {
    paddingHorizontal: wp('5%'),
    backgroundColor: 'red',
  },
  gradientBorder: {
    height: hp('1.5%'), // Height of the gradient border
  },
  itemText: {
    color: '#000',
    fontFamily: 'Poppins SemiBold',
  },
  subtitleText: {
    fontSize: hp('1.5%'),
    fontFamily: 'Poppins',
    color: '#5B5B5B',
    maxHeight: hp('10%'),
    overflow: 'hidden', 
    marginTop: hp('2%'),
  },
  cardContainer: {
    width: cardWidth,
    marginHorizontal: wp('2%'),
    marginVertical: hp('2.5%'),
  },
  card: {
    borderRadius: wp('2%'),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.11,
    shadowRadius: 5,
    elevation: 2,
    height: cardHeight,
    marginBottom: hp('1%'),
    overflow: 'hidden',
  },
  gradientBackground: {
    padding: wp('2%'),
    justifyContent: 'space-between',
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: wp('2%'),
    padding: wp('2%'),
  },
  extraContainer: {
    maxWidth: wp('20%'),
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('5%'),
    marginVertical: hp('1.5%'),
  },
});

export default Jobs;
