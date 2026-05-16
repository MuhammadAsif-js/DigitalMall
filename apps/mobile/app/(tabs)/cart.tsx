import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useCartStore } from '../../store/cartStore';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react-native';

export default function CartScreen() {
  const { items, updateQuantity, updateCustomPrice, removeItem, clearCart, getTotalPrice } = useCartStore();
  const [localPrices, setLocalPrices] = useState<Record<string, string>>({});

  const handleCheckout = () => {
    // Calculate total cost and profit
    const totalRevenue = getTotalPrice();
    const totalCost = items.reduce((total, item) => total + (item.costPrice * item.quantity), 0);
    const profit = totalRevenue - totalCost;

    console.log(`Checkout complete! Total Revenue: Rs. ${totalRevenue}, Profit: Rs. ${profit}`);
    clearCart();
  };

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
    </View>
  );
}
