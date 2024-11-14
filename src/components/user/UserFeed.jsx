import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomHeader from '../../../shared/CustomHeader'

const UserFeed = () => {
  return (
    <View style={styles.container}>
        <CustomHeader
        title={'Feed'}
        icon={require('../../../assets/images/back.png')}
      />
      <Text>UserFeed</Text>
    </View>
  )
}

export default UserFeed

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F3F7FF'
    }
})