import React, {PureComponent} from 'react';
import {View, Text, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import NetInfo from "@react-native-community/netinfo";

const {width} = Dimensions.get('window');
import obj from '../config.js'

function MiniOfflineSign() {
    return (
        <View style = {{marginBottom: 30}}>
            <View style={styles.offlineContainer}>
                <Text style={styles.offlineText}>No Internet Connection</Text>
            </View>
        </View>
    );
}

class OfflineNotice extends PureComponent {
    state = {
        isConnected: true
    };
   

    componentDidMount() {
        // console.log(NetInfo)
        NetInfo.addEventListener('connectionchange', this.handleConnectivityChange)
        console.log(NetInfo)
        NetInfo.fetch().then((info) => {
            // console.log(isConnected.isConnected)
            obj.isConnected = info.isConnected
            if (info.isConnected == true) {
                this.setState({isConnected: true})
            } else {
                this.setState({isConnected: false})
            }

        });

    }

    handleConnectivityChange = (isConnected) => {
        console.log('in _handleConnectivityChange')
        obj.isConnected = isConnected

        if (isConnected == true) {
            this.setState({isConnected: true})
        } else {
            this.setState({isConnected: false})
        }
    };

    componentWillUnmount() {

        // NetInfo.removeEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );

    }


    
    render() {
        if (!this.state.isConnected) {
            return <MiniOfflineSign/>;
        }
        return null
    }
}

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#ff1a1a',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width,
        zIndex: 10,
        position: 'absolute',
        top: 0,
        marginBottom: 20
    },
    offlineText: {color: '#fff'},

    submitButton: {
        backgroundColor: '#007bff',
        padding: 10,
        textAlign: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },

    offline: {
        marginTop: 50,
        marginBottom: 30
    }
});

export default OfflineNotice;
