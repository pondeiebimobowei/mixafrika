import useFundApplication from '@/hooks/use-apply-for-funding.hook';
import { Controller } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorMessageDisplay from '@/components/form/error-message-display';
import { Dropdown } from "react-native-element-dropdown"
import {
  File,
} from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {
  PAYMENT_PLAN_OPTIONS,
  REPAYMENT_DURATION_OPTIONS,
} from '@/data/options';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import KeyboardAvoidingAreaView from '@/components/keyboard-avoiding-area-view';
import { useBusinessState } from '@/store/hooks/business';

export default function LoanApplication() {
  const {
    form: { control, formState, handleSubmit },
    handleFundingApplication,
  } = useFundApplication();

  const { data: { business } } = useBusinessState();

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

  return (
    <SafeAreaView edges={['top']} className="dark:bg-black flex-1 px-3">
      <KeyboardAvoidingAreaView>
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className='flex gap-5'>
            <View>
              <Text className="dark:text-white mb-2">Business</Text>
              <Controller
                control={control}
                name="user_business_id"
                render={({ field, fieldState: { error },
                }) => (
                  <Select className='w-full ' onValueChange={(option) => field.onChange(option?.value)}>
                    <SelectTrigger className='w-full h-14 bg-white border-0 dark:border-input'>
                      <SelectValue className='text-black dark:text-white' placeholder='Select a business' />
                    </SelectTrigger>
                    <SelectContent className='w-11/12'>
                      <SelectGroup>
                        {
                          business.map((business) => (
                            <SelectItem key={business.id} label={business.name} value={business.id as string}>
                              {business.name}
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

            <View>
              <Text className="dark:text-white mb-2">Amount</Text>
              <Controller
                control={control}
                name="amount"
                render={({ field, fieldState: { error } }) => (
                  <>
                    <TextInput
                      keyboardType="number-pad"
                      className="bg-white dark:bg-black dark:border dark:border-input dark:text-white rounded-xl px-4 py h-14"
                      value={field.value}
                      onChangeText={field.onChange}
                      placeholder='500000'
                      onBlur={field.onBlur}
                    />
                    {error && <ErrorMessageDisplay message={error.message} />}
                  </>
                )}
              />
            </View>

            <View className="flex gap-6  flex-row items-center justify-between">
              <View className="w-[47%]">
                <Text className="dark:text-white mb-2">Repayment Plan</Text>

                <Controller
                  control={control}
                  name="repayment_plan"
                  render={({ field, fieldState: { error },
                  }) => (
                    <Select className='w-full' onValueChange={(option) => field.onChange(option?.value)}>
                      <SelectTrigger className='w-full h-14 bg-white border-0 dark:border-input'>
                        <SelectValue className='text-black dark:text-white' placeholder='Select a duration' />
                      </SelectTrigger>
                      <SelectContent className='w-11/12'>
                        <SelectGroup>
                          {
                            PAYMENT_PLAN_OPTIONS.map((duration) => (
                              <SelectItem key={duration.value} label={duration.label} value={duration.value}>
                                {duration.label}
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
              <View className="w-[47%]">
                <Text className="dark:text-white mb-2">Repayment Duration</Text>
                <Controller
                  control={control}
                  name="duration"
                  render={({ field, fieldState: { error },
                  }) => (
                    <Select className='w-full' onValueChange={(option) => field.onChange(option?.value)}>
                      <SelectTrigger className='w-full h-14 bg-white border-0 dark:border-input'>
                        <SelectValue className='text-black dark:text-white' placeholder='Select a plan' />
                      </SelectTrigger>
                      <SelectContent className='w-11/12'>
                        <SelectGroup>
                          {
                            REPAYMENT_DURATION_OPTIONS.map((duration) => (
                              <SelectItem key={duration.value} label={duration.label} value={duration.value}>
                                {duration.label}
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
            </View>

            <View>
              <Text className="dark:text-white mb-2">Purpose of Funds</Text>
              <Controller
                control={control}
                name="purpose"
                render={({ field, fieldState: { error } }) => (
                  <>
                    <TextInput
                      multiline={true}
                      numberOfLines={4}
                      placeholder="Enter your detailed feedback here..."
                      className="dark:text-white bg-white dark:bg-black p-4 dark:border dark:border-input rounded-xl px-4 py h-44"
                      textAlignVertical="top"
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
              <Text>Required Document</Text>

              <View className="flex flex-row justify-between  items-center w-full">


                <View>
                  <Controller
                    control={control}
                    name="statement" // The name of the field in your form data
                    rules={{ required: 'Please select a file to proceed.' }}
                    render={(
                      {
                        field: { onChange, value },
                        fieldState: { error },
                        formState,
                      },
                      // { formState:any, fieldState: { error: any }, field: { value: { uri: string, type: string, name: string, size: number }, onChange: (...evt: any[]) => void}, }
                    ) => {
                      // 'value' is the current fileInfo (or null) stored by RHF
                      const fileInfo = value as any;

                      return (
                        <View>
                          <View className='flex flex-row items-center justify-between w-full'>
                            <View className=" flex flex-row  items-center gap-1">
                              <File size={20} color={'white'} />
                              <Text className="dark:text-white">
                                Statement of Account
                              </Text>
                            </View>
                            {/* Your Button and Display Logic */}
                            <Pressable
                              onPress={() => handlePickerChoice(onChange)}
                              className="rounded-lg overflow-hidden"
                            >
                              <Text className="px-6 py-2 text-white bg-primary">
                                Upload
                              </Text>
                            </Pressable>
                          </View>
                          {error && (
                            <ErrorMessageDisplay message={error.message} />
                          )}
                        </View>
                      );
                    }}
                  />
                </View>
              </View>
              <Pressable
                className="bg-primary px-3 py-4 rounded-xl w-full my-6"
                disabled={formState.isSubmitting}
                onPress={handleSubmit(handleFundingApplication)}
              >
                <View className="flex flex-row items-center justify-center">
                  <Text className='text-white text-center text-lg'>
                    {formState.isSubmitting ? <ActivityIndicator size="small" color="white" /> : 'Submit'}

                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingAreaView>
    </SafeAreaView>
  );
}

export const dropDownStyles = StyleSheet.create({
  container: {
    color: "white",
    padding: 1,
  },
  dropdown: {
    height: 50,
    width: 300,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'black',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "white"
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "white"
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});