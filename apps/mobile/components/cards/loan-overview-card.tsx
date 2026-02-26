import { useLoanAccountStore } from '@/store';
import { Calendar, Expand, Eye, TrendingUp } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { Accordion, AccordionContent, AccordionItem, AccordionTriggerNoIcon } from '../ui/accordion';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function LoanOverviewCard() {
  const { loan_account } = useLoanAccountStore();

  return (
    <View className=" px-6 py-10 my-4 bg-primary  rounded-xl flex-1 items-center justify-center ">
      <Accordion type='single' collapsable>
        <AccordionItem value='item-1'>
          <View>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-lg text-white font-bold">Loan Overview</Text>
              <AccordionTriggerNoIcon>
                <Expand
                  className="h-4 w-4"
                  color={'white'}
                  strokeWidth={1}
                />
              </AccordionTriggerNoIcon>
            </View>

            <View className="mt-10 mb-6">
              <View className="flex flex-row items-center gap-2 mb-2">
                <Text className="text-white text ">Amount Received</Text>
                <Eye color={'white'} size={14} />
              </View>

              <Text className="text-white text-5xl font-bold">
                {formatCurrency(loan_account?.disbursed_amount)}
              </Text>
              <View className="h-2 w-full mt-4 mb-1 rounded-full bg-white/40 overflow-hidden">
                <View
                  style={{ width: `${(Number(loan_account?.daily_repayment_amount) / Number(loan_account?.total_repayment_amount)) * 100}%` }}
                  className="h-full bg-white"
                />
              </View>
              <View className='flex flex-row justify-between items-center'>
                <Text className='text-white text-sm'>{((Number(loan_account?.repaid_amount) / Number(loan_account?.total_repayment_amount)) * 100).toFixed(2)}% Repaid</Text>
                <Text className='text-white text-sm'>{formatCurrency(Number(loan_account?.total_repayment_amount) - Number(loan_account?.repaid_amount)).toLocaleString()} left</Text>
              </View>
            </View>

            <View className='border-t border-white/20 flex flex-row justify-between items-center'>
              <View className='flex flex-row gap-2 items-center'>
                <Calendar color={"white"} size={18} strokeWidth={1} />
                <View>
                  <Text className='text-white text-xs'>Date Received</Text>
                  <Text className='text-white text-xs'>{formatDate(loan_account?.approved_at)}</Text>
                </View>
              </View>

              <View className='flex flex-row gap-2 items-center'>
                <TrendingUp color={"white"} size={18} strokeWidth={1} />
                <View>
                  <Text className='text-white text-xs'>Repayment:</Text>
                  <Text className='text-white text-xs'>{formatCurrency(loan_account?.daily_repayment_amount)}</Text>
                </View>
              </View>

            </View>

          </View>
          <AccordionContent className='my-6'>
            <View className='flex flex-row flex-wrap gap-4 items-center justify-between'>
              <View className='w-5/12 '>
                <Text className='text-white/50'>Interest Rate</Text>
                <Text className='text-white font-semibold'>{Number(loan_account?.cluster.roi).toFixed()}%</Text>
              </View>

              <View className='w-5/12 '>
                <Text className='text-white/50'>Total Repayment</Text>
                <Text className='text-white font-semibold'>{formatCurrency(loan_account?.total_repayment_amount)}</Text>
              </View>
              
              <View className='w-5/12 '>
                <Text className='text-white/50'>Next Payment</Text>
                <Text className='text-white font-semibold'>{formatCurrency(Number(loan_account?.daily_repayment_amount))}</Text>
              </View>

              <View className='w-full '>
                <Text className='text-white/50'>Loan duration</Text>
                <Text className='text-white font-semibold'>{Number(loan_account?.cluster.duration).toFixed()} days</Text>
              </View>

              <View>
                <Text className='text-white'>Funded by 12 investors</Text>
              </View>

            </View>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
}
