import React, { Component } from 'react'
import { View, Text, Image, ScrollView, TouchableHighlight } from 'react-native'
import commonStyles from '../styles'
import styles from './ListCss'
import obj from '../config'

function goToMessages(messages, navigation, name) {
    navigation.navigate("ViewMessage", { messages, name })
}

async function filterMessages(messages, item, navigation, setRead) {
    let messagesToRead = [];
    messagesToRead = messages[0][item.topic]
    setRead(item.topic)
    goToMessages(messagesToRead, navigation, item.name)

}

const getLastMessageTime = (messages, topic) => {
    let allKeys, lastKey;
    if (messages) {
        if (messages[topic]) {
            allKeys = Object.keys(messages[topic])
            lastKey = allKeys[0]
            if (messages[topic][lastKey]) {
                let date = messages[topic][lastKey][messages[topic][lastKey].length - 1].fullDate
                if (date == formatDate(new Date())) {
                    date = messages[topic][lastKey][messages[topic][lastKey].length - 1].time
                }
                else if (date == formatDate(new Date(new Date().setDate(new Date().getDate() - 1)))) {
                    date = "YesterDay"
                }
                return date
            }
        }
    }
    return ''
}

const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear().toString().substr(-2);

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('/');
}


export default function List(props) {
    return (
        <ScrollView style={styles.tab}>
            {
                props.data.map((item, index) => (
                    (item.mobile || item.gname || item.itemName) && (item.mobile != obj.mobile) &&
                    <TouchableHighlight underlayColor="lightgray" key={index}
                        onPress={() => { filterMessages(props.messages, item, props.navigation, props.setRead) }}>
                        <View style={[commonStyles.flexRow, styles.item]}>
                            <View style={[styles.image, commonStyles.flexColumn]}>
                                <Image style={{ width: 50, height: 50, marginRight: 20 }} source={require('../../assets/user-icon.png')} />
                            </View>
                            <View style={[commonStyles.flexRow, styles.nameContainer]}>
                                <View><Text style={styles.name}>{item.name}</Text></View>
                                <View style={styles.indicator}>
                                    <Text 
                                    style = {[styles.lastMsgDate, props.counts[item.topic] && styles.unseen]}>
                                        {getLastMessageTime(props.messages[0], item.topic)}
                                        </Text>
                                    {
                                        props.counts[item.topic] &&
                                        <Text style={styles.count}>{props.counts[item.topic]}</Text>
                                    }
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>
                ))
            }
        </ScrollView>
    )
}


