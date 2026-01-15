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
    File,
    Phone,
    Building2,
    MapPin,
    Briefcase,
    Upload,
    CheckCircle,
    ArrowRight,
    ChevronLeft
} from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {
    BUSINESS_LOCATION_OPTIONS,
    BUSINESS_TYPE_OPTIONS,
} from '@/data/options';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import KeyboardAvoidingAreaView from '@/components/keyboard-avoiding-area-view';
import { useKyc } from '@/hooks/use-kyc.hook';
import { useColorScheme } from 'nativewind';
import { useRouter } from 'expo-router';

export default function KycScreen() {
    const {
        form: { control, formState, handleSubmit },
        handleKycSubmit,
        isLoading,
        currentStep,
        totalSteps,
        goNext,
        goBack
    } = useKyc();
    const { colorScheme } = useColorScheme();
    const router = useRouter();

    const handleDocumentSelection = async (
        onChange: (...event: any[]) => void,
    ) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                onChange(file);
            } else {
                onChange(null);
            }
        } catch (error) {
            console.error('Document Picker Error:', error);
            onChange(null);
        }
    };

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

    const handlePickerChoice = (onChange: (...event: any[]) => void) => {
        Alert.alert(
            'Select File Type',
            'Which kind of file would you like to upload?',
            [
                {
                    text: 'Photo or Video',
                    onPress: () => handleMediaSelection(onChange),
                },
                {
                    text: 'Document (PDF, DOCX, etc.)',
                    onPress: () => handleDocumentSelection(onChange),
                },
                { text: 'Cancel', style: 'cancel' },
            ],
        );
    };

    const ProgressBar = () => {
        return (
            <View className="flex-row justify-center gap-2 mb-6 mt-2">
                {Array.from({ length: totalSteps }).map((_, index) => {
                    const step = index + 1;
                    const isActive = step <= currentStep;
                    return (
                        <View
                            key={step}
                            className={`h-1.5 w-16 rounded-full ${isActive ? 'bg-[#10b981]' : 'bg-gray-200 dark:bg-zinc-800'}`}
                        />
                    )
                })}
            </View>
        )
    }

    const CustomHeader = () => (
        <View className="flex-row items-center justify-between py-4 border-b border-gray-100 dark:border-zinc-800 mb-2">
            <TouchableOpacity onPress={() => currentStep > 1 ? goBack() : router.back()}>
                <ChevronLeft size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-black dark:text-white">
                {currentStep === 1 ? 'Business Information' : `Step ${currentStep} of ${totalSteps}: Verification`}
            </Text>
            <View className="w-6" />
        </View>
    )

    return (
        <SafeAreaView edges={['top']} className="dark:bg-black flex-1 px-5 bg-white">
            <CustomHeader />
            <KeyboardAvoidingAreaView>
                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <ProgressBar />

                    <View className='flex gap-6 pb-10'>

                        {/* STEP 1: BUSINESS INFORMATION */}
                        {currentStep === 1 && (
                            <>
                                <View>
                                    <Text className="text-2xl font-bold text-black dark:text-white mb-2">Tell us about your trade</Text>
                                    <Text className="text-gray-500 dark:text-gray-400">Step 1 of {totalSteps}: Please provide your official business details to complete the KYC verification.</Text>
                                </View>

                                {/* Business Name */}
                                <View>
                                    <Text className="text-gray-600 dark:text-gray-300 mb-2 text-xs font-bold uppercase tracking-wider">Legal Business Name</Text>
                                    <Controller
                                        control={control}
                                        name="business_name"
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <View className="flex-row items-center border border-gray-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 px-4 h-14">
                                                    <TextInput
                                                        className="flex-1 text-black dark:text-white text-base"
                                                        placeholder="e.g. Lagos Textile Hub"
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

                                {/* Business Type */}
                                <View>
                                    <Text className="text-gray-600 dark:text-gray-300 mb-2 text-xs font-bold uppercase tracking-wider">Business Category</Text>
                                    <Controller
                                        control={control}
                                        name="business_type"
                                        render={({ field, fieldState: { error },
                                        }) => (
                                            <Select className='w-full' onValueChange={(option) => field.onChange(option?.value)}>
                                                <SelectTrigger className='w-full h-14 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl'>
                                                    <View className="flex-row items-center justify-between w-full pr-3">
                                                        <SelectValue className='text-black dark:text-white text-base' placeholder='Select business type' />
                                                    </View>
                                                </SelectTrigger>
                                                <SelectContent className='w-11/12'>
                                                    <SelectGroup>
                                                        {
                                                            BUSINESS_TYPE_OPTIONS.map((item) => (
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

                                {/* Business Location */}
                                <View>
                                    <Text className="text-gray-600 dark:text-gray-300 mb-2 text-xs font-bold uppercase tracking-wider">Business Location</Text>
                                    <Controller
                                        control={control}
                                        name="business_location"
                                        render={({ field, fieldState: { error },
                                        }) => (
                                            <Select className='w-full' onValueChange={(option) => field.onChange(option?.value)}>
                                                <SelectTrigger className='w-full h-14 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl px-4'>
                                                    <View className="flex-row items-center gap-3">
                                                        <MapPin size={18} color="#d4d4d8" />
                                                        <SelectValue className='text-black dark:text-white text-base' placeholder='Enter market or city name' />
                                                    </View>
                                                </SelectTrigger>
                                                <SelectContent className='w-11/12'>
                                                    <SelectGroup>
                                                        {
                                                            BUSINESS_LOCATION_OPTIONS.map((item) => (
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

                                {/* Business Phone Number */}
                                <View>
                                    <Text className="text-gray-600 dark:text-gray-300 mb-2 text-xs font-bold uppercase tracking-wider">Business Phone Number</Text>
                                    <Controller
                                        control={control}
                                        name="business_phone_number"
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <View className="flex-row items-center gap-3">
                                                    {/* Country Code Fake Input for visual match */}
                                                    <View className="h-14 w-28 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl flex-row items-center justify-center gap-2">
                                                        {/* Placeholder Flag Icon if needed, using text for now or just generic */}
                                                        <Text className="text-base text-black dark:text-white font-medium">+234</Text>
                                                    </View>

                                                    <View className="flex-1 flex-row items-center border border-gray-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 px-4 h-14">
                                                        <TextInput
                                                            className="flex-1 text-black dark:text-white text-base"
                                                            placeholder="801 234 5678"
                                                            placeholderTextColor="#9ca3af"
                                                            keyboardType="phone-pad"
                                                            value={field.value}
                                                            onChangeText={field.onChange}
                                                            onBlur={field.onBlur}
                                                        />
                                                    </View>
                                                </View>
                                                {error && <ErrorMessageDisplay message={error.message} />}
                                            </>
                                        )}
                                    />
                                    <Text className="text-gray-400 text-xs italic mt-2">Used for verification and cluster networking.</Text>
                                </View>
                            </>
                        )}


                        {/* STEP 2: DOCUMENTS */}
                        {currentStep === 2 && (
                            <>
                                <View>
                                    <Text className="text-2xl font-bold text-black dark:text-white mb-2">Upload Business Documents</Text>
                                    <Text className="text-gray-500 dark:text-gray-400">We need to verify your business entity and identity to activate your trading account.</Text>
                                </View>

                                {/* CAC Document */}
                                <View className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                                    <View className="border border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl h-32 items-center justify-center mb-4 bg-gray-50 dark:bg-black/20">
                                        <Upload size={32} color="#a1a1aa" className="mb-2" />
                                        <Text className="text-gray-400 text-xs text-center">Click or drag to upload</Text>
                                    </View>

                                    <Text className="text-lg font-bold text-black dark:text-white mb-1">CAC Document (Business Registration)</Text>
                                    <Text className="text-gray-400 text-xs mb-4">Certificate of Incorporation issued by the Corporate Affairs Commission.</Text>

                                    <View className="flex-row items-center justify-between">
                                        <View>
                                            <Text className="text-[#a16207] dark:text-[#fbbf24] text-[10px] font-bold uppercase tracking-wider mb-1">Accepted Formats</Text>
                                            <Text className="text-black dark:text-white text-xs font-medium">PDF, JPG (Max 5MB)</Text>
                                        </View>
                                        <Controller
                                            control={control}
                                            name="cac_document"
                                            render={({ field: { onChange, value }, fieldState: { error } }) => {
                                                const fileInfo = value as any;
                                                return (
                                                    <View>
                                                        <Pressable
                                                            onPress={() => handlePickerChoice(onChange)}
                                                            className={`px-6 py-3 rounded-xl ${fileInfo ? 'bg-green-100 dark:bg-green-900/30' : 'bg-[#a16207] dark:bg-[#fbbf24]'} `}
                                                        >
                                                            <Text className={`${fileInfo ? 'text-green-700 dark:text-green-400' : 'text-white dark:text-black'} font-bold`}>
                                                                {fileInfo ? 'Changed' : 'Select File'}
                                                            </Text>
                                                        </Pressable>
                                                        {error && <View className="absolute top-12 right-0 w-32"><ErrorMessageDisplay message={error.message} /></View>}
                                                    </View>
                                                )
                                            }}
                                        />
                                    </View>
                                </View>

                                {/* National ID Document */}
                                <View className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                                    <View className="border border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl h-32 items-center justify-center mb-4 bg-gray-50 dark:bg-black/20">
                                        <View className="bg-[#a16207]/10 p-2 rounded-lg">
                                            <Building2 size={24} color="#a16207" />
                                        </View>
                                        <Text className="text-gray-400 text-xs text-center mt-2">Click or drag to upload</Text>
                                    </View>

                                    <Text className="text-lg font-bold text-black dark:text-white mb-1">National ID Document</Text>
                                    <Text className="text-gray-400 text-xs mb-4">Passport, Voter's Card, or National Identification Number (NIN).</Text>

                                    <View className="flex-row items-center justify-between">
                                        <View>
                                            <Text className="text-[#a16207] dark:text-[#fbbf24] text-[10px] font-bold uppercase tracking-wider mb-1">Accepted Formats</Text>
                                            <Text className="text-black dark:text-white text-xs font-medium">JPG, PNG (Max 5MB)</Text>
                                        </View>
                                        <Controller
                                            control={control}
                                            name="national_id_document"
                                            render={({ field: { onChange, value }, fieldState: { error } }) => {
                                                const fileInfo = value as any;
                                                return (
                                                    <View>
                                                        <Pressable
                                                            onPress={() => handlePickerChoice(onChange)}
                                                            className={`px-6 py-3 rounded-xl ${fileInfo ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-zinc-800'}`}
                                                        >
                                                            <Text className={`${fileInfo ? 'text-green-700 dark:text-green-400' : 'text-[#a16207] dark:text-[#fbbf24]'} font-bold`}>
                                                                {fileInfo ? 'Changed' : 'Select File'}
                                                            </Text>
                                                        </Pressable>
                                                        {error && <View className="absolute top-12 right-0 w-32"><ErrorMessageDisplay message={error.message} /></View>}
                                                    </View>
                                                )
                                            }}
                                        />
                                    </View>
                                </View>

                                <View className="bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-xl flex-row gap-3">
                                    <CheckCircle size={20} color="#10b981" />
                                    <View className="flex-1">
                                        <Text className="text-sm font-bold text-black dark:text-white mb-1">Secure Data Handling</Text>
                                        <Text className="text-xs text-gray-400 leading-5">Your documents are encrypted and processed according to international financial security standards. We never share your private data with third parties.</Text>
                                    </View>
                                </View>
                            </>
                        )}


                        {/* Action Buttons */}
                        <Pressable
                            className="bg-[#10b981] h-14 rounded-2xl items-center justify-center shadow-sm shadow-[#10b981]/20 mt-4 flex-row gap-2"
                            disabled={formState.isSubmitting || isLoading}
                            onPress={currentStep === totalSteps ? handleSubmit(handleKycSubmit) : goNext}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <>
                                    <Text className="text-white font-bold text-lg">
                                        {currentStep === totalSteps ? 'Submit Verification' : 'Continue'}
                                    </Text>
                                    {currentStep !== totalSteps && <ArrowRight size={20} color="white" />}
                                </>
                            )}
                        </Pressable>

                        {currentStep === 1 && (
                            <Text className="text-center text-gray-400 text-xs py-2">
                                By continuing, you agree to our <Text className="underline text-[#a16207] dark:text-[#fbbf24]">Terms of Service</Text>
                            </Text>
                        )}

                    </View>
                </ScrollView>
            </KeyboardAvoidingAreaView>
        </SafeAreaView>
    );
}
