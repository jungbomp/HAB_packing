import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from './src/LoginScreen';
import SignUpScreen from "./src/SignUpScreen";
import WelcomeScreen from './src/WelcomeScreen';
import MainScreen from "./src/MainScreen";

const AppNavigator = createStackNavigator({
  
  Home: {
    screen: MainScreen,
    navigationOptions: {
      header: null
    }
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
      header: null
    }
  },
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: {
      header: null
    }
  },
  Main: {
    screen: MainScreen,
    navigationOptions: {
      header: null
    },
  },
});

export default createAppContainer(AppNavigator);