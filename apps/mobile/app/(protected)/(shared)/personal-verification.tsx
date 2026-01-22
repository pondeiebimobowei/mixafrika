import { Controller } from 'react-hook-form';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorMessageDisplay from '@/components/form/error-message-display';
import {
    ChevronLeft,
    Upload,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import KeyboardAvoidingAreaView from '@/components/keyboard-avoiding-area-view';
import { usePersonalVerification } from '@/hooks/use-personal-verification.hook';
import { useRouter } from 'expo-router';
import { ID_TYPES } from '@/data/options';

export default function PersonalVerificationScreen() {
    const {
        form: { control, formState, handleSubmit },
        handleVerificationSubmit,
        isLoading,
    } = usePersonalVerification();
    const router = useRouter();

    const handleMediaSelection = async (onChange: (...event: any[]) => void) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please grant photo library access.');
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                onChange(asset);
            } else {
                onChange(null);
            }
        } catch (error) {
            console.error('Image Picker Error:', error);
            onChange(null);
        }
    };

    const CustomHeader = () => (
        <View className="flex-row items-center justify-between py-4 border-b border-gray-100 dark:border-zinc-800 mb-2">
            <TouchableOpacity onPress={() => router.back()}>
                <ChevronLeft size={24} color={'white'} />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-white">
                Identity Verification
            </Text>
            <View className="w-6" />
        </View>
    )

    return (
        <SafeAreaView edges={['top']} className="bg-black flex-1 px-5">
            <CustomHeader />
            <KeyboardAvoidingAreaView>
                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <View className='flex gap-6 pb-10'>
                        <View>
                            <Text className="text-2xl font-bold text-white mb-2">Verify your identity</Text>
                            <Text className="text-gray-400">Please provide your personal identification details to verify your account.</Text>
                        </View>

                        {/* ID Type */}
                        <View>
                            <Text className="text-gray-300 mb-2 text-xs font-bold uppercase tracking-wider">ID Type</Text>
                            <Controller
                                control={control}
                                name="id_type"
                                render={({ field, fieldState: { error },
                                }) => (
                                    <Select className='w-full' onValueChange={(option) => field.onChange(option?.value)}>
                                        <SelectTrigger className='w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl'>
                                            <View className="flex-row items-center justify-between w-full pr-3">
                                                <SelectValue className='text-white text-base' placeholder='Select ID type' />
                                            </View>
                                        </SelectTrigger>
                                        <SelectContent className='w-11/12'>
                                            <SelectGroup>
                                                {
                                                    ID_TYPES.map((item) => (
                                                        <SelectItem key={item.value} label={item.label} value={item.value}>
                                                            {item.label}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                        {error && <ErrorMessageDisplay message={error.message} />}

                                    </Select>
                                )}
                            />
                        </View>

                        {/* ID Number */}
                        <View>
                            <Text className="text-gray-300 mb-2 text-xs font-bold uppercase tracking-wider">ID Number</Text>
                            <Controller
                                control={control}
                                name="id_number"
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <View className="flex-row items-center border border-zinc-800 rounded-2xl bg-zinc-900 px-4 h-14">
                                            <TextInput
                                                className="flex-1 text-white text-base"
                                                placeholder="Enter ID Number"
                                                placeholderTextColor="#9ca3af"
                                                value={field.value}
                                                onChangeText={field.onChange}
                                                onBlur={field.onBlur}
                                            />
                                        </View>
                                        {error && <ErrorMessageDisplay message={error.message} />}
                                    </>
                                )}
                            />
                        </View>

                        {/* ID Image */}
                        <View className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800 shadow-sm">
                            <View className="border border-dashed border-zinc-700 rounded-2xl h-32 items-center justify-center mb-4 bg-black/20">
                                <Upload size={32} color="green" className="mb-2" />
                                <Text className="text-gray-400 text-xs text-center">Click to upload ID image (front)</Text>
                            </View>

                            <Text className="text-lg font-bold text-white mb-1">Upload ID Image(front)</Text>
                            <Text className="text-gray-400 text-xs mb-4">Clear image of your selected ID.</Text>

                            <Controller
                                control={control}
                                name="id_image_front"
                                render={({ field: { onChange, value }, fieldState: { error } }) => {
                                    const fileInfo = value as any;
                                    return (
                                        <View>
                                            <Pressable
                                                onPress={() => handleMediaSelection(onChange)}
                                                className={`px-6 py-3 rounded-xl ${fileInfo ? 'bg-green-900/30' : 'bg-primary'} `}
                                            >
                                                <Text className={`${fileInfo ? 'text-green-400' : 'text-white'} font-bold text-center`}>
                                                    {fileInfo ? 'Changed' : 'Select Image'}
                                                </Text>
                                            </Pressable>
                                            {error && <View className="mt-2"><ErrorMessageDisplay message={error.message} /></View>}
                                        </View>
                                    )
                                }}
                            />
                        </View>

                        {/* ID Image */}
                        <View className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800 shadow-sm">
                            <View className="border border-dashed border-zinc-700 rounded-2xl h-32 items-center justify-center mb-4 bg-black/20">
                                <Upload size={32} color="green" className="mb-2" />
                                <Text className="text-gray-400 text-xs text-center">Click to upload ID image (back)</Text>
                            </View>

                            <Text className="text-lg font-bold text-white mb-1">Upload ID Image (back)</Text>
                            <Text className="text-gray-400 text-xs mb-4">Clear image of your selected ID.</Text>

                            <Controller
                                control={control}
                                name="id_image_back"
                                render={({ field: { onChange, value }, fieldState: { error } }) => {
                                    const fileInfo = value as any;
                                    return (
                                        <View>
                                            <Pressable
                                                onPress={() => handleMediaSelection(onChange)}
                                                className={`px-6 py-3 rounded-xl ${fileInfo ? 'bg-green-900/30' : 'bg-primary'} `}
                                            >
                                                <Text className={`${fileInfo ? 'text-green-400' : 'text-white'} font-bold text-center`}>
                                                    {fileInfo ? 'Changed' : 'Select Image'}
                                                </Text>
                                            </Pressable>
                                            {error && <View className="mt-2"><ErrorMessageDisplay message={error.message} /></View>}
                                        </View>
                                    )
                                }}
                            />
                        </View>

                        <Pressable
                            className="bg-primary h-14 rounded-2xl items-center justify-center shadow-sm shadow-[#10b981]/20 mt-4 flex-row gap-2"
                            disabled={formState.isSubmitting || isLoading}
                            onPress={handleSubmit(handleVerificationSubmit)}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text className="text-white font-bold text-lg">
                                    Submit Verification
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingAreaView>
        </SafeAreaView>
    );
}
