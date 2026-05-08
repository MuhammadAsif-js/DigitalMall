import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ScanLine, ShieldAlert, Zap } from 'lucide-react-native';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  // NEW: State to control the flashlight
  const [isTorchOn, setIsTorchOn] = useState(false);

  if (!permission) return <View className="flex-1 bg-slate-950" />;

  if (!permission.granted) {
    // Keep your excellent original denied access screen
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center px-6">
        <ShieldAlert size={48} color="#ef4444" />
        <Text className="text-white text-xl font-bold mt-4 text-center">Camera Access Denied</Text>
        <Text className="text-slate-400 text-center mt-2 mb-6">D Mall needs your camera to scan product barcodes.</Text>
        <TouchableOpacity onPress={requestPermission} className="bg-emerald-600 px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/20">
          <Text className="text-white font-semibold text-lg">Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    Alert.alert("Barcode Scanned!", `Type: ${type}\nData: ${data}`, [{ text: "Scan Next Item", onPress: () => setScanned(false) }]);
  };

  return (
    <View className="flex-1 bg-slate-950">
      
      {/* 1. FIX: Make the Camera a sibling, not a container.
        Using StyleSheet.absoluteFillObject is fine here.
      */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={isTorchOn} // 2. FIX: Connect flashlight state
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['upc_a', 'upc_e', 'ean13', 'ean8', 'qr'] }}
      />

      {/* 3. FIX: New Full-Screen, Centered Overlay Container.
        'absolute inset-0' makes it fill the screen on top of the camera,
        and 'justify-center items-center' centers all children on the screen.
      */}
      <View className="absolute inset-0 bg-slate-950/60 justify-center items-center px-4">
        
        {/* Everything inside here is centered automatically */}
        
        <View className="items-center w-full">
          <Text className="text-white text-xl font-bold tracking-widest mb-12 shadow-black shadow-lg text-center">
            ALIGN BARCODE
          </Text>

          {/* The targeting box (now centered) */}
          <View className="w-80 h-52 border-2 border-emerald-500 rounded-2xl bg-transparent items-center justify-center overflow-hidden">
            <View className="absolute top-0 w-full h-0.5 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] opacity-50" />
            <ScanLine size={48} color="#10b981" className="opacity-20" />
          </View>
        </View>
        
        {/* Container for status text and button, now centered below the box */}
        <View className="items-center w-full mt-10 space-y-4">
          
          <View className="bg-slate-900/80 px-5 py-2.5 rounded-full border border-slate-800">
            <Text className="text-slate-300 text-sm font-medium">Waiting for product...</Text>
          </View>

          {/* 4. FIX: A centered, working, Tailwind-styled Flashlight toggle button */}
          <TouchableOpacity 
            onPress={() => setIsTorchOn(!isTorchOn)}
            className="mt-6 bg-slate-800/80 px-8 py-3 rounded-full border border-slate-700 active:bg-slate-700 flex-row items-center gap-2 shadow-lg"
          >
            <Zap size={18} color={isTorchOn ? '#10b981' : 'white'} />
            <Text className="text-white font-medium text-lg">
              {isTorchOn ? 'Turn Flashlight OFF' : 'Turn Flashlight ON'}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}