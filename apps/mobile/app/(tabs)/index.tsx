import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ScanLine, ShieldAlert, Zap, ShoppingCart, CheckCircle, XCircle } from 'lucide-react-native';
import { useCartStore } from '../../store/cartStore';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const MOCK_INVENTORY = [
  { id: '1', barcode: '123456789', name: 'Panadol Extra', price: 150, costPrice: 100, stock: 50 },
  { id: '2', barcode: '987654321', name: 'Brufen 400mg', price: 120, costPrice: 80, stock: 30 }
];

const mockInventoryLookup = (barcode: string) => {
  return MOCK_INVENTORY.find(item => item.barcode === barcode) || null;
};

export default function ScannerScreen() {
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [foundProduct, setFoundProduct] = useState<{name: string, price: number} | null>(null);
  const [notFound, setNotFound] = useState(false);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animations
  const pulseOpacity = useSharedValue(0.5);
  const scannerLineY = useSharedValue(0);
  const bottomSheetY = useSharedValue(400);

  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    scannerLineY.value = withRepeat(
      withSequence(
        withTiming(200, { duration: 2000, easing: Easing.linear }),
        withTiming(0, { duration: 2000, easing: Easing.linear })
      ),
      -1,
      false
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const animatedLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scannerLineY.value }],
  }));

  const animatedBottomSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomSheetY.value }],
  }));

  if (!permission) return <View className="flex-1 bg-slate-950" />;

  if (!permission.granted) {
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

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    setIsLoading(true);

    // Simulate small delay for mock lookup
    await new Promise(resolve => setTimeout(resolve, 300));
    const medicine = mockInventoryLookup(data);
    setIsLoading(false);

    if (medicine) {
      addItem({
        id: medicine.id,
        barcode: medicine.barcode,
        name: medicine.name,
        price: medicine.price,
        costPrice: medicine.costPrice
      });
      setFoundProduct({ name: medicine.name, price: medicine.price });
      bottomSheetY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.exp) });

      scanTimeoutRef.current = setTimeout(() => {
        resetScan();
      }, 2000);
    } else {
      setNotFound(true);
      bottomSheetY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.exp) });

      scanTimeoutRef.current = setTimeout(() => {
        resetScan();
      }, 2000);
    }
  };

  const resetScan = () => {
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }
    bottomSheetY.value = withTiming(400, { duration: 300, easing: Easing.in(Easing.exp) });
    setTimeout(() => {
      setScanned(false);
      setFoundProduct(null);
      setNotFound(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={isTorchOn}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['upc_a', 'upc_e', 'ean13', 'ean8', 'qr'] }}
      />

      {/* FIXED: The "Massive Border" trick creates a crystal clear physical hole for the camera */}
      <View style={[StyleSheet.absoluteFillObject, { overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }]} pointerEvents="none">
        <View style={{
          width: 320,
          height: 250,
          borderColor: 'rgba(2, 6, 23, 0.80)', // Dark glass color
          borderWidth: 1000, // Forces the glass to cover the rest of the screen
          position: 'absolute',
          marginTop: -80 // Aligns perfectly with your brackets
        }} />
      </View>

      {/* FOREGROUND UI */}
      <View style={StyleSheet.absoluteFillObject} className="justify-center items-center px-4" pointerEvents="box-none">
        
        <View className="items-center w-full mt-[-80px]" pointerEvents="none">
          <Text className="text-white text-xl font-bold tracking-widest mb-12 shadow-black shadow-lg text-center">
            ALIGN BARCODE
          </Text>

          <View className="w-80 h-[250px] bg-transparent items-center justify-center overflow-hidden relative">
            <Animated.View style={animatedPulseStyle} className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl" />
            <Animated.View style={animatedPulseStyle} className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl" />
            <Animated.View style={animatedPulseStyle} className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl" />
            <Animated.View style={animatedPulseStyle} className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-xl" />

            <Animated.View style={[animatedLineStyle, { position: 'absolute', top: 0, width: '100%', height: 2, zIndex: 10 }]}>
              <View className="w-full h-full bg-emerald-400 shadow-lg shadow-emerald-500/100" />
            </Animated.View>

            <ScanLine size={48} color="#10b981" className="opacity-20" />
          </View>
        </View>
        
        <View className="items-center w-full mt-12 gap-y-4">
          <View className="bg-slate-900/80 px-5 py-2.5 rounded-full border border-slate-800 flex-row items-center gap-2">
            {isLoading && <ActivityIndicator size="small" color="#10b981" />}
            <Text className="text-slate-300 text-sm font-medium">
              {isLoading ? 'Searching database...' : 'Waiting for product...'}
            </Text>
          </View>

          <TouchableOpacity 
            onPress={() => setIsTorchOn(!isTorchOn)}
            className="bg-slate-800/80 px-8 py-3 rounded-full border border-slate-700 active:bg-slate-700 flex-row items-center gap-2 shadow-lg"
          >
            <Zap size={18} color={isTorchOn ? '#10b981' : 'white'} />
            <Text className="text-white font-medium text-lg">
              {isTorchOn ? 'Turn Flashlight OFF' : 'Turn Flashlight ON'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* BOTTOM SHEETS */}
        {foundProduct && (
          <Animated.View style={animatedBottomSheetStyle} className="absolute bottom-28 w-full px-6">
            <View className="bg-slate-900/95 p-6 rounded-3xl border border-emerald-500/20 shadow-2xl">
              <View className="flex-row items-center gap-4 mb-4">
                <View className="bg-emerald-500/20 p-3 rounded-full">
                  <CheckCircle size={32} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="text-emerald-400 font-bold tracking-tight">SUCCESS</Text>
                  <Text className="text-white text-xl font-bold tracking-tight">Added {foundProduct.name} to Cart</Text>
                  <Text className="text-slate-400 text-lg">Rs. {foundProduct.price}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={resetScan} className="overflow-hidden rounded-2xl shadow-lg shadow-emerald-500/20 mt-2">
                <LinearGradient colors={['#059669', '#10b981']} className="py-4 items-center justify-center">
                  <Text className="text-white font-bold text-lg tracking-tight">Scan Next Item</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {notFound && (
          <Animated.View style={animatedBottomSheetStyle} className="absolute bottom-28 w-full px-6">
            <View className="bg-slate-900/95 p-6 rounded-3xl border border-rose-500/20 shadow-2xl">
              <View className="flex-row items-center gap-4 mb-4">
                <View className="bg-rose-500/20 p-3 rounded-full">
                  <XCircle size={32} color="#f43f5e" />
                </View>
                <View className="flex-1">
                  <Text className="text-rose-400 font-bold tracking-tight">NOT FOUND</Text>
                  <Text className="text-white text-xl font-bold tracking-tight">Unknown Product</Text>
                  <Text className="text-slate-400 text-lg">Item not in database</Text>
                </View>
              </View>
              <TouchableOpacity onPress={resetScan} className="overflow-hidden rounded-2xl shadow-lg mt-2">
                <LinearGradient colors={['#475569', '#334155']} className="py-4 items-center justify-center">
                  <Text className="text-white font-bold text-lg tracking-tight">Try Again</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {totalItems > 0 && !foundProduct && !notFound && (
          <View className="absolute bottom-28 w-full px-6">
            <TouchableOpacity
              className="bg-slate-900/95 px-6 py-4 rounded-3xl flex-row items-center justify-between shadow-2xl border border-emerald-500/30"
              onPress={() => Alert.alert("Cart", "View Cart functionality coming soon")}
            >
              <View className="flex-row items-center gap-3">
                <View className="bg-emerald-500/20 p-2 rounded-2xl">
                  <ShoppingCart size={24} color="#10b981" />
                </View>
                <View>
                  <Text className="text-white font-bold text-lg tracking-tight">View Cart</Text>
                  <Text className="text-emerald-500 font-medium">{totalItems} item{totalItems !== 1 ? 's' : ''}</Text>
                </View>
              </View>
              <Text className="text-white font-bold text-xl">Rs. {totalPrice}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}