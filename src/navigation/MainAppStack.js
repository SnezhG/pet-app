import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';

import PetProfileScreen from '../screens/pet/PetProfileScreen';
import PetCreateScreen from '../screens/pet/PetCreateScreen';
import PetEditFormScreen from '../screens/pet/PetEditFormScreen';

import PetEventCreateScreen from '../screens/pet-event/PetEventCreateScreen';
import PetEventEditFormScreen from '../screens/pet-event/PetEventEditFormScreen';
import PetEventsByDayScreen from '../screens/pet-event/PetEventsByDayScreen';
import PetEventViewScreen from '../screens/pet-event/PetEventViewScreen';
import DocumentationViewer from "../documentation/DocumentationViewer";


const Stack = createNativeStackNavigator();

const MainAppStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: true }}>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="PetProfile" component={PetProfileScreen} />
            <Stack.Screen name="PetCreate" component={PetCreateScreen} />
            <Stack.Screen name="PetEdit" component={PetEditFormScreen} />
            <Stack.Screen name="EventCreate" component={PetEventCreateScreen} />
            <Stack.Screen name="EventEdit" component={PetEventEditFormScreen} />
            <Stack.Screen name="EventsByDay" component={PetEventsByDayScreen} />
            <Stack.Screen name="EventView" component={PetEventViewScreen} />
            <Stack.Screen name="Documentation" component={DocumentationViewer} />
        </Stack.Navigator>
    );
};

export default MainAppStack;
