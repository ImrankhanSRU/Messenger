import React, { Component } from 'react'
import { View, Text, Image, TextInput, Keyboard, KeyboardAvoidingView, Button, Animated } from 'react-native'
import styles from './ViewMessageCss'
import obj from '../config'
import commonStyles from '../styles'
import { TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler'
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import axios from 'axios'
import Swipeable from 'react-native-gesture-handler/Swipeable';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

const mqtt = require('mqtt')

export default class Thread extends Component {
    messageRef = React.createRef();

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
            keyboardOffset: 0,
            disbleButton: true,
            colors: {},
            height: 0,
            showThreadAlert: false
        }


    }

    componentDidMount() {
        // console.log(this.props.navigation.navigate("Login"))
        let { topic } = this.props.navigation.state.params
        if (topic.split('/')[0] == "plants") {
            this.getAllUsers()
        }
        else if (topic.includes('/')) {
            let groupId = topic.split('/')[1]
            this.getGroupDetails(groupId)
        }



        obj.currentTabTopic = topic
        let scope = this
        this.client.on('connect', function () {
        })



        scope.client.on('message', function (topic, message) {
            // message is Buffer
            if (message != "shub") {
                let time = JSON.parse(message).time
                let msg = JSON.parse(message)
                if (time.includes('/') && !msg.reply_to_msg_id) {
                    msg.time = scope.formatMessageTime(time)
                    // msg.fullDate = new Date().toLocaleDateString()
                }
                if ((msg.reciever == obj.mobile && msg.sender == obj.currentTabTopic) ||
                    (msg.reciever == obj.currentTabTopic)) {
                    if (msg.reply_to_msg_id) {
                        scope.addMessage(msg, true)
                    }
                    else {
                        scope.addMessage(msg)
                    }
                }

            }
        })

        if (topic.includes('/')) {
            this.subscribeToTopic(topic)
        }
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

    getAllUsers = async () => {
        const response = await axios.get(`http://52.66.213.147:3000/api/userManagement/getUserDetails`)
        this.getRandomColor(response.data.data)

    }

    componentWillUnmount() {
        obj.currentTabTopic = ''
        let { topic } = this.props.navigation.state.params
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.props.navigation.state.params.setRead(topic)
        this.client.end()
    }

    _keyboardDidShow = (event) => {
        this.setState({
            keyboardOffset: "10%"
        })
    }

    _keyboardDidHide = () => {
        this.setState({
            keyboardOffset: 0,
        })
    }

    getGroupDetails = async (id) => {
        const response = await axios.get(`http://52.66.213.147:3000/api/controlCenter/messenger/getGroupDetails/${id}`)
        this.getRandomColor(response.data.data.groupMembers)
    }

    addMessage = (newMsg, isThread) => {
        if (!isThread) {
            let sendMsg = 0;
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
            if (minutes < 10) {
                minutes = `0${minutes}`
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
            let msgObj = {
                sender: obj.mobile,
                reciever: obj.currentTabTopic,
                fullDate,
                sname: obj.name,
                time
            }
            if (newMsg) {
                msgObj = newMsg
                msgObj.fullDate = fullDate
            }
            else {
                msgObj["msg"] = this.state.msg
                sendMsg = 1;
            }
            if (messages["Today"]) {
                messages["Today"].push(msgObj)
            }
            else {
                messages["Today"] = [msgObj]
            }
            this.setState({
                messages,
                msg: ''
            })
            if (sendMsg)
                this.client.publish(obj.currentTabTopic, JSON.stringify(msgObj), false)
        }
        else {
            this.increaseReplyCount(newMsg)
        }

    }

    increaseReplyCount = (newMsg) => {
        let messages = { ...this.state.messages }
        let days = Object.keys(messages)
        days.map(day => {
            messages[day].map(msg => {
                if (msg.id == newMsg.reply_to_msg_id) {
                    if (msg.replyCount) {
                        msg.replyCount++
                    }
                    else {
                        msg.replyCount = 0
                    }
                }
            })
        })
        this.setState({
            messages
        })
    }

    handleInputChange = (text) => {
        let disbleButton = true
        if (text) {
            disbleButton = false
        }
        this.setState({
            msg: text,
            disbleButton
        })
    }

    formatMessageTime = (msgTime) => {
        let time = new Date(msgTime).toLocaleTimeString().split(':').slice(0, 2).join(':')
        let type = new Date(msgTime).toLocaleTimeString().split(' ')[1];
        return `${time} ${type}`

    }

    getRandomColor(groupMembers) {
        if (groupMembers.length) {
            groupMembers.push({
                mobile: "BOT"
            })
        }
        var letters = '0123456789ABCDEF';
        var allColors = {}
        var color = '#';
        for (let i = 0; i < groupMembers.length; i++) {
            color = '#'
            for (var j = 0; j < 6; j++) {
                color += letters[Math.floor(Math.random() * 10)];
            }
            allColors[groupMembers[i].mobile] = color
        }
        this.setState({
            colors: allColors
        })
    }


    getRandomArbitrary = (min, max) => Math.random() * (max - min) + min

    renderLeftActions = (progress) => {
        // const trans = dragX.interpolate({
        //     inputRange: [0, 50, 100, 101],
        //     outputRange: [-20, 0, 0, 1],
        // });
        return (
            <TouchableOpacity delayLongPress={1000}
                onLongPress={() => {
                    console.log("long press")
                }
                } >
                <Text style={{ color: "dodgerblue" }}>{this.state.threadText}</Text>
            </TouchableOpacity >

        );

    };



    goToThread = async (item) => {
        const messages = await axios.get(`http://52.66.213.147:3000/api/controlCenter/messenger/getReplyMessages/${item.id}`)

        this.props.navigation.navigate("Thread", {
            messages: messages.data.data, name: `Thread - ${messages.data.data.mainThread}`, topic: item.reciever,
            userIcon: "contact", setRead: this.props.navigation.state.params.setRead
        })

    }

    renderMessage = (item) => {
        return (
            <View
                delayLongPress={1000}
                onLongPress={() => {
                    console.log("Message Long pressed")
                }}
                style={[styles.message, commonStyles.flexRow,
                item.sender == obj.mobile ? styles.myMessage : null,
                item.showName ? { borderTopLeftRadius: 0 } : null,
                item.showName && item.sender == obj.mobile ?
                    { borderTopRightRadius: 0 } : null
                ]}>
                {
                    item.showName &&
                    <View style={[
                        item.sender == obj.mobile ?
                            styles.myMessageBorderStyle : styles.borderStyle]}>

                    </View>
                }

                <View style={styles.msg}>

                    <View style={styles.msgText}>
                        <View>
                            {
                                item.showName && item.reciever.includes('/') &&
                                item.sender != obj.mobile &&

                                <Text style={{ color: this.state.colors[item.sender] }}>
                                    {item.sname}
                                </Text>
                            }
                            <Text>
                                {item.msg}
                            </Text>
                        </View>

                        {
                            item.msg.length < 33 &&
                            <Text style={[styles.msgTime, styles.innerTime,
                            item.sender == obj.mobile || !item.reciever.includes('/') || !item.showName ? { marginTop: 5 } : { marginTop: 25 }]}>{item.time}</Text>
                        }
                    </View>

                    {/* <Text style={styles.msgTime}>{item.time}</Text> */}

                    {
                        item.msg.length >= 33 &&
                        <Text style={styles.msgTime}>
                            {item.time}
                        </Text>
                    }
                </View>
            </View>
        )
    }

    threadAlert = () => {
        return (
            <View style={{
                position: "absolute",
                top: "40%",
                left: "40%",
                // height: "100%",
                zIndex: 999,
                // backgroundColor: ""
            }}>
                <Text>Start a Thread</Text>
            </View>
        )
    }

    render() {

        const leftContent = <Text>Pull to activate</Text>;

        let { messages } = this.state
        let disbleButton = this.state.disbleButton
        let { userIcon, topic } = this.props.navigation.state.params
        let iconObj = {
            contact: require('../../assets/user-icon.png'),
            group: require('../../assets/groups.png'),
            plant: require('../../assets/plant.png')
        }
        let days = Object.keys(messages)
        if (days.includes("Today") && days.indexOf("Today") > 0) {
            days.pop()
            days.splice(0, 0, "Today")
        }
        const name = this.props.navigation.state.params.name
        return (
            <>
                {
                    // this.state.showThreadAlert &&
                    this.threadAlert()

                }
                {/* <TouchableOpacity style={styles.down}>
                    <Image source={require('../../assets/down.png')}
                        style={{ width: 20, height: 20 }}
                        onPress={() => {
                            console.log(this.ListView_Ref)
                            this.ListView_Ref.scrollTo({ x: 0, y: 0, animated: true });
                        }} />
                </TouchableOpacity> */}
                <View
                    behavior={null} keyboardVerticalOffset={0}
                    style={[commonStyles.flexColumn, styles.viewMessageContainer]} >

                    <View style={[commonStyles.flexRow, styles.headerTop, { backgroundColor: "darkgreen", padding: 10, alignItems: "center" }]}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity underlayColor="lightgray" onPress={() => this.props.navigation.goBack()} >
                                <Image style={{ marginRight: 10, width: 18, height: 18 }} source={require('../../assets/back.png')} />
                            </TouchableOpacity>
                            <Image style={[{ width: 40, height: 40, marginRight: 10, borderRadius: 50 }]}
                                source={iconObj[userIcon]} />
                            <Text style={[styles.heading, { color: "white", fontSize: 20 }]}>
                                {
                                    ((name).length > 20) ?
                                        (((name).substring(0, 20 - 3)) + '...') :
                                        name
                                }
                            </Text>
                        </View>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <Image style={[commonStyles.icon, commonStyles.mRight10]} source={require('../../assets/search.png')} />
                            <Image style={commonStyles.icon} source={require('../../assets/menu-vertical.png')} />
                        </View>
                    </View>

                    <View style={styles.messageContainer} >

                        <InvertibleScrollView ref={(ref) => {
                            this.ListView_Ref = ref;
                        }} inverted contentContainerStyle={styles.messages}
                        >
                            {/* <View > */}
                            {
                                days.map((date, i) => (
                                    <View style={{ marginBottom: 20 }} key={i}>
                                        <View style={styles.date}>
                                            <View style={styles.line}></View>
                                            <Text style={styles.dateText}>{date}</Text>
                                        </View>
                                        {/* <View> */}
                                        {
                                            messages[date].map((item, index) => (
                                                item.showName = true &&
                                                item.sname != "NA" &&
                                                // topic.includes('/') &&
                                                (index == 0 ||
                                                    (index > 0 &&
                                                        messages[date][index - 1].sname != item.sname)),
                                                <View key={index}>
                                                    <TouchableHighlight
                                                        underlayColor="lightblue"
                                                        onPress={() => { }}
                                                        delayLongPress={1000}
                                                        onLongPress={() => {
                                                            this.setState({
                                                                showThreadAlert: true
                                                            })
                                                        }}
                                                        style={{
                                                            padding: 25,
                                                            paddingBottom: 10, paddingTop: 10,
                                                            // backgroundColor: this.state.backgroundColor
                                                        }}
                                                    >
                                                        {/* <View> */}
                                                        <View>
                                                            {this.renderMessage(item)}



                                                        </View>
                                                    </TouchableHighlight>
                                                    {
                                                        item.replyCount &&
                                                        (item.replyCount > 1 ?
                                                            item.replyText = "replies" : item.replyText = "reply") &&
                                                        <View
                                                            style={[
                                                                item.replyCount ?
                                                                    styles.messageReply : null,
                                                                item.sender == obj.mobile ? styles.myMessageReply : null
                                                            ]}>
                                                            <TouchableHighlight
                                                                underlayColor="lightgray"
                                                                onPress={() => {
                                                                    this.goToThread(item)
                                                                }}
                                                                key={index + 1}
                                                            >
                                                                <Text style={styles.replyText}>
                                                                    {item.replyCount} {item.replyText}
                                                                </Text>
                                                            </TouchableHighlight>
                                                        </View>
                                                    }
                                                </View>

                                            ))
                                        }
                                        {/* </View> */}
                                    </View>
                                ))

                            }
                            {/* </View> */}
                        </InvertibleScrollView>

                    </View>
                    <View style={[commonStyles.flexRow, styles.inputContainer]}

                        bottom={this.state.keyboardOffset}>
                        <TextInput placeholder="Type a message"
                            value={this.state.messageText}

                            style={styles.input}
                            value={this.state.msg}
                            onChangeText={(text) => {
                                this.handleInputChange(text)
                            }}
                        />
                        <TouchableOpacity

                            style={[styles.sendButton,
                            !this.state.msg.length ? { backgroundColor: "lightgray" } : {}]}
                            disabled={this.state.disbleButton}
                            onPress={() => {
                                this.addMessage()
                            }} >
                            <Image style={{ width: 30, height: 30 }} source={require('../../assets/send.png')} />
                        </TouchableOpacity>
                    </View>

                </View>
            </ >
        )
    }
}

// const mapDispatchToProps = dispatch => ({
    // setRead: (topic) => dispatch(setRead(topic))
// });

