import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Check, CreditCard, Wallet } from 'lucide-react-native';
import { formatCurrency, cn } from '@/lib/utils';
import { useWalletState } from '@/store/hooks/wallet.hook';
import { apiPrivate } from '@/axios/axios-config';
import Toast from 'react-native-toast-message';
import { useFetchBankCards, useBankCardState } from '@/store/hooks/bank-card.hook';

interface TopUpPlanSheetProps {
    onClose: () => void;
    savingsId: string;
    onSuccess: () => void;
}

export function TopUpPlanSheet({ onClose, savingsId, onSuccess }: TopUpPlanSheetProps) {
    const [amount, setAmount] = useState('0');
    const [source, setSource] = useState<'wallet' | 'card'>('wallet');
    const [selectedCard, setSelectedCard] = useState('mastercard');
    const [loading, setLoading] = useState(false);

    const { data: walletData } = useWalletState();

    useFetchBankCards()
    const { data: { bank_cards} } = useBankCardState()

    const handleConfirm = async () => {
        const numAmount = Number(amount);
        if (numAmount <= 0) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Amount',
                text2: 'Please enter a valid amount to top up.',
            });
            return;
        }

        if (source === 'wallet' && walletData?.available_balance && numAmount > Number(walletData.available_balance)) {
            Toast.show({
                type: 'error',
                text1: 'Insufficient Funds',
                text2: 'Your wallet balance is insufficient.',
            });
            return;
        }

        setLoading(true);
        try {
            await apiPrivate.post(`v1/savings/${savingsId}/top-up`, {
                amount: numAmount,
                source: source
            });

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Top up successful!',
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Top Up Failed',
                text2: 'Something went wrong. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="p-4 pb-10 dark:bg-[#0f172a] h-[580px]">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl text-white font-bold">Top Up Plan</Text>
            </View>

            {/* Amount Input */}
            <View className="mb-6">
                <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Amount to Add</Text>
                <View className="flex-row items-center bg-[#1e293b] rounded-2xl border border-[#10b981] h-16 px-4">
                    <Text className="text-gray-400 text-xl font-bold mr-2">₦</Text>
                    <TextInput
                        className="flex-1 text-white text-3xl font-bold h-full"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        placeholder="0.00"
                        placeholderTextColor="#4b5563"
                    />
                </View>
            </View>

            {/* Payment Source Selector */}
            <View className="mb-6">
                <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Payment Source</Text>
                <View className="flex-row bg-[#1e293b] p-1 rounded-xl">
                    <TouchableOpacity
                        className={cn(
                            "flex-1 py-3 rounded-lg items-center",
                            source === 'wallet' ? "bg-[#334155]" : "bg-transparent"
                        )}
                        onPress={() => setSource('wallet')}
                    >
                        <Text className={cn(
                            "font-bold",
                            source === 'wallet' ? "text-white" : "text-gray-400"
                        )}>Wallet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={cn(
                            "flex-1 py-3 rounded-lg items-center",
                            source === 'card' ? "bg-[#334155]" : "bg-transparent"
                        )}
                        onPress={() => setSource('card')}
                    >
                        <Text className={cn(
                            "font-bold",
                            source === 'card' ? "text-white" : "text-gray-400"
                        )}>Card</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Source Details */}
            <View className="mb-8 flex-1">
                {source === 'wallet' ? (
                    <View className="bg-[#1e293b] p-4 rounded-2xl border border-[#334155] flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-full bg-[#334155] items-center justify-center">
                                <Wallet size={20} color="#94a3b8" />
                            </View>
                            <Text className="text-gray-300 font-medium">Available Balance</Text>
                        </View>
                        <Text className="text-white font-bold text-lg">{formatCurrency(walletData?.available_balance || 0)}</Text>
                    </View>
                ) : (
                    <View className="gap-3">
                        <TouchableOpacity
                            onPress={() => setSelectedCard('visa')}
                            className={cn(
                                "p-4 rounded-2xl border flex-row items-center justify-between",
                                selectedCard === 'visa' ? "bg-white border-white" : "bg-[#1e293b] border-[#334155]"
                            )}
                        >
                            <View className="flex-row items-center gap-3">
                                <CreditCard size={24} color={selectedCard === 'visa' ? 'black' : 'white'} />
                                <View>
                                    <Text className={cn("font-bold", selectedCard === 'visa' ? "text-black" : "text-white")}>Visa Debit</Text>
                                    <Text className={cn("text-xs", selectedCard === 'visa' ? "text-gray-500" : "text-gray-400")}>**** 4242</Text>
                                </View>
                            </View>
                            {selectedCard === 'visa' && <Check size={20} color="#10b981" />}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setSelectedCard('mastercard')}
                            className={cn(
                                "p-4 rounded-2xl border flex-row items-center justify-between",
                                selectedCard === 'mastercard' ? "bg-white border-white" : "bg-[#1e293b] border-[#334155]"
                            )}
                        >
                            <View className="flex-row items-center gap-3">
                                <CreditCard size={24} color={selectedCard === 'mastercard' ? 'black' : 'white'} />
                                <View>
                                    <Text className={cn("font-bold", selectedCard === 'mastercard' ? "text-black" : "text-white")}>Mastercard Gold</Text>
                                    <Text className={cn("text-xs", selectedCard === 'mastercard' ? "text-gray-500" : "text-gray-400")}>**** 8899</Text>
                                </View>
                            </View>
                            {selectedCard === 'mastercard' && (
                                <View className="w-6 h-6 rounded-full bg-[#10b981] items-center justify-center">
                                    <Check size={14} color="white" />
                                </View>
                            )}
                        </TouchableOpacity>

                        { bank_cards.map( ( card ) => {
                            return(
                                <TouchableOpacity
                                    key={card.id}
                                    onPress={() => setSelectedCard('mastercard')}
                                    className={cn(
                                        "p-4 rounded-2xl border flex-row items-center justify-between",
                                        selectedCard === 'mastercard' ? "bg-white border-white" : "bg-[#1e293b] border-[#334155]"
                                    )}
                                >
                                    <View className="flex-row items-center gap-3">
                                        <CreditCard size={24} color={selectedCard === 'mastercard' ? 'black' : 'white'} />
                                        <View>
                                            <Text className={cn("font-bold", selectedCard === 'mastercard' ? "text-black" : "text-white")}>Mastercard Gold</Text>
                                            <Text className={cn("text-xs", selectedCard === 'mastercard' ? "text-gray-500" : "text-gray-400")}>**** 8899</Text>
                                        </View>
                                    </View>
                                    {selectedCard === 'mastercard' && (
                                        <View className="w-6 h-6 rounded-full bg-[#10b981] items-center justify-center">
                                            <Check size={14} color="white" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                )}
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
                onPress={handleConfirm}
                disabled={loading}
                className="bg-[#10b981] py-4 rounded-xl items-center justify-center"
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">Confirm ₦{amount}</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
