import { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Info, XCircle } from 'lucide-react-native';
import { useLoanAccountStore, useLoanHistory } from '@/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useFetchLoanRepaymentHistory, useLoanRepaymentHistory } from '@/store/hooks/repayment-history.hook';
// import { useFetchLoanRepaymentHistory, useLoanRepaymentHistory } from '../../../../store/hooks/repayment-history.hook';


const upcomingRepayment = { amount: 5500, dueDate: 'Tomorrow' };

export default function RepaymentScreen() {
  const [isRepaySheetOpen, setIsRepaySheetOpen] = useState(false);

  const { loan_account } = useLoanAccountStore()
  const { data: { repayment_history } } = useLoanRepaymentHistory()

  useFetchLoanRepaymentHistory()

  const handlePayNow = () => {
    setIsRepaySheetOpen(true);
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-[#121212] pt-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4">
          <View className="bg-primary rounded-xl p-5 flex flex-wrap flex-row justify-between items-center mb-6">
            <View className='w-full mb-10'>
                <Text className='font-light text-sm'>Upcoming Payments</Text>
            </View>

            <View>
              {/* FIX NOW */}
              {/* <Text className="text-white text-2xl font-bold">{formatCurrency(Number(loan_account?.repayment_amount)/Number(loan_account.))}</Text> */}
              <Text className="text-white/80 text-sm">Due {upcomingRepayment.dueDate}</Text>
            </View>
            <Button className="bg-white rounded-lg px-6 py-3" onPress={handlePayNow}>
              <Text className="text-primary">Pay Now</Text>
            </Button>
          </View>

          <View className="flex-row items-center gap-3 mb-6 p-3 bg-[#1C1C1E] rounded-lg">
            <Info color='orange' size={18} className=" text-yellow-500 mt-1 shrink-0" />
            <Text className="text-gray-400 text-xs flex-1">
              Your payment history is updated in real-time. Fast repayments increase credit score
            </Text>
          </View>

          <Text className=" font-bold text-white mb-4">Past Repayments</Text>
          <View className="space-y-3 gap-3">
            {repayment_history.map((repayment) => {
              const isPaid = repayment.status === 'paid';
              const isPaidLate = repayment.status === 'paid (late)';
              return (
                <View
                  key={repayment.id}
                  className="bg-[#1b1b1d] rounded-lg p-4 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-4">
                    {isPaid || isPaidLate ? (
                      <View className="h-8 w-8 rounded-full bg-green-500/20 items-center justify-center">
                        <CheckCircle2 size={20} color="#27AE60" />
                      </View>
                    ) : (
                      <View className="h-8 w-8 rounded-full bg-red-500/20 items-center justify-center">
                        <XCircle size={20} color="#E53935" />
                      </View>
                    )}
                    <View>
                      <Text className="text-white font-bold text-sm">{formatCurrency(repayment.amount)}</Text>
                      <Text className="text-gray-400 text-xs">{formatDate(repayment.createdAt)}</Text>
                    </View>
                  </View>
                  {isPaid ? (
                    <View className="bg-[#27AE60]/20 rounded-full px-3 py-1">
                      <Text className="text-[#27AE60] text-xs font-semibold">Paid</Text>
                    </View>
                  ) : 
                  
                  isPaidLate ? 
                  (
                    <View className="bg-orange-700/50 rounded-full px-3 py-2">
                      <Text className="text-white text-xs font-semibold">Paid (late)</Text>
                    </View>
                  ):
                  (
                    <Button
                      className="bg-pink-600 rounded-lg px-3 py-1"
                      onPress={handlePayNow}
                    >
                      <Text className="text-white text-xs font-bold">Pay Now</Text>
                    </Button>
                  )
                }
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      {/* <Sheet open={isRepaySheetOpen} onOpenChange={setIsRepaySheetOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl p-0 bg-[#1A1A1A]">
          <MakeRepaymentSheet
            upcomingRepayment={upcomingRepayment}
            walletBalance={walletBalance}
            onSuccess={() => setIsRepaySheetOpen(false)}
          />
        </SheetContent>
      </Sheet> */}
    </SafeAreaView>
  );
}
