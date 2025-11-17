import { Create_user_dto } from '@mixafrica/shared/validation/create-user-dto';
import { useRouter } from 'expo-router';
import { Handshake, Sprout, TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const roles = [
  {
    id: 'trader',
    title: 'Trader',
    description: 'For active, short term market participant',
    icon: TrendingUp,
  },
  {
    id: 'investor',
    title: 'Investor',
    description: 'For active, short term market participant',
    icon: Sprout,
  },
  {
    id: 'agent',
    title: 'Agent',
    description: 'For active, short term market participant',
    icon: Handshake,
  },
];

export default function SelectRoleScreen() {
  const { control, trigger, watch } = useFormContext<Create_user_dto>();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState('');

  const handleNext = async () => {
    const isValid = await trigger(['role']);

    if (isValid) {
      router.push('/(auth)/(signup)/personal');
    }
  };
  return (
    <SafeAreaView className="flex-1 py-10 bg-black">
      <View className="flex-1 items-center justify-between">
        <View>
          <View>
            <Text className="text-4xl font-bold text-center text-white mb-2">
              Select Your Role
            </Text>
            <Text className=" text-center text-white">
              How will you be using the app?
            </Text>
          </View>

          <View className="py-10 w-fulls w-11/12">
            <Controller
              control={control}
              name="role"
              render={({ field, fieldState: { error } }) => (
                <>
                  <View className="flex justify-between gap-6 items-center my-4">
                    {roles.map((role) => {
                      const isSelected = selectedRole === role.id;

                      return (
                        <Pressable
                          key={role.id}
                          onPress={() => {
                            field.onChange(role.id);
                            setSelectedRole(role.id);
                          }}
                          className={`
                              border w-full items-center px-3 py-6  rounded-xl
                              flex flex-row gap-6
                              ${
                                isSelected
                                  ? `border-2 border-primary bg-primary`
                                  : 'border-white/50 bg-black'
                              }
                            `}
                        >
                          <View className="bg-slate-800 rounded-full p-3">
                            <role.icon
                              color={isSelected ? 'white' : 'white'}
                              size={24}
                            />
                          </View>

                          <View>
                            <Text
                              className={`text-lg mt-2 font-bold ${isSelected ? 'text-white' : 'text-white'}`}
                            >
                              {role.title}
                            </Text>
                            <Text className="text-slate-300">
                              {role.description}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>

                  {error && (
                    <Text className="text-red-500 mt-2">{error.message}</Text>
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
