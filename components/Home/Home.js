import React, { Component } from 'react'
import { View, Text, Image, TextInput, Dimensions, TouchableHighlight } from 'react-native'
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



   componentDidMount() {
      let scope = this
      this.client.on('connect', function () {
         // console.log("connected")
      })

      scope.client.on('message', function (topic, message) {
         // message is Buffer
         if (message != "shub") {
            let msg = JSON.parse(message)
            if (msg.reciever != obj.currentTabTopic && msg.sender != obj.currentTabTopic) {
               console.log("adding")
               scope.addNewMessage(msg)
            }
         }
      })
      this.props.fetchPlants();
      this.props.fetchContacts();
      this.props.fetchGroups();
      this.props.fetchMessages();
      this.props.fetchMessagesCount();
   }


   setMessagesAsRead = (topic) => {
      this.props.setRead(topic)
   }

   addNewMessage = (msg) => {
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
      this.props.fetchMessagesCount()
   }

   componentDidUpdate() {
      if (this.props.plants && !this.props.groupMessages.length) {
         this.props.fetchGroupMessages(this.props.plants)
      }
   }

   shouldComponentUpdate() {
      return true
   }

   getSnapshotBeforeUpdate() {
      let { contacts, groups, plants } = this.props
      contacts.map(user => {
         user.name = `${user.fname} ${user.lname}`
         this.subscribeToTopic(user.topic)
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
   };

   renderScene = ({ route, jumpTo }) => {
      // let messages = []
      // console.log(this.props.groupMessages)
      // if (this.props.messages.length && this.props.groupMessages.length) {
      //    messages = [{ ...this.props.messages[0], ...this.props.groupMessages[0] }]
      // }
      // if (messages.length) {
      switch (route.key) {
         case 'contacts':
            return <List
               data={this.props.contacts}
               messages={this.props.messages}
               navigation={this.props.navigation}
               counts={this.props.counts}
               setRead={this.setMessagesAsRead}
            />;
         case 'groups':
            return <List
               data={this.props.groups}
               messages={this.props.groupMessages}
               navigation={this.props.navigation}
               counts={this.props.counts}
               setRead={this.setMessagesAsRead}

            />;
         case 'plants':
            return <List
               data={this.props.plants}
               messages={this.props.groupMessages}
               navigation={this.props.navigation}
               counts={this.props.counts}
               setRead={this.setMessagesAsRead}

            />;
         default:
            return null;
      }
      // }
   };



   render() {
      return (
         <>
            <View style={[commonStyles.flexRow, styles.headerTop, { backgroundColor: "darkgreen" }]}>
               <Text style={styles.heading}>Messenger</Text>
               <View style={{ display: "flex", flexDirection: "row" }}>
                  <Image style={[commonStyles.icon, commonStyles.mRight10]} source={require('../../assets/search.png')} />
                  <Image style={commonStyles.icon} source={require('../../assets/menu-vertical.png')} />
               </View>
            </View>
            {/* <TabView
            renderTabBar={props =>
               <TabBar
                  {...props}
                  indicatorStyle={{ backgroundColor: 'white' }}
                  style={{ backgroundColor: '#06D755' }}
               />
            }
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
         >
         </TabView> */}
            <TabView
               renderTabBar={props =>
                  <TabBar
                     {...props}
                     indicatorStyle={{ backgroundColor: 'white' }}
                     style={{ backgroundColor: 'darkgreen' }}
                  />
               }
               navigationState={this.state}
               renderScene={this.renderScene}
               onIndexChange={index => this.setState({ index })}
               initialLayout={this.initialLayout}
               style={{ backgroundColor: 'white', color: 'black' }}
               tabStyle={{ backgroundColor: 'white' }}
               indicatorStyle={{ backgroundColor: 'black' }}
            />
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
   counts: state.view.counts
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