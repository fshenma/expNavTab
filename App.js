import React from 'react';
import { ActivityIndicator,Button, AsyncStorage,Text,StatusBar, StyleSheet, View,Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Version can be specified in package.json
import { TabNavigator,StackNavigator,SwitchNavigator, TabBarBottom ,NavigationActions} from 'react-navigation'; // Version can be specified in package.json

class HomeScreen extends React.Component {
  
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
        {/* <Button title="Actually, sign me out :)" onPress={this._signOutAsync} /> */}
      </View>
      
    );
  }

  // _signOutAsync = async () => {
  //   await AsyncStorage.clear();
  //   this.props.navigation.navigate('Auth');
  // };
}

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Sign in!" onPress={this._signInAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}

class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
}

class LogoutScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Sign Out" onPress={this._signOutAsync} />
      </View>
    );
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}


class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


const AppStack = TabNavigator(
  {
    Home: { screen: HomeScreen },
    Settings: { screen: SettingsScreen },
    Logout: {screen:LogoutScreen
      ,navigationOptions: ({navigation}) => ({
      tabBarOnPress: (scene, jumpToIndex) => {
          return Alert.alert(   // Shows up the alert without redirecting anywhere
              'Confirmation required'
              ,'Do you really want to logout?'
              ,[
                {text: 'Accept', onPress:async () => {
                  await AsyncStorage.clear();
                  navigation.navigate('Auth');
                }},
                {text: 'Cancel'}
               ]
          );
      },
  })},
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Settings') {
          iconName = `ios-options${focused ? '' : '-outline'}`;
        }
        else if (routeName === 'Logout') {
          iconName = `ios-log-out${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
    animationEnabled: false,
    swipeEnabled: false,
  }

  
);

const AuthStack = StackNavigator({ SignIn: SignInScreen });

export default SwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);
 