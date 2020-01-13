import React from 'react'
import { Router, Scene, Actions } from 'react-native-router-flux'
import Login from './components/Login/Login.js'
import obj from './components/config.js'

const Routes =() => {
    home = false
//    alert(obj.user_hCode)
    if(obj.user_hCode.length)
        home = true
    return (
       <Router>
          <Scene key = "root" >
             <Scene hideNavBar={true} key = "login" title = "Maintenance Hub" component = {Login}  initial = {true} />
          </Scene>
       </Router>
    )
}
export default Routes
