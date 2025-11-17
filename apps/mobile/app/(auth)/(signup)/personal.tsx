import ErrorMessageDisplay from '@/components/form/error-message-display';
import { Create_user_dto } from '@mixafrica/shared/validation/create-user-dto';
import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PersondalDetailsScreen() {
  const { control, trigger } = useFormContext<Create_user_dto>();
  const router = useRouter();

  const handleNext = async () => {
    const isValid = await trigger(['first_name', 'last_name', 'email']);

    if (isValid) {
      router.push('/(auth)/(signup)/security');
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-black py-10">
      <View className="flex-1 items-center justify-between">
        <View className="w-11/12">
          <View>
            <Text className="text-5xl font-bold text-white mb-2">Personal</Text>
            <Text className="text-2xl text-white">Tell us About yourself</Text>
          </View>

          <View className="py-10 gap-8">
            <View className="">
              <Text className="text-lg text-white mb-2">First Name</Text>

              <Controller
                control={control}
                name="first_name"
                render={({ field, fieldState: { error } }) => (
                  <>
                    <TextInput
                      className="text-white w-full h-16 pl-4 pr-12 text-base border border-slate-700 rounded-xl bg-slate-950 focus:border-primary focus:border-2"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                    />
                    {error && <ErrorMessageDisplay message={error.message} />}
                  </>
                )}
              />
            </View>
            <View>
              <Text className="text-base text-white mb-2">Last Name</Text>

              <Controller
                control={control}
                name="last_name"
                render={({ field, fieldState: { error } }) => (
                  <>
                    <TextInput
                      className="text-white w-full h-16 pl-4 pr-12 text-base border border-slate-700 rounded-xl bg-slate-950 focus:border-primary focus:border-2"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                    />
                    {error && <ErrorMessageDisplay message={error.message} />}
                  </>
                )}
              />
            </View>

            <View>
              <Text className="text-base text-white mb-2">Email</Text>

              <Controller
                control={control}
                name="email"
                render={({ field, fieldState: { error } }) => (
                  <>
                    <TextInput
                      className="text-white w-full h-16 pl-4 pr-12 text-base border border-slate-700 rounded-xl bg-slate-950 focus:border-primary focus:border-2"
                      keyboardType="email-address"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                    />
                    {error && (
                      <Text className="text-destructive mt-1">
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>
          </View>
        </View>

        <Pressable
          className="bg-primary p-3 rounded-xl w-11/12"
          onPress={handleNext}
        >
          <Text className="text-white font-bold text-center text-xl">
            Continue
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
