import { useLoanAccountStore } from '@/store';
import { Calendar, Expand, Eye, TrendingUp } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { Accordion, AccordionContent, AccordionItem, AccordionTriggerNoIcon } from '../ui/accordion';

export default function LoanOverviewCard() {
  const { loan_account } = useLoanAccountStore();

  const repaidPercentage =
  // @ts-expect-error÷
    (loan_account.repaid_amount / loan_account?.recieied_amount) * 100;

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
                ₦{loan_account?.received_amount.toLocaleString()}
              </Text>
              <View className="h-2 w-full mt-4 mb-1 rounded-full bg-white/40 overflow-hidden">
                <View
                  style={{ width: `${repaidPercentage}%` }}
                  className="h-full bg-white"
                />
              </View>
              <View className='flex flex-row justify-between items-center'>
                <Text className='text-white text-sm'>{loan_account?.repaid_amount}% Repaid</Text>
                <Text className='text-white text-sm'>₦{loan_account?.repayment_amount} left</Text>
              </View>
            </View>

            <View className='border-t border-white/20 flex flex-row justify-between items-center'>
              <View className='flex flex-row gap-2 items-center'>
                <Calendar color={"white"} size={18} strokeWidth={1} />
                <View>
                  <Text className='text-white text-xs'>Date Received</Text>
                  <Text className='text-white text-xs'>{loan_account?.createdAt || "Jan. 24, 2025"}</Text>
                </View>
              </View>

              <View className='flex flex-row gap-2 items-center'>
                <TrendingUp color={"white"} size={18} strokeWidth={1} />
                <View>
                  <Text className='text-white text-xs'>Repayment:</Text>
                  <Text className='text-white text-xs'>₦{loan_account?.repayment_amount}</Text>
                </View>
              </View>

            </View>

          </View>
          <AccordionContent>
            <Text>This is me</Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
}
