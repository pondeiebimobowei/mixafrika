import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { X, Check, ChevronDown, Calendar } from 'lucide-react-native';
import { useWalletState } from '@/store/hooks/wallet.hook';
import { formatCurrency } from '@/lib/utils';
import { Controller } from 'react-hook-form';
import useCreateSavingsPlan from '@/hooks/use-create-savings-plan.hook';
import { Dropdown } from 'react-native-element-dropdown';
import { dropDownStyles } from '@/app/(protected)/(trader)/(dashboard)/loan/apply';
import ErrorMessageDisplay from '@/components/form/error-message-display';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TriggerRef } from '@rn-primitives/select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function FixedSavings({ onClose, onSuccess }: { onClose?: () => void, onSuccess?: () => void }) {
    const { data: walletData } = useWalletState();
    const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);


    const {
        is_loading,
        form: { control, handleSubmit },
        handleCreateSavgingsPlan,
    } = useCreateSavingsPlan();

    const ref = React.useRef<TriggerRef>(null);
    
    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
        left: 12,
        right: 12,
    };
    
    // Workaround for rn-primitives/select not opening on mobile
    function onTouchStart() {
        ref.current?.open();
    }
    



    return (
        <ScrollView className="flex-1 p-4 pb-10 bg-black">
            <View className="flex-1">

                <View className='mb-4'>
                    <Text className="text-white font-semibold mb-2">Plan Name</Text>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                            <>
                                <TextInput
                                    placeholder="e.g. New Car"
                                    className="border border-slate-600 text-white p-4 rounded-xl font-medium"
                                    value={value}
                                    onChangeText={onChange}
                                    placeholderTextColor="#6B7280"
                                    onBlur={onBlur}
                                />

                                {error && <ErrorMessageDisplay message={error.message} />}
                            </>
                        )}
                    />
                </View>

                <View className='mb-4'>
                    <Text className="text-white font-semibold mb-2">Target Amount</Text>
                    <Controller
                        control={control}
                        name="target_amount"
                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                            <>
                                <TextInput
                                    placeholder="e.g. 500,000"
                                    className="border border-slate-600 text-white p-4 rounded-xl font-medium"
                                    value={value}
                                    onChangeText={onChange}
                                    placeholderTextColor="#6B7280"
                                    keyboardType='numeric'
                                    onBlur={onBlur}
                                />

                                {error && <ErrorMessageDisplay message={error.message} />}
                            </>
                        )}
                    />
                </View>
                
                <View className='flex flex-row justify-between '>

                    <View className='mb-4 w-[47%]'>
                        <Text className="text-white font-semibold mb-2">Duration (Month)</Text>
                        <Controller
                            control={control}
                            name="maturity_date"
                            render={({ field, fieldState: { error },
                            }) => (
                                <Select onValueChange={(option) => field.onChange(option?.value)} className='w-full'>
                                    <SelectTrigger onTouchStart={onTouchStart} className=''>
                                        <SelectValue placeholder='Select a duration' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                        {
                                            [
                                                { label: '3 Months', value: '3' },
                                                { label: '6 Months', value: '6' },
                                                { label: '12 Months', value: '12' },
                                            ].map((duration) => (
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

                    <View className='mb-4 w-[47%]'>
                        <Text className="text-white font-semibold mb-2">Frequency</Text>
                        <Controller
                            control={control}
                            name="frequency"
                            render={({ field, fieldState: { error },
                            }) => (
                                <Select className='w-full' onValueChange={(option) => field.onChange(option?.value)}>
                                    <SelectTrigger onTouchStart={onTouchStart} className='w-full'>
                                        <SelectValue placeholder='Select a frequency' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                        {
                                            [
                                                { label: 'Daily', value: 'daily' },
                                                { label: 'Weekly', value: 'weekly' },
                                                { label: 'Monthly', value: 'monthly' }
                                            ].map((duration) => (
                                            <SelectItem key={duration.value} label={duration.label} value={duration.value}>
                                                {duration.label}
                                            </SelectItem>
                                            ))
                                        }
                                        </SelectGroup>
                                    </SelectContent>
                                    {error && <ErrorMessageDisplay message={error.message} />}

                                    </Select>
                                // <View className="">
                                //     <View className="flex flex-row items-center border border-solid border-slate-600 rounded-xl px-4">
                                //         <Calendar color={'white'} />
                                //         <View style={dropDownStyles.container}>
                                //             <Dropdown
                                //                 style={dropDownStyles.dropdown}
                                //                 placeholderStyle={dropDownStyles.placeholderStyle}
                                //                 selectedTextStyle={dropDownStyles.selectedTextStyle}
                                //                 inputSearchStyle={dropDownStyles.inputSearchStyle}
                                //                 iconStyle={dropDownStyles.iconStyle}
                                //                 data={[
                                //                     { label: 'Daily', value: 'daily' },
                                //                     { label: 'Weekly', value: 'weekly' },
                                //                     { label: 'Monthly', value: 'monthly' }
                                //                 ]}
                                //                 maxHeight={300}
                                //                 labelField="label"
                                //                 valueField="value"
                                //                 searchPlaceholder="Search..."
                                //                 value={field.value}
                                //                 onChange={(item) => field.onChange(item.value)}
                                //             />
                                //         </View>


                                //     </View>
                                //     {error && (
                                //         <Text className="text-white mt-1">{error.message}</Text>
                                //     )}
                                // </View>
                            )}
                        />
                    </View>
                    
                </View>

                <View className="mb-6">
                    <Text className="text-white font-semibold mb-2">Funding Source</Text>

                    <Controller
                        control={control}
                        name="source"
                        // defaultValue="wallet"
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <View>
                                <TouchableOpacity
                                    onPress={() => setIsSourceDropdownOpen(!isSourceDropdownOpen)}
                                    className="border border-slate-600 p-4 rounded-xl flex-row justify-between items-center"
                                >
                                    { value ? (
                                        <View className="flex-row items-center">
                                        <View className="w-8 h-8 rounded-full bg-[#27AE60]/20 items-center justify-center mr-3">
                                            <Text className="text-[#27AE60] font-bold">W</Text>
                                        </View>
                                        <View>
                                            <Text className="text-white font-medium capitalize">{value}</Text>
                                            <Text className="text-gray-400 text-xs">
                                                Balance: {formatCurrency(walletData?.amount || 0)}
                                            </Text>
                                        </View>
                                    </View>
                                    ): (
                                        <View>
                                            <Text>Select Funding Source</Text>
                                        </View>
                                    )}

                                </TouchableOpacity>

                                {isSourceDropdownOpen && (
                                    <View className="mt-2 border border-slate-600 rounded-xl overflow-hidden">
                                        <TouchableOpacity
                                            onPress={() => {
                                                onChange("wallet");     // update RHF value
                                                setIsSourceDropdownOpen(false);
                                            }}
                                            className="p-4 flex-row items-center justify-between bg-[#374151]"
                                        >
                                            <View className="flex-row items-center">
                                                <View className="w-8 h-8 rounded-full bg-[#27AE60]/20 items-center justify-center mr-3">
                                                    <Text className="text-[#27AE60] font-bold">W</Text>
                                                </View>
                                                <View>
                                                    <Text className="text-white font-medium">Wallet</Text>
                                                    <Text className="text-gray-400 text-xs">
                                                        Balance: {formatCurrency(walletData?.amount || 0)}
                                                    </Text>
                                                </View>
                                            </View>

                                            {value === "wallet" && <Check size={16} color="#27AE60" />}
                                        </TouchableOpacity>
                                    </View>
                                )}
                                
                                {error && <ErrorMessageDisplay message={error.message} />}
                                
                            </View>
                        )}
                    />

                </View>


                <TouchableOpacity
                    onPress={handleSubmit(handleCreateSavgingsPlan)}
                    disabled={is_loading}
                    className="bg-[#27AE60] p-4 rounded-xl items-center mt-4"
                >
                    {is_loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Create Plan</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
