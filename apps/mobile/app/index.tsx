import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Store, Mail, Lock } from 'lucide-react-native';
// Here is our digital backpack connecting to the database!
import { supabase } from '../lib/supabase'; 

export default function MobileLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Stop them if they left the email or password blank
    if (!email || !password) {
      Alert.alert("Hold up!", "Please enter both your email and password.");
      return;
    }

    setIsLoading(true);

    // 2. Ask Supabase if this user actually exists!
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setIsLoading(false);

    // 3. If Supabase says "No" (wrong password, fake email), show an error.
    if (error) {
      Alert.alert("Login Failed", error.message);
      return;
    }

    // 4. If Supabase says "Yes", let them into the app!
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-slate-950 justify-center px-6">
      <View className="items-center mb-10">
        <View className="h-16 w-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 items-center justify-center mb-6">
          {/* @ts-ignore - Monorepo web types leaking into mobile */}
          <Store size={32} color="#10b981" strokeWidth={2.5} />
        </View>
        <Text className="text-3xl font-bold text-white tracking-tight mb-2">D Mall Register</Text>
        <Text className="text-slate-400 text-base text-center">Sign in to your shop terminal</Text>
      </View>

      <View className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 shadow-2xl">
        <View className="mb-4">
          <Text className="text-slate-300 text-sm font-medium mb-2 ml-1">Email Address</Text>
          <View className="flex-row items-center bg-slate-950/50 border border-slate-800 rounded-2xl px-4 h-14">
            {/* @ts-ignore - Monorepo web types leaking into mobile */}
            <Mail size={20} color="#64748b" />
            <TextInput className="flex-1 text-white ml-3 text-base" placeholder="owner@shop.com" placeholderTextColor="#475569" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-slate-300 text-sm font-medium mb-2 ml-1">Password</Text>
          <View className="flex-row items-center bg-slate-950/50 border border-slate-800 rounded-2xl px-4 h-14">
            {/* @ts-ignore - Monorepo web types leaking into mobile */}
            <Lock size={20} color="#64748b" />
            <TextInput className="flex-1 text-white ml-3 text-base" placeholder="••••••••" placeholderTextColor="#475569" value={password} onChangeText={setPassword} secureTextEntry />
          </View>
        </View>

        <TouchableOpacity onPress={handleLogin} disabled={isLoading} className="bg-emerald-600 h-14 rounded-2xl items-center justify-center shadow-lg shadow-emerald-600/20 flex-row">
          {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text className="text-white text-lg font-semibold tracking-wide">Unlock Terminal</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}