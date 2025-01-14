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
  useDeletePracticeAreaMutation,
  useDeleteSkillMutation,
  useGetAdvocateQuery,
} from '../../../../redux/api/api';
import CustomDeleteModal from '../../../../../shared/CustomDeleteModal';
import { handleError } from '../../../../../shared/authUtils';

const ViewSkill = () => {
  const navigation = useNavigation();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const {data, error, isLoading} = useGetAdvocateQuery();
  // Handle loading state

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  console.log(data.data[0].userSkills);
  // Handle error state
  if (error) {
    console.log("viewskill",error);
    handleError(error);
    showMessage({
      message: `An error occurred: ${error?.message}`,
      type: 'danger',
      titleStyle: {fontFamily: 'Poppins'},
      style: {backgroundColor: 'red'},
    });

    return null;
  }

  const [deleteSkill] = useDeleteSkillMutation();

  const handleDeleteSkill = async () => {
    try {
      const res = await deleteSkill({id: selectedSkillId}).unwrap();
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
  const openDeleteModal = skillId => {
    setSelectedSkillId(skillId);
    setDeleteModalVisible(true);
  };
  return (
    <>
      <CustomHeader
        title={'Skills'}
        icon={require('../../../../../assets/images/back.png')}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        <View style={styles.practiceArea}>
          {data &&
          data.data[0]?.userSkills &&
          data.data[0].userSkills.length > 0 ? (
            <View>
              {data.data[0].userSkills.map((item, index) => (
                <View style={styles.practiceContainer}>
                  <Text key={index} style={styles.practiceItem}>
                    {item.skillName}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => openDeleteModal(item._id)}>
                      <Image
                        source={require('../../../../../assets/images/icons/trash.png')} // Path to the profile image
                        style={{width: 22, height: 22}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.notFoundMessage}>No skills found</Text>
          )}
        </View>
        <CustomDeleteModal
          visible={deleteModalVisible}
          onConfirm={handleDeleteSkill}
          onCancel={() => setDeleteModalVisible(false)}
          title="Skill"
        />
      </KeyboardAwareScrollView>
    </>
  );
};

export default ViewSkill;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingHorizontal: wp('5%'),
  },
  practiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wp('5%'),
    borderRadius: wp('2%'),
    marginRight: wp('1.5%'),
    marginBottom: hp('1.5%'),
    backgroundColor: '#fff',
    width: wp('90%'),
  },
  practiceArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: hp('2%'),
  },
  practiceItem: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins',
    color: '#000',
    fontWeight: '400',
  },
});
