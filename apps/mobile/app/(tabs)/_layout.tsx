import { Tabs } from 'expo-router';
import { Scan, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // THIS DESTROYS THE UGLY WHITE HEADER
        tabBarStyle: {
          backgroundColor: '#020617', // Deep slate-950 for the Midnight theme
          borderTopColor: '#1e293b', 
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#10b981', // Emerald green
        tabBarInactiveTintColor: '#64748b', // Muted slate
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color }) => <Scan size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}