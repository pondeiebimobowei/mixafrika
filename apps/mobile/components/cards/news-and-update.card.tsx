import { ChevronRight, Megaphone } from "lucide-react-native";
import { Text, View } from "react-native";

export default function NewsAndUpdates(){
    return (
        <View className='py-10 px-4 rounded-xl bg-card my-10'>
            <View className='flex flex-row items-center justify-between'>
              <Text className='text-white text-xl font-bold'>News & Updates</Text>
              <Text className='text-primary text-xl font-bold '>View all</Text>
            </View>
            <View className='flex pt-6 gap-8'>
              {[1,2,3].map((item)=> (
                <View className='flex flex-row items-center justify-between'>
                  <View className='bg-primary/40 p-3 rounded-full'>
                    <Megaphone size={24} color={'green'} />
                  </View>
                  <View className='w-9/12'>
                    <Text className='text-white font-semibold text-md'>Tips for managing your daily cash flow</Text>
                    <Text className='text-slate-300 text'>Financial Tips</Text>
                  </View>
                  <ChevronRight className='' size={24} color={"grey"} />
                </View>
              ))}
            </View>
          </View>
    )
}