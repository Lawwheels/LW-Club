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
import StarRating from '../../../../../shared/StarRating';

const articles = [
  {
    id: 1,
    title: 'Secondary school law: dsajirua fdoakdsa',
    description: "In today's digital age, cybersecurity has become a critical concern for individuals and businesses alike.",
    author: 'Ankush Gupta',
    date: 'Feb 28, 2024',
    category: 'Category',
    views: '1.5k',
  },
  {
    id: 2,
    title: 'Secondary school law: dsajirua fdoakdsa',
    description: "In today's digital age, cybersecurity has become a critical concern for individuals and businesses alike.",
    author: 'Author Name',
    date: 'Feb 20, 2024',
    category: 'Category',
    views: '2.1k',
  },
];

const Blogs = ({navigation}) => {
  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={articles}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.articleCard}
              >
              <View style={{flexDirection: 'row'}}>
                <View style={styles.imagePlaceholder} />
                <View style={{width: wp('55%'), marginLeft: wp('2%'),paddingHorizontal:wp('2%')}}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.category}>{item.category}</Text>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        source={require('../../../../../assets/images/student/blueEye.png')}
                        style={{width: 15, height: 15, marginRight: wp('1%')}}
                      />
                      <Text style={styles.views}>{item.views}</Text>
                    </View>
                  </View>
                  <Text style={styles.articleTitle}>{item.title}</Text>
                  <Text style={styles.articleDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <View style={styles.authorSection}>
                  <Image
                    source={{
                      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD116U9ZCk8bEaanCeB5rSCC2uqY5Ka_2_EA&s',
                    }}
                    style={styles.authorImage}
                  />
                  <View>
                    <Text style={styles.authorName}>{item.author}</Text>
                    <StarRating
                      rating={5}
                      starSize={12}
                      marginVertical={hp(0)}
                    />
                  </View>
                </View>
                <View style={{alignItems: 'center', marginTop: hp('1%')}}>
                  <Text style={[styles.date,{color:'#000'}]}>Published on </Text>
                  <Text style={[styles.date,{color:'#8C8C8C'}]}>{item.date}</Text>
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
    marginBottom: 8,
  },
  category: {
    backgroundColor: '#fff',
    color: '#1D7FFF',
    fontSize: hp('1.4%'),
    padding: 4,
    borderRadius: 4,
    fontFamily: 'Poppins',
  },
  views: {
    fontSize: hp('1.4%'),
    color: '#1262D2',
    fontFamily: 'Poppins',
  },
  articleTitle: {
    fontSize: hp('1.5%'),
    fontFamily: 'Poppins',
    color: '#000',
  },
  articleDescription: {
    fontSize: hp('1.2%'),
    fontFamily: 'Poppins',
    color: '#8C8C8C',
    // marginBottom: 8,
  },
  cardFooter: {
    marginTop: hp('1%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: hp('1%'),
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  authorName: {
    fontSize: hp('1.7%'),
    fontFamily: 'Poppins',
    color: '#000',
  },
  date: {
    fontSize: hp('1.5%'),
    fontFamily: 'Poppins',
  },
  imagePlaceholder: {
    width: wp('28%'),
    height: hp('15%'),
    borderRadius: 10,
    backgroundColor: '#D3D3D3',
    // marginBottom: hp('2%'),
  },
});

export default Blogs;
