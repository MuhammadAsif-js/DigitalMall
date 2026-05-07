import { View, Text, TouchableOpacity } from 'react-native';

export default function CalculatorTab() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-950 px-6">
      <Text className="text-white text-2xl font-bold mb-8">
        Calculator & Scanner
      </Text>
      
      {/* Test Button for the future Barcode Scanner */}
      <TouchableOpacity 
        className="bg-emerald-600 px-8 py-4 rounded-xl shadow-lg shadow-emerald-600/20"
        onPress={() => alert("Scanner will open here!")}
      >
        <Text className="text-white font-bold text-lg">Test Scanner Button</Text>
      </TouchableOpacity>
    </View>
  );
}