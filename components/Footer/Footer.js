import React, { Component } from 'react'
import {View, Image, Text, StyleSheet, TouchableOpacity, AsyncStorage} from 'react-native'
import styles from './FooterCss.js'

class Footer extends Component {


   render() {
      return (
          <View>

             <View style = {styles.footer}>
                <Text style = {styles.footerText}>Powered by</Text>
                <Image style = {styles.footerImg} source = {require('../../assets/nova-global.png')} />
             </View>
          </View>
      )
   }
}
export default Footer

