import React, { Component } from 'react'
import {
   Animated, View, Text, Image, TextInput, Dimensions, TouchableHighlight,
   TouchableWithoutFeedback, TouchableOpacity
} from 'react-native'
import styles from './HomeCss'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { fetchContacts, fetchGroups, fetchPlants } from "../../redux/actions/network/fetch";
import { fetchMessages, fetchGroupMessages } from '../../redux/actions/network/fetchMessages'
import { fetchMessagesCount, setRead, addMessage } from '../../redux/actions/network/messagesFunctions'
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux'
import List from '../List/List'
import commonStyles from '../styles'
import obj from '../config';
import Footer from '../Footer/Footer';
// import Sound from 'react-native-sound';
import AnimatedEllipsis from 'react-native-animated-ellipsis';


var Sound = require('react-native-sound')

Sound.setCategory('Playback');


const mqtt = require('mqtt')

class Home extends Component {


   options = {
      port: 9000,
      host: '52.66.213.147',
   };
   client = mqtt.connect('ws://52.66.213.147/mqtt', this.options)


   subscribeToTopic = (topic) => {
      this.client.subscribe(topic, (err) => {
         // console.log(err)
      })
   }

   hello = new Sound(require('../../assets/notify.mp3'), Sound.MAIN_BUNDLE, error => console.log(error))


   componentDidMount() {

      let scope = this
      this.client.on('connect', function () {
         // console.log("connected")
      })

      scope.client.on('message', function (topic, message) {
         // message is Buffer
         if (message != "shub") {
            let msg = JSON.parse(message)
            if (msg.sender != obj.mobile && (msg.reciever == obj.mobile || msg.reciever.includes('/'))) {
               scope.hello.play()
            }

            if ((msg.reciever != obj.currentTabTopic && msg.sender != obj.currentTabTopic) &&
               (msg.reciever == obj.mobile || msg.reciever.includes('/'))) {
               if (msg.reply_to_msg_id) {
                  scope.addNewMessage(msg, true)
               }
               else {
                  scope.addNewMessage(msg)
               }
            }
         }
      })
      this.props.fetchPlants();
      this.props.fetchContacts();
      this.props.fetchGroups();
      this.props.fetchMessages();
      this.props.fetchMessagesCount();
   }

   decreaseConversationCount = (topic) => {
      let counts = { ...this.state.counts }

      if (topic.includes('/')) {

         if (topic.split('/')[0] == "plants") {
            counts["PLANTS"]--;
         }
         else {
            counts["GROUPS"]--;
         }
      }
      else {
         counts["CONTACTS"]--;
      }
      this.setState({
         counts
      })
   }

   increaseConversationCount = (topic) => {
      let counts = { ...this.state.counts }

      if (topic.includes('/')) {
         if (topic.split('/')[0] == "plants") {
            counts["PLANTS"]++;
         }
         else {
            counts["GROUPS"]++;
         }
      }
      else {
         counts["CONTACTS"]++;
      }
      this.setState({
         counts
      })
   }

   setMessagesAsRead = (topic) => {
      this.decreaseConversationCount(topic)
      this.props.setRead(topic)
      this.props.fetchMessages()
      this.props.fetchGroupMessages(this.props.plants)
   }

   addNewMessage = (msg, isThread) => {
      if (!isThread) {
         let date = new Date()
         let year = date.getFullYear() % 100
         let day = date.getDate()
         let month = date.getMonth() + 1
         let hours = date.getHours()
         let minutes = date.getMinutes()
         let type = "AM"
         if (hours > 12) {
            hours -= 12
            type = "PM"
         }
         let time = `${hours}:${minutes} ${type}`
         if (day < 10) {
            day = `0${day}`
         }
         if (month < 10) {
            month = `0${month}`
         }
         let fullDate = `${day}/${month}/${year}`
         msg["fullDate"] = fullDate
         msg.time = time
         this.props.addMessage(msg)
      }
      if (msg.reciever.includes('/')) {
         if (!this.props.counts[msg.reciever]) {
            this.increaseConversationCount(msg.reciever)
         }
      }
      else if (!this.props.counts[msg.sender]) {
         this.increaseConversationCount(msg.sender)
      }
      this.props.fetchMessagesCount()
   }

   componentDidUpdate() {
      if (this.props.plants && !this.props.groupMessages.length) {
         this.props.fetchGroupMessages(this.props.plants)
      }
      if (Object.keys(this.props.counts).length) {
         let keys = Object.keys(this.props.counts)
         let counts = { ...this.state.counts }
         if (!Object.keys(counts).length) {
            counts["CONTACTS"] = keys.filter(item => !item.includes('/')).length
            counts["PLANTS"] = keys.filter(item => item.split('/')[0] == "plants").length
            counts["GROUPS"] = keys.filter(item => item.includes('/') && item.split('/')[0] != "plants").length
            this.setState({
               counts
            })
         }
      }
   }

   shouldComponentUpdate() {
      return true
   }

   getSnapshotBeforeUpdate() {
      let { contacts, groups, plants } = this.props
      this.subscribeToTopic(obj.mobile)
      contacts.map(user => {
         user.name = `${user.fname} ${user.lname}`
         // this.subscribeToTopic(user.topic)

      })

      groups.map(grp => {
         grp.name = grp.gname
         this.subscribeToTopic(grp.topic)

      })

      plants.map(pl => {
         pl.name = pl.itemName
         this.subscribeToTopic(pl.topic)

      })
      return true
   }

   initialLayout = { width: Dimensions.get('window').width };
   state = {
      index: 0,
      routes: [
         { key: 'contacts', title: 'CONTACTS' },
         { key: 'groups', title: 'GROUPS' },
         { key: 'plants', title: 'PLANTS' }

      ],
      showMenu: false,
      showSearch: false,
      searchText: '',
      counts: {}
   };



   renderScene = ({ route, jumpTo }) => {
      let contacts = this.props.contacts
      let groups = this.props.groups
      let plants = this.props.plants
      if (this.state.searchText) {
         contacts = contacts.filter(item => item.name.toLowerCase().startsWith(this.state.searchText.toLowerCase()))
         groups = groups.filter(item => item.name.toLowerCase().startsWith(this.state.searchText.toLowerCase()))
         plants = plants.filter(item => item.name.toLowerCase().startsWith(this.state.searchText.toLowerCase()))

      }
      switch (route.key) {
         case 'contacts':
            return <List
               data={contacts}
               messages={this.props.messages}
               navigation={this.props.navigation}
               counts={this.props.counts}
               setRead={this.setMessagesAsRead}
               handleOutside={this.handleOutside}
               searchText={this.state.searchText}
            />;
         case 'groups':
            return <List
               data={groups}
               messages={this.props.groupMessages}
               navigation={this.props.navigation}
               counts={this.props.counts}
               setRead={this.setMessagesAsRead}
               handleOutside={this.handleOutside}
               searchText={this.state.searchText}

            />;
         case 'plants':
            return <List
               data={plants}
               messages={this.props.groupMessages}
               navigation={this.props.navigation}
               counts={this.props.counts}
               setRead={this.setMessagesAsRead}
               handleOutside={this.handleOutside}
               searchText={this.state.searchText}

            />;
         default:
            return null;
      }
   };

   toggleMenu = () => {
      this.setState({
         showMenu: !this.state.showMenu
      })
   }

   handleOutside = () => {
      this.setState({
         showMenu: false,
      })
   }

   logout = () => {
      AsyncStorage.removeItem('mess-user')
      this.props.navigation.navigate("Login")
   }

   showSearch = () => {
      this.setState({
         showSearch: true
      })
   }

   handleSearch = (text) => {
      this.setState({
         searchText: text
      })
   }

   handleIndexChange = (index) => {
      this.handleOutside(),
         this.setState({ index })
   }


   render() {
      return (
         this.props.pending ?
            <View style={styles.loading}>
               <View style={commonStyles.flexColumn, { justifyContent: "center", alignItems: "center", height: "50%" }}>
                  <Image source={require('../../assets/nova-icon.png')} />
                  <Text style={styles.loadingText}>Messenger</Text>
                  <AnimatedEllipsis animationDelay={100} style={styles.loadingDots} />
               </View>
               <Footer />
            </View> :
            <>
               {
                  this.state.showMenu &&

                  <View style={[styles.userMenu]}>
                     <View style={styles.menuItem}>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                           <Text style={{ fontSize: 16 }}>
                              Welcome
                        </Text>
                           <Text style={styles.userName}>
                              {obj.name}
                           </Text>
                        </View>
                     </View>
                     <TouchableHighlight underlayColor="lightgray" onPress={() => { this.logout() }} style={styles.menuItem}>
                        <Text style={{ fontSize: 16 }}>Logout</Text>
                     </TouchableHighlight >
                  </View>
               }

               {
                  this.state.showSearch &&
                  <View style={[commonStyles.flexRow, { justifyContent: "flex-start", alignItems: "center" }]}>
                     <TouchableOpacity
                        onPress={() => {
                           this.setState({
                              showSearch: false,
                              searchText: ''
                           })
                        }}
                     >
                        <Image style={{ width: 20, height: 20, marginRight: 10, marginLeft: 5 }} source={require('../../assets/back-green.png')} />
                     </TouchableOpacity>
                     <TextInput
                        style={styles.search}
                        autoFocus={true}
                        value={this.state.searchText}
                        onChangeText={(text) => { this.handleSearch(text) }}
                        placeholder="Search..."
                     />
                  </View>
               }

               {
                  !this.state.showSearch &&
                  <TouchableWithoutFeedback
                     onPress={() => { this.handleOutside() }}>
                     <View style={[commonStyles.flexRow, styles.headerTop, { backgroundColor: "darkgreen" }]}>
                        <Text style={styles.heading}>Messenger</Text>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                           <TouchableOpacity onPress={this.showSearch} >
                              <Image style={[commonStyles.icon, commonStyles.mRight10, { width: 30, height: 30 }]} source={require('../../assets/search.png')} />
                           </TouchableOpacity>
                           <TouchableOpacity onPress={() => {
                              this.toggleMenu()
                           }} >
                              <Image style={[commonStyles.icon, { height: 30 }]} source={require('../../assets/menu-vertical.png')} />
                           </TouchableOpacity>
                        </View>
                     </View>
                  </TouchableWithoutFeedback>
               }
               {
                  <TabView

                     renderTabBar={props =>
                        // !this.state.showSearch &&
                        <TabBar
                           {...props}
                           indicatorStyle={{ backgroundColor: 'white' }}
                           style={{ backgroundColor: 'darkgreen' }}
                           renderLabel={({ route, focused, color }) => (
                              <View style={commonStyles.flexRow}>
                                 <Text style={[
                                    styles.labelStyle,
                                    focused ? styles.labelSelectedStyle : null,
                                 ]}>
                                    {route.title}
                                 </Text>
                                 {
                                    this.state.counts[route.title] > 0 &&
                                    <Text style={styles.count}>
                                       {this.state.counts[route.title]}
                                    </Text>
                                 }
                              </View>
                           )}

                        />
                     }
                     navigationState={this.state}
                     renderScene={this.renderScene}
                     onIndexChange={index => { this.handleIndexChange(index) }}
                     initialLayout={this.initialLayout}
                     style={{ backgroundColor: 'white', color: 'black' }}
                     tabStyle={{ backgroundColor: 'white' }}
                     indicatorStyle={{ backgroundColor: 'black' }}
                  />
               }

            </>
      )
   }
}


const mapStateToProps = state => ({
   contacts: state.data.contacts,
   groups: state.data.groups,
   plants: state.data.plants,
   messages: state.messages.messages,
   groupMessages: state.messages.groupMessages,
   counts: state.view.counts,
   pending: state.messages.pending
});

const mapDispatchToProps = dispatch => ({
   fetchContacts: () => dispatch(fetchContacts()),
   fetchGroups: () => dispatch(fetchGroups()),
   fetchPlants: () => dispatch(fetchPlants()),
   fetchMessages: () => dispatch(fetchMessages()),
   fetchGroupMessages: (plants) => dispatch(fetchGroupMessages(plants)),
   fetchMessagesCount: () => dispatch(fetchMessagesCount()),
   setRead: (topic) => dispatch(setRead(topic)),
   addMessage: (msg) => dispatch(addMessage(msg))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home)