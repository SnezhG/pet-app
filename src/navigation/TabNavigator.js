import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import PetEventsListScreen from '../screens/pet-event/PetEventsListScreen';
import ProfileScreen from "../screens/pet-user/ProfileScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'paw' : 'paw-outline';
                    } else if (route.name === 'Event') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'happy' : 'happy-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#78A75A',
                tabBarInactiveTintColor: '#9DC384',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarLabel: 'Питомцы',
            }} />
            <Tab.Screen name="Event" component={PetEventsListScreen} options={{
                tabBarLabel: 'События',
            }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{
                tabBarLabel: 'Профиль',
            }} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
