import { formatCurrency } from "@/lib/utils"
import { Info } from "lucide-react-native"
import { Text, View } from "react-native"

export default function AutoSaveEnabledCard() {
    const targetAmount = 0;
    const frequency = 'daily';
    
    return (
        <View className="bg-[#451a03]/50 border border-[#451a03] p-4 rounded-xl mb-8 flex-row gap-3">
            <Info size={20} color="#f59e0b" className="mt-0.5" />
            <View className="flex-1">
                <Text className="text-white font-bold mb-1">Auto-Save Enabled</Text>
                <Text className="text-[#fcd34d] text-xs leading-4">
                    We will automatically deduct {formatCurrency(Number(targetAmount))} {frequency || 'daily'} from your wallet.
                </Text>
            </View>
        </View>
    )
}