import React, { Component } from 'react'
import { View, Text, Image, TextInput, Dimensions, TouchableHighlight } from 'react-native'
import commonStyles from '../styles'
import styles from './ListCss'

export default function List(props) {
    return (
        <View style={styles.tab}>
            {
                props.data.map(item => (
                    (item.mobile || item.gname || item.itemName) &&
                    <View style={[commonStyles.flexRow, styles.item]}>
                        <View style = {[styles.image, commonStyles.flexColumn]}>
                            <Image style={{ width: 50, height: 50, marginRight: 20}} source={require('../../assets/user-icon.png')} />
                        </View>
                        <View style={[commonStyles.flexRow, styles.nameContainer]}>
                            <View><Text style={styles.name}>{item.name}</Text></View>
                            <Text>6.17 pm</Text>
                        </View>
                    </View>
                ))
            }
        </View>
    )
}