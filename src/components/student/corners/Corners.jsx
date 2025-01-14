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
import LinearGradient from 'react-native-linear-gradient';
import CustomHeader from '../../../../shared/CustomHeader';
import Constitution from './cornersPage/Constitution';
import Blogs from './cornersPage/Blogs';
import LegalTextBook from './cornersPage/LegalTextBook';
import BareAct from './cornersPage/constitutionPage/BareAct';
import Jobs from './cornersPage/Jobs';
const cardWidth = wp('100%') / 2 - wp('0.5%');
const cardHeight = hp('100%') / 2 - hp('22%');

const Corners = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState(1);
  const handleCardSelect = id => {
    setSelectedCard(id);
  };

  const data = [
    {
      id: '1',
      title: `Explore Resources \nfor Legal Excellence`,
      subtitle:
        'Dive into comprehensive study material, including textbooks, previous year question papers, the Constitution of India, and insightful articles.',
      colors: ['#CDE2FF', '#FFFFFF'],
      borderTopColors: ['#1261D1', '#093F6B'],
    },
    {
      id: '2',
      title: 'Stay Ahead with the Latest Legal Developments',
      subtitle:
        'Access updates on published amendments, current legal news, and recent changes in legislation.',
      colors: ['#FFEABA', '#FFFFFF'],
      borderTopColors: ['#FFA800', '#996500'],
    },
    {
      id: '3',
      title: 'Shape Your Legal Career',
      subtitle:
        'Discover job openings and internships tailored for aspiring legal professionals.',
      colors: ['#E0FFC8', '#FFFFFF'],
      borderTopColors: ['#55A426', '#203E0F'],
    },
    {
      id: '4',
      title: 'Get Answers to Your Queries',
      subtitle:
        'Find solutions to commonly asked questions and enhance your experience with the application',
      colors: ['#FFC8FF', '#FFFFFF'],
      borderTopColors: ['#A226A4', '#3E0F3E'],
    },
  ];

  const tabConfig = {
    1: {
      tabs: [
        'Legal Textbooks',
        'Constitution',
        'Bare Act',
        'Articles',
        'Question Paper',
      ],
      activeTabColor: ['#1261D1', '#093F6B'],
      components: {
        'Legal Textbooks': LegalTextBook,
        Constitution: Constitution,
        'Bare Act': BareAct,
        // Articles: Articles,
      },
    },
    2: {
      tabs: ['Blogs', 'Judgements', 'Community'],
      activeTabColor: ['#FFA800', '#996500'],
      components: {
        Blogs: Blogs,
        Judgements: Blogs,
      },
    },
    3: {
        tabs: ['Jobs', 'Internship', 'Community'],
        activeTabColor:['#55A426', '#203E0F'],
        components: {
          Jobs: Jobs,
          Internship: Jobs
        },
      },
  };

  const TabMenu = ({selectedCard}) => {
    const [activeTab, setActiveTab] = useState(
      tabConfig[selectedCard]?.tabs[0],
    ); 

    const tabs = tabConfig[selectedCard]?.tabs || [];
    const components = tabConfig[selectedCard]?.components || {};
    const activeTabColor = tabConfig[selectedCard]?.activeTabColor || [
      '#1261D1',
      '#093F6B',
    ];

    useEffect(() => {
      setActiveTab(tabs[0]);
    }, [selectedCard, tabs]);

    const ActiveComponent = components[activeTab];

    if (!ActiveComponent) {
      return <Text>Error: Component not found for {activeTab}</Text>;
    }

    return (
      <View style={styles.tabMenu}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false} 
        >
          <View style={styles.tabNames}>
            {tabs.map(tabName => (
              <TouchableOpacity
                key={tabName}
                style={[
                  styles.tabButton,
                  activeTab === tabName && styles.activeTabButton, 
                  activeTab !== tabName && styles.inactiveTabButton, 
                ]}
                onPress={() => setActiveTab(tabName)}>
                {activeTab === tabName ? (
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={activeTabColor} 
                    style={styles.gradientTabButton}>
                    <Text style={styles.activeTabText}>{tabName}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.inactiveTabContent}>
                    <Text style={styles.inactiveTabText}>{tabName}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={styles.tabContent}>
          <ActiveComponent />
        </View>
      </View>
    );
  };

  const renderItem = ({item}) => (
    <>
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={item.borderTopColors}
          style={styles.gradientBorder}
        />
        <View style={styles.card}>
          <LinearGradient
            colors={item.colors}
            style={styles.gradientBackground}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Image
                source={require('../../../../assets/images/student/Ashoka.png')}
                style={{width: wp('8%'), height: hp('5%')}}
              />
              <Text style={styles.itemText}>{item.title}</Text>
            </View>
            <Text style={styles.subtitleText}>{item.subtitle}</Text>
            <View style={styles.buttonWrapper}>
              <LinearGradient
                colors={item.borderTopColors}
                style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleCardSelect(item.id)}>
                  <Text style={styles.buttonText}>Explore More</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </LinearGradient>
        </View>
      </View>
    </>
  );
  return (
    <>
      <View style={styles.container}>
        <CustomHeader
          title={'Student Corners'}
          icon={require('../../../../assets/images/back.png')}
        />
        <ScrollView style={{paddingHorizontal: wp('5%')}}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Search"
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
              style={styles.searchInput}
              placeholderTextColor="#999" // You can customize the placeholder color here
            />
            <Image
              source={require('../../../../assets/images/icons/tabIcon/searchIcon.png')}
              style={styles.searchIcon}
              resizeMode="contain"
            />
          </View>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            contentContainerStyle={styles.listContainer}
            showsHorizontalScrollIndicator={false}
          />
          <TabMenu selectedCard={selectedCard} />
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingTop: hp('2.5%'),
  },
  inputContainer: {
    // flex: 1,
    height: hp('6.75%'),
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.20)',
    borderRadius: wp('4.5%'),
    position: 'relative',
    margin: wp('1%'),
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingLeft: wp('5%'),
    color: '#000',
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins',
  },
  searchIcon: {
    position: 'absolute',
    right: 10, // Adjust the right position of the icon
    top: '50%', // Center vertically
    transform: [{translateY: -12}], // Adjust as needed to center the icon
    width: 24,
    height: 24,
  },
  listContainer: {
    paddingHorizontal: wp('1%'),
  },
  cardContainer: {
    width: cardWidth, // Dynamically set width
    marginRight: wp('2%'), // Consistent margins
    marginVertical: hp('2.5%'), // Adjust vertical spacing
  },
  gradientBorder: {
    height: hp('1.5%'), // Height of the gradient border
  },

  itemText: {
    flex: 1,
    fontSize: hp('2%'), // Scaled font size
    color: '#000',
    fontFamily: 'Poppins SemiBold',
  },
  subtitleText: {
    fontSize: hp('1.3%'),
    fontFamily: 'Poppins',
    color: '#5B5B5B',
    maxHeight: hp('10%'), // Limit subtitle height
    overflow: 'hidden', // Hide overflowing text
  },
  cardContainer: {
    width: cardWidth,
    marginHorizontal: wp('2%'),
    marginVertical: hp('2.5%'),
  },
  card: {
    borderBottomLeftRadius: wp('2%'),
    borderBottomRightRadius: wp('2%'),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.11,
    shadowRadius: 5,
    elevation: 2,
    height: cardHeight, // Set fixed height
    marginBottom: hp('1%'),
    overflow: 'hidden', // Ensures no content spills out
  },
  gradientBackground: {
    borderBottomLeftRadius: wp('2%'),
    borderBottomRightRadius: wp('2%'),
    padding: wp('2%'),
    flex: 1, // Allow content to scale proportionally
    justifyContent: 'space-between', // Ensure spacing within the card
  },
  buttonWrapper: {
    justifyContent: 'flex-end', // Push to the bottom
    alignItems: 'flex-end', // Align to the right
    marginTop: hp('2%'),
  },
  buttonContainer: {
    maxWidth: wp('30%'),
    height: hp('5%'),
    padding: wp('2%'),
    borderRadius: wp('2%'),
  },
  buttonText: {
    fontSize: hp('1.5%'),
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Poppins',
  },
  tabMenu: {
    // your existing styles for the tab menu
  },
  tabNames: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButton: {
    marginRight: wp('2%'),
    borderRadius: wp('2%'),
  },
  activeTabButton: {},
  gradientTabButton: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
    height: hp('5%'),
    maxWidth: wp('50%'),
  },
  activeTabText: {
    fontSize: hp('1.6%'),
    color: '#fff', // White text for active tab
    textAlign: 'center',
    fontFamily: 'Poppins SemiBold',
  },
  inactiveTabButton: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.20)', // Gray border for inactive tabs
    backgroundColor: '#fff',
  },
  inactiveTabContent: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
  },
  inactiveTabText: {
    fontSize: hp('1.6%'),
    color: '#000', // Gray text for inactive tab
    textAlign: 'center',
    fontFamily: 'Poppins SemiBold',
  },
  tabContent: {
    // marginTop: 10,
  },
});

export default Corners;
