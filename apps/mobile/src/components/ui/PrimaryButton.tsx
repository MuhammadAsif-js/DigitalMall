import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  title, 
  onPress, 
  isLoading = false 
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.8}
      className="min-h-[56px] w-full rounded-xl bg-white flex items-center justify-center"
    >
      {isLoading ? (
        <ActivityIndicator color="#0f172a" size="small" />
      ) : (
        <Text className="text-slate-900 text-lg font-bold">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;