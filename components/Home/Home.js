import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import styles from './HomeCss'
import HomeHeader from '../HomeHeader/HomeHeader'
import commonStyles from '../styles'

class Home extends Component {

   render() {
      return (
         // <View style={commonStyles.flexColumn}>
            <HomeHeader />
         // </View>
      )
   }
}
export default Home
