import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Clock, ShoppingBag } from 'lucide-react-native';

const TARGET_REVENUE = 45500;
const ITEMS_SOLD = 124;

const MOCK_TRANSACTIONS = [
  { id: '1', time: '10:42 AM', summary: '3 items', price: 1250 },
  { id: '2', time: '11:15 AM', summary: '1 item', price: 450 },
  { id: '3', time: '12:30 PM', summary: '5 items', price: 3200 },
  { id: '4', time: '1:05 PM', summary: '2 items', price: 850 },
  { id: '5', time: '2:45 PM', summary: '1 item', price: 150 },
  { id: '6', time: '3:20 PM', summary: '4 items', price: 2100 },
  { id: '7', time: '4:10 PM', summary: '2 items', price: 900 },
  { id: '8', time: '5:55 PM', summary: '6 items', price: 4500 },
];

function CountUp({ targetValue, duration = 500 }: { targetValue: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [duration, progress]);

  useAnimatedStyle(() => {
    const currentValue = Math.floor(progress.value * targetValue);
    runOnJS(setDisplayValue)(currentValue);
    return {};
  });

  return (
    <Text className="text-white text-5xl font-bold tracking-tight">
      Rs. {displayValue.toLocaleString()}
    </Text>
  );
}

function TransactionListItem({ item, index }: { item: any; index: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(
      index * 50, // 50ms stagger
      withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) })
    );
    translateY.value = withDelay(
      index * 50,
      withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) })
    );
  }, [index, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="mb-4">
      <View className="bg-slate-900/60 rounded-2xl p-4 flex-row items-center justify-between border border-white/5">
        <View className="flex-row items-center gap-4">
          <View className="bg-slate-800/80 p-3 rounded-full">
            <ShoppingBag size={20} color="#34d399" />
          </View>
          <View>
            <Text className="text-white font-semibold text-lg">{item.summary}</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <Clock size={14} color="#64748b" />
              <Text className="text-slate-400 text-sm">{item.time}</Text>
            </View>
          </View>
        </View>
        <Text className="text-emerald-400 font-bold text-lg">Rs. {item.price.toLocaleString()}</Text>
      </View>
    </Animated.View>
  );
}

export default function DashboardScreen() {
  const heroOpacity = useSharedValue(0);
  const heroScale = useSharedValue(0.95);

  useEffect(() => {
    heroOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) });
    heroScale.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.5)) });
  }, [heroOpacity, heroScale]);

  const animatedHeroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ scale: heroScale.value }],
  }));

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView className="flex-1 px-6 pt-6 pb-24">
        <Text className="text-white text-3xl font-bold tracking-tight mb-6">Analytics</Text>

        {/* Hero Card */}
        <Animated.View style={animatedHeroStyle}>
          <View className="bg-emerald-500/10 rounded-3xl p-6 border border-emerald-500/20 mb-8 overflow-hidden relative">
            <LinearGradient
              colors={['rgba(16, 185, 129, 0.15)', 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View className="flex-row items-center gap-2 mb-2">
              <TrendingUp size={20} color="#34d399" />
              <Text className="text-emerald-400 font-semibold tracking-tight text-lg">Today's Revenue</Text>
            </View>

            <CountUp targetValue={TARGET_REVENUE} duration={500} />

            <View className="mt-4 pt-4 border-t border-emerald-500/20 flex-row items-center justify-between">
              <Text className="text-slate-400 font-medium">Items Sold</Text>
              <Text className="text-white font-bold text-lg">{ITEMS_SOLD}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Recent Sales List */}
        <Text className="text-white text-xl font-bold tracking-tight mb-4">Recent Sales</Text>
        <View className="pb-24">
          {MOCK_TRANSACTIONS.map((item, index) => (
            <TransactionListItem key={item.id} item={item} index={index} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
