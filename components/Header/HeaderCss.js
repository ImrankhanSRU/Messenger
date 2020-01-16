import { StyleSheet, Dimensions } from 'react-native'
import { withOrientation } from 'react-navigation';

let { height, width } = Dimensions.get('window');
export default StyleSheet.create({
     header: {
          // padding: 20
     },
     heading: {
          color: '#4cd137',
          fontSize: 25,
          padding: 8,
          textAlign: 'center',
          marginBottom: 10,
          backgroundColor: "white"
     },
     headerImg: {
          //    marginTop: 30,
          // width: width * .6,
          // height: height / 7.2,
          marginLeft: 'auto',
          marginRight: 'auto',
     },
})