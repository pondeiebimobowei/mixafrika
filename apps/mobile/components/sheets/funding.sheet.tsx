import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { ArrowLeft, Building2, CreditCard, Wallet, Copy, Check } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { clsx } from 'clsx';
import { useWalletState } from '@/store/hooks/wallet.hook';
import KeyboardAvoidingAreaView from '../keyboard-avoiding-area-view';

type ViewState = 'selection' | 'bank-transfer' | 'crypto';

export function FundingSheet() {
    const [currentView, setCurrentView] = useState<ViewState>('selection');
    const [copied, setCopied] = useState(false);

    const handleCopy = async (text: string) => {
        await Clipboard.setStringAsync(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderHeader = (title: string, onBack?: () => void) => (
        <View className="flex-row items-center mb-6">
            {onBack && (
                <TouchableOpacity onPress={onBack} className="mr-4">
                    <ArrowLeft size={24} color="white" />
                </TouchableOpacity>
            )}
            <Text className="text-lg text-white">{title}</Text>
        </View>
    );

    const [selectedMethod, setSelectedMethod] = useState<ViewState | null>(null);

    const fundingMethods = [
        {
            id: 'card',
            title: 'Card Payment',
            subtitle: 'Coming soon',
            icon: <CreditCard size={20} color="gray" />,
            disabled: true,
            value: null,
        },
        {
            id: 'bank-transfer',
            title: 'Bank Transfer',
            subtitle: 'Instant funding via bank transfer',
            icon: <Building2 size={20} color="#27AE60" />,
            disabled: false,
            value: 'bank-transfer',
        },
        {
            id: 'ussd',
            title: 'USSD',
            subtitle: 'Coming soon',
            icon: <Text className="text-gray-400 font-bold text-xs">USSD</Text>,
            disabled: true,
            value: null,
        },
        {
            id: 'crypto',
            title: 'Crypto Deposit',
            subtitle: 'Fund via USDT, BTC, etc.',
            icon: <Wallet size={20} color="#F7931A" />,
            disabled: false,
            value: 'crypto',
        },
    ];

    const renderSelection = () => (
        <View>
            {renderHeader('Fund Wallet')}
            <View className="gap-4">
                {fundingMethods.map((method) => (
                    <TouchableOpacity
                        key={method.id}
                        disabled={method.disabled}
                        onPress={() => method.value && setSelectedMethod(method.value as ViewState)}
                        className={clsx(
                            "flex-row items-center p-4 bg-[#2A2D35] rounded-xl justify-between",
                            method.disabled && "opacity-50"
                        )}
                    >
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-[#1C1F26] items-center justify-center mr-4">
                                {method.icon}
                            </View>
                            <View>
                                <Text className="text-white font-semibold">{method.title}</Text>
                                <Text className="text-gray-400 text-xs">{method.subtitle}</Text>
                            </View>
                        </View>
                        <View className={clsx(
                            "w-5 h-5 rounded-full border items-center justify-center",
                            selectedMethod === method.value ? "border-[#27AE60]" : "border-gray-500",
                            method.disabled && "border-gray-600"
                        )}>
                            {selectedMethod === method.value && <View className="w-3 h-3 rounded-full bg-[#27AE60]" />}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                disabled={!selectedMethod}
                onPress={() => selectedMethod && setCurrentView(selectedMethod)}
                className={clsx("mt-8 p-4 rounded-xl items-center", selectedMethod ? "bg-[#27AE60]" : "bg-[#2A2D35] opacity-50")}
            >
                <Text className={clsx("font-bold text-base", selectedMethod ? "text-white" : "text-gray-500")}>Proceed</Text>
            </TouchableOpacity>
        </View>
    );

    const [amount, setAmount] = useState('');
    const { data: { fundWallet }, loading } = useWalletState();

    const handleConfirmTransfer = async () => {
        if (!amount || isNaN(Number(amount))) return;

        fundWallet(Number(amount));
        setCurrentView('selection');
        setAmount('');
    };

    const renderBankTransfer = () => (
        <View>
            {renderHeader('Bank Transfer', () => setCurrentView('selection'))}
            <View className="bg-[#2A2D35] p-6 rounded-xl items-center mb-6">
                <Text className="text-gray-400 text-sm mb-2">Transfer to this account</Text>
                <Text className="text-white text-2xl font-bold mb-1">1234 5678 90</Text>
                <Text className="text-[#27AE60] font-medium mb-4">MixAfrica / User Name</Text>

                <View className="w-full h-[1px] bg-gray-700 mb-4" />

                <View className="flex-row justify-between w-full mb-2">
                    <Text className="text-gray-400">Bank Name</Text>
                    <Text className="text-white font-medium">Wema Bank</Text>
                </View>
                <View className="flex-row justify-between w-full">
                    <Text className="text-gray-400">Beneficiary</Text>
                    <Text className="text-white font-medium">MixAfrica User</Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => handleCopy('1234567890')}
                className="flex-row items-center justify-center bg-[#27AE60] p-4 rounded-xl mb-6"
            >
                {copied ? <Check size={20} color="white" className="mr-2" /> : <Copy size={20} color="white" className="mr-2" />}
                <Text className="text-white font-bold">{copied ? 'Copied!' : 'Copy Account Number'}</Text>
            </TouchableOpacity>

            <View className="mb-6">
                <Text className="text-gray-400 text-sm mb-2">Amount Sent</Text>
                <KeyboardAvoidingAreaView>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter amount"
                        placeholderTextColor="#6B7280"
                        keyboardType="numeric"
                        className="bg-[#2A2D35] text-white p-4 rounded-xl font-medium"
                    />
                </KeyboardAvoidingAreaView>
            </View>

            <TouchableOpacity
                onPress={handleConfirmTransfer}
                disabled={!amount || loading}
                className={clsx("p-4 rounded-xl items-center", amount ? "bg-[#27AE60]" : "bg-[#2A2D35] opacity-50")}
            >
                <Text className={clsx("font-bold text-base", amount ? "text-white" : "text-gray-500")}>
                    {loading ? 'Processing...' : 'I have made the transfer'}
                </Text>
            </TouchableOpacity>

            <Text className="text-gray-500 text-xs text-center mt-4">
                Transfers are typically processed within minutes.
            </Text>
        </View>
    );

    const renderCrypto = () => (
        <View>
            {renderHeader('Crypto Deposit', () => setCurrentView('selection'))}

            <View className="bg-[#2A2D35] p-4 rounded-xl mb-4">
                <Text className="text-gray-400 text-xs mb-1">Network</Text>
                <Text className="text-white font-bold">USDT (TRC20)</Text>
            </View>

            <View className="bg-white p-4 rounded-xl items-center justify-center mb-6 aspect-square w-48 self-center">
                {/* Placeholder for QR Code */}
                <View className="w-full h-full bg-black" />
            </View>

            <View className="bg-[#2A2D35] p-4 rounded-xl mb-6">
                <Text className="text-gray-400 text-xs mb-2">Wallet Address</Text>
                <View className="flex-row items-center justify-between">
                    <Text className="text-white text-xs flex-1 mr-2" numberOfLines={1} ellipsizeMode="middle">
                        T9yD14Nj9j7xAB4dbGeiX9h8bAyWC3SAea
                    </Text>
                    <TouchableOpacity onPress={() => handleCopy('T9yD14Nj9j7xAB4dbGeiX9h8bAyWC3SAea')}>
                        {copied ? <Check size={16} color="#27AE60" /> : <Copy size={16} color="#27AE60" />}
                    </TouchableOpacity>
                </View>
            </View>

            <Text className="text-yellow-500/80 text-xs text-center px-4">
                Send only USDT (TRC20) to this address. Sending any other coin may result in permanent loss.
            </Text>
        </View>
    );

    return (
        <View className="p-4 pb-10 bg-[#1A1A1A]">
            {currentView === 'selection' && renderSelection()}
            {currentView === 'bank-transfer' && renderBankTransfer()}
            {currentView === 'crypto' && renderCrypto()}
        </View>
    );
}
