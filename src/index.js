import React from "react"; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native'

// pages
import Home from "./screens/home";
import Splash from './screens/splash';
import Basic from "./screens/basic";
import Map from "./screens/map";

const Stack = createNativeStackNavigator();

const App = () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Splash" component={Splash} options={{headerShown: false}}/>
            <Stack.Screen name="Home" component={Home} options={{headerLeft: () => (<View/>)}}/>
            <Stack.Screen name="Basic" component={Basic}/>
            <Stack.Screen name="Map" component={Map}/>
        </Stack.Navigator>
    </NavigationContainer>
)

export default App