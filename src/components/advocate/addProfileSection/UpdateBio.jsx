import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Formik} from 'formik';
import {showMessage} from 'react-native-flash-message';
import * as Yup from 'yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SelectList} from 'react-native-dropdown-select-list';
import MultiSelect from 'react-native-multiple-select';
import CustomHeader from '../../../../shared/CustomHeader';
import CustomText from '../../../../shared/CustomText';
import CustomButton from '../../../../shared/CustomButton';
import {
  useGetAdvocateQuery,
  useGetPracticeAreaQuery,
  useGetSpecializationQuery,
  useUpdateAdvocateBioMutation,
} from '../../../redux/api/api';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters long'),
  location: Yup.object().shape({
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
  }),

  headLine: Yup.string()
    .min(30, 'Headline must be at least 30 characters long')
    .max(1000, 'Headline must be less than or equal to 1000 characters')
    .optional(),
});

export default UpdateBio = ({navigation}) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [specialization, setSpecialization] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [selectedPracticeArea, setSelectedPracticeArea] = useState([]);

  const {data, error, isLoading: loading} = useGetAdvocateQuery();

  const advocateData = data?.data[0]; // Access the first advocate
  const initialValues = {
    name: advocateData?.name || '',
    email: advocateData?.email || '',
    mobileNumber: advocateData?.mobileNumber || '',
    location: {
      country: advocateData?.location?.country || '',
      state: advocateData?.location?.state || '',
      city: advocateData?.location?.city || '',
    },

    headLine: advocateData?.headLine || '',

    total_cases:
      advocateData?.total_cases != null ? String(advocateData.total_cases) : '',
    experience_year:
      advocateData?.experience_year != null
        ? String(advocateData.experience_year)
        : '',
  };

  useEffect(() => {
    if (data && data.data[0] && specializationData?.data) {
      const selectedIds = data.data[0].specialization
        .map(spec => {
          const normalizedSpecName = spec.name.trim().toLowerCase();
          const match = specializationData.data.find(
            item => item.name.trim().toLowerCase() === normalizedSpecName,
          );
          console.log(
            'Mapping specialization:',
            spec,
            '=> Found:',
            match ? match._id : 'No Match',
          );
          return match ? match._id : null;
        })
        .filter(Boolean);
      console.log('selectedIds', selectedIds);
      setSpecialization(selectedIds || []);
    }
  }, [data, specializationData]);

  // console.log("practiceAreaData",practiceAreaData)
  useEffect(() => {
    if (data && data.data[0] && practiceAreaData?.data) {
      const selectedIds = data.data[0].userPracticeAreas
        .map(spec => {
          const normalizedSpecName = spec.name.trim().toLowerCase();
          const match = practiceAreaData.data.find(
            item => item.name.trim().toLowerCase() === normalizedSpecName,
          );
          console.log(
            'Mapping practice Area:',
            spec,
            '=> Found:',
            match ? match._id : 'No Match',
          );
          return match ? match._id : null;
        })
        .filter(Boolean);
      console.log('selectedIds', selectedIds);
      setSelectedPracticeArea(selectedIds || []);
    }
  }, [data, practiceAreaData]);

  useEffect(() => {
    if (data && data.data[0]?.language) {
      // Check if language is already an array
      const parsedLanguages = Array.isArray(data.data[0].language)
        ? data.data[0].language
        : JSON.parse(data.data[0].language);

      // Map language names to their corresponding IDs
      const languageIds = parsedLanguages.map(
        lang => language.find(item => item.name === lang)?.id,
      );

      setSelectedLanguage(languageIds.filter(Boolean) || []);
    }
  }, [data, language]);

  // Handle loading state
  if (loading && specializationLoading && practiceAreaLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    console.log(error);
    return <Text>An error occurred: {error.message}</Text>;
  }

  if (specializationError) {
    return (
      <Text>
        An error occurred while fetching specializations:{' '}
        {specializationError.message}
      </Text>
    );
  }
  if (practiceAreaError) {
    return (
      <Text>
        An error occurred while fetching specializations:{' '}
        {practiceAreaError.message}
      </Text>
    );
  }

  const [updateAdvocateBio, {isLoading}] = useUpdateAdvocateBioMutation();

  const {
    data: specializationData,
    isLoading: specializationLoading,
    error: specializationError,
  } = useGetSpecializationQuery();

  const {
    data: practiceAreaData,
    isLoading: practiceAreaLoading,
    error: practiceAreaError,
  } = useGetPracticeAreaQuery();
  //   console.log(specializationData);

  const practiceItems =
    practiceAreaData?.data?.map(item => ({
      id: item._id,
      name: item.name,
    })) || [];

  console.log('practiceArea', practiceItems);

  const specialisationItems =
    specializationData?.data?.map(item => ({
      id: item._id,
      name: item.name,
    })) || [];
  console.log(specialisationItems);
  useEffect(() => {
    const fetchedCountries = [{key: 'IN', value: 'India'}];

    const fetchedStates = [
      {key: 'MH', value: 'Maharashtra'},
      {key: 'DL', value: 'Delhi'},
      {key: 'UP', value: 'Uttar Pradesh'},
      {key: 'KA', value: 'Karnataka'},
    ];

    const fetchedCities = [
      {key: 'MUM', value: 'Mumbai'},
      {key: 'DEL', value: 'New Delhi'},
      {key: 'BLR', value: 'Bangalore'},
      {key: 'LKO', value: 'Lucknow'},
      {key: 'PUN', value: 'Pune'},
    ];

    setCountries(fetchedCountries);
    setStates(fetchedStates);
    setCities(fetchedCities);
  }, []);

  const language = [
    {id: '1', name: 'Hindi'},
    {id: '2', name: 'English'},
  ];
  const languageIdToName = language.reduce((acc, item) => {
    acc[item.id] = item.name;
    return acc;
  }, {});
  return (
    <>
      <CustomHeader
        title={'Edit Your Profile'}
        icon={require('../../../../assets/images/back.png')}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Header */}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, {setSubmitting}) => {
            console.log('onSubmit triggered with values:', values);
            const languages = values.language.map(id => languageIdToName[id]);

            setSubmitting(true);
            try {
              const updateData = {
                name: values.name,
                location: values.location,
                practiceArea: selectedPracticeArea,
                total_cases: values.total_cases,
                experience_year: values.experience_year,
                language: languages,
                specialization: specialization,
                ...(values.headLine && {headLine: values.headLine}), // Include headLine only if it has a value
              };
              console.log(updateData);
              const res = await updateAdvocateBio(updateData);
              console.log(res);
              if (res && res?.data.success) {
                showMessage({
                  message: 'Success',
                  description: res?.data?.message,
                  type: 'success',
                  titleStyle: {fontFamily: 'Poppins SemiBold'},
                  textStyle: {fontFamily: 'Poppins'},
                });
              } else {
                const errorMsg =
                  res.error?.data?.message || 'Something went wrong!';
                showMessage({
                  message: 'Error',
                  description: errorMsg,
                  type: 'danger',
                  titleStyle: {fontFamily: 'Poppins SemiBold'},
                  textStyle: {fontFamily: 'Poppins'},
                });
              }
            } catch (error) {
              console.error('Submission error: ', error);
              const errorMsg =
                error?.response?.data?.error?.data?.message ||
                'Something went wrong!';
              showMessage({
                message: 'Error',
                description: errorMsg,
                type: 'danger',
                titleStyle: {fontFamily: 'Poppins SemiBold'},
                textStyle: {fontFamily: 'Poppins'},
              });
            } finally {
              setSubmitting(false); // Ensure this is always called
            }
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            setFieldValue,
            touched,
          }) => (
            <View>
              {/* Editable Fields for Name and Email */}
              <Text style={styles.inputLabel}>Name</Text>
              <CustomText
                placeholder="Enter Your Name Here"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                inputStyle={{fontFamily: 'Poppins', fontSize: 14}}
                placeholderTextStyle={{color: '#7F7F80'}}
                keyboardType="default"
                error={touched.name && errors.name}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
              <Text style={styles.inputLabel}>Email</Text>
              <CustomText
                placeholder="Enter Email"
                value={values.email}
                // onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                inputStyle={{fontFamily: 'Poppins', fontSize: 14}}
                placeholderTextStyle={{color: '#7F7F80'}}
                keyboardType="email-address"
              />
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <CustomText
                placeholder="Enter Mobile Number"
                value={values.mobileNumber}
                // onChangeText={handleChange('email')}
                onBlur={handleBlur('mobileNumber')}
                inputStyle={{fontFamily: 'Poppins', fontSize: 14}}
                placeholderTextStyle={{color: '#7F7F80'}}
                keyboardType="number"
              />
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Country</Text>
                <SelectList
                  setSelected={val => setFieldValue('location.country', val)}
                  data={countries}
                  defaultOption={{
                    key: initialValues.location.country,
                    value: initialValues.location.country,
                  }}
                  placeholder="Select a country"
                  onBlur={handleBlur('location.country')}
                  fontFamily="Poppins"
                  save="value"
                  inputStyles={{color: '#8E8E8E'}}
                  boxStyles={styles.dropdown}
                  dropdownStyles={styles.dropdownBox}
                  dropdownTextStyles={styles.dropdownText}
                />
                {touched?.location && errors?.location?.country && (
                  <Text style={styles.errorText}>
                    {errors.location.country}
                  </Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>State</Text>
                <SelectList
                  setSelected={val => setFieldValue('location.state', val)}
                  data={states}
                  defaultOption={{
                    key: initialValues.location.state,
                    value: initialValues.location.state,
                  }}
                  placeholder="Select a state"
                  onBlur={handleBlur('location.state')}
                  fontFamily="Poppins"
                  save="value"
                  inputStyles={{color: '#8E8E8E'}}
                  boxStyles={styles.dropdown}
                  dropdownStyles={styles.dropdownBox}
                  dropdownTextStyles={styles.dropdownText}
                />
                {touched?.location && errors?.location?.state && (
                  <Text style={styles.errorText}>{errors.location.state}</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>City</Text>
                <SelectList
                  setSelected={val => setFieldValue('location.city', val)}
                  data={cities}
                  defaultOption={{
                    key: initialValues.location.city,
                    value: initialValues.location.city,
                  }}
                  placeholder="Select a city"
                  onBlur={handleBlur('location.city')}
                  fontFamily="Poppins"
                  save="value"
                  inputStyles={{color: '#8E8E8E'}}
                  boxStyles={styles.dropdown}
                  dropdownStyles={styles.dropdownBox}
                  dropdownTextStyles={styles.dropdownText}
                />
                {touched?.location && errors?.location?.city && (
                  <Text style={styles.errorText}>{errors.location.city}</Text>
                )}
              </View>
              <Text style={styles.inputLabel}>No Of Cases</Text>
              <CustomText
                placeholder="Enter Answer"
                value={values.total_cases}
                onChangeText={handleChange('total_cases')}
                onBlur={handleBlur('total_cases')}
                inputStyle={{fontFamily: 'Poppins', fontSize: 14}}
                placeholderTextStyle={{color: '#7F7F80'}}
                keyboardType="number"
              />
              <Text style={styles.inputLabel}>Total Year Experience</Text>
              <CustomText
                placeholder="Enter Answer"
                value={values.experience_year}
                onChangeText={handleChange('experience_year')}
                onBlur={handleBlur('experience_year')}
                inputStyle={{fontFamily: 'Poppins', fontSize: 14}}
                placeholderTextStyle={{color: '#7F7F80'}}
                keyboardType="number"
              />
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Headline</Text>

                <TextInput
                  placeholder="Enter Answer"
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: '#E1EBFF',
                    fontFamily: 'Poppins',
                  }}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={values.headLine}
                  onChangeText={handleChange('headLine')}
                  onBlur={handleBlur('headLine')}
                />
                {touched?.headLine && errors?.headLine && (
                  <Text style={styles.errorText}>{errors.headLine}</Text>
                )}
              </View>
              <Text style={styles.inputLabel}>Specialization</Text>
              {/* <MultiSelect
                hideTags
                items={specialisationItems}
                uniqueKey="id"
                onSelectedItemsChange={val => {
                  setSpecialization(val);
                  setFieldValue('specialization', val);
                }}
                selectedItems={specialization || []}
                selectText="Select Specialization"
                searchInputPlaceholderText="Search Items..."
                altFontFamily="Poppins"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{
                  color: '#000',
                  fontFamily: 'Poppins',
                }}
                // submitButtonColor="#000"
                submitButtonText=""
                hideSubmitButton={true}
                styleInputGroup={styles.styleInputGroup}
                styleDropdownMenuSubsection={styles.styleDropdownMenuSubsection}
                styleMainWrapper={styles.styleMainWrapper}
                styleItemsContainer={{
                  borderColor: '#fff',
                  backgroundColor: '#E1EBFF',
                  borderRadius: wp('3%'),
                }}
                flatListProps={{
                  renderItem: ({item}) => {
                    const isSelected = specialization.includes(item.id);
                    return (
                      <TouchableOpacity
                        style={[
                          {padding: 10},
                          {backgroundColor: isSelected ? '#E1EBFF' : '#E1EBFF'},
                        ]}
                        onPress={() => {
                          const newSelectedItems = isSelected
                            ? specialization.filter(id => id !== item.id)
                            : [...specialization, item.id];
                          setSpecialization(newSelectedItems);
                          setFieldValue('specialization', newSelectedItems);
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={[
                              styles.itemText,
                              {
                                color: isSelected ? '#17316D' : '#000',
                                fontFamily: 'Poppins',
                              },
                            ]}>
                            {item.name}
                          </Text>
                          {isSelected && (
                            <Image
                              source={require('../../../../assets/images/tick-circle.png')}
                              style={{width: 20, height: 20}}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  },
                }}
              />
              <View style={styles.tabsContainer}>
                {specialization.map(itemId => {
                  const item = specialisationItems.find(i => i.id === itemId);
                  if (!item) return null;
                  return (
                    <View key={item.id} style={styles.tab}>
                      <Text style={styles.tabText}>{item.name}</Text>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => {
                          const updatedItems = specialization.filter(
                            id => id !== itemId,
                          );
                          setSpecialization(updatedItems);
                          setFieldValue('specialisations', updatedItems);
                        }}>
                        <Text style={styles.removeButtonText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View> */}
              <MultiSelect
                hideTags
                items={specialisationItems}
                uniqueKey="id"
                onSelectedItemsChange={val => {
                  setSpecialization(val);
                  setFieldValue('specialization', val);
                }}
                selectedItems={specialization || []}
                selectText="Select Specialization"
                searchInputPlaceholderText="Search Items..."
                altFontFamily="Poppins"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{
                  color: '#000',
                  fontFamily: 'Poppins',
                }}
                hideSubmitButton={true}
                styleInputGroup={styles.styleInputGroup}
                styleDropdownMenuSubsection={styles.styleDropdownMenuSubsection}
                styleMainWrapper={styles.styleMainWrapper}
                styleItemsContainer={{
                  borderColor: '#fff',
                  backgroundColor: '#E1EBFF',
                  borderRadius: wp('3%'),
                }}
                flatListProps={{
                  renderItem: ({item}) => {
                    const isSelected = specialization.includes(item.id);
                    return (
                      <TouchableOpacity
                        style={[
                          {padding: 10},
                          {backgroundColor: isSelected ? '#E1EBFF' : '#E1EBFF'},
                        ]}
                        onPress={() => {
                          const newSelectedItems = isSelected
                            ? specialization.filter(id => id !== item.id)
                            : [...specialization, item.id];
                          setSpecialization(newSelectedItems);
                          setFieldValue('specialization', newSelectedItems);
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={[
                              styles.itemText,
                              {
                                color: isSelected ? '#17316D' : '#000',
                                fontFamily: 'Poppins',
                              },
                            ]}>
                            {item.name}
                          </Text>
                          {isSelected && (
                            <Image
                              source={require('../../../../assets/images/tick-circle.png')}
                              style={{width: 20, height: 20}}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  },
                }}
              />
              <View style={styles.tabsContainer}>
                {specialization?.map(itemId => {
                  const item = specialisationItems.find(i => i.id === itemId);
                  if (!item) return null;
                  return (
                    <View key={item.id} style={styles.tab}>
                      <Text style={styles.tabText}>{item.name}</Text>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => {
                          const updatedItems = specialization.filter(
                            id => id !== itemId,
                          );
                          setSpecialization(updatedItems);
                          setFieldValue('specialisation', updatedItems);
                        }}>
                        <Text style={styles.removeButtonText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>

              <View>
                <Text style={styles.inputLabel}>Languages</Text>

                <MultiSelect
                  hideTags
                  items={language}
                  uniqueKey="id"
                  onSelectedItemsChange={newSelectedItems => {
                    setSelectedLanguage(newSelectedItems);
                    setFieldValue('language', newSelectedItems);
                  }}
                  selectedItems={selectedLanguage}
                  selectText="Select Your Language"
                  searchInputPlaceholderText="Search Items..."
                  altFontFamily="Poppins"
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="name"
                  submitButtonColor="#000"
                  hideSubmitButton={true}
                  searchInputStyle={{
                    color: '#000',
                    fontFamily: 'Poppins',
                  }}
                  // submitButtonColor="#000"
                  submitButtonText=""
                  styleInputGroup={styles.styleInputGroup}
                  styleDropdownMenuSubsection={
                    styles.styleDropdownMenuSubsection
                  }
                  styleMainWrapper={styles.styleMainWrapper}
                  styleItemsContainer={{
                    borderColor: '#fff',
                    backgroundColor: '#E1EBFF',
                    borderRadius: wp('3%'),
                  }}
                  flatListProps={{
                    renderItem: ({item}) => {
                      const isSelected = selectedLanguage.includes(item.id);
                      return (
                        <TouchableOpacity
                          style={[
                            {padding: 10},
                            {
                              backgroundColor: isSelected
                                ? '#E1EBFF'
                                : '#E1EBFF',
                            },
                          ]}
                          onPress={() => {
                            const newSelectedItems = isSelected
                              ? selectedLanguage.filter(id => id !== item.id)
                              : [...selectedLanguage, item.id];
                            setSelectedLanguage(newSelectedItems);
                            setFieldValue('language', newSelectedItems);
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={[
                                styles.itemText,
                                {
                                  color: isSelected ? '#17316D' : '#000',
                                  fontFamily: 'Poppins',
                                },
                              ]}>
                              {item.name}
                            </Text>
                            {isSelected && (
                              <Image
                                source={require('../../../../assets/images/tick-circle.png')}
                                style={{width: 20, height: 20}}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    },
                  }}
                />
                <View style={styles.tabsContainer}>
                  {selectedLanguage.map(itemId => {
                    const item = language.find(i => i.id === itemId);
                    if (!item) return null;
                    return (
                      <View key={item.id} style={styles.tab}>
                        <Text style={styles.tabText}>{item.name}</Text>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => {
                            const updatedItems = selectedLanguage.filter(
                              id => id !== itemId,
                            );
                            setSelectedLanguage(updatedItems);
                            setFieldValue('language', updatedItems);
                          }}>
                          <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
              <View>
                <Text style={styles.inputLabel}>Practice Area</Text>
                <MultiSelect
                  hideTags
                  items={practiceItems}
                  uniqueKey="id"
                  onSelectedItemsChange={val => {
                    setSelectedPracticeArea(val);
                    setFieldValue('practiceArea', val);
                  }}
                  selectedItems={selectedPracticeArea || []}
                  selectText="Select Practice Area"
                  searchInputPlaceholderText="Search Items..."
                  altFontFamily="Poppins"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="name"
                  searchInputStyle={{
                    color: '#000',
                    fontFamily: 'Poppins',
                  }}
                  // submitButtonColor="#000"
                  submitButtonText=""
                  hideSubmitButton={true}
                  styleInputGroup={styles.styleInputGroup}
                  styleDropdownMenuSubsection={
                    styles.styleDropdownMenuSubsection
                  }
                  styleMainWrapper={styles.styleMainWrapper}
                  styleItemsContainer={{
                    borderColor: '#fff',
                    backgroundColor: '#E1EBFF',
                    borderRadius: wp('3%'),
                  }}
                  flatListProps={{
                    renderItem: ({item}) => {
                      const isSelected = selectedPracticeArea.includes(item.id);
                      return (
                        <TouchableOpacity
                          style={[
                            {padding: 10},
                            {
                              backgroundColor: isSelected
                                ? '#E1EBFF'
                                : '#E1EBFF',
                            },
                          ]}
                          onPress={() => {
                            const newSelectedItems = isSelected
                              ? selectedPracticeArea.filter(
                                  id => id !== item.id,
                                )
                              : [...selectedPracticeArea, item.id];
                            setSelectedPracticeArea(newSelectedItems);
                            setFieldValue('practiceArea', newSelectedItems);
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={[
                                styles.itemText,
                                {
                                  color: isSelected ? '#17316D' : '#000',
                                  fontFamily: 'Poppins',
                                },
                              ]}>
                              {item.name}
                            </Text>
                            {isSelected && (
                              <Image
                                source={require('../../../../assets/images/tick-circle.png')}
                                style={{width: 20, height: 20}}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    },
                  }}
                />
                <View style={styles.tabsContainer}>
                  {selectedPracticeArea.map(itemId => {
                    const item = practiceItems.find(i => i.id === itemId);
                    if (!item) return null;
                    return (
                      <View key={item.id} style={styles.tab}>
                        <Text style={styles.tabText}>{item.name}</Text>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => {
                            const updatedItems = selectedPracticeArea.filter(
                              id => id !== itemId,
                            );
                            setSelectedPracticeArea(updatedItems);
                            setFieldValue('practiceAreas', updatedItems);
                          }}>
                          <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
              <View style={{marginVertical: hp('3%')}}>
                <CustomButton
                  title="Save"
                  onPress={handleSubmit}
                  loading={isLoading}
                />
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingHorizontal: wp('5%'),
  },

  inputLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
    fontFamily: 'Poppins SemiBold',
  },
  dropdown: {
    // marginVertical: hp('1%'),
    borderColor: '#fff',
    backgroundColor: '#E1EBFF',
    borderRadius: wp('3%'),
  },
  dropdownBox: {
    marginVertical: 2,
    borderColor: '#fff',
    backgroundColor: '#E1EBFF',
    borderRadius: wp('3%'),
  },
  dropdownText: {
    color: '#8E8E8E',
    fontSize: wp('3.73%'),
    fontWeight: '400',
    marginVertical: 2,
  },
  errorText: {
    color: 'red',
    marginBottom: hp('1.5%'),
    fontFamily: 'Poppins',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: hp('1.5%'),
  },
  input: {
    height: 48,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#E1EBFF',
    fontFamily: 'Poppins',
  },
  customButton: {
    backgroundColor: '#007BFF', // Customize the button color
    padding: 10,
    borderRadius: wp('2%'),
    alignItems: 'center',
    width: wp('40%'),
    backgroundColor: '#E1EBFF',
  },
  buttonText: {
    color: '#7F7F80', // Text color
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  styleDropdownMenu: {
    borderWidth: 0, // Remove underline from dropdown menu
    backgroundColor: '#E1EBFF',
    borderRadius: wp('3%'),
  },
  styleInputGroup: {
    borderWidth: 0,
    borderBottomWidth: 0,
    borderRadius: wp('3%'),
    backgroundColor: '#E1EBFF',
  },
  styleDropdownMenuSubsection: {
    borderWidth: 0, // Remove underline from dropdown menu subsection
    borderBottomWidth: 0,
    backgroundColor: '#E1EBFF',
    borderRadius: wp('3%'),
  },
  styleMainWrapper: {
    borderColor: '#fff',
    backgroundColor: '#E1EBFF',
    borderRadius: wp('3%'),
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tab: {
    // backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 5,
    marginTop: 3,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    color: '#000',
    fontSize: 13,
    fontFamily: 'Poppins',
  },
  removeButton: {
    marginLeft: 5,
    padding: 5,
    marginTop: -5,
    borderRadius: 10,
  },
  removeButtonText: {
    fontSize: 16,
    color: '#000',
  },
});
