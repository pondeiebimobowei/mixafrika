import { useLoanAccount } from '@/store';
import { Expand, Eye } from 'lucide-react-native';
import { Text, View } from 'react-native';

export default function LoanOverviewCard() {
  const { loan_account } = useLoanAccount();
  console.log(loan_account);

  const repaidPercentage =
  // @ts-expect-error÷
    (loan_account.repaid_amount / loan_account?.recieved_amount) * 100;

  return (
    <View className=" px-6 py-10 my-4 bg-primary  rounded-xl flex-1 items-center justify-center ">
      <View>
        <View className="flex flex-row justify-between w-full">
          <Text className="text-2xl text-white font-bold">Loan Overview</Text>
          <Expand
            className="h-5 w-5 fill-white outline-white bg-white color-white"
            color={'white'}
          />
        </View>

        <View className="my-6">
          <View className="flex flex-row items-center gap-4 mb-2">
            <Text className="text-white text-xl ">Amount Recieved</Text>
            <Eye color={'white'} size={18} />
          </View>

          <Text className="text-white text-6xl font-bold">
            ₦{loan_account?.recieved_amount.toLocaleString()}
          </Text>
          <View className="h-2 w-full my-4 rounded-full bg-muted overflow-hidden">
            <View
              style={{ width: `${repaidPercentage}%` }}
              className="h-full bg-black"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
