import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PrimaryButton from '../components/ui/PrimaryButton';

const Tab = createBottomTabNavigator();

const CalculatorScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900 px-6">
      <Text className="text-white text-2xl font-bold mb-8">
        Calculator Screen
      </Text>
      
      {/* Here is your custom Button Lego Brick! */}
      <PrimaryButton 
        title="Test Scanner Button" 
        onPress={() => alert("Button tapped!")} 
      />
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <Text className="text-white text-lg font-bold">Settings Screen</Text>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#020617', // slate-950
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#64748b', // slate-500
      }}
    >
      <Tab.Screen name="Calculator" component={CalculatorScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
