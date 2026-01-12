import ErrorMessageDisplay from '@/components/form/error-message-display';
import { Create_user_dto } from '@mixafrica/shared/validation/create-user-dto';
import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { Pressable, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { ArrowLeft, Moon, Sun, Eye, EyeOff, Phone, Mail, Lock, User } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { useSignup } from '@/hooks/use-signup.hook';

export default function PersonalDetailsScreen() {
  const { control, handleSubmit, getValues } = useFormContext<Create_user_dto>();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const [showPassword, setShowPassword] = useState(false);
  const { handleSignup, isLoading } = useSignup();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-5 py-4">

        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 items-center justify-center"
          >
            <ArrowLeft size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          </TouchableOpacity>
        </View>

        {/* Title & Subtitle */}
        <View className="mb-5">
          <Text className="text-3xl font-bold text-black dark:text-white capitalize mb-2">Create {getValues('role')} Account</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-base">Start building your wealth today</Text>
        </View>

        {/* Form Fields */}
        <View className="gap-2">

          {/* Name Row */}
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-black dark:text-white font-bold mb-2 ml-1">First Name</Text>
              <Controller
                control={control}
                name="first_name"
                render={({ field, fieldState: { error } }) => (
                  <View>
                    <View className="flex-row items-center border border-gray-200 dark:border-zinc-800 rounded-2xl bg-gray-50 dark:bg-zinc-900 px-4 h-14">
                      <User size={18} color={colorScheme === 'dark' ? '#a1a1aa' : '#9ca3af'} />
                      <TextInput
                        className="flex-1 ml-3 mb-1 text-black dark:text-white text-base"
                        placeholder="John"
                        placeholderTextColor="#9ca3af"
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </View>
                    {error && <ErrorMessageDisplay message={error.message} />}
                  </View>
                )}
              />
            </View>

            <View className="flex-1">
              <Text className="text-black dark:text-white font-bold mb-2 ml-1">Last Name</Text>
              <Controller
                control={control}
                name="last_name"
                render={({ field, fieldState: { error } }) => (
                  <View>
                    <View className="flex-row items-center border border-gray-200 dark:border-zinc-800 rounded-2xl bg-gray-50 dark:bg-zinc-900 px-4 h-14">
                      <User size={18} color={colorScheme === 'dark' ? '#a1a1aa' : '#9ca3af'} />
                      
                      <TextInput
                        className="flex-1 text-black ml-3 mb-1 dark:text-white text-base"
                        placeholder="Doe"
                        placeholderTextColor="#9ca3af"
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </View>
                    {error && <ErrorMessageDisplay message={error.message} />}
                  </View>
                )}
              />
            </View>
          </View>

          {/* Phone Number */}
          <View>
            <Text className="text-black dark:text-white font-bold mb-2 ml-1">Phone Number</Text>
            <Controller
              control={control}
              name="phone_number"
              render={({ field, fieldState: { error } }) => (
                <View>
                  <View className="flex-row items-center border border-gray-200 dark:border-zinc-800 rounded-2xl bg-gray-50 dark:bg-zinc-900 px-4 h-14">
                    <Phone size={18} color={colorScheme === 'dark' ? '#a1a1aa' : '#9ca3af'} />
                    <TextInput
                      className="flex-1 ml-3 text-black dark:text-white text-base"
                      placeholder="+234 800 000 0000"
                      placeholderTextColor="#9ca3af"
                      keyboardType="phone-pad"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </View>
                  {error && <ErrorMessageDisplay message={error.message} />}
                </View>
              )}
            />
          </View>

          {/* Email */}
          <View>
            <Text className="text-black dark:text-white font-bold mb-2 ml-1">Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState: { error } }) => (
                <View>
                  <View className="flex-row items-center border border-gray-200 dark:border-zinc-800 rounded-2xl bg-gray-50 dark:bg-zinc-900 px-4 h-14">
                    <Mail size={18} color={colorScheme === 'dark' ? '#a1a1aa' : '#9ca3af'} />
                    <TextInput
                      className="flex-1 ml-3 text-black dark:text-white text-base"
                      placeholder="you@example.com"
                      placeholderTextColor="#9ca3af"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </View>
                  {error && <ErrorMessageDisplay message={error.message} />}
                </View>
              )}
            />
          </View>

          {/* Password */}
          <View>
            <Text className="text-black dark:text-white font-bold mb-2 ml-1">Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState: { error } }) => (
                <View>
                  <View className="flex-row items-center border border-gray-200 dark:border-zinc-800 rounded-2xl bg-gray-50 dark:bg-zinc-900 px-4 h-14">
                    <Lock size={18} color={colorScheme === 'dark' ? '#a1a1aa' : '#9ca3af'} />
                    <TextInput
                      className="flex-1 ml-3 text-black dark:text-white text-base"
                      placeholder="••••••••"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry={!showPassword}
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <EyeOff size={20} color={colorScheme === 'dark' ? '#a1a1aa' : '#9ca3af'} />
                      ) : (
                        <Eye size={20} color={colorScheme === 'dark' ? '#a1a1aa' : '#9ca3af'} />
                      )}
                    </TouchableOpacity>
                  </View>
                  {error && <ErrorMessageDisplay message={error.message} />}
                </View>
              )}
            />
          </View>

        </View>

        {/* Actions */}
        <View className="mt-8 gap-6">
          <Pressable
            className="bg-[#10b981] h-14 rounded-2xl items-center justify-center shadow-sm shadow-[#10b981]/20"
            onPress={handleSubmit(handleSignup)}
            // disabled={isLoading}
          >
            <Text className="text-white font-bold text-lg">
              {isLoading ? "Creating Account..." : "Continue"}
            </Text>
          </Pressable>

          <View className="flex-row items-center gap-4">
            <View className="flex-1 h-[1px] bg-gray-200 dark:bg-zinc-800" />
            <Text className="text-gray-400 text-xs font-bold uppercase">Or sign up with</Text>
            <View className="flex-1 h-[1px] bg-gray-200 dark:bg-zinc-800" />
          </View>

          <Pressable className="bg-white dark:bg-zinc-800 h-14 rounded-2xl border border-gray-200 dark:border-zinc-700 flex-row items-center justify-center gap-3">
            <Text className="text-black dark:text-white font-bold text-base">Google</Text>
          </Pressable>
        </View>

        {/* Bottom spacer */}
        <View className="h-10" />
      </View>
    </SafeAreaView>
  );
}
