import { StyleSheet, Dimensions } from 'react-native'

let { height, width } = Dimensions.get('window');

export default StyleSheet.create({
    flexRow: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
    },
    flexColumn: {
        flexDirection: "column"
    },
    icon: {
        height: 24,
        width: 24,
    },
    mRight10: {
        marginRight: 10
    },
    boldText: {
        fontWeight: "bold"
    },
    font24: {
        fontSize: 20
    }
})