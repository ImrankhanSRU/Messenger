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
    }
})