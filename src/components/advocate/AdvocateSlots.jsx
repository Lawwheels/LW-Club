import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SelectList} from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useGetAdvocateSlotsQuery} from '../../redux/api/api';
import CustomButton from '../../../shared/CustomButton';
import CustomHeader from '../../../shared/CustomHeader';

const AdvocateSlots = () => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [currentDateType, setCurrentDateType] = useState(''); // Track which date type is being set

  const filters = {
    // If no filters are set, default to using the date filter
    date: selectedFilter === '' || !selectedFilter ? date : undefined,

    // Include other filters based on selection
    ...(selectedFilter === 'date_range'
      ? {start_date: startDate, end_date: endDate}
      : {}),
    ...(selectedFilter === 'date' ? {date} : {}),
    ...(selectedFilter === 'status' ? {status} : {}),
    ...(selectedFilter === 'serviceType' ? {serviceType} : {}),
  };

  const {
    data: slotsData,
    error,
    isLoading,
    refetch,
  } = useGetAdvocateSlotsQuery(filters, {skip: shouldFetch});

  console.log('slotsData', slotsData);
  useEffect(() => {
    if (!shouldFetch) {
      setShouldFetch(true);
    }
  }, [slotsData, error]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      // Set the corresponding date based on currentDateType

      if (currentDateType === 'start_date') {
        setStartDate(formattedDate);
        console.log('Start Date set to: ', formattedDate);
      } else if (currentDateType === 'end_date') {
        setEndDate(formattedDate);
        console.log('End Date set to: ', formattedDate);
      } else {
        setDate(formattedDate); // For the single date selection
      }
    }
  };

  const handleFetchSlots = () => {
    // Validate required date selections
    if (selectedFilter === 'date_range' && (!startDate || !endDate)) {
      alert('Please select both start and end dates.');
      return;
    }

    setShouldFetch(false);
  };

  const renderSlot = ({item}) => {
    console.log(item)
    return (
      <View style={styles.slotContainer}>
        {item.client && item.client.name && (
          <View style={styles.clientContainer}>
            {item.client.avatar && (
              <Image
                source={{uri: item.client.avatar}}
                style={{width: 80, height: 80, borderRadius: 50}}
                resizeMode="cover"
              />
            )}
            <Text style={{fontFamily: 'Poppins SemiBold', margin: 20}}>
              {item.client.name}
            </Text>
          </View>
        )}
        <Text style={styles.timeText}>Time: {item.time}</Text>
        <Text style={{fontFamily: 'Poppins'}}>Status: {item.status}</Text>
        <Text style={{fontFamily: 'Poppins'}}>
          Service Type:{' '}
          {Array.isArray(item.serviceType)
            ? item.serviceType.join(', ')
            : item.serviceType}
        </Text>
      </View>
    );
  };

  const renderDate = ({item}) => {
    return(
    <View style={styles.dateContainer}>
      <Text style={styles.dateText}>
        Date:{' '}
        {new Date(item.date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </Text>
      <FlatList
        data={item.slotes}
        keyExtractor={slot => slot._id}
        renderItem={renderSlot}
      />
    </View>)
}

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Created Slot"
        icon={require('../../../assets/images/back.png')}
      />
      <SelectList
        setSelected={setSelectedFilter}
        data={[
          {key: 'date', value: 'Date'},
          {key: 'date_range', value: 'Date Range'},
          {key: 'status', value: 'Status'},
          {key: 'serviceType', value: 'Service Type'},
        ]}
        fontFamily="Poppins"
        placeholder="Select Filter"
        boxStyles={styles.dropdown}
      />

      {selectedFilter === 'date_range' && (
        <>
          <TouchableOpacity
            onPress={() => {
              setCurrentDateType('start_date'); // Set the date type
              setShowDatePicker(true);
            }}
            style={styles.input}>
            <Text>{startDate || 'Select Start Date'}</Text>
          </TouchableOpacity>
          {startDate && (
            <TouchableOpacity
              onPress={() => {
                setCurrentDateType('end_date'); // Set the date type
                setShowDatePicker(true);
              }}
              style={styles.input}>
              <Text>{endDate || 'Select End Date'}</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {(selectedFilter === 'date' ||
        selectedFilter === 'start_date' ||
        selectedFilter === 'end_date') && (
        <TouchableOpacity
          onPress={() => {
            setCurrentDateType(selectedFilter); // Use the current selected filter type
            setShowDatePicker(true);
          }}
          style={styles.input}>
          <Text>
            {(selectedFilter === 'date' && date) ||
              (selectedFilter === 'start_date' && startDate) ||
              (selectedFilter === 'end_date' && endDate) ||
              'Select Date'}
          </Text>
        </TouchableOpacity>
      )}

      {selectedFilter === 'status' && (
        <SelectList
          setSelected={setStatus}
          data={[
            {key: 'Vacant', value: 'Vacant'},
            {key: 'Upcoming', value: 'Upcoming'},
            {key: 'Missed', value: 'Missed'},
            {key: 'Completed', value: 'Completed'},
            {key: 'Deactivated', value: 'Deactivated'},
          ]}
          placeholder="Select Status"
          boxStyles={styles.dropdown}
        />
      )}

      {selectedFilter === 'serviceType' && (
        <SelectList
          setSelected={setServiceType}
          data={[
            {key: 'Audio', value: 'Audio'},
            {key: 'Video', value: 'Video'},
            {key: 'Visit', value: 'Visit'},
          ]}
          placeholder="Select Service Type"
          boxStyles={styles.dropdown}
        />
      )}

      <View style={{marginVertical: hp('2%')}}>
        <CustomButton
          title="Fetch Slots"
          onPress={handleFetchSlots}
          loading={isLoading}
        />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>
          Error fetching data: {error.message}
        </Text>
      ) : (
        <FlatList
          data={slotsData?.data || []}
          keyExtractor={item => item.date}
          renderItem={renderDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    backgroundColor: '#F3F7FF',
  },
  dropdown: {
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  dateContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Poppins SemiBold',
  },
  slotContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins',
    marginTop:10
  },
  clientContainer: {
    marginTop: 5,
    flexDirection: 'row',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'Poppins',
  },
});

export default AdvocateSlots;
