import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Formik, FieldArray} from 'formik';
import Icon from 'react-native-vector-icons/Ionicons';
import {showMessage} from 'react-native-flash-message';
import * as Yup from 'yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Avatar, Rating, Button} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SelectList} from 'react-native-dropdown-select-list';
import Collapsible from 'react-native-collapsible';
import MultiSelect from 'react-native-multiple-select';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomHeader from '../../../shared/CustomHeader';
import CustomText from '../../../shared/CustomText';
import CustomButton from '../../../shared/CustomButton';
import {
  useAdvocateCertificateMutation,
  useAdvocateEducationMutation,
  useAdvocateExperienceMutation,
  useAdvocatePracticeAreaMutation,
  useAdvocateSkillMutation,
  useGetAdvocateQuery,
  useGetSpecializationQuery,
  useUpdateAdvocateBioMutation,
} from '../../redux/api/api';
import { handleError } from '../../../shared/authUtils';

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
  // isProfileVisible: Yup.string().required(),
  // headLine: Yup.string().optional(),
  headLine: Yup.string()
    .min(30, 'Headline must be at least 30 characters long')
    .max(1000, 'Headline must be less than or equal to 1000 characters')
    .optional(),
});

const experienceValidationSchema = Yup.object().shape({
  jobTitle: Yup.string().required('Job title is required'),
  firmName: Yup.string().required('Firm name is required'),
});

const educationValidationSchema = Yup.object().shape({
  school_university: Yup.string().required('School / University is required'),
});

const skillValidationSchema = Yup.object().shape({
  skillName: Yup.string().required('Skill is required'),
});
const practiceAreaValidationSchema = Yup.object().shape({
  practiceArea: Yup.string().required('Practice Area is required'),
});

const certificateValidationSchema = Yup.object().shape({
  firmName: Yup.string().required('Company name is required'),
});

export default AdvocateProfile = ({navigation}) => {
  const [sections, setSections] = useState({
    bio: true,
    experience: true,
    certificate: true,
    practiceAreas: true,
    specialization: true,
    educationalDetails: true,
    skills: true,
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [datePickerVisible, setDatePickerVisible] = useState([]);
  const [date, setDate] = useState([]);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const [specialization, setSpecialization] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  //education state
  const [educationStartDate, setEducationStartDate] = useState([]);
  const [educationEndDate, setEducationEndDate] = useState([]);
  const [educationStartDatePicker, setEducationStartDatePicker] = useState([]);
  const [educationEndDatePicker, setEducationEndDatePicker] = useState([]);

  // certificate state

  const [issueDate, setIssueDate] = useState([]);
  const [issueDatePicker, setIssueDatePicker] = useState([]);

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
    isProfileVisible: advocateData?.isProfileVisible ? 'True' : 'False',
    headLine: advocateData?.headLine || '',
    // total_cases: String(advocateData?.total_cases) || '',
    // experience_year: String(advocateData?.experience_year) || '',
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

  useEffect(() => {
    if (data && data.data[0]?.language) {
      // Check if language is already an array
      const parsedLanguages = Array.isArray(data.data[0].language)
        ? data.data[0].language
        : JSON.parse(data.data[0].language);

      console.log('Parsed Languages:', parsedLanguages); // Should log: ["Hindi"]

      // Map language names to their corresponding IDs
      const languageIds = parsedLanguages.map(
        lang => language.find(item => item.name === lang)?.id,
      );

      console.log('Mapped Language IDs:', languageIds); // Should log the IDs that match ["Hindi"]

      setSelectedLanguage(languageIds.filter(Boolean) || []);
    }
  }, [data]);

  // Handle loading state
  if (loading) {
    return <Text>Loading...</Text>;
  }
  // Check for loading state
  if (specializationLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle error state
  if (error) {
    handleError(error);
    console.log(error);
    return <Text>An error occurred: {error?.message}</Text>;
  }
  console.log(data.data[0].language);
  // Handle error states for both queries
  if (specializationError) {
    return (
      <Text>
        An error occurred while fetching specializations:{' '}
        {specializationError?.message}
      </Text>
    );
  }

  const [updateAdvocateBio, {isLoading}] = useUpdateAdvocateBioMutation();
  const [advocateExperience] = useAdvocateExperienceMutation();
  const [advocateEducation, {isLoading: eduLoading}] =
    useAdvocateEducationMutation();
  const [advocateSkill, {isLoading: skillLoading}] = useAdvocateSkillMutation();

  const [advocatePracticeArea, {isLoading: areaLoading}] =
    useAdvocatePracticeAreaMutation();
  const [advocateCertificate, {isLoading: certificateLoading}] =
    useAdvocateCertificateMutation();

  const {
    data: specializationData,
    isLoading: specializationLoading,
    error: specializationError,
  } = useGetSpecializationQuery();
  // console.log(specializationData);

  const specialisationItems =
    specializationData?.data?.map(item => ({
      id: item._id,
      name: item.name,
    })) || [];

  // console.log(items);

  const jobTitles = [
    {key: '1', value: 'Advocate'},
    {key: '2', value: 'AOR'},
    {key: '3', value: 'Senior Advocate'},
    {key: '4', value: 'Advocate General'},
    {key: '5', value: 'Additional Advocate General'},
    {key: '6', value: 'Deputy Advocate General'},
    {key: '7', value: 'Public Prosecutor'},
  ];
  const profileVisible = [
    {key: '1', value: 'True'},
    {key: '2', value: 'False'},
  ];
  // Example data (You might want to replace this with actual API calls)
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

  const toggleSection = section => {
    setSections({...sections, [section]: !sections[section]});
  };

  const booleanMapping = {
    True: true,
    False: false,
  };

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
        icon={require('../../../assets/images/back.png')}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Header */}

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image
            source={
              data && data?.data[0]?.profilePic && data.data[0].profilePic.url
                ? {uri: data.data[0].profilePic.url}
                : require('../../../assets/images/avatar.png')
            } // Path to the profile image
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{initialValues?.name}</Text>

            <View style={styles.starRating}>
              <Text style={styles.stars}>★★★★★</Text>
              <Text style={styles.ratingText}>5/5</Text>
            </View>

            {/* </View> */}
          </View>
        </View>

        {/* Accordion Sections */}
        {renderBioSection(
          initialValues,
          countries,
          states,
          cities,
          profileVisible,
          // handleChange,
          sections.bio,
          isLoading,
          booleanMapping,
          specialisationItems,
          specialization,
          setSpecialization,
          language,
          selectedLanguage,
          setSelectedLanguage,
          languageIdToName,
          updateAdvocateBio,
          () => toggleSection('bio'),
        )}
        {renderExperienceSection(
          profileVisible,
          jobTitles,
          date,
          setDate,
          datePickerVisible,
          setDatePickerVisible,
          endDate,
          setEndDate,
          endDatePickerVisible,
          setEndDatePickerVisible,
          booleanMapping,
          sections.experience,
          advocateExperience,
          () => toggleSection('experience'),
        )}
        {renderCertificateSection(
          issueDate,
          setIssueDate,
          issueDatePicker,
          setIssueDatePicker,
          sections.certificate,
          advocateCertificate,
          certificateLoading,
          () => toggleSection('certificate'),
        )}
        {renderEducationSection(
          profileVisible,
          jobTitles,
          educationStartDate,
          setEducationStartDate,
          educationStartDatePicker,
          setEducationStartDatePicker,
          educationEndDate,
          setEducationEndDate,
          educationEndDatePicker,
          setEducationEndDatePicker,
          booleanMapping,
          sections.educationalDetails,
          advocateEducation,
          eduLoading,
          () => toggleSection('educationalDetails'),
        )}
        {renderSkillSection(sections.skills, advocateSkill, skillLoading, () =>
          toggleSection('skills'),
        )}
        {renderPracticeAreaSection(
          sections.practiceAreas,
          advocatePracticeArea,
          areaLoading,
          () => toggleSection('practiceAreas'),
        )}
      </KeyboardAwareScrollView>
    </>
  );
};

// Accordion Section for Bio (Editable Name and Email)
const renderBioSection = (
  initialValues,
  countries,
  states,
  cities,
  profileVisible,
  // handleChange,
  collapsed,
  isLoading,
  booleanMapping,
  specialisationItems,
  specialization,
  setSpecialization,
  language,
  selectedLanguage,
  setSelectedLanguage,
  languageIdToName,
  updateAdvocateBio,
  onToggle,
) => {
  const [isAccordionCollapsed, setAccordionCollapsed] = useState(collapsed);
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          onToggle();
          setAccordionCollapsed(!isAccordionCollapsed);
        }}
        style={styles.accordionHeader}>
        <Text style={styles.accordionTitle}>Bio</Text>
        {isAccordionCollapsed ? (
          <Image
            source={require('../../../assets/images/icons/arrow-down.png')}
            style={{width: 20, height: 20}}
          />
        ) : (
          <Image
            source={require('../../../assets/images/icons/arrow-up.png')}
            style={{width: 20, height: 20}}
          />
        )}
      </TouchableOpacity>
      <Collapsible collapsed={isAccordionCollapsed}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, {setSubmitting}) => {
            const languages = values.language.map(id => languageIdToName[id]);
            setSubmitting(true);
            try {
              const updateData = {
                name: values.name,
                location: values.location,
                // isProfileVisible: values.isProfileVisible,
                total_cases: values.total_cases,
                experience_year: values.experience_year,
                language: languages,
                specialization: specialization,
                ...(values.headLine && {headLine: values.headLine}), // Include headLine only if it has a value
              };
              const res = await updateAdvocateBio(updateData).unwrap();
              console.log(res);
              if (res && res?.success) {
                showMessage({
                  message: 'Success',
                  description: res?.message,
                  type: 'success',
                  titleStyle: {fontFamily: 'Poppins SemiBold'},
                  textStyle: {fontFamily: 'Poppins'},
                });
                setAccordionCollapsed(true);
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
            <View style={styles.accordionContent}>
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

              {/* <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Profile Visibility</Text>
                <SelectList
                  setSelected={val =>
                    setFieldValue('isProfileVisible', booleanMapping[val])
                  }
                  defaultOption={{
                    key: initialValues.isProfileVisible,
                    value: initialValues.isProfileVisible,
                  }}
                  data={profileVisible}
                  placeholder="Select a option"
                  onBlur={handleBlur('isProfileVisible')}
                  fontFamily="Poppins"
                  save="value"
                  inputStyles={{color: '#8E8E8E'}}
                  boxStyles={styles.dropdown}
                  dropdownStyles={styles.dropdownBox}
                  dropdownTextStyles={styles.dropdownText}
                />
                {errors.isProfileVisible && (
                  <Text style={styles.errorText}>
                    {errors.isProfileVisible}
                  </Text>
                )}
              </View> */}

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Headline</Text>
                {/* <CustomText
                  placeholder="Enter Headline"
                  value={values.headLine}
                  onChangeText={handleChange('headLine')}
                  onBlur={handleBlur('headLine')}
                  inputStyle={{fontFamily: 'Poppins', fontSize: 14}}
                  placeholderTextStyle={{color: '#7F7F80'}}
                  keyboardType="default"
                /> */}
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
              <MultiSelect
                hideTags
                items={specialisationItems}
                uniqueKey="id"
                onSelectedItemsChange={val => {
                  setSpecialization(val);
                  setFieldValue('specialization', val);
                }}
                selectedItems={specialization}
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
                              source={require('../../../assets/images/tick-circle.png')}
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
                          setSelectedSpecialisations(updatedItems);
                          setFieldValue('specialisations', updatedItems);
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
                                source={require('../../../assets/images/tick-circle.png')}
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
      </Collapsible>
    </View>
  );
};

// Accordion Section for Experiences (Dynamic Form)
const renderExperienceSection = (
  profileVisible,
  jobTitles,
  date,
  setDate,
  datePickerVisible,
  setDatePickerVisible,
  endDate,
  setEndDate,
  endDatePickerVisible,
  setEndDatePickerVisible,
  booleanMapping,
  collapsed,
  advocateExperience,
  onToggle,
) => {
  const [isAccordionCollapsed, setAccordionCollapsed] = useState(collapsed);
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          onToggle();
          setAccordionCollapsed(!isAccordionCollapsed);
        }}
        style={styles.accordionHeader}>
        <Text style={styles.accordionTitle}>Experience</Text>
        {isAccordionCollapsed ? (
          <Image
            source={require('../../../assets/images/icons/arrow-down.png')} // Path to the profile image
            style={{width: 20, height: 20}}
          />
        ) : (
          <Image
            source={require('../../../assets/images/icons/arrow-up.png')} // Path to the profile image
            style={{width: 20, height: 20}}
          />
        )}
      </TouchableOpacity>
      <Collapsible collapsed={isAccordionCollapsed}>
        <View style={styles.accordionContent}>
          <Formik
            initialValues={{
              experiences: [
                {
                  jobTitle: '',
                  firmName: '',
                  startDate: null,
                  endDate: null,
                  description: '',
                  isRecent: false,
                  isOngoing: false,
                },
              ],
            }}
            // validationSchema={validationExperience}
            onSubmit={(values, {setSubmitting}) => {
              console.log('values', values);
            }}>
            {({
              handleSubmit,
              values,
              setFieldValue,
              errors,
              touched,
              handleBlur,
              isSubmitting,
            }) => {
              useEffect(() => {
                const newDatePickerVisible = Array(
                  values.experiences.length,
                ).fill(false);
                setDatePickerVisible(newDatePickerVisible);
                setEndDatePickerVisible(newDatePickerVisible);
                setEndDate(Array(values.experiences.length).fill(new Date()));
                setDate(Array(values.experiences.length).fill(new Date()));
              }, [values.experiences.length]);

              return (
                <FieldArray
                  name="experiences"
                  render={arrayHelpers => (
                    <View>
                      {values.experiences && values.experiences.length > 0 ? (
                        values.experiences.map((experience, index) => {
                          return (
                            <View key={index} style={styles.experienceItem}>
                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Job Title</Text>
                                <SelectList
                                  setSelected={val =>
                                    setFieldValue(
                                      `experiences[${index}].jobTitle`,
                                      val,
                                    )
                                  }
                                  data={jobTitles}
                                  placeholder="Select a job title"
                                  onBlur={() =>
                                    handleBlur(`experiences[${index}].jobTitle`)
                                  }
                                  fontFamily="Poppins"
                                  save="value"
                                  inputStyles={{color: '#8E8E8E'}}
                                  boxStyles={styles.dropdown}
                                  dropdownStyles={styles.dropdownBox}
                                  dropdownTextStyles={styles.dropdownText}
                                />
                              </View>
                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Company</Text>
                                <TextInput
                                  placeholder="Enter Company"
                                  style={styles.input}
                                  value={experience.firmName}
                                  onChangeText={value =>
                                    setFieldValue(
                                      `experiences[${index}].firmName`,
                                      value,
                                    )
                                  }
                                />
                                {/* {touched.experiences &&
                                touched.experiences[index]?.firmName &&
                                errors.experiences &&
                                errors.experiences[index]?.firmName && (
                                  <Text style={styles.errorText}>
                                    {errors.experiences[index].firmName}
                                  </Text>
                                )} */}
                              </View>
                              <View style={styles.inputContainer}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                  }}>
                                  <View>
                                    <Text style={styles.inputLabel}>
                                      Start Date
                                    </Text>

                                    <TouchableOpacity
                                      style={styles.customButton} // Custom button style
                                      onPress={() => {
                                        // Only show picker if not collapsed
                                        const newVisibilities = [
                                          ...datePickerVisible,
                                        ];
                                        newVisibilities[index] = true; // Show date picker for this experience
                                        setDatePickerVisible(newVisibilities);
                                      }}>
                                      {experience.startDate === null ? (
                                        <Text style={styles.buttonText}>
                                          Select Start Date
                                        </Text>
                                      ) : (
                                        <Text
                                          style={{
                                            fontFamily: 'Poppins',
                                            fontSize: 14,
                                          }}>{`${experience.startDate}`}</Text>
                                      )}
                                    </TouchableOpacity>

                                    {datePickerVisible[index] && ( // Show only if collapsed is false
                                      <DateTimePicker
                                        value={date[index] || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                          if (event.type === 'set') {
                                            const currentDate =
                                              selectedDate || date[index];
                                            // Format date to YYYY-MM-DD
                                            const formattedDate = currentDate
                                              .toISOString()
                                              .split('T')[0];

                                            // Update the field with the formatted date
                                            setFieldValue(
                                              `experiences[${index}].startDate`,
                                              formattedDate,
                                            );

                                            const newDates = [...date];
                                            newDates[index] = currentDate;
                                            setDate(newDates);
                                          }
                                          // Hide the date picker after selection
                                          const newVisibilities = [
                                            ...datePickerVisible,
                                          ];
                                          newVisibilities[index] = false;
                                          setDatePickerVisible(newVisibilities);
                                        }}
                                      />
                                    )}
                                  </View>
                                  <View>
                                    <Text style={styles.inputLabel}>
                                      Expected End Date
                                    </Text>

                                    <TouchableOpacity
                                      style={styles.customButton} // Custom button style
                                      onPress={() => {
                                        // Only show picker if not collapsed
                                        const newVisibilities = [
                                          ...endDatePickerVisible,
                                        ];
                                        newVisibilities[index] = true; // Show date picker for this experience
                                        setEndDatePickerVisible(
                                          newVisibilities,
                                        );
                                      }}>
                                      {experience.endDate === null ? (
                                        <Text style={styles.buttonText}>
                                          Select End Date
                                        </Text>
                                      ) : (
                                        <Text
                                          style={{
                                            fontFamily: 'Poppins',
                                            fontSize: 14,
                                          }}>{`${experience.endDate}`}</Text>
                                      )}
                                    </TouchableOpacity>

                                    {endDatePickerVisible[index] && ( // Show only if collapsed is false
                                      <DateTimePicker
                                        value={endDate[index] || new Date()} // Set a default value if date is null
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                          if (
                                            event.type === 'set' &&
                                            selectedDate
                                          ) {
                                            const formattedDate = selectedDate
                                              .toISOString()
                                              .split('T')[0];
                                            setFieldValue(
                                              `experiences[${index}].endDate`,
                                              formattedDate,
                                            );
                                            const newDates = [...endDate];
                                            newDates[index] = selectedDate;
                                            setEndDate(newDates);
                                          }
                                          const newVisibilities = [
                                            ...endDatePickerVisible,
                                          ];
                                          newVisibilities[index] = false;
                                          setEndDatePickerVisible(
                                            newVisibilities,
                                          );
                                        }}
                                      />
                                    )}
                                  </View>
                                </View>
                              </View>
                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                  Description
                                </Text>

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
                                  value={experience.description}
                                  textAlignVertical="top"
                                  onChangeText={value =>
                                    setFieldValue(
                                      `experiences[${index}].description`,
                                      value,
                                    )
                                  }
                                />
                              </View>
                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Recent</Text>
                                <SelectList
                                  setSelected={val => {
                                    // Log the selected value to ensure it is coming as expected
                                    console.log('Selected value:', val);

                                    const isRecentValue = booleanMapping[val];

                                    console.log(
                                      'Mapped boolean value:',
                                      isRecentValue,
                                    );
                                    setFieldValue(
                                      `experiences[${index}].isRecent`,
                                      isRecentValue,
                                    );
                                  }}
                                  data={profileVisible}
                                  placeholder="Select a option"
                                  onBlur={handleBlur(
                                    `experiences[${index}].isRecent`,
                                  )}
                                  fontFamily="Poppins"
                                  save="value"
                                  inputStyles={{color: '#8E8E8E'}}
                                  boxStyles={styles.dropdown}
                                  dropdownStyles={styles.dropdownBox}
                                  dropdownTextStyles={styles.dropdownText}
                                />
                              </View>

                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Ongoing</Text>
                                <SelectList
                                  setSelected={val => {
                                    // Log the selected value to ensure it is coming as expected
                                    console.log('Selected value:', val);

                                    const isOngoingValue = booleanMapping[val];

                                    console.log(
                                      'Mapped boolean value:',
                                      isOngoingValue,
                                    );
                                    setFieldValue(
                                      `experiences[${index}].isOngoing`,
                                      isOngoingValue,
                                    );
                                  }}
                                  data={profileVisible}
                                  placeholder="Select a option"
                                  onBlur={handleBlur(
                                    `experiences[${index}].isOngoing`,
                                  )}
                                  fontFamily="Poppins"
                                  save="value"
                                  inputStyles={{color: '#8E8E8E'}}
                                  boxStyles={styles.dropdown}
                                  dropdownStyles={styles.dropdownBox}
                                  dropdownTextStyles={styles.dropdownText}
                                />
                              </View>
                              <Button
                                title="Remove"
                                type="clear"
                                buttonStyle={styles.removeButton}
                                onPress={() => arrayHelpers.remove(index)} // Remove the experience
                              />

                              <CustomButton
                                title="Save"
                                onPress={async () => {
                                  try {
                                    // Validate the current experience using the schema
                                    await experienceValidationSchema.validate(
                                      experience,
                                      {abortEarly: false},
                                    );

                                    const experienceToSubmit = {
                                      jobTitle: experience.jobTitle,
                                      firmName: experience.firmName,
                                      startDate: experience.startDate,
                                      endDate: experience.endDate,
                                      isRecent: experience.isRecent,
                                      isOngoing: experience.isOngoing,
                                      description: experience.description,
                                    };

                                    const response = await advocateExperience(
                                      experienceToSubmit,
                                    );
                                    console.log('API Response:', response);
                                    if (
                                      response?.data &&
                                      response?.data?.success
                                    ) {
                                      showMessage({
                                        message: 'Success',
                                        description: response?.data?.message,
                                        type: 'success',
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                      setAccordionCollapsed(true);
                                    } else {
                                      // Handle non-successful API responses here
                                      const errorMsg =
                                        response.error?.data?.message ||
                                        'Something went wrong!';

                                      showMessage({
                                        message: 'Error',
                                        description: errorMsg,
                                        type: 'danger',
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                    }
                                  } catch (error) {
                                    if (error instanceof Yup.ValidationError) {
                                      Alert.alert(
                                        'Validation Error',
                                        error.errors.join('\n'),
                                      ); // Show validation errors in alert
                                    } else {
                                      console.error(error);
                                      const errorMsg =
                                        error?.response?.data?.error?.data
                                          ?.message || 'Something went wrong!';
                                      showMessage({
                                        message: 'Error',
                                        description: errorMsg,
                                        type: 'danger',
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                    }
                                  }
                                }}
                              />
                            </View>
                          );
                        })
                      ) : (
                        <Text>No experiences added</Text>
                      )}
                      <CustomButton
                        title="Add Experience"
                        onPress={() =>
                          arrayHelpers.push({
                            jobTitle: '',
                            firmName: '',
                            startDate: null,
                            endDate: null,
                            isRecent: false,
                            isOngoing: false,
                            description: '',
                          })
                        }
                      />
                    </View>
                  )}
                />
              );
            }}
          </Formik>
        </View>
      </Collapsible>
    </View>
  );
};

const renderCertificateSection = (
  issueDate,
  setIssueDate,
  issueDatePicker,
  setIssueDatePicker,
  collapsed,
  advocateCertificate,
  certificateLoading,
  onToggle,
) => {
  const [isAccordionCollapsed, setAccordionCollapsed] = useState(collapsed);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          onToggle();
          setAccordionCollapsed(!isAccordionCollapsed);
        }}
        style={styles.accordionHeader}>
        <Text style={styles.accordionTitle}>Certificate</Text>
        {isAccordionCollapsed ? (
          <Image
            source={require('../../../assets/images/icons/arrow-down.png')} // Path to the profile image
            style={{width: 20, height: 20}}
          />
        ) : (
          <Image
            source={require('../../../assets/images/icons/arrow-up.png')} // Path to the profile image
            style={{width: 20, height: 20}}
          />
        )}
      </TouchableOpacity>
      <Collapsible collapsed={isAccordionCollapsed}>
        <View style={styles.accordionContent}>
          <Formik
            initialValues={{
              certificates: [
                {
                  firmName: '',
                  certificate_number: '',
                  certificate_name: '',
                  issueDate: null,
                },
              ],
            }}
            // validationSchema={validationExperience}
            onSubmit={(values, {setSubmitting}) => {
              console.log('values', values);
            }}>
            {({
              // handleSubmit,
              values,
              setFieldValue,
              // errors,
              // touched,
              // handleBlur,
              // isSubmitting,
            }) => {
              useEffect(() => {
                const newDatePickerVisible = Array(
                  values.certificates.length,
                ).fill(false);
                setIssueDatePicker(newDatePickerVisible);
                setIssueDate(
                  Array(values.certificates.length).fill(new Date()),
                );
              }, [values.certificates.length]);
              return (
                <FieldArray
                  name="certificates"
                  render={arrayHelpers => (
                    <View>
                      {values.certificates && values.certificates.length > 0 ? (
                        values.certificates.map((certificate, index) => {
                          return (
                            <View key={index} style={styles.experienceItem}>
                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                  Company Name
                                </Text>

                                <TextInput
                                  placeholder="Enter Name"
                                  style={styles.input}
                                  value={certificate.firmName}
                                  onChangeText={value =>
                                    setFieldValue(
                                      `certificates[${index}].firmName`,
                                      value,
                                    )
                                  }
                                />
                              </View>
                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                  Certificate Name
                                </Text>

                                <TextInput
                                  placeholder="Enter Answer"
                                  style={styles.input}
                                  value={certificate.certificate_name}
                                  onChangeText={value =>
                                    setFieldValue(
                                      `certificates[${index}].certificate_name`,
                                      value,
                                    )
                                  }
                                />
                              </View>
                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                  Certificate Number
                                </Text>

                                <TextInput
                                  placeholder="Enter Answer"
                                  style={styles.input}
                                  value={certificate.certificate_number}
                                  onChangeText={value =>
                                    setFieldValue(
                                      `certificates[${index}].certificate_number`,
                                      value,
                                    )
                                  }
                                />
                              </View>

                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                  Issue Date
                                </Text>
                                <TouchableOpacity
                                  style={{
                                    backgroundColor: '#007BFF', // Customize the button color
                                    padding: 10,
                                    borderRadius: wp('2%'),
                                    width: wp('85%'),
                                    backgroundColor: '#E1EBFF',
                                  }} // Custom button style
                                  onPress={() => {
                                    // Only show picker if not collapsed
                                    const newVisibilities = [
                                      ...issueDatePicker,
                                    ];
                                    newVisibilities[index] = true; // Show date picker for this experience
                                    setIssueDatePicker(newVisibilities);
                                  }}>
                                  {certificate.issueDate === null ? (
                                    <Text style={styles.buttonText}>
                                      Select Issue Date
                                    </Text>
                                  ) : (
                                    <Text
                                      style={{
                                        fontFamily: 'Poppins',
                                        fontSize: 14,
                                      }}>{`${certificate.issueDate}`}</Text>
                                  )}
                                </TouchableOpacity>

                                {issueDatePicker[index] && ( // Show only if collapsed is false
                                  <DateTimePicker
                                    value={issueDate[index]}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                      if (event.type === 'set') {
                                        const currentDate =
                                          selectedDate || issueDate[index];
                                        // Format date to YYYY-MM-DD
                                        const formattedDate = currentDate
                                          .toISOString()
                                          .split('T')[0];

                                        // Update the field with the formatted date
                                        setFieldValue(
                                          `certificates[${index}].issueDate`,
                                          formattedDate,
                                        );

                                        const newDates = [...issueDate];
                                        newDates[index] = currentDate;
                                        setIssueDate(newDates);
                                      }
                                      // Hide the date picker after selection
                                      const newVisibilities = [
                                        ...issueDatePicker,
                                      ];
                                      newVisibilities[index] = false;
                                      setIssueDatePicker(newVisibilities);
                                    }}
                                  />
                                )}
                              </View>

                              <Button
                                title="Remove"
                                type="clear"
                                buttonStyle={styles.removeButton}
                                onPress={() => arrayHelpers.remove(index)} // Remove the experience
                              />

                              <CustomButton
                                title="Save"
                                onPress={async () => {
                                  try {
                                    // Validate the current education using the schema
                                    await certificateValidationSchema.validate(
                                      certificate,
                                      {
                                        abortEarly: false,
                                      },
                                    );

                                    const certificateToSubmit = {
                                      firmName: certificate.firmName,
                                      certificate_name:
                                        certificate.certificate_name,
                                      certificate_number:
                                        certificate.certificate_number,
                                      issueDate: certificate.issueDate,
                                    };

                                    console.log(
                                      'Submitting individual certificate',
                                      certificateToSubmit,
                                    );
                                    // Make the API call here
                                    const response = await advocateCertificate(
                                      certificateToSubmit,
                                    );
                                    console.log('API Response:', response);
                                    if (
                                      response?.data &&
                                      response?.data?.success
                                    ) {
                                      showMessage({
                                        message: 'Success',
                                        description: response?.data?.message,
                                        type: 'success',
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                      setAccordionCollapsed(true);
                                    } else {
                                      // Handle non-successful API responses here
                                      const errorMsg =
                                        response.error?.data?.message ||
                                        'Something went wrong!';

                                      showMessage({
                                        message: 'Error',
                                        description: errorMsg,
                                        type: 'danger',
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                    }
                                    // Show API response in alert
                                  } catch (error) {
                                    if (error instanceof Yup.ValidationError) {
                                      // Alert.alert(
                                      //   'Validation Error',
                                      //   error.errors.join(', '),
                                      // ); // Show validation errors in alert
                                      showMessage({
                                        message: 'Validation Error',
                                        description: error.errors.join(', '), // Joins all errors into a single string
                                        type: 'danger', // You can change the type to 'success', 'warning', etc.
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                    } else {
                                      console.error(error);
                                      const errorMsg =
                                        error?.response?.data?.error?.data
                                          ?.message || 'Something went wrong!';

                                      showMessage({
                                        message: 'Error',
                                        description: errorMsg,
                                        type: 'danger',
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                    }
                                  }
                                }}
                                loading={certificateLoading}
                              />
                            </View>
                          );
                        })
                      ) : (
                        <Text>No certificate added</Text>
                      )}
                      <CustomButton
                        title="Add Certificate"
                        onPress={() =>
                          arrayHelpers.push({
                            firmName: '',
                            certificate_name: '',
                            certificate_number: '',
                            issueDate: null,
                          })
                        }
                      />
                    </View>
                  )}
                />
              );
            }}
          </Formik>
        </View>
      </Collapsible>
    </View>
  );
};

// Accordion Section for Education (Dynamic Form)
const renderEducationSection = (
  profileVisible,
  jobTitles,
  educationStartDate,
  setEducationStartDate,
  educationStartDatePicker,
  setEducationStartDatePicker,
  educationEndDate,
  setEducationEndDate,
  educationEndDatePicker,
  setEducationEndDatePicker,
  booleanMapping,
  collapsed,
  advocateEducation,
  eduLoading,
  onToggle,
) => {
  const [isAccordionCollapsed, setAccordionCollapsed] = useState(collapsed);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          onToggle();
          setAccordionCollapsed(!isAccordionCollapsed);
        }}
        style={styles.accordionHeader}>
        <Text style={styles.accordionTitle}>Education</Text>
        {isAccordionCollapsed ? (
          <Image
            source={require('../../../assets/images/icons/arrow-down.png')} // Path to the profile image
            style={{width: 20, height: 20}}
          />
        ) : (
          <Image
            source={require('../../../assets/images/icons/arrow-up.png')} // Path to the profile image
            style={{width: 20, height: 20}}
          />
        )}
      </TouchableOpacity>
      <Collapsible collapsed={isAccordionCollapsed}>
        <View style={styles.accordionContent}>
          <Formik
            initialValues={{
              educations: [
                {
                  school_university: '',
                  fieldOfStudy: '',
                  grade: '',
                  activities: '',
                  description: '',
                  degreeType: '',
                  startDate: null,
                  endDate: null,
                  isRecent: false,
                  isOngoing: false,
                },
              ],
            }}
            // validationSchema={validationExperience}
            onSubmit={(values, {setSubmitting}) => {
              console.log('values', values);
            }}>
            {({
              handleSubmit,
              values,
              setFieldValue,
              errors,
              touched,
              handleBlur,
              isSubmitting,
            }) => {
              useEffect(() => {
                const newDatePickerVisible = Array(
                  values.educations.length,
                ).fill(false);
                setEducationStartDatePicker(newDatePickerVisible);
                setEducationEndDatePicker(newDatePickerVisible);
                setEducationEndDate(
                  Array(values.educations.length).fill(new Date()),
                );
                setEducationStartDate(
                  Array(values.educations.length).fill(new Date()),
                );
              }, [values.educations.length]);

              return (
                <FieldArray
                  name="educations"
                  render={arrayHelpers => (
                    <View>
                      {values.educations && values.educations.length > 0 ? (
                        values.educations.map((education, index) => {
                          return (
                            <View key={index} style={styles.experienceItem}>
                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                  School / University
                                </Text>

                                <TextInput
                                  placeholder="Ex: Boston University"
                                  style={styles.input}
                                  value={education.school_university}
                                  onChangeText={value =>
                                    setFieldValue(
                                      `educations[${index}].school_university`,
                                      value,
                                    )
                                  }
                                />
                              </View>
                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Degree</Text>

                                <TextInput
                                  placeholder="Ex: Bachelor's"
                                  style={styles.input}
                                  value={education.degreeType}
                                  onChangeText={value =>
                                    setFieldValue(
                                      `educations[${index}].degreeType`,
                                      value,
                                    )
                                  }
                                />
                              </View>
                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                  Study Field
                                </Text>

                                <TextInput
                                  placeholder="Ex:Business"
                                  style={styles.input}
                                  value={education.fieldOfStudy}
                                  onChangeText={value =>
                                    setFieldValue(
                                      `educations[${index}].fieldOfStudy`,
                                      value,
                                    )
                                  }
                                />
                              </View>

                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Grade</Text>

                                <TextInput
                                  placeholder="Ex: Grade A, Excellent performance"
                                  style={styles.input}
                                  value={education.grade}
                                  onChangeText={value =>
                                    setFieldValue(
                                      `educations[${index}].grade`,
                                      value,
                                    )
                                  }
                                />
                              </View>
                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                  Description
                                </Text>

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
                                  value={education.description}
                                  textAlignVertical="top"
                                  onChangeText={value =>
                                    setFieldValue(
                                      `educations[${index}].description`,
                                      value,
                                    )
                                  }
                                />
                              </View>
                              <View style={styles.inputContainer}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                  }}>
                                  <View>
                                    <Text style={styles.inputLabel}>
                                      Start Date
                                    </Text>

                                    <TouchableOpacity
                                      style={styles.customButton} // Custom button style
                                      onPress={() => {
                                        // Only show picker if not collapsed
                                        const newVisibilities = [
                                          ...educationStartDatePicker,
                                        ];
                                        newVisibilities[index] = true; // Show date picker for this experience
                                        setEducationStartDatePicker(
                                          newVisibilities,
                                        );
                                      }}>
                                      {education.startDate === null ? (
                                        <Text style={styles.buttonText}>
                                          Select Start Date
                                        </Text>
                                      ) : (
                                        <Text
                                          style={{
                                            fontFamily: 'Poppins',
                                            fontSize: 14,
                                          }}>{`${education.startDate}`}</Text>
                                      )}
                                    </TouchableOpacity>

                                    {educationStartDatePicker[index] && ( // Show only if collapsed is false
                                      <DateTimePicker
                                        value={
                                          educationStartDate[index] ||
                                          new Date()
                                        }
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                          if (event.type === 'set') {
                                            const currentDate =
                                              selectedDate ||
                                              educationStartDate[index];
                                            // Format date to YYYY-MM-DD
                                            const formattedDate = currentDate
                                              .toISOString()
                                              .split('T')[0];

                                            // Update the field with the formatted date
                                            setFieldValue(
                                              `educations[${index}].startDate`,
                                              formattedDate,
                                            );

                                            const newDates = [
                                              ...educationStartDate,
                                            ];
                                            newDates[index] = currentDate;
                                            setEducationStartDate(newDates);
                                          }
                                          // Hide the date picker after selection
                                          const newVisibilities = [
                                            ...educationStartDatePicker,
                                          ];
                                          newVisibilities[index] = false;
                                          setEducationStartDatePicker(
                                            newVisibilities,
                                          );
                                        }}
                                      />
                                    )}
                                  </View>
                                  <View>
                                    <Text style={styles.inputLabel}>
                                      Expected End Date
                                    </Text>

                                    <TouchableOpacity
                                      style={styles.customButton} // Custom button style
                                      onPress={() => {
                                        // Only show picker if not collapsed
                                        const newVisibilities = [
                                          ...educationEndDatePicker,
                                        ];
                                        newVisibilities[index] = true; // Show date picker for this experience
                                        setEducationEndDatePicker(
                                          newVisibilities,
                                        );
                                      }}>
                                      {education.endDate === null ? (
                                        <Text style={styles.buttonText}>
                                          Select End Date
                                        </Text>
                                      ) : (
                                        <Text
                                          style={{
                                            fontFamily: 'Poppins',
                                            fontSize: 14,
                                          }}>{`${education.endDate}`}</Text>
                                      )}
                                    </TouchableOpacity>

                                    {educationEndDatePicker[index] && ( // Show only if collapsed is false
                                      <DateTimePicker
                                        value={
                                          educationEndDate[index] || new Date()
                                        } // Set a default value if date is null
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                          if (
                                            event.type === 'set' &&
                                            selectedDate
                                          ) {
                                            const formattedDate = selectedDate
                                              .toISOString()
                                              .split('T')[0];
                                            setFieldValue(
                                              `educations[${index}].endDate`,
                                              formattedDate,
                                            );
                                            const newDates = [
                                              ...educationEndDate,
                                            ];
                                            newDates[index] = selectedDate;
                                            setEducationEndDate(newDates);
                                          }
                                          const newVisibilities = [
                                            ...educationEndDatePicker,
                                          ];
                                          newVisibilities[index] = false;
                                          setEducationEndDatePicker(
                                            newVisibilities,
                                          );
                                        }}
                                      />
                                    )}
                                  </View>
                                </View>
                              </View>
                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                  Activities
                                </Text>

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
                                  value={education.activities}
                                  textAlignVertical="top"
                                  onChangeText={value =>
                                    setFieldValue(
                                      `educations[${index}].activities`,
                                      value,
                                    )
                                  }
                                />
                              </View>
                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Recent</Text>
                                <SelectList
                                  setSelected={val => {
                                    // Log the selected value to ensure it is coming as expected
                                    console.log('Selected value:', val);

                                    const isRecentValue = booleanMapping[val];

                                    console.log(
                                      'Mapped boolean value:',
                                      isRecentValue,
                                    );
                                    setFieldValue(
                                      `educations[${index}].isRecent`,
                                      isRecentValue,
                                    );
                                  }}
                                  data={profileVisible}
                                  placeholder="Select a option"
                                  onBlur={handleBlur(
                                    `educations[${index}].isRecent`,
                                  )}
                                  fontFamily="Poppins"
                                  save="value"
                                  inputStyles={{color: '#8E8E8E'}}
                                  boxStyles={styles.dropdown}
                                  dropdownStyles={styles.dropdownBox}
                                  dropdownTextStyles={styles.dropdownText}
                                />
                              </View>

                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Ongoing</Text>
                                <SelectList
                                  setSelected={val => {
                                    // Log the selected value to ensure it is coming as expected
                                    console.log('Selected value:', val);

                                    const isOngoingValue = booleanMapping[val];

                                    console.log(
                                      'Mapped boolean value:',
                                      isOngoingValue,
                                    );
                                    setFieldValue(
                                      `educations[${index}].isOngoing`,
                                      isOngoingValue,
                                    );
                                  }}
                                  data={profileVisible}
                                  placeholder="Select a option"
                                  onBlur={handleBlur(
                                    `educations[${index}].isOngoing`,
                                  )}
                                  fontFamily="Poppins"
                                  save="value"
                                  inputStyles={{color: '#8E8E8E'}}
                                  boxStyles={styles.dropdown}
                                  dropdownStyles={styles.dropdownBox}
                                  dropdownTextStyles={styles.dropdownText}
                                />
                              </View>
                              <Button
                                title="Remove"
                                type="clear"
                                buttonStyle={styles.removeButton}
                                onPress={() => arrayHelpers.remove(index)} // Remove the experience
                              />

                              <CustomButton
                                title="Save"
                                onPress={async () => {
                                  try {
                                    // Validate the current education using the schema
                                    await educationValidationSchema.validate(
                                      education,
                                      {abortEarly: false},
                                    );

                                    const educationToSubmit = {
                                      school_university:
                                        education.school_university,
                                      grade: education.grade,
                                      activities: education.activities,
                                      degreeType: education.degreeType,
                                      fieldOfStudy: education.fieldOfStudy,
                                      startDate: education.startDate,
                                      endDate: education.endDate,
                                      isRecent: education.isRecent,
                                      isOngoing: education.isOngoing,
                                      description: education.description,
                                    };
                                    console.log('save', education.isRecent);

                                    console.log(
                                      'Submitting individual experience:',
                                      educationToSubmit,
                                    );
                                    // Make the API call here
                                    const response = await advocateEducation(
                                      educationToSubmit,
                                    );
                                    console.log('API Response:', response);
                                    if (
                                      response?.data &&
                                      response?.data?.success
                                    ) {
                                      showMessage({
                                        message: 'Success',
                                        description: response?.data?.message,
                                        type: 'success',
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                      setAccordionCollapsed(true);
                                    } else {
                                      // Handle non-successful API responses here
                                      const errorMsg =
                                        response.error?.data?.message ||
                                        'Something went wrong!';
                                      showMessage({
                                        message: 'Error',
                                        description: errorMsg,
                                        type: 'danger',
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                    }
                                    // Show API response in alert
                                  } catch (error) {
                                    if (error instanceof Yup.ValidationError) {
                                      Alert.alert(
                                        'Validation Error',
                                        error.errors.join(', '),
                                      ); // Show validation errors in alert
                                    } else {
                                      console.error(error);
                                      const errorMsg =
                                        error?.response?.data?.error?.data
                                          ?.message || 'Something went wrong!';
                                      showMessage({
                                        message: 'Error',
                                        description: errorMsg,
                                        type: 'danger',
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                    }
                                  }
                                }}
                                loading={eduLoading}
                              />
                            </View>
                          );
                        })
                      ) : (
                        <Text>No education added</Text>
                      )}
                      <CustomButton
                        title="Add Education"
                        onPress={() =>
                          arrayHelpers.push({
                            school_university: '',
                            fieldOfStudy: '',
                            grade: '',
                            activities: '',
                            degreeType: '',
                            startDate: {month: '', year: ''},
                            endDate: {month: '', year: ''},
                            isRecent: false,
                            isOngoing: false,
                            description: '',
                          })
                        }
                      />
                    </View>
                  )}
                />
              );
            }}
          </Formik>
        </View>
      </Collapsible>
    </View>
  );
};

const renderSkillSection = (
  collapsed,
  advocateSkill,
  skillLoading,
  onToggle,
) => {
  const [isAccordionCollapsed, setAccordionCollapsed] = useState(collapsed);
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          onToggle();
          setAccordionCollapsed(!isAccordionCollapsed);
        }}
        style={styles.accordionHeader}>
        <Text style={styles.accordionTitle}>Skills</Text>
        {isAccordionCollapsed ? (
          <Image
            source={require('../../../assets/images/icons/arrow-down.png')} // Path to the profile image
            style={{width: 20, height: 20}}
          />
        ) : (
          <Image
            source={require('../../../assets/images/icons/arrow-up.png')} // Path to the profile image
            style={{width: 20, height: 20}}
          />
        )}
      </TouchableOpacity>
      <Collapsible collapsed={isAccordionCollapsed}>
        <View style={styles.accordionContent}>
          <Formik
            initialValues={{
              skills: [
                {
                  skillName: '',
                },
              ],
            }}
            // validationSchema={validationExperience}
            onSubmit={(values, {setSubmitting}) => {
              console.log('values', values);
            }}>
            {({
              // handleSubmit,
              values,
              setFieldValue,
              // errors,
              // touched,
              // handleBlur,
              // isSubmitting,
            }) => {
              return (
                <FieldArray
                  name="skills"
                  render={arrayHelpers => (
                    <View>
                      {values.skills && values.skills.length > 0 ? (
                        values.skills.map((skill, index) => {
                          return (
                            <View key={index} style={styles.experienceItem}>
                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Skill</Text>

                                <TextInput
                                  placeholder="Enter Skill"
                                  style={styles.input}
                                  value={skill.skillName}
                                  onChangeText={value =>
                                    setFieldValue(
                                      `skills[${index}].skillName`,
                                      value,
                                    )
                                  }
                                />
                              </View>

                              <Button
                                title="Remove"
                                type="clear"
                                buttonStyle={styles.removeButton}
                                onPress={() => arrayHelpers.remove(index)} // Remove the experience
                              />

                              <CustomButton
                                title="Save"
                                onPress={async () => {
                                  try {
                                    // Validate the current education using the schema
                                    await skillValidationSchema.validate(
                                      skill,
                                      {
                                        abortEarly: false,
                                      },
                                    );

                                    const skillToSubmit = {
                                      skillName: skill.skillName,
                                    };

                                    console.log(
                                      'Submitting individual skills',
                                      skillToSubmit,
                                    );
                                    // Make the API call here
                                    const response = await advocateSkill(
                                      skillToSubmit,
                                    );
                                    console.log('API Response:', response);
                                    if (
                                      response?.data &&
                                      response?.data?.success
                                    ) {
                                      showMessage({
                                        message: 'Success',
                                        description: response?.data?.message,
                                        type: 'success',
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                      setAccordionCollapsed(true);
                                    } else {
                                      // Handle non-successful API responses here
                                      const errorMsg =
                                        response.error?.data?.message ||
                                        'Something went wrong!';
                                      showMessage({
                                        message: 'Error',
                                        description: errorMsg,
                                        type: 'danger',
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                    }
                                    // Show API response in alert
                                  } catch (error) {
                                    if (error instanceof Yup.ValidationError) {
                                      Alert.alert(
                                        'Validation Error',
                                        error.errors.join(', '),
                                      ); // Show validation errors in alert
                                    } else {
                                      console.error(error);
                                      const errorMsg =
                                        error?.response?.data?.error?.data
                                          ?.message || 'Something went wrong!';
                                      showMessage({
                                        message: 'Error',
                                        description: errorMsg,
                                        type: 'danger',
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                    }
                                  }
                                }}
                                loading={skillLoading}
                              />
                            </View>
                          );
                        })
                      ) : (
                        <Text>No skill added</Text>
                      )}
                      <CustomButton
                        title="Add Skill"
                        onPress={() =>
                          arrayHelpers.push({
                            skillName: '',
                          })
                        }
                      />
                    </View>
                  )}
                />
              );
            }}
          </Formik>
        </View>
      </Collapsible>
    </View>
  );
};

const renderPracticeAreaSection = (
  collapsed,
  advocatePracticeArea,
  areaLoading,
  onToggle,
) => {
  const [isAccordionCollapsed, setAccordionCollapsed] = useState(collapsed);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          onToggle();
          setAccordionCollapsed(!isAccordionCollapsed);
        }}
        style={styles.accordionHeader}>
        <Text style={styles.accordionTitle}>Practice Area</Text>
        {isAccordionCollapsed ? (
          <Image
            source={require('../../../assets/images/icons/arrow-down.png')} // Path to the profile image
            style={{width: 20, height: 20}}
          />
        ) : (
          <Image
            source={require('../../../assets/images/icons/arrow-up.png')} // Path to the profile image
            style={{width: 20, height: 20}}
          />
        )}
      </TouchableOpacity>
      <Collapsible collapsed={isAccordionCollapsed}>
        <View style={styles.accordionContent}>
          <Formik
            initialValues={{
              practiceAreas: [
                {
                  practiceArea: '',
                },
              ],
            }}
            // validationSchema={validationExperience}
            onSubmit={(values, {setSubmitting}) => {
              console.log('values', values);
            }}>
            {({
              // handleSubmit,
              values,
              setFieldValue,
              // errors,
              // touched,
              // handleBlur,
              // isSubmitting,
            }) => {
              return (
                <FieldArray
                  name="practiceAreas"
                  render={arrayHelpers => (
                    <View>
                      {values.practiceAreas &&
                      values.practiceAreas.length > 0 ? (
                        values.practiceAreas.map((practiceArea, index) => {
                          return (
                            <View key={index} style={styles.experienceItem}>
                              <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                  Practice Area
                                </Text>

                                <TextInput
                                  placeholder="Enter Answer"
                                  style={styles.input}
                                  value={practiceArea.practiceArea}
                                  onChangeText={value =>
                                    setFieldValue(
                                      `practiceAreas[${index}].practiceArea`,
                                      value,
                                    )
                                  }
                                />
                              </View>

                              <Button
                                title="Remove"
                                type="clear"
                                buttonStyle={styles.removeButton}
                                onPress={() => arrayHelpers.remove(index)} // Remove the experience
                              />

                              <CustomButton
                                title="Save"
                                onPress={async () => {
                                  try {
                                    // Validate the current education using the schema
                                    await practiceAreaValidationSchema.validate(
                                      practiceArea,
                                      {
                                        abortEarly: false,
                                      },
                                    );

                                    const practiceAreaToSubmit = {
                                      practiceArea: practiceArea.practiceArea,
                                    };

                                    console.log(
                                      'Submitting individual practice area',
                                      practiceAreaToSubmit,
                                    );
                                    // Make the API call here
                                    const response = await advocatePracticeArea(
                                      practiceAreaToSubmit,
                                    );
                                    console.log('API Response:', response);
                                    if (
                                      response?.data &&
                                      response?.data?.success
                                    ) {
                                      showMessage({
                                        message: 'Success',
                                        description: response?.data?.message,
                                        type: 'success',
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                      setAccordionCollapsed(true);
                                    } else {
                                      // Handle non-successful API responses here
                                      const errorMsg =
                                        response.error?.data?.message ||
                                        'Something went wrong!';
                                      showMessage({
                                        message: 'Error',
                                        description: errorMsg,
                                        type: 'danger',
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                    }
                                    // Show API response in alert
                                  } catch (error) {
                                    if (error instanceof Yup.ValidationError) {
                                      Alert.alert(
                                        'Validation Error',
                                        error.errors.join(', '),
                                      ); // Show validation errors in alert
                                    } else {
                                      console.error(error);
                                      const errorMsg =
                                        error?.response?.data?.error?.data
                                          ?.message || 'Something went wrong!';
                                      showMessage({
                                        message: 'Error',
                                        description: errorMsg,
                                        type: 'danger',
                                        titleStyle: {
                                          fontFamily: 'Poppins SemiBold',
                                        },
                                        textStyle: {fontFamily: 'Poppins'},
                                      });
                                    }
                                  }
                                }}
                                loading={areaLoading}
                              />
                            </View>
                          );
                        })
                      ) : (
                        <Text>No practice area added</Text>
                      )}
                      <CustomButton
                        title="Add Practice Area"
                        onPress={() =>
                          arrayHelpers.push({
                            practiceArea: '',
                          })
                        }
                      />
                    </View>
                  )}
                />
              );
            }}
          </Formik>
        </View>
      </Collapsible>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
    paddingHorizontal: wp('5%'),
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1.5%'),
  },
  profileImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
  },
  profileInfo: {
    marginHorizontal: wp('5%'),
  },
  profileName: {
    fontSize: wp('4.5%'),
    marginBottom: 0,
    fontFamily: 'Poppins SemiBold',
    color: '#294776',
    lineHeight: wp('5%'),
  },
  profileTitle: {
    fontSize: wp('3.5%'),
    marginBottom: 0,
    color: '#75797E',
    fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: wp('5%'),
  },
  ratingText: {
    marginLeft: wp('1%'),
    fontFamily: 'Poppins',
    fontSize: wp('3.2%'),
    // marginTop:10,
    color: '#fff',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.2%'),
    borderRadius: wp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1262D2',
  },
  starRating: {
    flexDirection: 'row',
    marginVertical: hp('0.5%'),
    // marginHorizontal: 5,
    alignItems: 'center',
  },
  stars: {
    color: '#FFA800',
    fontSize: wp('5%'),
    lineHeight: wp('5%'),
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins',
  },
  accordionContent: {
    paddingHorizontal: 10,
    paddingVertical: hp('0.8%'),
    backgroundColor: '#F3F7FF',
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
