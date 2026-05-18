import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS } from 'react-native-reanimated';
import { useCartStore } from '../../store/cartStore';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react-native';

export default function CartScreen() {
  const { items, updateQuantity, updateCustomPrice, removeItem, clearCart, getTotalPrice } = useCartStore();
  const [localPrices, setLocalPrices] = useState<Record<string, string>>({});

  const translateY = useSharedValue(1000);
  const [isTenderVisible, setIsTenderVisible] = useState(false);
  const [cashReceived, setCashReceived] = useState('');

  const handleCheckout = () => {
    setIsTenderVisible(true);
    translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
  };

const resetTenderState = () => {
    setIsTenderVisible(false);
    setCashReceived('');
  };

  const closeTender = () => {
    translateY.value = withTiming(1000, { duration: 300 }, () => {
      runOnJS(resetTenderState)();
    });
  };

  const confirmSale = () => {
    const totalRevenue = getTotalPrice();
    const totalCost = items.reduce((total, item) => total + (item.costPrice * item.quantity), 0);
    const profit = totalRevenue - totalCost;

    console.log(`Checkout complete! Total Revenue: Rs. ${totalRevenue}, Profit: Rs. ${profit}`);
    clearCart();
    closeTender();
    Alert.alert("Success", "Sale Successful");
  };

  const tenderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handlePriceChange = (id: string, text: string) => {
    setLocalPrices(prev => ({ ...prev, [id]: text }));
    const newPrice = parseFloat(text);
    if (!isNaN(newPrice)) {
      updateCustomPrice(id, newPrice);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-slate-800 p-4 rounded-2xl mb-4 border border-slate-700 shadow-sm flex-row items-center">
      <View className="flex-1 mr-2">
        <Text className="text-white font-bold text-lg">{item.name}</Text>

        {/* Custom Price Override */}
        <View className="flex-row items-center mt-2">
          <Text className="text-slate-400 mr-2">Price: Rs.</Text>
          <TextInput
            className="bg-slate-900 text-emerald-400 font-bold px-3 py-1 rounded-lg border border-slate-700 w-24"
            keyboardType="numeric"
            value={localPrices[item.id] !== undefined ? localPrices[item.id] : item.price.toString()}
            onChangeText={(text) => handlePriceChange(item.id, text)}
            onBlur={() => {
              if (localPrices[item.id] === '' || isNaN(parseFloat(localPrices[item.id]))) {
                setLocalPrices(prev => ({ ...prev, [item.id]: item.price.toString() }));
              }
            }}
          />
        </View>
      </View>

      {/* Quantity Controls */}
      <View className="flex-row items-center bg-slate-900 rounded-xl p-1 border border-slate-700">
        <TouchableOpacity
          onPress={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
          className="p-2"
        >
          <Minus size={18} color="#64748b" />
        </TouchableOpacity>

        <Text className="text-white font-bold px-3">{item.quantity}</Text>

        <TouchableOpacity
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
          className="p-2"
        >
          <Plus size={18} color="#10b981" />
        </TouchableOpacity>
      </View>

      {/* Remove Button */}
      <TouchableOpacity
        onPress={() => removeItem(item.id)}
        className="ml-4 p-2 bg-rose-500/10 rounded-xl border border-rose-500/20"
      >
        <Trash2 size={20} color="#f43f5e" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-[#020617]">
      {/* Header */}
      <View className="px-6 pt-16 pb-6 bg-slate-900/50 border-b border-slate-800">
        <Text className="text-white text-3xl font-bold tracking-tight">My Cart</Text>
      </View>

      {/* Cart Content */}
      <View className="flex-1 px-6 pt-6">
        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <View className="bg-slate-800/50 p-6 rounded-full mb-4">
              <ShoppingCart size={48} color="#475569" />
            </View>
            <Text className="text-slate-400 text-lg font-medium">Cart is Empty</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 120 }} // Space for checkout footer
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Checkout Footer */}
      {items.length > 0 && (
        <View className="absolute bottom-0 w-full bg-slate-900 border-t border-slate-800 px-6 py-6 pb-8 shadow-2xl">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-slate-400 text-lg">Grand Total</Text>
            <Text className="text-white text-2xl font-bold tracking-tight">
              Rs. {getTotalPrice()}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleCheckout}
            className="bg-emerald-600 py-4 rounded-2xl items-center justify-center shadow-lg shadow-emerald-600/20"
          >
            <Text className="text-white font-bold text-lg tracking-tight">Complete Checkout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tender Screen Bottom Sheet */}
      {isTenderVisible && (
        <View style={StyleSheet.absoluteFillObject} className="z-50 bg-black/50 justify-end">
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={closeTender}
            activeOpacity={1}
          />
          <Animated.View style={[tenderStyle]} className="bg-slate-900 rounded-t-3xl border-t border-slate-800 p-6 shadow-2xl">
            <Text className="text-white text-3xl font-bold tracking-tight mb-6 text-center">
              Total Due: Rs. {getTotalPrice()}
            </Text>

            <Text className="text-slate-400 text-lg mb-2">Cash Received</Text>
            <TextInput
              className="bg-slate-950 text-emerald-400 font-bold text-4xl px-4 py-4 rounded-2xl border border-slate-700 mb-6 text-center"
              keyboardType="number-pad"
              value={cashReceived}
              onChangeText={setCashReceived}
              placeholder="0"
              placeholderTextColor="#334155"
            />

            <View className="flex-row justify-between mb-6">
              <TouchableOpacity
                onPress={() => setCashReceived(getTotalPrice().toString())}
                className="bg-slate-800 px-4 py-3 rounded-xl border border-slate-700 flex-1 mr-2 items-center"
              >
                <Text className="text-white font-bold">Exact</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCashReceived('500')}
                className="bg-slate-800 px-4 py-3 rounded-xl border border-slate-700 flex-1 mr-2 items-center"
              >
                <Text className="text-white font-bold">Rs. 500</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCashReceived('1000')}
                className="bg-slate-800 px-4 py-3 rounded-xl border border-slate-700 flex-1 mr-2 items-center"
              >
                <Text className="text-white font-bold">Rs. 1000</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCashReceived('5000')}
                className="bg-slate-800 px-4 py-3 rounded-xl border border-slate-700 flex-1 items-center"
              >
                <Text className="text-white font-bold">Rs. 5000</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-slate-800 p-4 rounded-2xl mb-6 items-center border border-slate-700">
              <Text className="text-slate-400 text-lg mb-1">Change Due</Text>
              <Text className="text-emerald-400 text-3xl font-bold">
                Rs. {cashReceived && parseFloat(cashReceived) >= getTotalPrice() ? parseFloat(cashReceived) - getTotalPrice() : 0}
              </Text>
            </View>

            <TouchableOpacity
              onPress={confirmSale}
              disabled={!cashReceived || parseFloat(cashReceived) < getTotalPrice()}
              className={`py-5 rounded-2xl items-center justify-center shadow-lg ${(!cashReceived || parseFloat(cashReceived) < getTotalPrice()) ? 'bg-slate-700' : 'bg-emerald-600 shadow-emerald-600/20'}`}
            >
              <Text className={`font-bold text-xl tracking-tight ${(!cashReceived || parseFloat(cashReceived) < getTotalPrice()) ? 'text-slate-400' : 'text-white'}`}>Confirm Sale</Text>
            </TouchableOpacity>
            <View className="h-4" />
          </Animated.View>
        </View>
      )}
    </View>
  );
}
