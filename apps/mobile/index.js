import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

export function App() {
  // This explicitly tells Metro where to find your folders, bypassing the Windows bug
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);