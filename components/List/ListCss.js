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
    }
})