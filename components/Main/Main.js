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
        AsyncStorage.getItem('user').then(item => {
            if (item) {
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
        if (this.state.go != '') {
            if (this.state.go) {
                return <Home />
            }
            return <Login />
        }
        else {
            return (<></>)
        }

    }
}

export default Main
