import { useRouter } from 'expo-router';
import { FilePenLine } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

export default function WelcomeCard() {
  const router = useRouter();

  return (
    <View className=" py-10 my-4 bg-primary  rounded-xl flex-1 items-center justify-center ">
      <View className="w-full flex-1  px-6  items-center">
        <View className=" w-full p-3 rounded-full bg-primary/50 flex items-center">
          <FilePenLine size={40} color={'white'} className="h-40 w-40" />
        </View>

        <View className="my-6 w-full">
          <Text className="text-white text-2xl font-bold text-center">
            Welcome to MixAfrica
          </Text>
          <Text className="text-white font-light  mt-1 text-center">
            You don't have any active fundidng yet. Apply for a loan to get
            started and grow your business.
          </Text>
        </View>

        <View className="bg-white w-11/12 px-6 py-3 rounded-xl">
          <Pressable
            onPress={() =>
              router.push('/(protected)/(trader)/(dashboard)/loan/apply')
            }
          >
            <Text className="text-primary font-semibold text-center">
              Apply for Funding
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
