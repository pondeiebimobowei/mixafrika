import useFundApplication from '@/hooks/use-apply-for-funding.hook';
import { Controller } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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
  Briefcase,
  Calendar,
  File,
  LocateFixedIcon,
} from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {
  BUSINESS_LOCATION_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  PAYMENT_PLAN_OPTIONS,
  REPAYMENT_DURATION_OPTIONS,
} from '@/data/options';

export default function LoanApplication() {
  const {
    form: { control, handleSubmit },
    handleFundingApplication,
  } = useFundApplication();

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
        console.log(file);
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
    <SafeAreaView className="bg-black flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'android' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 50 : 0}
      >
        <ScrollView className="px-4 py-10 flex-1">
          <View>
            <Text className="text-white mb-2">Business Type</Text>
            <Controller
              control={control}
              name="business_type"
              render={({ field, fieldState: { error },
              }) => (
                <View className="">
                  <View className="flex flex-row items-center border border-solid border-slate-600 rounded-xl px-4">
                    <Briefcase color={'white'} />
                    <View style={dropDownStyles.container}>
                      <Dropdown
                        style={dropDownStyles.dropdown}
                        placeholderStyle={dropDownStyles.placeholderStyle}
                        selectedTextStyle={dropDownStyles.selectedTextStyle}
                        inputSearchStyle={dropDownStyles.inputSearchStyle}
                        iconStyle={dropDownStyles.iconStyle}
                        data={BUSINESS_TYPE_OPTIONS}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        searchPlaceholder="Search..."
                        value={field.value}
                        onChange={(item) => field.onChange(item.value)}
                      />
                    </View>


                  </View>
                  {error && (
                    <Text className="text-white mt-1">{error.message}</Text>
                  )}
                </View>
              )}
            />
          </View>
          <View>
            <Text className="text-white mb-2">Business Location</Text>
            <Controller
              control={control}
              name="business_location"
              render={({ field, fieldState: { error } }) => (
                <View>
                  <View className="flex flex-row items-center border border-solid border-slate-600 rounded-xl px-4">
                    <LocateFixedIcon color={'white'} />
                    <View style={dropDownStyles.container}>
                      <Dropdown
                        style={dropDownStyles.dropdown}
                        placeholderStyle={dropDownStyles.placeholderStyle}
                        selectedTextStyle={dropDownStyles.selectedTextStyle}
                        inputSearchStyle={dropDownStyles.inputSearchStyle}
                        iconStyle={dropDownStyles.iconStyle}
                        data={BUSINESS_LOCATION_OPTIONS}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        searchPlaceholder="Search..."
                        value={field.value}
                        onChange={(item) => field.onChange(item.value)}
                      />
                    </View>
                  </View>

                  {error && <ErrorMessageDisplay message={error.message} />}
                </View>
              )}
            />
          </View>

          <View>
            <Text className="text-white mb-2">Amount</Text>
            <Controller
              control={control}
              name="amount"
              render={({ field, fieldState: { error } }) => (
                <>
                  <TextInput
                    keyboardType="number-pad"
                    className="border border-slate-600 text-white rounded-xl px-4 py h-14"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                  {error && <ErrorMessageDisplay message={error.message} />}
                </>
              )}
            />
          </View>

          <View className="flex gap-6  flex-row items-center justify-between">
            <View className="w-[47%]">
              <Text className="text-white mb-2">Repayment Duration</Text>

              <Controller
                control={control}
                name="duration"
                render={({ field, fieldState: { error } }) => (
                  <View>
                    <View className="flex flex-row items-center border border-solid border-slate-600 rounded-xl px-4">
                      <Calendar color={'white'} />
                      <View style={dropDownStyles.container}>
                        <Dropdown
                          style={dropDownStyles.dropdown}
                          placeholderStyle={dropDownStyles.placeholderStyle}
                          selectedTextStyle={dropDownStyles.selectedTextStyle}
                          inputSearchStyle={dropDownStyles.inputSearchStyle}
                          iconStyle={dropDownStyles.iconStyle}
                          data={REPAYMENT_DURATION_OPTIONS}
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          searchPlaceholder="Search..."
                          value={field.value}
                          onChange={(item) => field.onChange(item.value)}
                        />
                      </View>
                    </View>

                    {error && <ErrorMessageDisplay message={error.message} />}
                  </View>
                )}
              />
            </View>
            <View className="w-[47%]">
              <Text className="text-white mb-2">Repayment Plan</Text>
              <Controller
                control={control}
                name="repayment_plan"
                render={({ field, fieldState: { error } }) => (
                  <View>
                    <View className="flex flex-row items-center border border-solid border-slate-600 rounded-xl px-4">
                      <Calendar color="white" />
                      <View style={dropDownStyles.container}>
                        <Dropdown
                          style={dropDownStyles.dropdown}
                          placeholderStyle={dropDownStyles.placeholderStyle}
                          selectedTextStyle={dropDownStyles.selectedTextStyle}
                          inputSearchStyle={dropDownStyles.inputSearchStyle}
                          iconStyle={dropDownStyles.iconStyle}
                          data={PAYMENT_PLAN_OPTIONS}
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          searchPlaceholder="Search..."
                          value={field.value}
                          onChange={(item) => field.onChange(item.value)}
                        />
                    </View>
                    </View>
                    {error && <ErrorMessageDisplay message={error.message} />}
                  </View>
                )}
              />
            </View>
          </View>

          <View>
            <Text className="text-white mb-2">Purpose of Funds</Text>
            <Controller
              control={control}
              name="purpose"
              render={({ field, fieldState: { error } }) => (
                <>
                  <TextInput
                    multiline={true}
                    numberOfLines={4}
                    placeholder="Enter your detailed feedback here..."
                    className="text-white border border-slate-600 rounded-xl px-4 py h-44"
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
              <View className=" flex flex-row border  items-center gap-2">
                <File color={'white'} />
                <Text className="text-white font-semibold">
                  Statement of Account
                </Text>
              </View>

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
                        {/* Your Button and Display Logic */}
                        <Pressable
                          onPress={() => handlePickerChoice(onChange)}
                          className="rounded-lg overflow-hidden"
                        >
                          <Text className="px-6 py-2 text-white bg-primary">
                            Upload
                          </Text>
                        </Pressable>
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
              className="bg-primary p-3 rounded-xl w-11/12 m-6"
              onPress={handleSubmit(handleFundingApplication)}
            >
              <Text className="text-white font-bold text-center text-xl">
                Submit
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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