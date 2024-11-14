import React, {useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import CustomHeader from '../../../../../shared/CustomHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  useDeleteExperienceMutation,
  useGetAdvocateQuery,
} from '../../../../redux/api/api';
import CustomDeleteModal from '../../../../../shared/CustomDeleteModal';

const ViewAllEducation = () => {
  const navigation = useNavigation();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);
  const {data, error, isLoading} = useGetAdvocateQuery();
  // Handle loading state

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle error state
  if (error) {
    console.log(error);
    // Show the flash message
    showMessage({
      message: `An error occurred: ${error.message}`,
      type: 'danger',
      titleStyle: {fontFamily: 'Poppins'},
      style: {backgroundColor: 'red'},
    });

    return null;
  }

  const [deleteExperience] = useDeleteExperienceMutation();

  const handleDeleteExperience = async () => {
    try {
      const res = await deleteExperience({id: selectedExperienceId}).unwrap();
      console.log(res);

      if (res && res?.success) {
        showMessage({
          message: 'Success',
          description: res.message,
          type: 'success',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
      } else {
        const errorMsg = res.error?.data?.message || 'Something went wrong!';
        showMessage({
          message: 'Error',
          description: errorMsg,
          type: 'danger',
          titleStyle: {fontFamily: 'Poppins SemiBold'},
          textStyle: {fontFamily: 'Poppins'},
        });
      }
    } catch (error) {
      console.error('Failed to delete profile picture: ', error);
      const errorMsg =
        error?.response?.data?.error?.data?.message || 'Something went wrong!';
      showMessage({
        message: 'Error',
        description: errorMsg,
        type: 'danger',
        titleStyle: {fontFamily: 'Poppins SemiBold'},
        textStyle: {fontFamily: 'Poppins'},
      });
    } finally {
      setDeleteModalVisible(false);
    }
  };

  // Function to open delete modal with the specific experience ID
  const openDeleteModal = experienceId => {
    setSelectedExperienceId(experienceId);
    setDeleteModalVisible(true);
  };
  return (
    <>
      <CustomHeader
        title={'Experience'}
        icon={require('../../../../../assets/images/back.png')}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        {renderEducations(
          data && data?.data[0]?.educations,
          navigation,
          openDeleteModal,
        )}
        <CustomDeleteModal
          visible={deleteModalVisible}
          onConfirm={handleDeleteExperience}
          onCancel={() => setDeleteModalVisible(false)}
          title="Experience"
        />
      </KeyboardAwareScrollView>
    </>
  );
};
const renderEducations = (educations, navigation, openDeleteModal) => {
  if (!educations || educations.length === 0) {
    return <Text style={styles.noExperienceMessage}>No education added</Text>;
  }
  function formatDate(dateString) {
    // Create a new Date object from the date string
    const date = new Date(dateString);

    // Define options for formatting
    const options = {year: 'numeric', month: 'long', day: 'numeric'};

    // Format the date using toLocaleDateString
    return date.toLocaleDateString('en-US', options);
  }
  // Create a shallow copy and sort by createdAt (newest first)
  const sortedEducations = [...educations].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return sortedEducations.map((education, index) => {
    const {
      _id,
      school_university,
      degreeType,
      fieldOfStudy,
      startDate,
      endDate,
      isOngoing,
      activities,
      description,
    } = education;

    // Format the dates
    const formattedStartDate = `${formatDate(startDate)}`;

    const formattedEndDate = isOngoing ? 'Present' : `${formatDate(endDate)}`;

    return (
      <View key={_id} style={styles.experienceItem}>
        <Text style={styles.experiencePeriod}>
          {formattedStartDate} - {formattedEndDate}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{marginRight: 5}}
            onPress={() => navigation.navigate('EditEducation', {id: _id})}>
            <Image
              source={require('../../../../../assets/images/icons/edit.png')} // Path to the profile image
              style={{width: 22, height: 22}}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openDeleteModal(_id)}>
            <Image
              source={require('../../../../../assets/images/icons/trash.png')} // Path to the profile image
              style={{width: 22, height: 22}}
            />
          </TouchableOpacity>
        </View>
        {/* Display education details */}
        <Text style={styles.experienceTitle}>
          {degreeType} in {fieldOfStudy}, {school_university}
        </Text>

        <Text style={styles.experienceDetail}>
          Studied {fieldOfStudy}, with a focus on {degreeType}. Activities:{' '}
          {activities}
        </Text>
      </View>
    );
  });
};

export default ViewAllEducation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingHorizontal: wp('5%'),
  },
  experienceItem: {
    backgroundColor: '#fff',
    padding: wp('4.5%'),
    borderRadius: wp('4%'),
    marginBottom: hp('1%'),
  },
  experienceTitle: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
  },
  experiencePeriod: {
    fontSize: wp('4%'),
    color: '#000',
    fontFamily: 'Poppins SemiBold',
    // fontWeight:'600',
    marginVertical: 5,
  },
  experienceDetail: {
    fontSize: wp('3.5%'),
    color: '#636363',
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
});
