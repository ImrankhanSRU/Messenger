import React, { Component } from 'react'
import {
    View, Text, Image, TextInput, Keyboard, KeyboardAvoidingView, Button, Alert,
    TouchableOpacity, TouchableHighlight, Dimensions, Modal, ScrollView,
    ActivityIndicator, Linking
} from 'react-native'
import styles from './ViewMessageCss'
import obj from '../config'
import commonStyles from '../styles'
// import InvertibleScrollView from 'react-native-invertible-scroll-view';
import axios from 'axios'
import ImageView from 'react-native-image-view';
import DocumentPicker from 'react-native-document-picker';
import { uploadAttachment, abortFetching } from '../../network/api/upload'
import RNBackgroundDownloader from 'react-native-background-downloader';
import GDrive from "react-native-google-drive-api-wrapper";
const accessToken = require('../token.json')
import FileViewer from 'react-native-file-viewer';
const RNFS = require('react-native-fs');
import * as Progress from 'react-native-progress';

// import * as ART from '@react-native-community/art'


// GDrive.setAccessToken(accessToken);
// GDrive.init();


const mqtt = require('mqtt')

export default class Thread extends Component {
    daysLayout = []
    msgLayout = []
    messageRef = React.createRef();
    groupDetails;
    options = {
        port: 9000,
        host: '52.66.213.147',
    };

    client = mqtt.connect('ws://52.66.213.147/mqtt', this.options)
    configureGetOptions() {
        const headers = new Headers()
        headers.append('Authorization', `Bearer ${accessToken}`)
        return {
            method: 'GET',
            headers,
        }
    }
    subscribeToTopic = (topic) => {
        this.client.subscribe(topic, (err) => {
            // console.log(err)
        })
    }
    ListView_Ref = React.createRef();

    constructor(props) {

        super(props)
        this.state = {
            scrollTo: 1,
            messages: this.props.navigation.state.params.messages,
            msg: '',
            keyboardOffset: 0,
            disbleButton: true,
            colors: {},
            height: 0,
            images: [{
                source: {
                    uri: '',
                    fname: ''
                },
                width: 400,
                height: Dimensions.get('window').height / 1.5,
            },],
            isImageViewVisible: false,
            firstMsgIndex: 0,
            uploading: []
        }


    }

    // formatMessages = (messages) => {
    //     let days = Object.keys(messages)
    //     let arr = []
    //     for(let i = days.length - 1; i >= 0; i --) {
    //         arr.push({date: days[i], isDate: 1 })
    //         messages[days[i]].map(msg => {
    //             arr.push(msg)
    //         })
    //     }
    //     return
    // }

    componentDidMount() {
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
                // else if (msg.reply_to_msg_id) {
                //     scope.increaseReplyCount(msg)
                // }

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
        const response = await axios.get(`${obj.BASE_URL}api/userManagement/getUserDetails`)
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
        const response = await axios.get(`${obj.BASE_URL}api/controlCenter/messenger/getGroupDetails/${id}`)
        this.groupDetails = response.data.data
        this.getRandomColor(response.data.data.groupMembers)
    }

    addMessage = (newMsg, isThread, doc) => {
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
            if (messages["Today"]) {
                msgObj.id = messages["Today"][messages["Today"].length - 1].id + 1
            }
            else {
                msgObj.id = 1
            }
            let uploading = this.state.uploading
            uploading[msgObj.id] = true
            this.setState({
                uploading,
                scrollTo: 0
            })
            if (newMsg) {
                msgObj = newMsg
                msgObj.fullDate = fullDate
            }
            else {
                if (doc) {

                    sendMsg = 0
                    msgObj["msg"] = doc.uri
                    if (doc.type.includes("image")) {
                        msgObj.isMedia = 1
                    }
                    else {
                        msgObj.isMedia = 2;
                    }
                    msgObj.fname = `${doc.name}.${doc.type.split('/')[1]}`
                    uploadAttachment(doc, obj.currentTabTopic, obj.mobile, obj.name).then(res => {
                        if (res.url) {
                            msgObj.msg = res.url
                            this.client.publish(obj.currentTabTopic, JSON.stringify(msgObj), false)
                            uploading[msgObj.id] = false
                            this.setState({ uploading })
                        }

                    })

                }
                else {
                    msgObj["msg"] = this.state.msg
                    sendMsg = 1;
                }

            }
            if (messages["Today"]) {
                messages["Today"].push(msgObj)
            }
            else {
                messages["Today"] = [msgObj]
            }
            this.setState({
                messages,
                msg: '',
            })
            // if (sendMsg) {
            //     this.client.publish(obj.currentTabTopic, JSON.stringify(msgObj), false)
            // }
        }
        else if (!obj.isThreadOpen) {
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
                        msg.replyCount = 1
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
                    // console.log("long press")
                }
                } >
                <Text style={{ color: "dodgerblue" }}>{this.state.threadText}</Text>
            </TouchableOpacity >

        );

    };



    goToThread = async (item) => {
        const messages = await axios.get(`{${obj.BASE_URL}api/controlCenter/messenger/getReplyMessages/${item.id}`)

        this.props.navigation.navigate("Thread", {
            messages: messages.data.data, name: `Thread - ${messages.data.data.mainThread}`, topic: obj.currentTabTopic,
            userIcon: "contact", setRead: this.props.navigation.state.params.setRead,
            increaseReplyCount: this.increaseReplyCount
        })

    }

    renderMessage = (item) => {
        let imgUri = "https://drive.google.com/thumbnail?id="
        if (item.isMedia) {
            // if (item.isMedia == 1) {
            if (item.msg.includes("content://")) {
                imgUri = item.msg
            }
            else {
                if (item.msg.includes("drive.google.com")) {
                    let split = item.msg.split('/')
                    imgUri += split[split.length - 2]
                }
                else {
                    imgUri += item.msg
                }
                // console.log(imgUri)
            }
            // }
            // else if (item.isMedia == 2) {
            //     let split = item.msg.split('/')
            //     imgUri += split[split.length - 2]
            //     imgUri += item.msg

            // }
        }

        return (
            <View

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
                            {
                                !item.isMedia ?
                                    <Text>
                                        {item.msg}
                                    </Text> :
                                    (item.isMedia == 1 ?
                                        <TouchableOpacity onPress={() => { this.showImage(imgUri, item.fname) }} >
                                            {
                                                this.state.uploading[item.id] == true &&
                                                <ActivityIndicator
                                                    style={{ position: "absolute", top: "38%", left: "40%" }}
                                                    size={50} color="mediumseagreen" />
                                            }


                                            <Image resizeMode={'stretch'} source={{ uri: imgUri }}
                                                style={{
                                                    height: Dimensions.get('window').height / 4,
                                                    width: Dimensions.get('window').width / 1.5,
                                                    borderRadius: 5,
                                                    marginTop: 10,
                                                    marginBottom: 5
                                                }}
                                            />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => {
                                            if (!this.state.uploading[item.id]) {
                                                this.openFile(item.msg, item.fname, item.id)
                                            }
                                        }} style={{ marginBottom: 5 }}>
                                            <View style={[commonStyles.flexRow,
                                            { padding: 10, backgroundColor: "#e4fdd0", borderRadius: 5 }]}>
                                                <Text style={{ marginRight: 20 }}>
                                                    {
                                                        item.fname.length < 30 ?
                                                            item.fname : item.fname.substr(0, 30) + '...'
                                                    }
                                                </Text>
                                                {/* <Progress.Circle size={30} /> */}

                                                {
                                                    this.state.uploading[item.id] &&
                                                    <View>
                                                        <ActivityIndicator size={30} color="green" />
                                                        {/* <TouchableOpacity
                                                            style={{ width: 20, height: 20, position: "absolute", right: 5, top: 5 }}
                                                        >
                                                            <Image  style={{ width: 20, height: 20}} source={require('../../assets/stop.png')} />
                                                        </TouchableOpacity> */}
                                                    </View>
                                                }
                                                {
                                                    
                                                    this.checkExisting(item.fname).then(res => {
                                                        item.exists = res
                                                    }),
                                                    (item.sender != obj.mobile && !item.exists && !this.state.uploading[item.id]) &&
                                                    <TouchableOpacity style={{ width: 20, height: 20 }} onPress={() => { this.openFile(item.msg, item.fname, item.id) }} >
                                                        <Image style={{ width: 20, height: 20 }} source={require('../../assets/download-black.png')} />
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    )
                            }
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
            </View >
        )
    }

    formatUrl = (msg, fname, msgId) => {
        let id = msg.split('/')[msg.split('/').length - 2]
        let url = `https://drive.google.com/a/nova-global.in/uc?authuser=1&id=${id}`
        this.downloadFile(url, fname, false, msgId)
    }

    showImage = (uri, fname) => {
        let images = [...this.state.images]
        images[0].source.uri = uri
        images[0].source.fname = fname
        this.setState({
            images,
            isImageViewVisible: true
        })
    }

    threadAlert = (item) => {
        let title = !item.replyCount ? "Create Thread" : "Reply To Thread"
        let msg = item.msg.length < 50 ? item.msg : item.msg.substr(0, 47) + "..."
        Alert.alert(
            title,
            msg,
            [
                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.goToThread(item) },
            ],
            { cancelable: false },
        );
    }

    goToGroupDetails = () => {
        // this.props.navigation.navigate("GroupDetails", { groupDetails: this.groupDetails, topic: obj.currentTabTopic })
    }

    scrollToUnread = () => {
        let { unReadCount } = this.props.navigation.state.params
        let { messages } = this.state
        let days = Object.keys(messages)
        let currIndex = 0;
        days.reverse().map((day, dayIndex) => {
            let length = messages[day].length
            for (let i = currIndex; i < currIndex + length; i++) {
                this.msgLayout[i] += this.daysLayout[dayIndex]
            }
            currIndex += length
        })
        if (!unReadCount) {
            unReadCount = 1
        }
        let firstMsgIndex = this.msgLayout.length - unReadCount
        if (this.state.scrollTo) {
            this.ListView_Ref.scrollTo({ x: 0, y: this.msgLayout[firstMsgIndex], animated: true })
        }
        this.setState({
            firstMsgIndex
        })
    }

    handleChoosePhoto = async () => {
        try {
            const result = await DocumentPicker.pick({
                // type: [DocumentPicker.types.images],
            });
            let fname = result.name
            let ext = result.type.split('/')[result.type.split('/').length - 1]
            fname += `.${ext}`
            if (result.type.includes('application')) {
                this.downloadFile(result.uri, fname)
            }
            else {
                this.downloadFile(result.uri, fname, 1)
            }
            this.addMessage(false, false, result)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    openFile = async (msg, fname, msgId) => {
        let uploading = [...this.state.uploading]
        if (await RNFS.exists(`${RNBackgroundDownloader.directories.documents}/${fname}`)) {
            FileViewer.open(`${RNBackgroundDownloader.directories.documents}/${fname}`)
        }
        else {
            uploading[msgId] = true
            this.setState({
                uploading,
                scrollTo: 0
            })
            this.formatUrl(msg, fname, msgId)
        }

    }

    checkExisting = async (fname) => {
        let status;
        await RNFS.exists(`${RNBackgroundDownloader.directories.documents}/${fname}`).then(res => {
            status = res
        })
        return status
        
    }

    downloadFile = async (url, fname, isImage, msgId) => {
        let scope = this;
        let uploading = [...scope.state.uploading]

        if (msgId) {
            uploading[msgId] = false
        }
        RNBackgroundDownloader.download({
            id: "file123",
            url,
            destination: `${RNBackgroundDownloader.directories.documents}/${fname}`,

        }).begin((expectedBytes) => {
            console.log(`Going to download ${expectedBytes} bytes!`);
        }).progress((percent) => {
            console.log(`Downloaded: ${percent * 100}%`);
        }).done((res) => {
            if (isImage && this.state.isImageViewVisible) {
                alert("Downloaded")
            }
            console.log('Download is done!');
            if (msgId) {
                scope.setState({
                    uploading
                })
            }
            // FileViewer.open(`${RNBackgroundDownloader.directories.documents}/${fname}`)
        }).error((error) => {
            console.log('Download canceled due to error: ', error);
        });

    }

    render() {

        let count = 0;
        let { messages } = this.state
        let disbleButton = this.state.disbleButton
        let { userIcon, topic, unReadCount } = this.props.navigation.state.params
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

        const view = <>

            {

                <Modal visible={this.state.isImageViewVisible} transparent={true}>
                    {/* <Text style = {{color: "white"}}>Download</Text> */}
                    <TouchableOpacity onPress={() => this.downloadFile(this.state.images[0].source.uri, this.state.images[0].source.fname, 1)}
                        style={{ zIndex: 1000, marginTop: 20, left: "10%", width: 30, height: 30 }}>
                        <Image style={{ width: 30, height: 30 }} source={require('../../assets/download.png')} />
                    </TouchableOpacity>

                    <ImageView
                        // style={{ width: 100, height: 100 }}
                        resizeMode={'stretch'}
                        images={this.state.images}
                        imageIndex={0}
                        isVisible={this.state.isImageViewVisible}
                        onClose={() => {
                            this.setState({
                                isImageViewVisible: false
                            })
                        }}
                    />
                </Modal>
            }

            {/* <View style={{ marginTop: "auto", marginBottom: "auto", position: "absolute", zIndex: 2000, width: "100%", height: "50%", flex: 1, backgroundColor: "white" }}>
                    <Image
                        style={{ width: "100%", height: "100%" }}
                        source={{ uri: "https://drive.google.com/thumbnail?id=1edfm6Kky6JuwCCaKjx5s5OjdkRHt-e4h" }}
                    />
                </View> */}
            <View
                behavior={null} keyboardVerticalOffset={0}
                style={[commonStyles.flexColumn, styles.viewMessageContainer]} >


                <View style={[commonStyles.flexRow, styles.headerTop, { backgroundColor: "darkgreen", padding: 10, alignItems: "center" }]}>

                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity underlayColor="#F5F5F5" onPress={() => this.props.navigation.goBack()} >
                            <Image style={{ marginRight: 10, width: 18, height: 18 }} source={require('../../assets/back.png')} />
                        </TouchableOpacity>
                        <Image style={[{ width: 40, height: 40, marginRight: 10, borderRadius: 50 }]}
                            source={iconObj[userIcon]} />
                        <TouchableHighlight
                            style={{}}
                            underlayColor="#d1d4d7"
                            onPress={() => { this.goToGroupDetails() }}>
                            <Text style={[styles.heading, { color: "white", fontSize: 20 }]}>
                                {
                                    ((name).length > 20) ?
                                        (((name).substring(0, 20 - 3)) + '...') :
                                        name
                                }
                            </Text>
                        </TouchableHighlight>

                    </View>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Image style={[commonStyles.icon, commonStyles.mRight10]} source={require('../../assets/search.png')} />
                        <Image style={commonStyles.icon} source={require('../../assets/menu-vertical.png')} />
                    </View>
                </View>

                <View style={styles.messageContainer} >

                    <ScrollView inverted ref={(ref) => {
                        this.ListView_Ref = ref;
                    }}
                        // inverted 
                        contentContainerStyle={styles.messages}
                    >
                        {/* <View > */}
                        {
                            days.reverse().map((date, i) => (
                                <View style={{ marginBottom: 20 }} key={i}
                                    onLayout={event => {
                                        const layout = event.nativeEvent.layout;
                                        this.daysLayout[i] = layout.y
                                    }}
                                >
                                    <View style={styles.date}
                                    >
                                        <View style={styles.line}></View>
                                        <Text style={styles.dateText}>{date}</Text>
                                    </View>
                                    {/* <View> */}
                                    {
                                        messages[date].map((item, index) => (
                                            count++ ,

                                            item.showName = true &&
                                            item.sname != "NA" &&
                                            // topic.includes('/') &&
                                            (index == 0 ||
                                                (index > 0 &&
                                                    messages[date][index - 1].sname != item.sname)),

                                            <View key={index}
                                                onLayout={event => {
                                                    const layout = event.nativeEvent.layout;
                                                    this.msgLayout.push(layout.y)
                                                    if (i == days.length - 1 && index == messages[date].length - 1) {
                                                        setTimeout(() => {
                                                            this.scrollToUnread()
                                                        }, 1000)
                                                    }
                                                }}
                                            >
                                                {/* {
                                                    count == this.state.firstMsgIndex && unReadCount &&
                                                    <View style={{
                                                        padding: 5,
                                                        backgroundColor: "#f7f7f7",
                                                        // opacity: .4,
                                                        // width: "100%"
                                                    }}>

                                                        <Text style={{
                                                            backgroundColor: "white", marginLeft: "auto",
                                                            marginRight: "auto",
                                                            padding: 10,
                                                            borderRadius: 50,
                                                            color: "black",
                                                        }}>
                                                            {unReadCount} UNREAD MESSAGES
                                                            </Text>
                                                    </View>
                                                } */}

                                                <TouchableHighlight
                                                    underlayColor="lightblue"
                                                    delayLongPress={2000}
                                                    onLongPress={() => {
                                                        this.threadAlert(item)
                                                    }}
                                                    style={{
                                                        padding: 25,
                                                        paddingBottom: 7, paddingTop: 7,
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
                                                            underlayColor="#d1d4d7"
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
                        {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 50 }}>
                            {!!photo && (
                                <Image
                                    source={{ uri: photo.uri }}
                                    style={{ width: 300, height: 300 }}
                                />
                            )}

                        </View> */}
                    </ScrollView>

                </View>

                <View style={[commonStyles.flexRow, styles.inputContainer]}

                    bottom={this.state.keyboardOffset}>
                    {/* <TouchableOpacity style={{ position: "absolute", zIndex: 10, left: 20 }} onPress={() => { this.handleChoosePhoto() }} >
                        <Image
                            source={require('../../assets/attach.png')}
                            style={{ width: 30, height: 30, }}
                        />
                    </TouchableOpacity>
                    <TextInput placeholder="Type a message"
                        value={this.state.messageText}
                        placeholderStyle={{ marginLeft: 20 }}
                        style={styles.input}
                        value={this.state.msg}
                        onChangeText={(text) => {
                            this.handleInputChange(text)
                        }}
                    /> */}
                    <View style={styles.searchSection}>
                        <TouchableOpacity style={styles.searchIcon} onPress={() => { this.handleChoosePhoto() }} >
                            <Image
                                source={require('../../assets/attach.png')}
                                style={{ width: 30, height: 30, }}
                            />
                        </TouchableOpacity>
                        <TextInput placeholder="Type a message"
                            value={this.state.messageText}
                            placeholderStyle={{ marginLeft: 20 }}
                            style={styles.input}
                            value={this.state.msg}
                            onChangeText={(text) => {
                                this.handleInputChange(text)
                            }}
                        />
                    </View>


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
        return (view)

    }
}

// const mapDispatchToProps = dispatch => ({
    // setRead: (topic) => dispatch(setRead(topic))
// });

