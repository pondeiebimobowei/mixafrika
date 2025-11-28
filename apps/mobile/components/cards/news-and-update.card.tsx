import { ChevronRight, Megaphone } from "lucide-react-native";
import { Text, View } from "react-native";

export default function NewsAndUpdates(){
    const updates: { title: string, category: string }[] = []
    return (
        <View className='py-10 px-6 rounded-xl bg-white dark:bg-card mt-10'>
            {updates.length > 0 ?(
              <>
                <View className='flex flex-row items-center justify-between'>
                  <Text className='dark:text-white font-bold'>News & Updates</Text>
                  <Text className='text-primary font-bold '>View all</Text>
                </View>
                
                <View className='flex pt-6 gap-8'>
                  {updates.map((item, idx)=> (
                    <View key={idx} className='flex flex-row items-center justify-between'>
                      <View className='bg-primary/40 p-3 rounded-full'>
                        <Megaphone size={18} color={'green'} />
                      </View>
                      <View className='w-9/12'>
                        <Text className='dark:text-white font-semibold text-md'>{item.title}</Text>
                        <Text className='text-slate-600 dark:text-slate-300'>{item.category}</Text>
                      </View>
                      <ChevronRight className='' size={24} color={"grey"} />
                    </View>
                  ))}
                </View>
              </>
            ):(
              <Text className='dark:text-white font-bold'>No News & Updates</Text>
            )}
          </View>
    )
}