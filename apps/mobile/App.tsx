import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import { View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </View>
  );
}