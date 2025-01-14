import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import StarRating from '../../../../shared/StarRating';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const LegalDictionary = () => {
    const navigation=useNavigation();
  const [searchMode, setSearchMode] = useState('term');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const dictionaryData = [
    {
      id: '1',
      term: 'a fortiori',
      definition:
        '(ah-for-she-ory) Latin for "with even stronger reason," which applies to a situation in which if one thing is true then it can be inferred that a second thing is even more certainly true...',
    },
    {
      id: '2',
      term: 'ab initio',
      definition:
        'Latin for "from the beginning," used to indicate that something is considered invalid from the outset.',
    },
  ];

  const articles = [
    {
      id: 1,
      title: 'Secondary school law: dsajirua fdoakdsa',
      description:
        "In today's digital age, cybersecurity has become a critical concern for ...",
      author: 'Ankush Gupta',
      date: 'Feb 28, 2024',
      category: 'Category',
      views: '1.5k',
    },
    {
      id: 2,
      title: 'Example Title 2',
      description: 'Short description for the second article...',
      author: 'Author Name',
      date: 'Feb 20, 2024',
      category: 'Category',
      views: '2.1k',
    },
  ];

  const handleSearch = () => {
    setLoading(true);
    const filteredResults = dictionaryData.filter(item =>
      searchMode === 'term'
        ? item.term.toLowerCase().includes(searchQuery.toLowerCase())
        : item.definition.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setTimeout(() => {
      setResults(filteredResults);
      setLoading(false);
    }, 500);
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Legal Dictionary</Text>
      <View style={styles.radioGroup}>
        {/* Radio Button for 'Search Legal Term' */}
        <TouchableOpacity
          style={[styles.radioOptionContainer, {marginRight: wp('3%')}]}
          onPress={() => setSearchMode('term')}>
          <View style={styles.radioButton}>
            {searchMode === 'term' && <View style={styles.radioSelected} />}
          </View>
          <Text
            style={[
              styles.radioOption,
              searchMode === 'term' && styles.radioOptionSelected,
            ]}>
            Search Legal Term
          </Text>
        </TouchableOpacity>

        {/* Radio Button for 'Search Definition' */}
        <TouchableOpacity
          style={styles.radioOptionContainer}
          onPress={() => setSearchMode('definition')}>
          <View style={styles.radioButton}>
            {searchMode === 'definition' && (
              <View style={styles.radioSelected} />
            )}
          </View>
          <Text
            style={[
              styles.radioOption,
              searchMode === 'definition' && styles.radioOptionSelected,
            ]}>
            Search Definition
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={
            searchMode === 'term'
              ? 'Type a legal term...'
              : 'Type a definition...'
          }
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Find</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Searching...</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.definitionContainer}>
              <Text style={styles.termTitle}>{item.term}</Text>
              <Text style={styles.definition}>{item.definition}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View
              style={{
                backgroundColor: '#E4EEFC',
                padding: hp('1%'),
                borderRadius: hp('1%'),
              }}>
              <Text style={styles.noResultsText}>
                No results found. Try another search!
              </Text>
            </View>
          }
        />
      )}

      {/* Articles Section */}
      <View style={{paddingVertical: hp('2%')}}>
        <Text style={styles.sectionTitle}>
          Connect with Advocates Through Their Articles
        </Text>
        <FlatList
          data={articles}
          showsHorizontalScrollIndicator={false}
          horizontal
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <LinearGradient colors={['#1262D2', '#17316D']}  start={{x: 0, y: 0}}
            end={{x: 1, y: 0}} style={styles.articleCard}>
            <TouchableOpacity  onPress={()=>navigation.navigate("Articles")}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.imagePlaceholder} />
                <View style={{maxWidth: wp('37%'), marginLeft: wp('2%')}}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.category}>{item.category}</Text>
                    <View style={{flexDirection:'row'}}>
                    <Image
                    source={
                      require("../../../../assets/images/student/whiteEye.png")
                    }
                    style={{width:15,height:15,marginRight:wp('1%')}}
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
                  <StarRating rating={5} starSize={12} marginVertical={hp(0)} />
                  </View>
                </View>
                <View style={{ alignItems: 'center',marginTop:hp('1%')}}>
                <Text style={styles.date}>Published on </Text>
                <Text style={styles.date}>{item.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
            </LinearGradient>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
  },
  radioGroup: {
    flexDirection: 'row',
    marginVertical: hp('1%'),
  },
  radioOptionContainer: {flexDirection: 'row', alignItems: 'center'},
  radioButton: {
    height: 12,
    width: 12,
    borderRadius: wp('5%'),
    borderWidth: 1,
    borderColor: '#1262D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioSelected: {
    height: 8,
    width: 8,
    borderRadius: 6,
    backgroundColor: '#1262D2',
  },
  radioOption: {fontSize: hp('1.5%'), fontFamily: 'Poppins'},
  radioOptionSelected: {
    color: '#1262D2',
    fontFamily: 'Poppins',
    fontSize: hp('1.5%'),
  },
  searchContainer: {flexDirection: 'row', marginVertical: 10},
  searchInput: {
    flex: 1,
    padding: hp('1%'),
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('1.5%'),
    borderBottomLeftRadius: wp('1.5%'),
    fontFamily: 'Poppins',
    fontSize: hp('1.7%'),
  },
  searchButton: {
    backgroundColor: '#D9D9D9',
    padding: hp('1.5%'),
    borderTopRightRadius: wp('1.5%'),
    borderBottomRightRadius: wp('1.5%'),
  },
  searchButtonText: {
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: hp('1.6%'),
  },
  loadingText: {textAlign: 'center', marginVertical: 10},
  noResultsText: {
    textAlign: 'center',
    marginVertical: hp('1%'),
    fontFamily: 'Poppins',
    fontSize: hp('1.5%'),
  },
  definitionContainer: {
    backgroundColor: '#E4EEFC',
    padding: hp('1.2%'),
    borderRadius: hp('1%'),
  },
  termTitle: {fontFamily: 'Poppins SemiBold', fontSize: hp('2%')},
  definition: {
    marginTop: hp('1.2%'),
    fontFamily: 'Poppins',
    fontSize: hp('1.6%'),
  },
  articleCard: {
    // backgroundColor: '#24477F',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    marginRight: 16,
    width: wp('75%'),
    
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  category: {
    backgroundColor: '#DEEEFF',
    color: '#1D7FFF',
    fontSize: hp('1.4%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('5%'),
    fontFamily:'Poppins'
  },
  views: {
    fontSize: hp('1.4%'),
    color: '#FFF',
    fontFamily:'Poppins'
  },
  articleTitle: {
    fontSize: hp('1.5%'),
    fontFamily: 'Poppins SemiBold',
    color: '#FFF',
  },
  articleDescription: {
    fontSize: hp('1.3%'),
    fontFamily: 'Poppins',
    color: '#DEF1FF',
    // marginBottom: 8,
  },
  cardFooter: {
    marginTop: hp('1%'),
    flexDirection:'row',
    justifyContent:'space-between'
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
    color: '#FFF',
  },
  date: {
    fontSize: hp('1.5%'),
    color: '#FFF',
    fontFamily:'Poppins'
  },
  imagePlaceholder: {
    width: wp('28%'),
    height: hp('15%'),
    borderRadius: 10,
    backgroundColor: '#D3D3D3',
    // marginBottom: hp('2%'),
  },
});

export default LegalDictionary;
