import React, { Component } from 'react'
import { View, Text, Image, ScrollView, TouchableHighlight } from 'react-native'
import commonStyles from '../styles'
import styles from './ListCss'
import obj from '../config'

function goToMessages(messages, navigation, item, setRead) {
    let userIcon = item.mobile ? 'contact' :
        (item.gname) ? 'group' : 'plant'
    navigation.navigate("ViewMessage", { messages, name: item.name, topic: item.topic, setRead, userIcon })
}

async function filterMessages(messages, item, navigation, setRead, handleOutside) {
    handleOutside()
    let messagesToRead = [];
    messagesToRead = messages[0][item.topic]
    setRead(item.topic)
    goToMessages(messagesToRead, navigation, item, setRead)

}

const getLastMessageTime = (messages, topic) => {
    let allKeys, lastKey;
    if (messages) {
        if (messages[topic]) {
            allKeys = Object.keys(messages[topic])
            lastKey = allKeys[0]
            if (messages[topic][lastKey]) {
                let fullDate = messages[topic][lastKey][messages[topic][lastKey].length - 1].fullDate
                let date;
                let time = messages[topic][lastKey][messages[topic][lastKey].length - 1].time
                if (fullDate == formatDate(new Date())) {
                    date = messages[topic][lastKey][messages[topic][lastKey].length - 1].time
                }
                else if (fullDate == formatDate(new Date(new Date().setDate(new Date().getDate() - 1)))) {
                    date = "YesterDay"
                }
                return [date, fullDate, time]
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

const getLastMessage = (msgs, topic) => {
    let firstKey = [];
    if (msgs) {
        if (msgs[topic]) {
            firstKey = Object.keys(msgs[topic])
        }
    }
    if (firstKey.length) {
        let lastMsg = msgs[topic][firstKey[0]][msgs[topic][firstKey[0]].length - 1]
        let name;

        if (lastMsg.sender == obj.mobile) {
            name = "You"
        }
        else {
            name = lastMsg.sname
        }

        return `${name}: ${lastMsg.msg}`

    }
    return ''
}


const sortByLatest = (props) => {
    let { data, messages } = props
    data.map(item => {
        if (getLastMessageTime(messages[0], item.topic).length) {
            let dates = getLastMessageTime(messages[0], item.topic)
            item.lastMsgTime = dates[0] ? dates[0] : dates[1]
            item.time = dates[2]
        }
        else {
            item.lastMsgTime = ''
        }
    })
    return data.sort(sort)
    // return data
}

const sort = (a, b) => {
    if (a.lastMsgTime.includes("M") && b.lastMsgTime.includes("M")) {
        if (new Date("1/1/2020 " + a.time) > new Date("1/1/2020 " + b.time)) {
            return -1;
        }
        else {
            return 1;
        }
    }

    else if (a.lastMsgTime.includes("M")) {
        return -1;
    }
    else if (b.lastMsgTime.includes("M")) {
        return 1;
    }
    else if (a.lastMsgTime == b.lastMsgTime) {
        if (new Date("1/1/2020 " + a.time) > new Date("1/1/2020 " + b.time)) {
            return -1;
        }
        else {
            return 1;
        }
    }
    else if (a.lastMsgTime > b.lastMsgTime) {
        return -1;
    }
    else {
        return 1;
    }
}


export default function List(props) {
    let { messages } = props
    let contacts = sortByLatest(props)

    return (
        <ScrollView style={styles.tab}>
            {
                contacts.map((item, index) => (
                    (item.mobile || item.gname || item.itemName) && (item.mobile != obj.mobile) &&
                    <TouchableHighlight underlayColor="lightgray" key={index}
                        onPress={() => { filterMessages(props.messages, item, props.navigation, props.setRead, props.handleOutside) }}>
                        <View style={[commonStyles.flexRow, styles.item]}>
                            <View style={[styles.image, commonStyles.flexColumn]}>
                                <Image style={[styles.userIcon, item.mobile ? { width: 50, height: 50 } : null]}
                                    source={item.mobile ? require('../../assets/user-icon.png') :
                                        (item.gname) ?
                                            require('../../assets/groups.png') : require('../../assets/plant.png')} />
                            </View>
                            <View style={[commonStyles.flexRow, styles.nameContainer]}>
                                <View>
                                    {
                                        !!props.searchText.length &&
                                        <Text style={styles.name}>

                                            <Text style={{ backgroundColor: "yellow" }}>
                                                {item.name.substr(0, props.searchText.length)}
                                            </Text>
                                            {item.name.substr(props.searchText.length)}
                                        </Text>
                                    }
                                    {
                                        !props.searchText.length &&
                                        <Text style={styles.name}>
                                            {item.name}
                                        </Text>
                                    }

                                    <Text style={{ color: "gray", fontSize: 14 }}>
                                        {

                                            // Object.keys(messages[0][item.topic]).length > 0 &&
                                            ((getLastMessage(messages[0], item.topic)).length > 30) ?
                                                (((getLastMessage(messages[0], item.topic)).substring(0, 30 - 3)) + '...') :
                                                getLastMessage(messages[0], item.topic)
                                        }
                                    </Text>
                                </View>
                                <View style={styles.indicator}>
                                    <Text
                                        style={[styles.lastMsgDate, props.counts[item.topic] && styles.unseen]}>
                                        {item.lastMsgTime}
                                        {/* {getLastMessageTime(props.messages[0], item.topic)} */}
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


