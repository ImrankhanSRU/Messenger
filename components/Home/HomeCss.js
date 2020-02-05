import { StyleSheet, Dimensions } from 'react-native'
import commonStyles from '../styles'
let { height, width } = Dimensions.get('window');

export default StyleSheet.create({
    header: {
        backgroundColor: "darkgreen"
    },
    heading: {
        ...commonStyles.font24,
        color: "white",
        
    },
    search: {
        backgroundColor: "white",
        height: 10
    },
    headerTop: {
        padding: 10
    },
    navBar: {
        padding: 10,
        paddingBottom: 0
    },
    tab: {
        marginTop: 10,
        width: "33%",
        textAlign: "center",
        borderBottomColor: "white",
        color: "white",
        opacity: 0.6,
        // borderBottomWidth: 3,
        paddingBottom: 20
    },
    active: {
        borderBottomWidth: 5,
        opacity: 1
    },
    scene: {
        flex: 1
    },
    contact: {
        padding: 10
    },
    userMenu: {
        position: "absolute",
        backgroundColor: "white",
        top: 30,
        right: 10,
        zIndex : 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 5,
        borderRadius: 5,
        paddingTop: 10,
        paddingBottom: 10,
        width: '60%'
    },
    menuItem: {
        padding: 10,
    },
    userName: {
        fontSize: 16,
        marginLeft: 10,
        color: "green"
    },
    loading: {
        // height: "70%",
        flex: 1,
        // alignItems: "center",
        justifyContent: "space-between"
    },
    loadingText: {
        marginTop: 20,
        color: "#72CE14",
        fontSize: 25,
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "100"
    },

    loadingDots: {
        fontSize: 30,
        color: "#72CE14"
    },

    labelStyle: {
        color: "gray",
        marginRight: 10
    },
    labelSelectedStyle: {
        color: "white"
    },
    count: {
        textAlign: "center",
        // backgroundColor: "white",
        color: "darkgreen",
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 1,
        paddingBottom: 1,
        borderRadius: 50,
        // minWidth: 25,
        // minHeight: 25,
    },

    search: {
        padding: 15,
        fontSize: 17
    }
})