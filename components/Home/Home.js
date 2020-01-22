import React, { Component } from 'react'
import { View, Text, Image, TextInput, Dimensions, TouchableHighlight } from 'react-native'
import styles from './HomeCss'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { fetchContacts, fetchGroups, fetchPlants } from "../../redux/actions/network/fetch";
import { fetchMessages, fetchGroupMessages } from '../../redux/actions/network/fetchMessages'
import { fetchMessagesCount, setRead } from '../../redux/actions/network/messagesFunctions'
import { connect } from 'react-redux'

import List from '../List/List'
import commonStyles from '../styles'



class Home extends Component {

   componentDidMount() {
      this.props.fetchPlants();
      this.props.fetchContacts();
      this.props.fetchGroups();
      this.props.fetchMessages();
      this.props.fetchMessagesCount();
   }

   setMessagesAsRead = (topic) => {
      this.props.setRead(topic)
      this.props.fetchMessagesCount()
   }

   componentDidUpdate() {
      console.log(this.props.counts)
      if (this.props.plants && !this.props.groupMessages.length) {
         this.props.fetchGroupMessages(this.props.plants)
      }
   }

   getSnapshotBeforeUpdate() {
      let { contacts, groups, plants } = this.props
      contacts.map(user => {
         user.name = `${user.fname} ${user.lname}`
      })

      groups.map(grp => {
         grp.name = grp.gname
      })

      plants.map(pl => {
         pl.name = pl.itemName
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
      switch (route.key) {
         case 'contacts':
            return <List
               data={this.props.contacts}
               messages={this.props.messages}
               navigation={this.props.navigation}
               counts = {this.props.counts}
               setRead = {this.setMessagesAsRead}
            />;
         case 'groups':
            return <List
               data={this.props.groups}
               messages={this.props.groupMessages}
               navigation={this.props.navigation}
               counts = {this.props.counts}
               setRead = {this.setMessagesAsRead}

            />;
         case 'plants':
            return <List
               data={this.props.plants}
               messages={this.props.groupMessages}
               navigation={this.props.navigation}
               counts = {this.props.counts}
               setRead = {this.setMessagesAsRead}

            />;
         default:
            return null;
      }
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
   setRead: (topic) => dispatch(setRead(topic))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home)