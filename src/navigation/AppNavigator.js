import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import PetProfileScreen from "../screens/pet/PetProfile";
import PetAddScreen from '../screens/pet/PetAdd';
import ActivityListScreen from "../screens/activity/ActivitysList";
import ActivityScreen from "../screens/activity/ActivityFormView";
import EventListScreen from "../screens/event/EventsList";
import EventsByDateScreen from "../screens/event/EventsByDay";
import EventScreen from "../screens/event/EventFormView";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Activity') {
                        iconName = focused ? 'paw' : 'paw-outline';
                    } else if (route.name === 'Event') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
                headerStyle: {
                    backgroundColor: '#4CAF50',
                    marginBottom: 15,
                },
                headerTitleStyle: {
                    color: '#fff',
                    fontSize: 20,
                    fontWeight: 'bold',
                },
                headerTitle: 'Pet-App',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Activity" component={ActivityListScreen} />
            <Tab.Screen name="Event" component={EventListScreen} />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#4CAF50',
                    },
                    headerTitleStyle: {
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: 'bold',
                    },
                    headerTitle: 'Pet-App',
                }}
            >
                <Stack.Screen
                    name="MainTabs"
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="PetAdd" component={PetAddScreen} />
                <Stack.Screen name="PetProfile" component={PetProfileScreen} />
                <Stack.Screen name="EventsByDay" component={EventsByDateScreen} />
                <Stack.Screen name="ActivityFormView" component={ActivityScreen} />
                <Stack.Screen name="EventFormView" component={EventScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
