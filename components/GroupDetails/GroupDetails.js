import React, { Component } from 'react'
import { View, Text, Image, ScrollView, TouchableHighlight } from 'react-native'
import commonStyles from '../styles'
import styles from '../List/ListCss'
import obj from '../config'

export default function GroupDetails(props) {
    let { groupDetails, topic } = props.navigation.state.params
    console.log(groupDetails, topic)

    return (
        <Text>Group Details</Text>
        // <ScrollView style={styles.tab}>
        //     {
        //         groupDetails.groupMembers.map((item, index) => (
        //             <TouchableHighlight underlayColor="lightgray" key={index}
        //                 onPress={() => { filterMessages(props.messages, item, props.navigation, props.setRead, props.handleOutside) }}>
        //                 <View style={[commonStyles.flexRow, styles.item]}>
        //                     <View style={[styles.image, commonStyles.flexColumn]}>
        //                         <Image style={[styles.userIcon, item.mobile ? { width: 50, height: 50 } : null]}
        //                             source={item.mobile ? require('../../assets/user-icon.png') :
        //                                 (item.gname) ?
        //                                     require('../../assets/groups.png') : require('../../assets/plant.png')} />
        //                     </View>
        //                     <View style={[commonStyles.flexRow, styles.nameContainer]}>
        //                         <View>
        //                             {
        //                                 !!props.searchText.length &&
        //                                 <Text style={styles.name}>

        //                                     <Text style={{ backgroundColor: "yellow" }}>
        //                                         {item.name.substr(0, props.searchText.length)}
        //                                     </Text>
        //                                     {item.name.substr(props.searchText.length)}
        //                                 </Text>
        //                             }
        //                             {
        //                                 !props.searchText.length &&
        //                                 <Text style={styles.name}>
        //                                     {item.name}
        //                                 </Text>
        //                             }

        //                             <Text style={{ color: "gray", fontSize: 14 }}>
        //                                 {

        //                                     // Object.keys(messages[0][item.topic]).length > 0 &&
        //                                     ((getLastMessage(messages[0], item.topic)).length > 30) ?
        //                                         (((getLastMessage(messages[0], item.topic)).substring(0, 30 - 3)) + '...') :
        //                                         getLastMessage(messages[0], item.topic)
        //                                 }
        //                             </Text>
        //                         </View>
        //                         <View style={styles.indicator}>
        //                             <Text
        //                                 style={[styles.lastMsgDate, props.counts[item.topic] && styles.unseen]}>
        //                                 {item.lastMsgTime}
        //                                 {/* {getLastMessageTime(props.messages[0], item.topic)} */}
        //                             </Text>
        //                             {
        //                                 props.counts[item.topic] &&
        //                                 <Text style={styles.count}>{props.counts[item.topic]}</Text>
        //                             }
        //                         </View>
        //                     </View>

        //                 </View>
        //             </TouchableHighlight>
        //         ))
        //     }
        // </ScrollView>
    )
}