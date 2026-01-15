import React, { useState } from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { useLoanAccountStore } from '@/store';
import { Progress } from '../ui/progress';
import Sheet from '../ui/sheet';
import { RepaymentSheet } from '../sheets/repayment.sheet';
import { SheetsState } from '@/app/(protected)/(trader)/(tabs)/profile';

export default function ActiveLoanDashboardCard() {
    const router = useRouter();
    const [sheetIsOpen, setSheetIsOpen] = useState<SheetsState>({ isFundingOpen: false, isRepayOpen: false, isWithdrawOpen: false })
    
    const { loan_account } = useLoanAccountStore();

    return (
        <View>
            { loan_account?.status === 'approved' && (
            <Pressable onPress={() => router.push('/repayment-history')}>
                <View className="bg-[#059669] rounded-2xl p-5 mb-6 relative overflow-hidden">
                    <View>
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <Text className="text-emerald-100 text-xs font-medium mb-1">Outstanding Balance</Text>
                                <Text className="text-white text-3xl font-bold">{formatCurrency(Number(loan_account?.total_repayment_amount) - Number(loan_account?.repaid_amount))}</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-emerald-100 text-xs font-medium mb-1">Due Date</Text>
                                <Text className="text-white font-bold">{formatDate(loan_account?.cluster.end_date)}</Text>
                            </View>
                        </View>

                        <Progress value={Number(loan_account?.repaid_amount) / Number(loan_account?.total_repayment_amount) * 100} label='Repayment Progress' showLabel className='mb-5' labelClassName='text-black dark:text-white' />

                        {/* Bottom Action Area */}
                        <View className="bg-[#047857] rounded-xl p-4 flex-row justify-between items-center">
                            <View>
                                <Text className="text-emerald-100 text-[10px] uppercase font-bold mb-0.5">Daily Installment</Text>
                                <Text className="text-white text-xl font-bold">{formatCurrency(loan_account?.daily_repayment_amount)}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setSheetIsOpen(prev => ({ ...prev, isRepayOpen: true }))}
                                className="bg-white px-6 py-3 rounded-lg"
                            >
                                <Text className="text-[#059669] font-bold">Pay Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <Sheet
                        open={sheetIsOpen.isRepayOpen}
                        onOpenChange={() => setSheetIsOpen(prev => ({ ...prev, isRepayOpen: !prev.isRepayOpen }))}
                        >
                            <RepaymentSheet onClose={() => setSheetIsOpen(prev => ({ ...prev, isRepayOpen: false }))} />
                    </Sheet>
                </View>
            </Pressable>
        )}
        </View>
    );
}
