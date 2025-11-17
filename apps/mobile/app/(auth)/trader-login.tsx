import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLogin } from '@/hooks/use-login.hook';
import { Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

const CustomIcons = {
  GoogleIcon: () => <Text className="text-xl">G</Text>,
  FacebookIcon: () => <Text className="text-xl text-blue-600">f</Text>,
};

const LoginScreen = () => {
  const router = useRouter();

  const { form, handleLogin } = useLogin('trader');

  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <View className="flex-1 justify-center items-center">
        <Text className="text-4xl w-full font-extrabold text-gray-900 mb-1">
          Trader Login
        </Text>
        <Text className="w-full">
          Enter your credentials to access your investor dashboard.
        </Text>

        {/* Email Input */}
        <View className="w-full my-6">
          <Text className="text-base font-semibold text-gray-700 mb-2">
            Email
          </Text>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState: { error } }) => (
              <>
                <TextInput
                  className="w-full h-14 pl-4 pr-12 text-base border outline-none  border-gray-300 rounded-xl bg-white focus:border-blue-500"
                  keyboardType="email-address"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
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
        <View className="w-full my-4">
          <Text className="text-base font-semibold text-gray-700 mb-2">
            Password
          </Text>
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState: { error } }) => (
              <>
                <TextInput
                  className="w-full h-14 pl-4 pr-12 text-base border border-gray-300 rounded-xl bg-white focus:border-blue-500"
                  keyboardType="visible-password"
                  secureTextEntry={true}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
                {error && (
                  <Text className="text-sm text-destructive mt-1">
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={form.handleSubmit(handleLogin)}
          className="w-full bg-primary p-4 my-6 rounded-xl  shadow-md shadow-primary/50"
        >
          <Text className="text-white text-center text-lg font-bold bg-primary rounded-lg">
            Login as Trader
          </Text>
        </TouchableOpacity>

        {/* OR Separator */}
        <View className="w-full flex-row items-center my-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="text-gray-500 text-sm mx-4">OR</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Social Login Buttons */}
        <TouchableOpacity className="w-full flex-row items-center justify-center border border-gray-300 bg-white py-3 rounded-xl mb-3">
          <CustomIcons.GoogleIcon />
          <Text className="text-gray-700 text-base font-semibold ml-3">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="w-full flex-row items-center justify-center border border-gray-300 bg-white py-3 rounded-xl mb-8">
          <CustomIcons.FacebookIcon />
          <Text className="text-gray-700 text-base font-semibold ml-3">
            Continue with Facebook
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <Text className="text-gray-600 text-center">
          Don't have an account?{' '}
          <Text
            className="text-blue-500 font-semibold"
            onPress={() => router.push('/(auth)/(signup)/select-role')}
          >
            Sign up
          </Text>
        </Text>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default LoginScreen; // Uncomment to use
