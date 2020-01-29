import { StyleSheet, Dimensions } from 'react-native'
import commonStyles from '../styles'
let { height, width } = Dimensions.get('window');

export default StyleSheet.create({
    tab: {
        flex: 1,
        padding: 10
    },
    item: {
        paddingRight: 10,
        justifyContent: "flex-start"
    },
    image: {
        // justifyContent: "flex-start",
        padding: 5,
        // paddingRight: 0
        // paddingLeft: 0
    },

    nameContainer: {
        width: "80%",
        borderColor: "lightgray",
        borderBottomWidth: 1,
        padding: 10,
        paddingLeft: 0
    },
    name: {
        // marginLeft: 20,
        fontSize: 15
    },
    indicator: {
        display: "flex",
        alignItems: "flex-end",
    },
    count: {
        marginTop: 5,
        textAlign: "center",
        backgroundColor: "#06D755",
        color: "white",
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 1,
        paddingBottom: 1,
        borderRadius: 50,
        // minWidth: 25,
        // minHeight: 25,
    },
    lastMsgDate: {
        fontSize: 12,
        color: "gray"
    },
    unseen: {
        color: "#06D755"
    },
    userIcon: {
        width: 40,
        height: 40,
        marginRight: 10
    }
})