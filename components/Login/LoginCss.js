import { StyleSheet } from 'react-native'

export default StyleSheet.create({
   container: {
      // paddingTop: 20,
      flexGrow: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
   },

   input: {
      margin: 15,
      padding: 10,
      borderColor : '#aeb7bf',
      borderWidth: 1,
      borderRadius: 3
   },
   submitButton: {
      backgroundColor: '#28a745',
      padding: 10,
      textAlign: 'center',
      margin: 15,
      height: 40,
   },

    buttonDisabled : {
        opacity: .65
    },

   submitButtonText:{
      color: 'white',
      textAlign : 'center'
   },
   error: {
        textAlign: 'center',
        padding: 10,
        marginTop: 10,
        color: '#721c24',
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb'
   },
   inputContainer: {
         borderBottomColor: '#F5FCFF',
         backgroundColor: '#FFFFFF',
         borderRadius:30,
         borderBottomWidth: 1,
         width:'100%',
         paddingRight: 15,
         height:45,
         marginBottom:30,
         flexDirection: 'row',
         alignItems:'center'
     },
     inputs:{
         height:45,
         marginLeft:16,
         borderBottomColor: '#FFFFFF',
         flex:1,
     },
     inputIcon:{
       width:30,
       height:30,
       marginLeft:15,
       justifyContent: 'center'
     },
     buttonContainer: {
       height:45,
       flexDirection: 'row',
       justifyContent: 'center',
       alignItems: 'center',
       width:'100%',
       borderRadius:30,
     },
     loginButton: {
        backgroundColor: '#28a745',
        borderColor: '#28a745',
     },
     disableButton: {
        opacity: .65,
     },
     loginText: {
       color: 'white',
     }
})