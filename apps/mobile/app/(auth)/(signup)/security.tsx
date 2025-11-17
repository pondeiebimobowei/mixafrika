import { useSignup } from '@/hooks/use-signup.hook';
import { Create_user_dto } from '@mixafrica/shared/validation/create-user-dto';
import { Controller, useFormContext } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SecurityScreen() {
  const { control, handleSubmit, formState, trigger } =
    useFormContext<Create_user_dto>();
  const { handleSignup } = useSignup();

  const handleNext = async () => {
    const isValid = await trigger(['password', 'confirm_password']);

    if (isValid) {
      const submit = handleSubmit(handleSignup);
      submit();
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-black py-10">
      <View className="flex-1 items-center justify-between">
        <View className="w-11/12">
          <View>
            <Text className="text-4xl font-bold text-center text-white mb-2">
              Security
            </Text>
            <Text className=" text-center text-white">
              Tell us About yourself
            </Text>
          </View>

          <View>
            <Text className="text-base text-white mb-2">Password</Text>

            <Controller
              control={control}
              name="password"
              render={({ field, fieldState: { error } }) => (
                <>
                  <TextInput
                    className="w-full text-white h-16 pl-4 pr-12 text-base border border-slate-700 rounded-xl bg-slate-950 focus:border-primary"
                    secureTextEntry={true}
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
          <View>
            <Text className="text-base text-white mb-2">Password</Text>

            <Controller
              control={control}
              name="confirm_password"
              render={({ field, fieldState: { error } }) => (
                <>
                  <TextInput
                    className="w-full h-16 text-white pl-4 pr-12 text-base border border-slate-700 rounded-xl bg-slate-950 focus:border-primary"
                    secureTextEntry={true}
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
