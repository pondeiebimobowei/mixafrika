import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignup } from '@/hooks/use-signup.hook';
import { Controller } from 'react-hook-form';

const SelectRoleScreen = () => {
  const { form, handleSignup } = useSignup();

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="bg-slate-900 py-10 px-4 ">
        <View>
          <Text className="text-white text-4xl font-bold">
            Create an Account
          </Text>
          <Text className="text-slate-300 text-xl">
            Join our community of investors, traders and agents.
          </Text>
        </View>

        <View className="flex gap-6">
          <View>
            <Text className="text-base text-white mb-2">First Name</Text>

            <Controller
              control={form.control}
              name="first_name"
              render={({ field, fieldState: { error } }) => (
                <>
                  <TextInput
                    className="w-full h-14 pl-4 pr-12 text-base border rounded-xl bg-slate-950 focus:border-white"
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
          <View>
            <Text className="text-base text-white mb-2">Last Name</Text>

            <Controller
              control={form.control}
              name="last_name"
              render={({ field, fieldState: { error } }) => (
                <>
                  <TextInput
                    className="w-full h-14 pl-4 pr-12 text-base border rounded-xl bg-slate-950 focus:border-white"
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

          <View>
            <Text className="text-base text-white mb-2">Email</Text>

            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState: { error } }) => (
                <>
                  <TextInput
                    className="w-full h-14 pl-4 pr-12 text-base border rounded-xl bg-slate-950 focus:border-white"
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
          <View>
            <Text className="text-base text-white mb-2">Password</Text>

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState: { error } }) => (
                <>
                  <TextInput
                    className="w-full h-14 pl-4 pr-12 text-base border rounded-xl bg-slate-950 focus:border-white"
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
          <View>
            <Text className="text-base text-white mb-2">Confirm Password</Text>

            <Controller
              control={form.control}
              name="confirm_password"
              render={({ field, fieldState: { error } }) => (
                <>
                  <TextInput
                    className="w-full h-14 pl-4 pr-12 text-base border rounded-xl bg-slate-950 focus:border-white"
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
        </View>

        <TouchableOpacity onPress={form.handleSubmit(handleSignup)}>
          <Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectRoleScreen;
