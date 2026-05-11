import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, Alert, FlatList } from 'react-native';
import { ShoppingCart, X } from 'lucide-react-native';
import { useCartStore } from '../../store/cartStore';
import { processCheckout } from '../../lib/api';

interface CheckoutModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ visible, onClose }: CheckoutModalProps) {
  const { items, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setIsLoading(true);
    const result = await processCheckout(items);
    setIsLoading(false);

    if (result.success) {
      clearCart();
      onClose();
      // Use Alert to simulate success haptic/alert
      Alert.alert("Success", "Sale completed and stock deducted.");
    } else {
      Alert.alert("Error", result.error || "Failed to process checkout.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-end bg-black/80">
        <View className="bg-slate-950 p-6 rounded-t-3xl border-t border-slate-800">
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center gap-2">
              <ShoppingCart size={24} color="#10b981" />
              <Text className="text-white text-2xl font-bold tracking-tight">Checkout</Text>
            </View>
            <TouchableOpacity onPress={onClose} disabled={isLoading}>
              <X size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <View className="bg-slate-900 rounded-2xl p-4 mb-6 border border-slate-800 max-h-64">
            {items.length === 0 ? (
              <Text className="text-slate-400 text-center py-4">Your cart is empty.</Text>
            ) : (
              <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View className="flex-row justify-between py-2 border-b border-slate-800 last:border-b-0">
                    <View className="flex-1">
                      <Text className="text-white font-medium">{item.name}</Text>
                      <Text className="text-slate-400">Qty: {item.quantity}</Text>
                    </View>
                    <Text className="text-white font-medium">Rs. {item.price * item.quantity}</Text>
                  </View>
                )}
              />
            )}

            {items.length > 0 && (
              <View className="flex-row justify-between mt-4 pt-4 border-t border-slate-700">
                <Text className="text-emerald-400 font-bold text-xl">Total</Text>
                <Text className="text-emerald-400 font-bold text-xl">Rs. {totalPrice}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleCheckout}
            disabled={isLoading || items.length === 0}
            className={`w-full py-4 rounded-xl items-center justify-center flex-row gap-2 ${
              isLoading || items.length === 0 ? 'bg-slate-800' : 'bg-emerald-600'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Complete Sale & Deduct Stock</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
