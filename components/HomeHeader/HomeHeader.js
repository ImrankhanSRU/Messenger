import React, { Component } from 'react'
import { View, Text, Image, TextInput } from 'react-native'
import styles from './HomeHeaderCss'
import commonStyles from '../styles'

class HomeHeader extends Component {

    render() {
        return (
            <View style={[commonStyles.flexColumn, styles.header]}>
                <View style={[commonStyles.flexRow, styles.headerTop]}>
                    <Text style={styles.heading}>Messenger</Text>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Image style={[commonStyles.icon, commonStyles.mRight10]} source={require('../../assets/search.png')} />
                        <Image style={commonStyles.icon} source={require('../../assets/menu-vertical.png')} />
                    </View>
                </View>
                <View style = {[commonStyles.flexRow, styles.navBar]}>
                    <Text style = {[styles.tab]}>CONTACTS</Text>
                    <Text style = {[styles.tab]}>GROUPS</Text>
                    <Text style = {[styles.tab, styles.active]}>PLANT GROUPS</Text>

                </View>
            </View>
        )
    }
}
export default HomeHeader
