import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { Wallet, X } from 'lucide-react-native';
import { clsx } from 'clsx';
import { useWalletState } from '@/store/hooks/wallet.hook';
import { formatCurrency } from '@/lib/utils';
import { useLoanAccountState } from '@/store/hooks/loan-account';

export function RepaymentSheet({ onClose }: { onClose?: () => void }) {
    const [amount, setAmount] = useState('0');
    const [duration, setDuration] = useState<'1 Day' | '7 Days' | 'Custom'>('1 Day');
    const [customDays, setCustomDays] = useState('1');
    const { data } = useWalletState();
    const { data: { loan_account, repay_loan }, loading } = useLoanAccountState();

    useEffect(() => {
        if (!loan_account) return;

        const dailyAmount = Number(loan_account.repayment_amount) / Number(loan_account.duration);
        let days = 1;

        if (duration === '1 Day') {
            days = 1;
        } else if (duration === '7 Days') {
            days = 7;
        } else if (duration === 'Custom') {
            days = Number(customDays) || 1;
        }

        const calculatedAmount = Math.ceil(dailyAmount * days);
        setAmount(calculatedAmount.toString());
    }, [duration, customDays, loan_account]);

    const renderHeader = (title: string, onBack?: () => void) => (
        <View className="flex-row items-center justify-between mb-6">
            <Text className="text-lg text-white font-semibold">{title}</Text>
            {onBack && (
                <TouchableOpacity onPress={onBack}>
                    <X size={24} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );

    const handlePay = async () => {
        if (!amount || isNaN(Number(amount))) return;

        const success = await repay_loan(Number(amount));
        if (success && onClose) {
            onClose();
        }
    };

    const getDueText = () => {
        if (duration === '1 Day') return 'Tomorrow';
        if (duration === '7 Days') return 'in 7 Days';
        if (duration === 'Custom' && customDays) return `in ${customDays} Days`;
        return '...';
    };

    return (
        <View className="p-4 pb-10 bg-[#1A1A1A]">
            {renderHeader('Make Repayment', onClose)}

            <View className="mb-4">
                <Text className="text-white font-semibold mb-2">Amount</Text>
                <TextInput
                    value={amount}
                    editable={false}
                    placeholder="Enter amount"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                    className="bg-[#2A2D35] text-white p-4 rounded-xl font-medium text-lg opacity-80"
                />
            </View>

            <View className="flex-row items-center mb-6">
                <Wallet size={16} color="#6B7280" className="mr-2" />
                <Text className="text-gray-400">Wallet Balance: </Text>
                <Text className="text-[#27AE60] font-bold">{formatCurrency(data?.amount || 0)}</Text>
            </View>

            <View className="flex-row justify-between mb-6 gap-2">
                {[
                    { label: '1 Day', value: '1 Day' },
                    { label: '7 Days', value: '7 Days' },
                    { label: 'Custom', value: 'Custom' }
                ].map((d) => (
                    <TouchableOpacity
                        key={d.value}
                        onPress={() => setDuration(d.value as any)}
                        className={clsx(
                            "flex-1 py-3 rounded-lg items-center justify-center",
                            duration === d.value ? "bg-[#27AE60]" : "bg-[#2A2D35]"
                        )}
                    >
                        <Text className={clsx("font-medium", duration === d.value ? "text-white" : "text-gray-400")}>
                            {d.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {duration === 'Custom' && (
                <View className="mb-6">
                    <Text className="text-white font-semibold mb-2">Duration (Days)</Text>
                    <TextInput
                        value={customDays}
                        onChangeText={setCustomDays}
                        placeholder="Enter days"
                        placeholderTextColor="#6B7280"
                        keyboardType="numeric"
                        className="bg-[#2A2D35] text-white p-4 rounded-xl font-medium"
                    />
                </View>
            )}

            <View className="bg-[#2A2D35] p-4 rounded-xl mb-8">
                <Text className="text-gray-400 text-sm">
                    Your upcoming repayment of <Text className="text-white font-bold">{formatCurrency(Number(amount) || 0)}</Text> is due <Text className="text-white font-bold">{getDueText()}</Text>.
                </Text>
            </View>

            <TouchableOpacity
                onPress={handlePay}
                disabled={loading || !amount}
                className={clsx("p-4 rounded-xl items-center", (loading || !amount) ? "bg-[#2A2D35] opacity-50" : "bg-[#27AE60]")}
            >
                <Text className="text-white font-bold text-lg">{loading ? 'Processing...' : `Pay ${formatCurrency(Number(amount) || 0)}`}</Text>
            </TouchableOpacity>
        </View>
    );
}
