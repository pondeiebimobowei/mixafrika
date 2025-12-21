import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Crown, Calendar, ShieldCheck, Wallet } from 'lucide-react-native';
import { useLoanAccountStore } from '@/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useFetchLoanRepaymentHistory, useLoanRepaymentHistory } from '@/store/hooks/repayment-history.hook';
import { RepaymentSheet } from '@/components/sheets/repayment.sheet';
import Sheet from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';

export default function LoanDetailsScreen() {
  const [isRepaySheetOpen, setIsRepaySheetOpen] = useState(false);

  const { loan_account } = useLoanAccountStore();
  const { data: { repayment_history } } = useLoanRepaymentHistory();

  useFetchLoanRepaymentHistory();

  const handlePayNow = () => {
    setIsRepaySheetOpen(true);
  };

  const totalRepayment = loan_account?.total_repayment_amount || 0;
  const repaidAmount = loan_account?.repaid_amount || 0;
  const outstandingAmount = totalRepayment - repaidAmount;
  const principal = loan_account?.disbursed_amount || 0;
  const interest = totalRepayment - principal;
  const progressPercentage = totalRepayment > 0 ? (repaidAmount / totalRepayment) * 100 : 0;
  const dailyInstallment = loan_account?.daily_repayment_amount || 0;

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-black pt-2">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 space-y-4">

          <View className="bg-[#00966D] rounded-3xl p-6 overflow-hidden relative">
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <Text className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">TOTAL OUTSTANDING</Text>
                <Text className="text-white text-3xl font-extrabold">{formatCurrency(outstandingAmount)}</Text>
              </View>
              <View className="bg-white/20 p-2 rounded-full">
                <ShieldCheck color="white" size={24} />
              </View>
            </View>

            <Button
              className="bg-white rounded-xl  mb-6"
              onPress={handlePayNow}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-[#00966D] font-semibold text-lg">Pay Now</Text>
              </View>
            </Button>

            <View className="flex-row bg-[#007F5C] rounded-xl p-4 justify-between">
              <View>
                <Text className="text-white/70 text-xs mb-1">Principal</Text>
                <Text className="text-white font-bold text-base">{formatCurrency(principal)}</Text>
              </View>
              <View>
                <Text className="text-white/70 text-xs mb-1">Interest</Text>
                <Text className="text-white font-bold text-base">{formatCurrency(interest)}</Text>
              </View>
            </View>
          </View>

          {/* Repayment Progress */}
          <View className="bg-[#1C1C1E] rounded-2xl p-5 my-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-400 text-xs font-medium">Repayment Progress</Text>
            </View>

            <View className="flex-row justify-between items-end mb-2">
              <Text className="text-white text-xl font-bold">{progressPercentage.toFixed(1)}%</Text>
              <View className="bg-[#00966D]/20 px-3 py-1 rounded-full">
                <Text className="text-[#00966D] text-xs font-bold">On Track</Text>
              </View>
            </View>

            <Progress value={progressPercentage} className='my-3' />

            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-xs">Paid: <Text className="text-gray-300 text-xs">{formatCurrency(repaidAmount)}</Text></Text>
              <Text className="text-gray-500 text-xs">Total: <Text className="text-gray-300 text-xs">{formatCurrency(totalRepayment)}</Text></Text>
            </View>
          </View>

          {/* Repayment Schedule */}
          <View className="bg-[#1C1C1E] rounded-2xl p-5">
            <Text className="text-white font-bold text-sm mb-4">Repayment Schedule</Text>

            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center gap-4">
                <View className="bg-[#007AFF]/20 p-3 rounded-xl">
                  <Calendar size={18} color="#007AFF" />
                </View>
                <View>
                  <Text className="text-white font-bold text-sm">Daily Installment</Text>
                  <Text className="text-gray-500 text-xs">Due every day at 4 PM</Text>
                </View>
              </View>
              <Text className="text-white font-bold text-sm">{formatCurrency(dailyInstallment)}</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <View className="bg-[#FFA500]/20 p-3 rounded-xl">
                  <Calendar size={18} color="#FFA500" />
                </View>
                <View>
                  <Text className="text-white font-bold text-sm">Due Date</Text>
                  <Text className="text-gray-500 text-xs">Final deadline</Text>
                </View>
              </View>
              {/* Placeholder for Due Date as we don't have it in ILoanAccount yet */}
              <Text className="text-white font-bold text-sm">Oct 31, 2023</Text>
            </View>
          </View>

          {/* Recent Payments */}
          <Text className="text-white font-bold mt-2">Recent Payments</Text>
          <View className="space-y-3 gap-2">
            {repayment_history.map((repayment) => {
              const isPaid = repayment.status === 'paid' || repayment.status === 'paid (late)'; // Treating both as paid for list
              return (
                <View
                  key={repayment.id}
                  className="bg-[#1C1C1E] rounded-2xl p-4 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-4">
                    <View className={`h-10 w-10 rounded-full items-center justify-center ${isPaid ? 'bg-[#00966D]/20' : 'bg-red-500/20'}`}>
                      {isPaid ? <CheckCircle2 size={20} color="#00966D" /> : <Text className="text-red-500 font-bold">!</Text>}
                    </View>
                    <View>
                      <Text className="text-white font-bold text-sm">Daily Auto-Debit</Text>
                      <Text className="text-gray-500 text-xs">{formatDate(repayment.createdAt)}</Text>
                    </View>
                  </View>
                  <Text className={`font-bold text-sm ${isPaid ? 'text-[#00966D]' : 'text-red-500'}`}>
                    {formatCurrency(repayment.amount)}
                  </Text>
                </View>
              );
            })}
          </View>

        </View>
      </ScrollView>

      <Sheet open={isRepaySheetOpen} onOpenChange={setIsRepaySheetOpen}>
          <RepaymentSheet
            onClose={() => setIsRepaySheetOpen(false)}
          />
      </Sheet>
    </SafeAreaView>
  );
}
