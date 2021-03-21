import React from 'react';
import { NavigationContainer, DefaultTheme  } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons} from '@expo/vector-icons';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);

// Import Screeen et composants
import HomeScreen from './screens/HomeScreen'
import CreateAccount from './screens/CreateAccountScreen'
import Login from './screens/LoginScreen'
import FavoriteScreen from './screens/FavoriteScreen'
import BookScreen from './screens/BookScreen'
import BookCard from './components/BookCard'

// Import Reducers
import catAPI from './reducers/categoryAPI.reducers';
import idAPI from './reducers/googleID.reducers'
import wishlist from './reducers/wishList.reducers'

// Import du Provider
import {Provider} from 'react-redux';

// Import du store
import {createStore, combineReducers}  from 'redux';

// Création du store
const store = createStore(combineReducers({catAPI, idAPI, wishlist}));

// Navigation
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const stackNavigator = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name="BookScreen" component={BookScreen} options={{headerShown: false}}/>
        <Stack.Screen name="BookCard" component={BookCard} options={{headerShown: false}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
        <Stack.Screen name="CreateAccount" component={CreateAccount} options={{headerShown: false}}/>
      </Stack.Navigator>
  );
  }

function App() {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fafafa',
    },
  };

 return (
  <Provider store={store}>
   <NavigationContainer theme={MyTheme}>
     <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Explorer') {
            iconName = 'compass-outline';
          } else if (route.name === 'Vos favoris') {
            iconName = 'heart-circle-outline';
          } 
          return <Ionicons name={iconName} size={30} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#23396c',
        inactiveTintColor: '#d9d4cd',
        style:{backgroundColor: 'white', height:60},
        labelStyle: {
          marginTop:0,
          marginBottom:10,
        },
        tabStyle: {
          paddingTop: 10,
        },
      }}>
        <Tab.Screen name="Explorer" component={stackNavigator} options={{ title: 'Explorer' }}/>
        <Tab.Screen name="Vos favoris" component={FavoriteScreen} />
     </Tab.Navigator>
   </NavigationContainer>
</Provider>
);
}

export default App;