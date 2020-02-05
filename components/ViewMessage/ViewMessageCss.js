import { StyleSheet, Dimensions } from 'react-native'
let { height, width } = Dimensions.get('window');

export default StyleSheet.create({
    viewMessageContainer: {
        height: "100%",
        backgroundColor: "#e9ecef"
    },
    messageContainer: {
        position: "relative",
        height: "80%",
        backgroundColor: "#e9ecef",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        paddingTop: 20,
    },
    messages: {
        // padding: 25,
        // paddingTop: 25,
        zIndex: -1,
    },
    message: {
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        // marginTop: 10,
        backgroundColor: "white",
        // textAlign: "right",
        alignSelf: "flex-start",
        maxWidth: "85%",
        borderStyle: "solid",

    },
    myMessage: {
        // marginLeft: "20%",
        marginRight: 0,
        // width: 100,
        backgroundColor: "#dcf8c6",
        alignSelf: "flex-end",
    },

    inputContainer: {
        alignItems: "center",
        padding: 10
    },

    input: {
        backgroundColor: "white",
        borderRadius: 50,
        padding: 12,
        // height: 10,
        paddingTop: 7,
        // paddingBottom: 7,
        width: "85%",
        fontSize: 17,

    },

    sendButton: {
        backgroundColor: "darkgreen",
        borderRadius: 50,
        padding: 10,
    },

    sendButtonDisable: {
        opacity: 0.3
    },

    msg: {
        // flex: 1,
    },

    msgText: {
        // flex: 1,
        // flexWrap: "wrap",
        display: "flex",
        flexDirection: "row"
    },

    msgTime: {
        fontSize: 12,
        color: "gray",
        textAlign: "right"
    },
    innerTime: {
        marginLeft: 10,
    },
    date: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    dateText: {
        fontSize: 15,
        // opacity: 0.7,
        color: "#1b262c",
        padding: 5,
        paddingRight: 20,
        paddingLeft: 20,
        backgroundColor: "rgb(225,245,254)",
        borderRadius: 5,
        marginBottom: 10,
        // textShadowOffset: "0 1px 0 hsla(0,0%,100%,.4)"
    },
    line: {
        position: "relative",
        top: "40%",
        width: "90%",
        borderTopColor: "#c9c9c9",
        borderTopWidth: 1,
        zIndex: -1,
    },

    groupIcon: {
        backgroundColor: "white"
    },

    borderStyle: {
        position: "absolute",
        left: -20,
        top: 0,
        width: 0,
        height: 0,
        // borderTopWidth: 10,
        // borderTopColor: "transparent",
        borderRightWidth: 20,
        borderRightColor: "white",
        borderBottomWidth: 20,
        borderBottomColor: "transparent",
        borderTopLeftRadius: 10,
    },

    myMessageBorderStyle: {
        position: "absolute",
        top: 0,
        width: 0,
        height: 0,
        right: -20,
        borderLeftWidth: 20,
        borderLeftColor: "#dcf8c6",
        borderBottomWidth: 20,
        borderBottomColor: "transparent",
        borderTopRightRadius: 10
    },

    messageReply: {
        alignSelf: "flex-start",
        // textAlign: "left",
        // width: 100,
        marginTop: -10,
        marginLeft: 25
    },
    myMessageReply: {
        alignSelf: "flex-end",
        marginRight: 25
    },
    replyText: {
        padding: 2,
        fontSize: 16,
        textAlign: "right",
        color: "dodgerblue",
        // backgroundColor: "white"
    },
    leftAction: {
        position: "absolute",
    },

    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 50,
        marginRight: 10
    },
    searchIcon: {
        padding: 10,
    },
    // input: {
    //     flex: 1,
    //     paddingTop: 10,
    //     paddingRight: 10,
    //     paddingBottom: 10,
    //     paddingLeft: 0,
    //     backgroundColor: '#fff',
    //     color: '#424242',
    // },
    opacity: {
        opacity: 0.4
    }
})