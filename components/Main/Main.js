import React, { Component } from 'react'
import { Text } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import obj from '../config'
import Home from '../Home/Home'
import Login from '../Login/Login'

class Main extends Component {
    state = {
        go: ''
    }
    componentDidMount() {
        // AsyncStorage.removeItem("mess-user")
        this.getUser()
    }

    getUser = async () => {
        await AsyncStorage.getItem('mess-user').then(item => {
            if (item) {
                let userData = JSON.parse(item)
                obj.userId = userData.id
                obj.user_hCode = userData.hCode
                obj.name = userData.name
                obj.mobile = userData.mobile
                this.setState({
                    go: true
                })
            }
            else {
                this.setState({
                    go: false
                })
            }
        })
    }

    render() {
        if (typeof this.state.go == "boolean") {
            if (this.state.go) {
                return <Home navigation = {this.props.navigation} />
            }
            else {
                return <Login props = {this.props} />
            }
        }
        else {
            return (<></>)
        }

    }
}

export default Main
