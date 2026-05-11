import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, 
  Platform, ActivityIndicator, Alert, TouchableWithoutFeedback, 
  Keyboard, ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Store, Mail, Lock } from 'lucide-react-native';
import { supabase } from '../lib/supabase'; 

export default function MobileLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Track focus states for the glowing border effect
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hold up!", "Please enter both your email and password.");
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    setIsLoading(false);

    if (error) {
      Alert.alert("Login Failed", error.message);
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1 bg-slate-950"
      >
        {/* Ambient Emerald Background Glow */}
        <View className="absolute top-1/4 left-0 right-0 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-40 pointer-events-none" />

        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-10 mt-10">
            <View className="h-16 w-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
              {/* @ts-ignore */}
              <Store size={32} color="#10b981" strokeWidth={2.5} />
            </View>
            <Text className="text-3xl font-bold text-white tracking-tight mb-2">Welcome to D Mall</Text>
            <Text className="text-slate-400 text-base text-center">Pharmacy Terminal Login</Text>
          </View>

          <View className="bg-slate-900/50 rounded-3xl p-8 border border-white/10 shadow-2xl">
            <View className="mb-4">
              <Text className="text-slate-300 text-sm font-medium mb-2 ml-1">Email Address</Text>
              <View className={`flex-row items-center bg-slate-950/50 border rounded-2xl px-4 h-14 transition-colors ${isEmailFocused ? 'border-emerald-500' : 'border-slate-800'}`}>
                {/* @ts-ignore */}
                <Mail size={20} color={isEmailFocused ? "#10b981" : "#64748b"} />
                <TextInput 
                  className="flex-1 text-white ml-3 text-base" 
                  placeholder="owner@shop.com" 
                  placeholderTextColor="#475569" 
                  value={email} 
                  onChangeText={setEmail} 
                  keyboardType="email-address" 
                  autoCapitalize="none"
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                />
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-slate-300 text-sm font-medium mb-2 ml-1">Password</Text>
              <View className={`flex-row items-center bg-slate-950/50 border rounded-2xl px-4 h-14 transition-colors ${isPasswordFocused ? 'border-emerald-500' : 'border-slate-800'}`}>
                {/* @ts-ignore */}
                <Lock size={20} color={isPasswordFocused ? "#10b981" : "#64748b"} />
                <TextInput 
                  className="flex-1 text-white ml-3 text-base" 
                  placeholder="••••••••" 
                  placeholderTextColor="#475569" 
                  value={password} 
                  onChangeText={setPassword} 
                  secureTextEntry 
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleLogin} 
              disabled={isLoading} 
              activeOpacity={0.7}
              className="bg-emerald-600 h-14 rounded-2xl items-center justify-center shadow-lg shadow-emerald-600/30 flex-row"
            >
              {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text className="text-white text-lg font-bold tracking-wide">Sign In</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
