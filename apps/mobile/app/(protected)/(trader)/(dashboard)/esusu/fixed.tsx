import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Controller } from 'react-hook-form';
import useCreateSavingsPlan from '@/hooks/use-create-savings-plan.hook';
import ErrorMessageDisplay from '@/components/form/error-message-display';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TriggerRef } from '@rn-primitives/select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TargetSavings() {

    const {
        is_loading,
        form: { control, setValue, handleSubmit },
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

    const SAVINGS_MATURITY_DATE_OPTIONS = [
        { label: '3 Months', value: '3' },
        { label: '6 Months', value: '6' },
        { label: '12 Months', value: '12' },
    ]

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
                    <Text className="text-white font-semibold mb-2">Amount to Lock</Text>
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

                    <View className='mb-4 w-full'>
                        <Text className="text-white font-semibold mb-2">Maturity Date</Text>
                        <Controller
                            control={control}
                            name="maturity_date"
                            render={({ field, fieldState: { error },
                            }) => (
                                <Select className='w-full' onValueChange={(option) => field.onChange(option?.value)}>
                                    <SelectTrigger onTouchStart={onTouchStart} className='w-full'>
                                        <SelectValue placeholder='Select a frequency' />
                                    </SelectTrigger>
                                    <SelectContent className='w-11/12'>
                                        <SelectGroup>
                                        {
                                            SAVINGS_MATURITY_DATE_OPTIONS.map((duration) => (
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
                    <View className='hidden'>
                        <Text className="text-white font-semibold mb-2">Type</Text>
                        <Controller
                            control={control}
                            name="type"
                            defaultValue='locked'
                            render={ _ => <></> }
                        />
                    </View>
                    
                </View>

                <View className="mb-6">
                    <Text className="text-white font-semibold mb-2">Funding Source</Text>

                    <Controller
                        control={control}
                        name="source_id"
                        // defaultValue="wallet"
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <Select className='w-full' onValueChange={(raw) => { 
                                console.log('raw', raw?.value)
                                // @ts-expect-error
                                const option = JSON.parse(raw?.value)
                                console.log('parsed', option)
                                setValue('source_type', option.type); onChange(option.id)}}>
                                    <SelectTrigger onTouchStart={onTouchStart} className='w-full'>
                                        <SelectValue placeholder='Select a frequency' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                [
                                                    {
                                                        id: '1e4f7e8b-5b8d-4c96-9312-dc0f8b7c94e4',
                                                        type: 'card',
                                                        masked_number: '5123...4193',
                                                        account_number: null,
                                                    },
                                                ].map((option) => (
                                                <SelectItem key={option.id} label={`Card (${option.masked_number})`} value={JSON.stringify({ id: option.id, type: option.type })} />
                                                ))
                                            }
                                            {
                                                [
                                                    {
                                                        id: '1e4f7e8b-5b8d-4c96-9312-dc0f8b7c94e7',
                                                        type: 'bank',
                                                        masked_number: null,
                                                        account_number: '12345678901',
                                                    },
                                                ].map((option) => (
                                                <SelectItem key={option.id} label={`Bank (${option.account_number})`} value={JSON.stringify({ id: option.id, type: option.type })} />
                                                ))
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                    {error && <ErrorMessageDisplay message={error.message} />}

                                    </Select>
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
