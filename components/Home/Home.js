import React, { Component } from 'react'
import { View, Text, Image, TextInput, Dimensions, TouchableHighlight } from 'react-native'
import styles from './HomeCss'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { fetchContacts, fetchGroups, fetchPlants } from "../../redux/actions/fetch";
import { connect } from 'react-redux'

import List from '../List/List'
import commonStyles from '../styles'



class Home extends Component {

   componentDidMount() {
      this.props.fetchContacts();
      this.props.fetchGroups();
      this.props.fetchPlants();


   }

   componentDidUpdate() {

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
            return <List data={this.props.contacts} />;
         case 'groups':
            return <List data={this.props.groups} />;
         case 'plants':
            return <List data={this.props.plants} />;
         default:
            return null;
      }
   };



   render() {
      console.log("render")
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
                  style={{ backgroundColor: 'darkgreen' }}
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
   plants: state.data.plants
});

const mapDispatchToProps = dispatch => ({
   fetchContacts: () => dispatch(fetchContacts()),
   fetchGroups: () => dispatch(fetchGroups()),
   fetchPlants: () => dispatch(fetchPlants())

});

export default connect(mapStateToProps, mapDispatchToProps)(Home)