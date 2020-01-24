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
        width: '50%'
    },
    menuItem: {
        padding: 10,
    },
    userName: {
        fontSize: 16,
        marginLeft: 10,
        color: "green"
    }
})