import React, { Component } from 'react'
import { View, Text, Image, TextInput, Keyboard } from 'react-native'
import styles from './ViewMessageCss'
import obj from '../config'
import commonStyles from '../styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import InvertibleScrollView from 'react-native-invertible-scroll-view';
const mqtt = require('mqtt')


export default class ViewMessage extends Component {

    options = {
        port: 9000,
        host: '52.66.213.147',
    };
    client = mqtt.connect('ws://52.66.213.147/mqtt', this.options)

    subscribeToTopic = (topic) => {
        this.client.subscribe(topic, (err) => {
            // console.log(err)
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            messages: props.navigation.state.params.messages,
            msg: '',
            keyboardOffset: 0
        }
    }

    componentDidMount() {
        let { topic } = this.props.navigation.state.params

        let scope = this
        this.client.on('connect', function () {
            console.log("connected")
        })

        scope.client.on('message', function (topic, message) {
            // message is Buffer
            console.log(message)
            if (message != "shub") {

            }
        })

        this.subscribeToTopic(topic)
        this.subscribeToTopic(obj.mobile)
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = (event) => {
        this.setState({
            keyboardOffset: "11%",
        })
    }

    _keyboardDidHide = () => {
        this.setState({
            keyboardOffset: 0,
        })
    }

    addMessage = () => {
        let date = new Date()
        let year = date.getFullYear() % 100
        let day = date.getDate()
        let month = date.getMonth() + 1
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let type = "AM"
        if (hours > 12) {
            hours -= 12
            type = "PM"
        }
        let time = `${hours}:${minutes} ${type}`
        if (day < 10) {
            day = `0${day}`
        }
        if (month < 10) {
            month = `0${month}`
        }
        let fullDate = `${day}/${month}/${year}`
        let messages = { ...this.state.messages }
        let msg = {
            msg: this.state.msg,
            sender: "8124966143",
            reciever: "889",
            fullDate,
            time
        }
        messages["Today"].push(msg)
        this.setState({
            messages,
            msg: ''
        })
    }

    handleInputChange = (text) => {
        this.setState({
            msg: text
        })
    }

    render() {
        let messages = this.state.messages
        const name = this.props.navigation.state.params.name
        return (
            <View style={[commonStyles.flexColumn, styles.viewMessageContainer]}
                behavior="" enabled>
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
                                <View style={{ marginBottom: 20 }} key={i}>
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
                <View style={[commonStyles.flexRow, styles.inputContainer, { bottom: this.state.keyboardOffset }]}>
                    <TextInput placeholder="Type a message" onSubmitEditing={Keyboard.dismiss}
                        style={styles.input}
                        value={this.state.msg}
                        onChangeText={(text) => {
                            this.handleInputChange(text)
                        }}
                    // style={styles.input}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={() => {
                        this.addMessage()
                    }} >
                        <Image style={{ width: 30, height: 30 }} source={require('../../assets/send.png')} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}
