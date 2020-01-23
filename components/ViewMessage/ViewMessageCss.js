import { StyleSheet, Dimensions } from 'react-native'
let { height, width } = Dimensions.get('window');

export default StyleSheet.create({
    viewMessageContainer: {
        height: "100%",
        backgroundColor: "#e9ecef"
    },
    messageContainer: {
        height: "80%",
        backgroundColor: "#e9ecef",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end"
    },
    messages: {
        padding: 25,
        zIndex: -1,
    },
    message: {
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        marginTop: 10,
        backgroundColor: "white",
        // textAlign: "right",
        alignSelf: "flex-start",
        maxWidth: "80%",
    },
    myMessage: {
        // marginLeft: "20%",
        marginRight: 0,
        // width: 100,
        backgroundColor: "#dcf8c6",
        alignSelf: "flex-end"
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
        marginTop: 7
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
        width: "100%",
        borderTopColor: "#c9c9c9",
        borderTopWidth: 1,
        zIndex: -1,
    }
})