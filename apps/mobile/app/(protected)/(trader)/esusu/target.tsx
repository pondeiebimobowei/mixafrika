import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Controller } from 'react-hook-form';
import useCreateSavingsPlan from '@/hooks/use-create-savings-plan.hook';
import ErrorMessageDisplay from '@/components/form/error-message-display';
import { TriggerRef } from '@rn-primitives/select';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, CreditCard, Lock, Wallet } from 'lucide-react-native';
import { cn, formatCurrency } from '@/lib/utils';
import { useWalletState } from '@/store/hooks/wallet.hook';

export default function TargetSavings() {

    const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card' | null>(null);
    
    const { data: { id: wallet_id } } = useWalletState()
    
    const {
        is_loading,
        form: { control, setValue, watch, trigger, handleSubmit },
        handleCreateSavgingsPlan,
    } = useCreateSavingsPlan();

    const ref = React.useRef<TriggerRef>(null);
    
    
    const targetAmount = watch('target_amount');
    const maturityDate = watch('maturity_date');

    const estReturn = React.useMemo(() => {
            const amount = Number(targetAmount) || 0;
            const months = Number(maturityDate) || 0;
            const rate = 0.12; // 12% fixed for now
            // Simple interest: P * R * T (years)
            return amount * rate * (months / 12);
        }, [targetAmount, maturityDate]);

    const BANK_CARDS = [
        {
           id: "cabe825f-d0aa-409b-94e8-299b4da65d9d",
           type: 'Visa Debit',
           number: '1234 5678 9012 3456',
           expiry: '12/25',
           cvv: '123',
        },

        {
            id: "cabe825f-d0aa-409b-94e8-299b4da65d9a",
            type: 'Mastercard Gold',
            number: '5678 1234 5678 1234',
            expiry: '12/25',
            cvv: '123',
        }
    ];

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-gray-200 dark:bg-black">

            <ScrollView className="flex-1 px-4 pb-10 pt-4" showsVerticalScrollIndicator={false}>
                <View className="flex-1 pb-10">
                    <View className='hidden'>
                        <Controller
                          control={control}
                          name="type"
                          defaultValue='target'
                          render={() => (
                            <></>
                          )}
                        />
                    </View>

                    {/* Plan Name */}
                    <View className='mb-6'>
                        <Text className="text-black dark:text-gray-400 text-xs font-bold uppercase mb-2">Plan Name</Text>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                <>
                                    <TextInput
                                        placeholder="e.g. New Shop Rent"
                                        className="bg-[#1f2937] text-white p-4 rounded-xl font-bold text-lg border border-transparent focus:border-[#10b981]"
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

                    {/* Target Amount */}
                    <View className='mb-6'>
                        <Text className="text-black dark:text-gray-400 text-xs font-bold uppercase mb-2">Target Amount</Text>
                        <Controller
                            control={control}
                            name="target_amount"
                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                <>
                                    <TextInput
                                        placeholder="₦ 0.00"
                                        className="bg-[#1f2937] text-white p-4 rounded-xl font-bold text-lg border border-transparent focus:border-[#10b981]"
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


                    <View className='mb-4 w-full'>
                        <Text className="text-black dark:text-gray-400 text-xs uppercase font-bold  mb-2">Liquidity Preference</Text>
                        <Controller
                            control={control}
                            name="is_locked"
                            defaultValue={false}
                            render={({ field: { value, onChange }, fieldState: { error },
                            }) => (
                                <>
                                    <View className="mb-8">
                                        <TouchableOpacity
                                            onPress={() => onChange(true)}
                                            className={cn(
                                                "p-4 rounded-xl border mb-3 flex-row items-center gap-3",
                                                value ? "bg-[#10b981]/10 border-[#10b981]" : "bg-[#1f2937] border-transparent"
                                            )}
                                        >
                                            <View className={cn("w-5 h-5 rounded-full items-center justify-center border", value ? "border-[#10b981]" : "border-gray-500")}>
                                                {value && <View className="w-2.5 h-2.5 bg-[#10b981] rounded-full" />}
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-white font-bold mb-0.5">Strict Locked</Text>
                                                <Text className="text-gray-400 text-xs">No withdrawal until maturity. Highest Rate.</Text>
                                            </View>
                                        </TouchableOpacity>
                            
                                        {/* Flexible */}
                                        <TouchableOpacity
                                            onPress={() => onChange(false)}
                                            className={cn(
                                                "p-4 rounded-xl border mb-3 flex-row items-center gap-3",
                                                !value ? "bg-[#10b981]/10 border-[#10b981]" : "bg-[#1f2937] border-transparent"
                                            )}
                                        >
                                            <View className={cn("w-5 h-5 rounded-full items-center justify-center border", !value ? "border-[#10b981]" : "border-gray-500")}>
                                                {!value && <View className="w-2.5 h-2.5 bg-[#10b981] rounded-full" />}
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-white font-bold mb-0.5">Flexible</Text>
                                                <Text className="text-gray-400 text-xs">Withdraw anytime. Lower Rate.</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    {error && <ErrorMessageDisplay message={error.message} />}
                                </>
                                
                            )}
                        />
                    </View>


                    <Controller
                        control={control}
                        name="source_type"
                        // defaultValue={wallet_id}
                        render={({ field: { value, onChange }, fieldState: { error } }) => {
                            return<>
                                {/* Wallet Option */}
                                <TouchableOpacity
                                    onPress={() => {setValue('source_id', wallet_id); trigger('source_id'); setPaymentMethod('wallet'); onChange('wallet')}}
                                    className={cn(
                                        "p-4 rounded-xl border mb-3 flex-row items-center justify-between",
                                        paymentMethod === 'wallet' ? "bg-[#1f2937] border-[#10b981]" : "bg-[#1f2937] border-transparent"
                                    )}
                                >
                                    <View className="flex-row items-center gap-4">
                                        <View className="w-10 h-10 rounded-full bg-[#374151] items-center justify-center">
                                            <Wallet size={20} color="#9CA3AF" />
                                        </View>
                                        <View>
                                            <Text className="text-white font-bold">Wallet Balance</Text>
                                            <Text className="text-gray-400 text-xs">Available: ₦3,400,520.00</Text>
                                        </View>
                                    </View>
                                    <View className={cn("w-5 h-5 rounded-full border items-center justify-center", paymentMethod === 'wallet' ? "border-[#10b981]" : "border-gray-500")}>
                                        {paymentMethod === 'wallet' && <View className="w-2.5 h-2.5 bg-[#10b981] rounded-full" />}
                                    </View>
                                </TouchableOpacity>

                                {/* Debit Card Option */}
                                <TouchableOpacity
                                    onPress={() => { setPaymentMethod('card'); setValue('source_id', '');  onChange('card')}}
                                    className={cn(
                                        "p-4 rounded-xl border mb-3 flex-row items-center justify-between",
                                        paymentMethod === 'card' ? "bg-[#1f2937] border-[#10b981]" : "bg-[#1f2937] border-transparent"
                                    )}
                                >
                                    <View className="flex-row items-center gap-4">
                                        <View className="w-10 h-10 rounded-full bg-[#374151] items-center justify-center">
                                            <CreditCard size={20} color="#9CA3AF" />
                                        </View>
                                        <Text className="text-white font-bold">Debit Card</Text>
                                    </View>
                                    <View className={cn("w-5 h-5 rounded-full border items-center justify-center", paymentMethod === 'card' ? "border-[#10b981]" : "border-gray-500")}>
                                        {paymentMethod === 'card' && <View className="w-2.5 h-2.5 bg-[#10b981] rounded-full" />}
                                    </View>
                                </TouchableOpacity>

                                {error && <ErrorMessageDisplay message={error.message} />}
                                
                                
                                {/* Card List (Only show if Debit Card selected) - Simplified for visual */}
                                
                                <Controller
                                    control={control}
                                    name="source_id"

                                    // defaultValue='card'
                                    render={({ field: { value, onChange: onChangeSourceType }, fieldState: { error } }) => {
                                        return(
                                            <>
                                                {paymentMethod === 'card' && (
                                                    <View className="pl-4 border-l-2 border-[#1f2937] ml-5 mb-4">
                                                        {BANK_CARDS.map((card, idx) => {
                                                            return(
                                                                <TouchableOpacity
                                                                key={idx}
                                                                onPress={() => { onChangeSourceType(card.id) }}
                                                                className="bg-white p-4 rounded-xl flex-row items-center justify-between mb-2">
                                                                    <View className="flex-row items-center gap-3">
                                                                        <CreditCard size={20} color="black" />
                                                                        <View>
                                                                            <Text className="text-black font-bold">{card.type}</Text>
                                                                            <Text className="text-gray-500 text-xs">****{card.number.slice(-4)}</Text>
                                                                        </View>
                                                                    </View>
                                                                    {value === card.number && <CheckCircle2 size={20} color="#10b981" />}
                                                                </TouchableOpacity>
                                                            )
                                                        })}
                                                    </View>
                                                )}

                                                {/* {error && <ErrorMessageDisplay message={error.message} />} */}

                                            </>
                                        )
                                    }}
                                />


                                </>
                        }}
                    />

                            {/* Summary Card and Button */}
                            <View>
                                <View className="bg-[#111827] rounded-xl p-5 mb-6 flex-row items-center justify-between border border-[#1f2937]">
                                    <View>
                                        <Text className="text-gray-400 text-xs font-bold mb-1 uppercase">Interest Rate</Text>
                                        <Text className="text-[#10b981] text-3xl font-bold">12% <Text className="text-white text-sm font-normal">P.A.</Text></Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-gray-400 text-xs font-bold mb-1 uppercase">Est. Return</Text>
                                        <Text className="text-white text-2xl font-bold">{formatCurrency(estReturn)}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Security Note */}
                            <View className="flex-row items-center justify-center gap-2 mb-6">
                                <Lock size={16} color="#6B7280" />
                                <Text className="text-gray-500 text-xs">Your plan is secured by bank-grade encryption</Text>
                            </View>

                            <View className="flex-row gap-4">
                                <TouchableOpacity
                                    onPress={handleSubmit(handleCreateSavgingsPlan, (e) => console.log("Error: ", e))}
                                    disabled={is_loading}
                                    className="flex-[2] bg-[#10b981] p-4 rounded-xl items-center"
                                >
                                    {is_loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-white font-bold text-lg">Confirm Plan</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
