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
import {useNavigation} from '@react-navigation/native';

const Constitution = () => {
  const navigation = useNavigation();
  const [showPreamble, setShowPreamble] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [expandedPart, setExpandedPart] = useState(null);

  const toggleExpansion = partName => {
    setExpandedPart(prev => (prev === partName ? null : partName));
  };

  const handleCardPress = cardId => {
    // Toggle the active card, if clicked again, hide it
    setActiveCard(activeCard === cardId ? null : cardId);
  };
  const dummyData = [
    {
      part: 'PART I',
      name: 'The Union and Its Territory',
      articles: [
        {
          articleNumber: 1,
          title: 'Name and territory of the Union',
          content:
            'India, that is Bharat, shall be a Union of States. The territory of India shall comprise—\n(a) the territories of the States;\n(b) the Union territories specified in the First Schedule; and\n(c) such other territories as may be acquired.',
        },
        {
          articleNumber: 2,
          title: 'Admission or establishment of new States',
          content:
            'Parliament may by law admit into the Union, or establish, new States on such terms and conditions as it thinks fit.',
        },
        {
          articleNumber: '2A',
          title: 'Sikkim to be associated with the Union',
          content:
            'Sikkim, which immediately before the commencement of the Constitution (Thirty-fifth Amendment) Act, 1974, was an Associate State, shall become a full-fledged State of the Union.',
        },
        {
          articleNumber: 3,
          title:
            'Formation of new States and alteration of areas, boundaries, or names of existing States',
          content:
            'Parliament may by law—\n(a) form a new State by separation of territory from any State or by uniting two or more States or parts of States or by uniting any territory to a part of any State;\n(b) increase the area of any State;\n(c) diminish the area of any State;\n(d) alter the boundaries of any State;\n(e) alter the name of any State.',
        },
        {
          articleNumber: 4,
          title:
            'Laws made under Articles 2 and 3 to provide for the amendment of the First and the Fourth Schedules and supplemental, incidental, and consequential matters',
          content:
            'Any law referred to in Article 2 or Article 3 shall contain such provisions for the amendment of the First Schedule and the Fourth Schedule as may be necessary to give effect to the provisions of the law and may also contain such supplemental, incidental, and consequential provisions as Parliament may deem necessary.',
        },
      ],
      amendments: [
        {
          amendmentNumber: 1,
          date: '1956-11-01',
          description:
            'Reorganization of States and Union Territories under the States Reorganization Act.',
        },
        {
          amendmentNumber: 35,
          date: '1974-04-09',
          description:
            'Provided for Sikkim as an Associate State under Article 2A.',
        },
        {
          amendmentNumber: 36,
          date: '1975-05-16',
          description:
            'Made Sikkim a full State of the Union by repealing Article 2A.',
        },
        {
          amendmentNumber: 100,
          date: '2015-08-01',
          description:
            'Exchanged certain enclaves between India and Bangladesh, altering the boundary of West Bengal.',
        },
      ],
    },
  ];

  return (
    <>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          {activeCard === null ? (
            <TouchableOpacity
              style={[styles.cardSubContainer,{marginTop:hp('3%')}]}
              onPress={() => handleCardPress(1)}>
              <View style={styles.headingContainer}>
                <Text style={styles.headingText}>Preamble</Text>
                <Image
                  source={require('../../../../../assets/images/student/preamble.png')}
                  style={{width: 40, height: 40}}
                />
              </View>
              <Text style={styles.subtitle}>
                Declares India as sovereign, socialist, secular, democratic, and
                ensures justice, liberty, equality, and fraternity.
              </Text>
            </TouchableOpacity>
          ) : null}
          {activeCard === null ? (
            <TouchableOpacity
            style={[styles.cardSubContainer,{marginTop:hp('3%')}]}
              onPress={() => handleCardPress(2)}>
              <View style={styles.headingContainer}>
                <Text
                  style={styles.headingText}>{`Parts of \nConstitution`}</Text>
                <Image
                  source={require('../../../../../assets/images/student/constitution.png')}
                  style={{width: 40, height: 40}}
                />
              </View>
              <Text style={styles.subtitle}>
                Declares India as sovereign, socialist, secular, democratic, and
                ensures justice, liberty, equality, and fraternity.
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={[styles.cardContainer, {marginVertical: hp('2%')}]}>
          {activeCard === null ? (
            <>
              <TouchableOpacity
                style={styles.cardSubContainer}
                onPress={() => handleCardPress(3)}>
                <View style={styles.headingContainer}>
                  <Text style={styles.headingText}>Schedule</Text>
                  <Image
                    source={require('../../../../../assets/images/student/schedule.png')}
                    style={{width: 40, height: 40}}
                  />
                </View>
                <Text style={styles.subtitle}>
                  Declares India as sovereign, socialist, secular, democratic,
                  and ensures justice, liberty, equality, and fraternity.
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
          {activeCard === null  ? (
            <TouchableOpacity
              style={styles.cardSubContainer}
              onPress={() => handleCardPress(4)}>
              <View style={styles.headingContainer}>
                <Text style={styles.headingText}>Amendments</Text>
                <Image
                  source={require('../../../../../assets/images/student/amendments.png')}
                  style={{width: 40, height: 40}}
                />
              </View>
              <Text style={styles.subtitle}>
                Declares India as sovereign, socialist, secular, democratic, and
                ensures justice, liberty, equality, and fraternity.
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {/* <TouchableOpacity onPress={() => navigation.navigate('Preamble')}>
        <Text>Preamble</Text>
      </TouchableOpacity> */}

      {activeCard === 1 && (
        <>
          <LinearGradient
            colors={['#1262D2', '#17316D']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.preambleContainer}
            >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../../../../../assets/images/student/preamble.png')}
                style={{width: 50, height: 50}}
              />
              <View style={{paddingHorizontal: wp('2%'), maxWidth: wp('75%')}}>
                <Text
                  style={[
                    styles.preambleText,
                    {fontSize: hp('1.8%'), fontFamily: 'Poppins SemiBold'},
                  ]}>
                  Preamble
                </Text>
                <Text
                  style={[
                    styles.preambleText,
                    {fontSize: hp('1.3%'), fontFamily: 'Poppins'},
                  ]}>
                  Declares India as sovereign, socialist, secular, democratic,
                  and ensures justice, liberty, equality, and fraternity.
                </Text>
              </View>
            </View>
          </LinearGradient>
          <View style={{marginVertical: hp('2%')}}>
            <Image
              source={require('../../../../../assets/images/student/constitutionImg.png')}
              style={{width: wp('90%'), height: hp('65%')}}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              style={styles.preambleOtherContainer}
              onPress={() => handleCardPress(2)}>
              <Image
                source={require('../../../../../assets/images/student/constitution.png')}
                style={{width: 40, height: 40}}
              />
              <Text
                style={
                  styles.preambleOtherContainerText
                }>{`Parts of\nConstitution`}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.preambleOtherContainer}
              onPress={() => handleCardPress(3)}>
              <Image
                source={require('../../../../../assets/images/student/constitution.png')}
                style={{width: 40, height: 40}}
              />
              <Text style={styles.preambleOtherContainerText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.preambleOtherContainer}
              onPress={() => handleCardPress(4)}>
              <Image
                source={require('../../../../../assets/images/student/constitution.png')}
                style={{width: 40, height: 40}}
              />
              <Text style={styles.preambleOtherContainerText}>Amendments</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {activeCard === 2 && (
        <>
          <LinearGradient
            colors={['#1262D2', '#17316D']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.preambleContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../../../../../assets/images/student/constitution.png')}
                style={{width: 50, height: 50}}
              />
              <View style={{paddingHorizontal: wp('2%'), maxWidth: wp('75%')}}>
                <Text
                  style={[
                    styles.preambleText,
                    {fontSize: hp('1.8%'), fontFamily: 'Poppins SemiBold'},
                  ]}>
                  Parts of Constitution
                </Text>
                <Text
                  style={[
                    styles.preambleText,
                    {fontSize: hp('1.3%'), fontFamily: 'Poppins'},
                  ]}>
                  Declares India as sovereign, socialist, secular, democratic,
                  and ensures justice, liberty, equality, and fraternity.
                </Text>
              </View>
            </View>
          </LinearGradient>
          <FlatList
            data={dummyData}
            keyExtractor={item => item.name}
            renderItem={({item}) => (
              <>
                <TouchableWithoutFeedback
                  onPress={() => toggleExpansion(item.name)}>
                  <View style={styles.constitutionContainer}>
                    <View style={{flexDirection: 'row', height: '100%'}}>
                      <View style={styles.rectangle}>
                        <View style={styles.slant} />
                        <View style={styles.partView}>
                          <Text style={styles.partText}>{item.part}</Text>
                        </View>
                      </View>
                      <Text style={styles.nameText}>{item.name}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>

                {expandedPart === item.name && (
                  <>
                    {/* <Text style={styles.sectionHeader}>Articles</Text> */}
                    {item.articles.map(article => (
                      <View style={styles.detailsContainer}>
                        <TouchableWithoutFeedback
                           onPress={() =>
                            navigation.navigate('StudentArticle', { name:item.name,article:item.articles,amendments:item.amendments })
                          }>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <View
                              key={article.articleNumber}
                              style={styles.articleItem}>
                              <Text
                                style={{
                                  color: '#1261D1',
                                  fontFamily: 'Poppins',
                                  lineHeight: 18,
                                  fontSize: hp('1.5%'),
                                }}>
                                Article {article.articleNumber} :
                              </Text>
                              <View
                                style={{
                                  height: 1,
                                  backgroundColor: '#1261D1',
                                  maxWidth: wp('14%'),
                                  marginBottom: 2,
                                }}
                              />

                              <Text style={styles.articleTitle}>
                                {article.title}
                              </Text>
                            </View>
                            <Image
                              source={require('../../../../../assets/images/student/arrow-right.png')}
                              style={{width: 15, height: 15}}
                            />

                         
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    ))}
                 
                  </>
                )}
              </>
            )}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              style={styles.preambleOtherContainer}
              onPress={() => handleCardPress(1)}>
              <Image
                source={require('../../../../../assets/images/student/preamble.png')}
                style={{width: 40, height: 40}}
              />
              <Text style={styles.preambleOtherContainerText}>Preamble</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.preambleOtherContainer}
              onPress={() => handleCardPress(3)}>
              <Image
                source={require('../../../../../assets/images/student/constitution.png')}
                style={{width: 40, height: 40}}
              />
              <Text style={styles.preambleOtherContainerText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.preambleOtherContainer}
              onPress={() => handleCardPress(4)}>
              <Image
                source={require('../../../../../assets/images/student/constitution.png')}
                style={{width: 40, height: 40}}
              />
              <Text style={styles.preambleOtherContainerText}>Amendments</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F7FF',
    // paddingTop: hp('2%'),
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('90%'),
    alignItems: 'center',
    // paddingTop: hp('1%')
  },
  cardSubContainer: {
    width: wp('43%'),
    height: hp('20%'),
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: wp('2%'),
    backgroundColor: '#e4eefc',
    padding: wp('2.5%'),
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('37%'),
  },
  headingText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins SemiBold',
  },
  subtitle: {
    marginTop: hp('1.2%'),
    fontFamily: 'Poppins',
    fontSize: hp('1.4%'),
    color: '#666666',
  },

  preambleContainer: {
    width: wp('90%'),
    height: hp('11.5%'),
    borderRadius: wp('5%'),
    padding: wp('2.5%'),

  },
  preambleText: {
    color: '#FFF',
  },
  preambleOtherContainer: {
    backgroundColor: '#E4EEFC',
    padding: wp('2.2%'),
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: wp('2%'),
    width: wp('27%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('2%'),
  },
  preambleOtherContainerText: {
    fontSize: hp('1.5%'),
    fontFamily: 'Poppins SemiBold',
    textAlign: 'center',
  },
  constitutionContainer: {
    backgroundColor: '#FFF',
    maxWidth: wp('90%'),
    height: hp('10%'),
    marginVertical: hp('1%'),
    borderRadius: wp('5%'),
  },
  rectangle: {
    width: 150,
    height: 77,
    backgroundColor: '#1261D1',
    borderTopLeftRadius: wp('5%'),
    borderBottomLeftRadius: wp('5%'),
    position: 'relative',
    overflow: 'hidden',
  },
  slant: {
    position: 'absolute',
    top: 0,
    right: -10, // Adjust for the diagonal cut
    width: 90, // Adjust for the size of the slant
    height: 170, // Larger than the rectangle's height for a sharp cut
    backgroundColor: '#fff',
    transform: [{rotate: '45deg'}], // Creates the slant
  },

  partView: {
    position: 'absolute',
    left: 20,
    top: 25,
  },
  partText: {
    fontFamily: 'Poppins',
    fontSize: hp('1.7%'),
    color: '#fff',
  },
  nameText: {
    fontFamily: 'Poppins',
    fontSize: hp('1.6%'),
    color: '#333',
    alignSelf: 'center',
  },
  detailsContainer: {
    marginTop: hp('1%'),
    padding: wp('3%'),
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
  },
 
  articleItem: {
    backgroundColor: '#fff',
  },
  articleTitle: {
    fontFamily: 'Poppins',
    fontSize: hp('1.5%'),
    color: '#1a1a1a',
    maxWidth: wp('75%'),
  },
  articleContent: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
 
});

export default Constitution;
