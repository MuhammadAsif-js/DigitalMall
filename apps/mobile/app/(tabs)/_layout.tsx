import { Tabs } from 'expo-router';
import { Calculator, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#020617', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
        headerTintColor: '#ffffff',
        tabBarStyle: { backgroundColor: '#0f172a', borderTopWidth: 1, borderTopColor: '#1e293b', height: 60, paddingBottom: 8, paddingTop: 8 },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Register', tabBarIcon: ({ color, size }) => <Calculator size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Settings size={size} color={color} /> }}
      />
    </Tabs>
  );
}