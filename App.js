import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Homescreem from './src/homescreen';
import ItemDetailsPage from './src/itemdetails';
import {Text, TextInput, View} from 'react-native';
import CommonText from './src/commontext';

const App = () => {
  const Stack = createStackNavigator();
  return (
    <CommonText />
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen
    //       name="Homescreen"
    //       component={Homescreem}
    //       options={{title: 'Homescreen', headerShown: false}}
    //     />
    //     <Stack.Screen
    //       name="Details"
    //       component={ItemDetailsPage}
    //       options={{title: 'Details', headerShown: false}}
    //     />
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default App;
