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
import { useNavigation } from '@react-navigation/native';

const LegalUpdate = () => {
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
        }} // Replace with your background image path
        style={styles.backgroundImage}>
             <View style={styles.overlay} />
        {/* Back Button and Bookmark */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Image
              source={require('../../../../assets/images/back.png')}
              style={{width: 22, height: 22}}
            />
          </TouchableOpacity>
          <TouchableOpacity >
            <Image
              source={require('../../../../assets/images/student/save.png')}
              style={{width: 22, height: 22}}
            />
          </TouchableOpacity>
        </View>

        {/* Category */}
        <View style={{paddingHorizontal: wp('5%'),marginVertical:hp('3%')}}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>Category</Text>
          </View>

          {/* Title */}
          <Text style={[styles.title,{paddingVertical:hp('2%')}]}>
            Secondary school law: dsajirau fdoakdsa
          </Text>
      
        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.court}>Delhi High Court</Text>
          <Text style={styles.date}>Published on Feb 19, 2024</Text>
        </View>
        </View>
      </ImageBackground>

      {/* Main Content */}
      <View style={{marginTop: -hp('6%'),backgroundColor:'#fff',borderTopRightRadius:wp('5%'),borderTopLeftRadius:wp('5%')}}>
      <View style={styles.content}>
        <Text style={styles.paragraph}>
          The Supreme Court has directed all States to fix liability on
          government officers who cause delay in the filing of appeals/cases on
          behalf of the government and thereby cause loss to the public
          exchequer.
        </Text>
        <Text style={styles.paragraph}>
          The Court observed that in many cases, the filing of appeals are
          delayed due to the failure to communicate the decisions to the higher
          authorities in time. Thus, appeals get dismissed by the Courts on the
          grounds of delay, although the subject matter is highly valuable.
        </Text>
        <Text style={styles.readMore}>
          Also Read -{' '}
          <Text style={styles.link}>
            'Pendency Of Criminal Appeals In MP HC Quite High, Early Hearing
            Unlikely' : Supreme Court Suspends Sentence
          </Text>
        </Text>
        <Text style={styles.paragraph}>
          Exasperated with such instances, a bench comprising Justice JB
          Pardiwala and Justice R Mahadevan asked the States to streamline their
          machinery on litigation, fix responsibility on the officers, and
          penalize them for the value of loss caused to the government.
        </Text>
        <Text style={styles.paragraph}>
          Exasperated with such instances, a bench comprising Justice JB
          Pardiwala and Justice R Mahadevan asked the States to streamline their
          machinery on litigation, fix responsibility on the officers, and
          penalize them for the value of loss caused to the government.
        </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black overlay
  },
 
  categoryBadge: {
    backgroundColor: '#1262D2',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily:'Poppins'
  },
  title: {
    fontSize: hp('3%'),
    fontFamily:"Poppins SemiBold",
    color: '#fff',
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  court: {
    fontSize: hp('1.5%'),
    color: '#fff',
    fontFamily:'Poppins'
  },

  date: {
    fontSize: hp('1.5%'),
    color: '#fff',
    fontFamily:'Poppins'
  },
  content: {
    marginVertical: hp('4%'),
    paddingHorizontal:wp('5%')
  },
  paragraph: {
    fontSize: wp('3.5%'),
    color: '#333',
    marginBottom: hp('3%'),
    fontFamily:'Poppins'
  },
  readMore: {
    color: '#333',
    marginBottom: 12,
    fontSize: wp('3.5%'),
    fontFamily:'Poppins'
  },
  link: {
    fontFamily:'Poppins',
    color: '#3366FF',
  },
});

export default LegalUpdate;
