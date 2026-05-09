import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Calculator, Settings } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#020617', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold', letterSpacing: -0.5 },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="dark"
            style={StyleSheet.absoluteFill}
            className="rounded-full overflow-hidden"
          />
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: 24,
          left: 24,
          right: 24,
          elevation: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: 64,
          borderRadius: 9999,
          paddingBottom: Platform.OS === 'ios' ? 0 : 0,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#34d399', // emerald-400
        tabBarInactiveTintColor: '#64748b', // slate-500
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Register',
          tabBarIcon: ({ color, size, focused }) => (
            <View className={`p-2 rounded-full ${focused ? 'bg-emerald-500/20' : 'bg-transparent'}`}>
              <Calculator size={24} color={color} />
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <View className={`p-2 rounded-full ${focused ? 'bg-emerald-500/20' : 'bg-transparent'}`}>
              <Settings size={24} color={color} />
            </View>
          )
        }}
      />
    </Tabs>
  );
}