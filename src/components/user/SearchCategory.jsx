import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {useNavigation} from '@react-navigation/native';

const SearchBar = ({searchQuery, setSearchQuery}) => {
  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.searchContainer}>
      <TouchableOpacity onPress={handleGoBack}>
        <Image
          source={require('../../../assets/images/back.png')}
          style={{width: 24, height: 24}}
          resizeMode="contain" // Adjust as needed
        />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          style={styles.searchInput}
          placeholderTextColor="#999" // You can customize the placeholder color here
        />
        <Image
          source={require('../../../assets/images/icons/tabIcon/searchIcon.png')}
          style={styles.searchIcon}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity>
        <Image
          source={require('../../../assets/images/icons/tabIcon/filterIcon.png')}
          style={{width: 30, height: 30}}
          resizeMode="contain" // Adjust as needed
        />
      </TouchableOpacity>
    </View>
  );
};

const SearchCategory = () => {
  const [expanded, setExpanded] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: 'Criminal Law Issues',
      subCategories: [],
    },
    {
      title: 'Civil Law Issues',
      subCategories: [],
    },
    {
      title: 'Family Law Issues',
      subCategories: [
        'Divorce and Separation',
        'Child Custody and Visitation',
        'Alimony and Spousal Support',
        'Child Support Disputes',
        'Adoption and Guardianship',
        'Domestic Violence and Abuse',
        'Paternity Disputes',
        'Prenuptial and Postnuptial Agreements',
      ],
    },
    {
      title: 'Corporate Law Issues',
      subCategories: [],
    },
    {
      title: 'Intellectual Property Law Issues',
      subCategories: [],
    },
  ];

  const toggleExpand = index => {
    setExpanded(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} >
        {categories.map((category, index) => (
          <View key={index}>
            <TouchableOpacity
              style={[
                styles.categoryHeader,
                expanded[index]
                  ? {borderTopLeftRadius: 15, borderTopRightRadius: 15}
                  : {borderRadius: 15},
              ]}
              onPress={() => toggleExpand(index)}>
              <Text style={styles.categoryHeaderText}>{category.title}</Text>

              {expanded[index] ? (
                <Image
                  source={require('../../../assets/images/icons/downArrow.png')}
                  style={{width: 24, height: 24}}
                />
              ) : (
                <Image
                  source={require('../../../assets/images/icons/rightArrow.png')}
                  style={{width: 24, height: 24}}
                />
              )}
            </TouchableOpacity>

            {expanded[index] && (
              <Animated.View style={styles.subCategoryContainer}>
                {category.subCategories.map((subCategory, subIndex) => (
                  <>
                    <Text key={subIndex} style={styles.subCategoryText}>
                      {subCategory}
                    </Text>
                    {subIndex < category.subCategories.length - 1 && (
                      <View style={styles.horizontalLine} />
                    )}
                  </>
                ))}
              </Animated.View>
            )}
          </View>
        ))}
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: '#F3F7FF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    // marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    height: 45, // Adjust the height as needed
    backgroundColor: '#F3F7FF',
    borderWidth: 1,
    borderColor: '#294776',
    borderRadius: 15,
    position: 'relative', // Position relative for the icon
    marginLeft: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingLeft: 20,
    // paddingTop: 12,
    color: '#000',
    fontSize: 14,
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
  categoryHeader: {
    padding: 15,
    backgroundColor: '#E4EEFC',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  categoryHeaderText: {
    fontSize: 16,
    color: '#294776',
    fontWeight: '500',
    fontFamily: 'Poppins',
  },
  subCategoryContainer: {
    backgroundColor: '#E4EEFC',
    padding: 15,
    marginHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  subCategoryText: {
    fontSize: 14,
    color: '#294776',
    fontFamily: 'Poppins',
    paddingVertical: 2,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: 'rgba(41, 71, 118, 0.20)',
    marginVertical: 8,
  },
});

export default SearchCategory;
