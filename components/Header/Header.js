import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Image from 'react-native-scalable-image';
import styles from './HeaderCss.js'
let { height, width } = Dimensions.get('window');

class Header extends Component {

   render() {
      return (
         <View style={styles.header}>
            <Text style={styles.heading}>Messenger</Text>
            <Image
               width={width / 1.7}
               style={styles.headerImg}
               source={require('../../assets/vena-logo.png')}
            />
         </View>
      )
   }
}
export default Header
