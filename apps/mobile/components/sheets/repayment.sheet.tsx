import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { Wallet, X } from 'lucide-react-native';
import { clsx } from 'clsx';
import { useWalletState } from '@/store/hooks/wallet.hook';
import { formatCurrency } from '@/lib/utils';
import { useLoanAccountState } from '@/store/hooks/loan-account';
import KeyboardAvoidingAreaView from '../keyboard-avoiding-area-view';

export function RepaymentSheet({ onClose }: { onClose?: () => void }) {
    const [days, setDays] = useState('0');
    const [duration, setDuration] = useState<number>(1);
    const [customDuration, setCustomDuration] = useState('1');
    const { data } = useWalletState();
    const { data: { loan_account, repay_loan }, loading } = useLoanAccountState();

    useEffect(() => {
        if (!loan_account) return;

        const dailyAmount = Number(loan_account.repayment_amount) / Number(loan_account.duration);
        let days = 1;

        if (duration === 1) {
            days = 1;
        } else if (duration === 7) {
            days = 7;
        } else if (duration === 0) {
            days = Number(customDuration) || 1;
        }

        setDays(days.toString());
    }, [duration, customDuration, loan_account]);

    const renderHeader = (title: string, onBack?: () => void) => (
        <View className="flex-row items-center justify-between mb-6">
            <Text className="text-lg text-black dark:text-white font-semibold">{title}</Text>
            {onBack && (
                <TouchableOpacity onPress={onBack}>
                    <X size={24} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );

    const handlePay = async () => {
        if (!days || isNaN(Number(days))) return;

        const success = await repay_loan(Number(days));
        if (success && onClose) {
            onClose();
        }
    };

    const getDueText = () => {
        if (duration === 1) return 'Tomorrow';
        if (duration >= 7 ) return 'in 7 Days';
        if (duration === 0 && customDuration) return `in ${customDuration} Days`;
        return '...';
    };

    const dailyAmount = Number(loan_account?.repayment_amount) / Number(loan_account?.duration) * Number(days);


    return (
        <View className="px-4 py-6 pb-10 rounded-xl bg-white dark:bg-[#1A1A1A]">
            {renderHeader('Make Repayment', onClose)}

            <View className="mb-4">
                <Text className="text-black dark:text-white font-semibold mb-2">Amount</Text>
                <TextInput
                    value={dailyAmount.toFixed()}
                    editable={false}
                    placeholder="Enter amount"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                    className="bg-white dark:bg-[#2A2D35] text-black border border-gray-200 dark:border-gray-700 dark:text-white p-4 rounded-xl font-medium text-lg opacity-80"
                />
            </View>

            <View className="flex-row items-center mb-6">
                <Wallet size={16} color="#6B7280" className="mr-2" />
                <Text className="text-gray-400">Wallet Balance: </Text>
                <Text className="text-[#27AE60] font-bold">{formatCurrency(data?.amount || 0)}</Text>
            </View>

            <View className="flex-row justify-between mb-6 gap-2">
                {[
                    { label: '1 Day', value: 1 },
                    { label: '7 Days', value: 7 },
                ].map((d) => (
                    <TouchableOpacity
                        key={d.value}
                        onPress={() => setDuration(d.value as any)}
                        className={clsx(
                            "flex-1 py-3 rounded-lg items-center justify-center",
                            duration === d.value ? "bg-[#27AE60]" : "bg-gray-200 dark:bg-[#2A2D35]"
                        )}
                    >
                        <Text className={clsx("font-medium", duration === d.value ? "text-white" : "text-gray-800 dark:text-white")}>
                            {d.label}
                        </Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    onPress={() => setDuration(0)}
                    className={clsx(
                        "flex-1 py-3 rounded-lg items-center justify-center",
                        duration === 0 ? "bg-[#27AE60]" : "bg-gray-200 dark:bg-[#2A2D35]"
                    )}
                >
                    <Text className={clsx("font-medium", duration === 0 ? "text-white" : "text-gray-800 dark:text-white")}>
                        Custom
                    </Text>
                </TouchableOpacity>
            </View>

            {duration === 0 && (
                <View className="mb-6">
                    <KeyboardAvoidingAreaView>
                    <Text className="text-black dark:text-white font-semibold mb-2">Duration (Days)</Text>
                    <TextInput
                        value={customDuration}
                        onChangeText={setCustomDuration}
                        placeholder="Enter days"
                        placeholderTextColor="#6B7280"
                        // keyboardType="number-pad"
                        className="bg-white dark:bg-[#2A2D35] h-14 text-black dark:text-white border border-gray-200 dark:border-gray-700 p-4 rounded-xl font-medium"
                    />
                    </KeyboardAvoidingAreaView>
                </View>
            )}

            <View className="bg-gray-100 dark:bg-[#2A2D35] p-4 rounded-xl mb-8">
                <Text className="text-gray-800 dark:text-gray-400 text-sm">
                    Your upcoming repayment of <Text className="text-black dark:text-white font-bold">{formatCurrency(Number(dailyAmount) || 0)}</Text> is due <Text className="text-black dark:text-white font-bold">{getDueText()}</Text>.
                </Text>
            </View>

            <TouchableOpacity
                onPress={handlePay}
                disabled={loading || !days}
                className={clsx("p-4 rounded-xl items-center", (loading || !days) ? "bg-[#2A2D35] opacity-50" : "bg-[#27AE60]")}
            >
                <Text className="text-white font-bold text-lg">{loading ? 'Processing...' : `Pay ${formatCurrency(Number(dailyAmount) || 0)}`}</Text>
            </TouchableOpacity>
        </View>
    );
}
