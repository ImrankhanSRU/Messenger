

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from './components/Login/Login'
import Home from './components/Home/Home'
const MainNavigator = createStackNavigator({
  // Login: {
  //   screen: Login,
  //   navigationOptions: {
  //     headerShown: false,
  //   }
  // },
  Home: {
    screen: Home,
    navigationOptions: {
      headerShown: false,
    }
  }
});

const App = createAppContainer(MainNavigator);

export default App;