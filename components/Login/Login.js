import React, { Component } from 'react'
import { View, ScrollView, Text, TouchableOpacity, TouchableHighlight, TextInput, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import Header from '../Header/Header.js'
import Footer  from '../Footer/Footer.js'
import obj from '../config.js'
import styles from './Login.js/index.js.js'
import checkConnection from '../checkConnection.js'
import OfflineNotice from '../OfflineNotice/OfflineNotice.js'

class Login extends Component {
   request = new XMLHttpRequest();

   state = {
      email: '',
      password: '',
      showError: false,
      errorText: '',
      disable: true,
      renderCall: false,
      isButtonDisabled: true,
      showPass: 'show',
      isShowPass: true,
   }



   img = {
        show: require('../../assets/icons8-invisible-24.png'),
        hide: require('../../assets/icons8-hide-24.png'),
        email: require('../../assets/email.png'),
        pass: require('../../assets/pass.png')
   }

   handleEmail = (text) => {
        this.setState({
            email: text,
        })

   }
   handlePassword = (text) => {
        this.setState({
            password: text,
        })

   }

   togglePassword = () => {
        if(this.state.showPass == 'show') {
            this.setState({
                showPass: 'hide',
                isShowPass: false,
            })
        }
        else {
            this.setState({
                showPass: 'show',
                isShowPass: true,
            })
        }
   }

   goToHome = (hCode) => {
        Actions.home(hCode)
   }

   checkConnection = () => {
        if(this.state.connection_Status == 'Online')
            return true
        return false
   }

   login = (email, pass) => {
        if(obj.isConnected) {
            fetch(obj.BASE_URL+"api/userManagement/authenticateUser", {
              method: 'POST',
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
              body: JSON.stringify({
                "uname": this.state.email,
                "pwd": this.state.password
              })
            })
            .then((response) => response.text())
            .then((responseText) => {
              responseObj = JSON.parse(responseText)
              if(responseObj.code != 200)  {
                this.setState({
                    showError: true,
                    errorText: responseObj.success
                })
              }
              else {
                  obj.name = responseObj.data.fname
                AsyncStorage.setItem('user', JSON.stringify({name: responseObj.data.fname, hCode: responseObj.data.hcode}));
                this.setState({
                    showError: false,
                })
                obj.user_hCode = responseObj.data.hcode
                this.goToHome({hCode: responseObj.data.hcode})
              }
            })
            .catch((error) => {
                console.error(error);
            });
        }

        else {
            this.setState({
                showError: false
            })
        }
   }

   componentDidMount() {
//     AsyncStorage.getItem('user').then((value) => alert(JSON.parse(value).hCode) )
   }


   render() {
      disable = true
      if(this.state.email.length && this.state.password.length)
        disable = false

      return (
           <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps={'handled'}
           >
                <OfflineNotice />

                <View style = {{marginTop: -40}}>
                    <Header text = ""/>
                </View>
                <View>
                    {
                        this.state.showError &&
                        <Text style = {styles.error}>{this.state.errorText}</Text>
                    }
                   <View style ={{
                       flex: 1,
                       justifyContent: 'center',
                       alignItems: 'center',
                       padding: 20
                   }}>
                       <View style={styles.inputContainer}>
                            <Image style={styles.inputIcon} source={this.img.email}/>
                            <TextInput style={styles.inputs}
                                placeholder="Email"
                                keyboardType="email-address"
                                underlineColorAndroid='transparent'
                                onChangeText={(email) => this.handleEmail(email)}
                            />
                       </View>

                        <View style={styles.inputContainer}>
                            <Image style={styles.inputIcon} source={this.img.pass}/>
                            <TextInput style={styles.inputs}
                                placeholder="Password"
                                secureTextEntry={this.state.isShowPass}
                                underlineColorAndroid='transparent'
                                onChangeText={(password) => this.handlePassword(password)}
                            />
                            <TouchableOpacity  onPress = {() => this.togglePassword()} >
                                <Image style={{width: 25}} source={this.img[this.state.showPass]}/>
                            </TouchableOpacity>
                        </View>

                        <TouchableHighlight disabled = {disable} style={[
                            styles.buttonContainer,
                            styles.loginButton,
                            disable && styles.disableButton
                        ]}
                            onPress={() => this.login()}>
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableHighlight>
                   </View>
                </View>

                <View>
                    <Footer />
                </View>

            </ScrollView>
      )
   }
}
export default Login