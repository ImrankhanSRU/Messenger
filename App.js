import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from './components/Home/Home'
import Main from './components/Main/Main'
import Login from './components/Login/Login'

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
  }
});

const App = createAppContainer(MainNavigator);

export default App;