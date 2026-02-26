import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLogin } from '@/hooks/use-login.hook';
import { Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { Link, useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, ShieldCheck, Briefcase } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

const CustomIcons = {
  GoogleIcon: () => (
    <Text className="text-xl font-bold text-blue-500">G</Text>
  ),
};

const AgentLoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { form, isLoading, handleLogin } = useLogin('agent');
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === 'dark';


  return (
    <SafeAreaView className="flex-1 bg-background p-6">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-10">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color={isDark ? 'white' : 'black'} />
          </TouchableOpacity>

          <View className="flex-row items-center space-x-2">
            <Text className="text-foreground font-medium text-base">Switch Role</Text>
          </View>

          <View></View>
        </View>

        <View className="flex-1 items-center">
          {/* Icon */}
          <View className="bg-violet-900/20 p-4 rounded-3xl mb-6">
            <ShieldCheck size={40} color="#8B5CF6" />
          </View>


          <Text className="text-4xl w-full text-center font-extrabold text-foreground mb-2">
            Agent Login
          </Text>
          <Text className="text-muted-foreground text-center mb-10">
            Manage field operations and onboarding
          </Text>

          {/* Email Input */}
          <View className="w-full mb-6">
            <Text className="text-base font-semibold text-foreground mb-2">
              Email
            </Text>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState: { error } }) => (
                <>
                  <View className={`flex-row items-center w-full h-14 pl-4 pr-4 border ${error ? 'border-destructive' : 'border-border'} rounded-xl bg-card focus:border-primary`}>
                    <View className="mr-3">
                      <Briefcase size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    </View>
                    <TextInput
                      className="flex-1 text-base text-foreground h-full"
                      placeholder="you@example.com"
                      placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </View>
                  {error && (
                    <Text className="text-sm text-destructive mt-1">
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          {/* Password Input */}
          <View className="w-full mb-2">
            <Text className="text-base font-semibold text-foreground mb-2">
              Password
            </Text>
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState: { error } }) => (
                <>
                  <View className={`flex-row items-center w-full h-14 pl-4 pr-4 border ${error ? 'border-destructive' : 'border-border'} rounded-xl bg-card focus:border-primary`}>
                    <TextInput
                      className="flex-1 text-base text-foreground h-full"
                      placeholder="........"
                      placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                      secureTextEntry={!showPassword}
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <EyeOff size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                      ) : (
                        <Eye size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                      )}
                    </TouchableOpacity>
                  </View>
                  {error && (
                    <Text className="text-sm text-destructive mt-1">
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          <View className="w-full items-end mb-6">
            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity>
                <Text className="text-violet-500 font-semibold">Forgot Password?</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={form.handleSubmit(handleLogin)}
            className="w-full bg-violet-500 p-4 mb-6 rounded-xl shadow-md shadow-violet-500/20"
          >
            {isLoading ? (
              <Text className="text-white text-center text-lg font-bold">Logging in...</Text>
            ) : (
              <View className="flex-row justify-center items-center">
                <Text className="text-white text-center text-lg font-bold mr-2">Sign In</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* OR Separator */}
          <View className="w-full flex-row items-center mb-6">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-muted-foreground text-sm mx-4">OR CONTINUE WITH</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Social Login Buttons */}
          <TouchableOpacity className="w-full flex-row items-center justify-center border border-border bg-card py-4 rounded-xl mb-10">
            <CustomIcons.GoogleIcon />
            <Text className="text-foreground text-base font-semibold ml-3">
              Google
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center mb-4">
            <Text className="text-muted-foreground mr-1">
              Don't have an account?
            </Text>
            <Link href={'/(auth)/(signup)/personal'} asChild>
              <TouchableOpacity>
                <Text className="text-violet-500 font-bold">
                  Register as Agent
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default AgentLoginScreen;
