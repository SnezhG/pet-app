import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import PetProfileScreen from "../screens/pet/PetProfileScreen";

import PetEventCreateScreen from "../screens/pet-event/PetEventCreateScreen";
import PetEventsListScreen from "../screens/pet-event/PetEventsListScreen";
import PetEventEditFormScreen from "../screens/pet-event/PetEventEditFormScreen";
import PetEventsByDayScreen from "../screens/pet-event/PetEventsByDayScreen";
import PetEventViewScreen from "../screens/pet-event/PetEventViewScreen";

import PetClinicMapScreen from "../screens/map/PetClinicMapScreen";
import PetCreateScreen from "../screens/pet/PetCreateScreen";
import PetEditFormScreen from "../screens/pet/PetEditFormScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
                    } else if (route.name === 'PetMap') {
                        iconName = focused ? 'map' : 'map-outline';
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
            <Tab.Screen name="Event" component={PetEventsListScreen} />
            <Tab.Screen name="PetMap" component={PetClinicMapScreen} />
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
                <Stack.Screen name="PetProfile" component={PetProfileScreen} />
                <Stack.Screen name="PetCreate" component={PetCreateScreen} />
                <Stack.Screen name="PetEdit" component={PetEditFormScreen} />

                <Stack.Screen name="EventCreate" component={PetEventCreateScreen} />
                <Stack.Screen name="EventEdit" component={PetEventEditFormScreen} />
                <Stack.Screen name="EventsByDay" component={PetEventsByDayScreen} />
                <Stack.Screen name="EventView" component={PetEventViewScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
