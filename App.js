import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from './components/Home/Home'
import Main from './components/Main/Main'
import Login from './components/Login/Login'
import List from './components/List/List'
import ViewMessage from './components/ViewMessage/ViewMessage'
import Thread from './components/Thread/Thread'

const MainNavigator = createStackNavigator({

  Main: {
    screen: Main,
    navigationOptions: {
      headerShown: false,
    }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      headerShown: false,
    }
  },
  Home: {
    screen: Home,
    navigationOptions: {
      headerShown: false,
    }
  },
  List: {
    screen: List,
    navigationOptions: {
      headerShown: false,
    }
  },
  ViewMessage: {
    screen: ViewMessage,
    navigationOptions: {
      headerShown: false
    }
  },

  Thread: {
    screen: Thread,
    navigationOptions: {
      headerShown: false
    }
  },
});

const App = createAppContainer(MainNavigator);

export default App;