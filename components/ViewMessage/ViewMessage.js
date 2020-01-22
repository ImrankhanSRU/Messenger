import React, { Component } from 'react'
import { View, Text, Image, TextInput, Dimensions, TouchableHighlight, ScrollView } from 'react-native'
import styles from './ViewMessageCss'
import { connect } from 'react-redux'
import obj from '../config'
import { Keyboard } from 'react-native'
import commonStyles from '../styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import InvertibleScrollView from 'react-native-invertible-scroll-view';

export default class ViewMessage extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        const content = { x: 100, y: 1000 }
        const messages = this.props.navigation.state.params.messages
        const name = this.props.navigation.state.params.name
        return (
            <View style={[commonStyles.flexColumn, styles.viewMessageContainer]}>
                <View style={[commonStyles.flexRow, styles.headerTop, { backgroundColor: "darkgreen", padding: 10, alignItems: "center" }]}>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity underlayColor="lightgray" onPress={() => this.props.navigation.goBack()} >
                            <Image style={{ marginRight: 10, width: 18, height: 18 }} source={require('../../assets/back.png')} />
                        </TouchableOpacity>
                        <Image style={{ width: 40, height: 40, marginRight: 10, borderRadius: 50 }} source={require('../../assets/user-icon.png')} />
                        <Text style={[styles.heading, { color: "white", fontSize: 20 }]}>
                            {
                                ((name).length > 23) ?
                                    (((name).substring(0, 23 - 3)) + '...') :
                                    name
                            }
                        </Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Image style={[commonStyles.icon, commonStyles.mRight10]} source={require('../../assets/search.png')} />
                        <Image style={commonStyles.icon} source={require('../../assets/menu-vertical.png')} />
                    </View>
                </View>
                <View style={styles.messageContainer}>
                    <InvertibleScrollView inverted contentContainerStyle={styles.messages}>
                        {/* <View > */}
                        {
                            Object.keys(messages).map((date, i) => (
                                <View style={{ marginBottom: 20 }} key = {i}>
                                    <View style={styles.date}>
                                        <View style={styles.line}></View>
                                        <Text style={styles.dateText}>{date}</Text>
                                    </View>
                                    <View>
                                        {
                                            messages[date].map((item, index) => (
                                                <View key={index} style={[styles.message, commonStyles.flexRow, item.sender == obj.mobile ? styles.myMessage : null]}>
                                                    <View style={styles.msg}>
                                                        <View style={styles.msgText}>
                                                            <Text>
                                                                {item.msg}
                                                            </Text>
                                                            {
                                                                item.msg.length < 30 &&
                                                                <Text style={[styles.msgTime, styles.innerTime]}>{item.time}</Text>
                                                            }
                                                        </View>
                                                        {/* <Text style={styles.msgTime}>{item.time}</Text> */}

                                                        {
                                                            item.msg.length >= 30 &&
                                                            <Text style={styles.msgTime}>
                                                                {item.time}
                                                            </Text>
                                                        }
                                                    </View>

                                                </View>
                                            ))
                                        }
                                    </View>
                                </View>
                            ))

                        }
                        {/* </View> */}
                    </InvertibleScrollView>

                </View>
                <View style={[commonStyles.flexRow, styles.inputContainer]}>
                    <TextInput placeholder="Type a message" style={styles.input} />
                    <TouchableOpacity style={styles.sendButton}>
                        <Image style={{ width: 30, height: 30 }} source={require('../../assets/send.png')} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}
