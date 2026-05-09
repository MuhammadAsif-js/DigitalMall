import { View, Text } from 'react-native';

export default function SettingsTab() {
  return (
    <View className="flex-1 bg-slate-950 px-6 pt-8">
      <Text className="text-white text-3xl font-bold tracking-tight mb-6">Settings</Text>

      <View className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 mb-4">
        <Text className="text-slate-400 text-base leading-relaxed">
          Welcome to the new, elite settings experience. Configure your app preferences here.
        </Text>
      </View>
    </View>
  );
}