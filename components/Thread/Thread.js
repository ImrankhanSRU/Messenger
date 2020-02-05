import React, { Component } from 'react'
import { View, Text, Image, TextInput, Keyboard } from 'react-native'
import styles from '../ViewMessage/ViewMessageCss'
import obj from '../config'
import commonStyles from '../styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import axios from 'axios'
import Swipeable from 'react-native-gesture-handler/Swipeable';

const mqtt = require('mqtt')

export default class ViewMessage extends Component {
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
            messages: props.navigation.state.params.messages.replies,
            replyId: props.navigation.state.params.messages.id,
            msg: '',
            keyboardOffset: 0,
            disbleButton: true,
            colors: {},
            topic: this.props.navigation.state.params.topic
        }


    }

    componentDidMount() {
        obj.isThreadOpen = true
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
                // if (time.includes('/')) {
                //     msg.time = scope.formatMessageTime(time)
                //     // msg.fullDate = new Date().toLocaleDateString()
                // }
                if ((msg.reciever == obj.mobile && msg.sender == obj.currentTabTopic) || msg.reciever == obj.currentTabTopic) {
                    scope.addMessage(msg)
                }

            }
        })

        // this.subscribeToTopic(topic)
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
        const response = await axios.get(`${obj.BASE_URL}api/userManagement/getUserDetails`)
        this.getRandomColor(response.data.data)

    }

    componentWillUnmount() {
        // obj.currentTabTopic = ''
        obj.isThreadOpen = false
        let { topic } = this.props.navigation.state.params
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.props.navigation.state.params.setRead(topic)
        this.client.end()
    }

    _keyboardDidShow = (event) => {
        this.setState({
            keyboardOffset: "8%"
        })
    }

    _keyboardDidHide = () => {
        this.setState({
            keyboardOffset: 0,
        })
    }

    getGroupDetails = async (id) => {
        const response = await axios.get(`${obj.BASE_URL}api/controlCenter/messenger/getGroupDetails/${id}`)
        this.getRandomColor(response.data.data.groupMembers)
    }

    addMessage = (newMsg) => {

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
        let messages = [...this.state.messages]
        let msgObj = {
            sender: obj.mobile,
            reciever: obj.currentTabTopic,
            date: fullDate,
            sname: obj.name,
            time,
            reply_to_msg_id: this.state.replyId
        }
        if (newMsg) {
            msgObj = newMsg
            msgObj.date = fullDate
        }
        else {
            msgObj["msg"] = this.state.msg
            sendMsg = 1;
        }
        messages.push(msgObj)
        this.setState({
            messages,
            msg: ''
        })  
        if (sendMsg) {
            this.client.publish(obj.currentTabTopic, JSON.stringify(msgObj), false)
        }
        this.props.navigation.state.params.increaseReplyCount(msgObj)

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
                color += letters[Math.floor(Math.random() * 16)];
            }
            allColors[groupMembers[i].mobile] = color
        }
        this.setState({
            colors: allColors
        })
    }


    getRandomArbitrary = (min, max) => Math.random() * (max - min) + min

    formatDate = (date) => {
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


    render() {

        let { messages } = this.state
        let mainThread = this.props.navigation.state.params.messages
        let disbleButton = this.state.disbleButton
        let { userIcon, topic } = this.props.navigation.state.params
        let iconObj = {
            contact: require('../../assets/user-icon.png'),
            group: require('../../assets/groups.png'),
            plant: require('../../assets/plant.png')
        }

        const name = this.props.navigation.state.params.name
        return (
            <>

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
                            <View>
                                <Text style={[styles.heading, { color: "white", fontSize: 18 }]}>
                                    {
                                        ((name).length > 25) ?
                                            (((name).substring(0, 25 - 3)) + '...') :
                                            name
                                    }
                                </Text>
                                {/* <Text style={{ color: "white" }}>You, deepak & 3 others</Text> */}
                            </View>
                        </View>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <Image style={[commonStyles.icon, commonStyles.mRight10]} source={require('../../assets/search.png')} />
                            <Image style={commonStyles.icon} source={require('../../assets/menu-vertical.png')} />
                        </View>
                    </View>

                    <View style={styles.messageContainer} >

                        <InvertibleScrollView ref={(ref) => {
                        }} inverted contentContainerStyle={styles.messages}
                        >

                            <View>
                                {
                                    messages.map((item, index) => (
                                        item.showName = true &&
                                        item.sname != "NA" &&
                                        // topic.includes('/') &&
                                        (index == 0 ||
                                            (index > 0 &&
                                                messages[index - 1].sname != item.sname)),
                                        <View key={index} style={{
                                            backgroundColor: "", padding: 25,
                                            paddingBottom: 0, paddingTop: 0, marginBottom: 8,
                                            marginTop: 8
                                        }} >
                                            <View
                                                // key={index}
                                                style={[styles.message, commonStyles.flexRow,
                                                item.sender == obj.mobile ? styles.myMessage : null,
                                                item.showName ? { borderTopLeftRadius: 0 } : null,
                                                item.showName && item.sender == obj.mobile ?
                                                    { borderTopRightRadius: 0 } : null,
                                                ]}>

                                                {
                                                    item.showName &&
                                                    <View style={[
                                                        item.sender == obj.mobile ?
                                                            styles.myMessageBorderStyle : styles.borderStyle,
                                                        { top: 0 }
                                                    ]}>

                                                    </View>
                                                }
                                                <View style={styles.msg}>
                                                    <View style={styles.msgText}>
                                                        <View>
                                                            {
                                                                item.showName &&
                                                                item.reciever.includes('/') &&
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
                                                            item.sender == obj.mobile || !topic.includes('/') ||
                                                                !item.showName ? { marginTop: 5 } : { marginTop: 25 }]}>

                                                                {!item.date.includes('/') ?
                                                                    this.formatDate(item.date)
                                                                    : item.date
                                                                }
                                                            </Text>
                                                        }
                                                    </View>

                                                    {
                                                        item.msg.length >= 33 &&
                                                        <Text style={styles.msgTime}>
                                                            {this.formatDate(item.date)}
                                                        </Text>
                                                    }
                                                </View>

                                            </View>
                                        </View>
                                    ))
                                }
                            </View>
                            <View
                                style={{
                                    backgroundColor: "white",
                                    maxWidth: "80%",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    padding: 10,
                                    marginBottom: 20,
                                    borderRadius: 10
                                }}
                            >
                                {
                                    mainThread.showName &&
                                    <View style={[
                                        mainThread.sender == obj.mobile ?
                                            styles.myMessageBorderStyle : styles.borderStyle]}>

                                    </View>
                                }

                                <View style={styles.msg}>

                                    <View style={styles.msgText}>
                                        <View>
                                            {
                                                // mainThread.showName = true &&
                                                // mainThread.showName && mainThread.receiver.includes('/') &&
                                                // mainThread.sender != obj.mobile &&

                                                <Text style={{ color: "darkgreen", fontSize: 17 }}>
                                                    {mainThread.sname}
                                                </Text>
                                            }
                                            <Text style={{ fontSize: 17 }}>
                                                {mainThread.mainThread}
                                            </Text>
                                        </View>


                                    </View>

                                    {
                                        mainThread.mainThread.length < 33 &&
                                        <Text style={[styles.msgTime, styles.innerTime,
                                        mainThread.sender == obj.mobile || !mainThread.receiver.includes('/')
                                            || !mainThread.showName ? { marginTop: 5 } : { marginTop: 25 }]}>
                                            {mainThread.date}
                                        </Text>
                                    }
                                    {
                                        mainThread.mainThread.length >= 33 &&
                                        <Text style={styles.msgTime}>
                                            {mainThread.date}
                                        </Text>
                                    }
                                </View>
                            </View>
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

