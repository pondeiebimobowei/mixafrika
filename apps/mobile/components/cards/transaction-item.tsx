import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Types } from "@mixafrica/shared/enums";
import { ITransaction } from "@mixafrica/shared/types/transaction";
import { ArrowDown, ArrowUp, Repeat, Send, X } from "lucide-react-native";
import { Text, View } from "react-native";

const transactionIcons = {
    deposit: ArrowDown,
    withdrawal: ArrowUp,
    failed: X,
    repayment: Repeat,
    loan: ArrowDown
  };

  const transactionIconColor = {
    credit: 'hsl(151 51% 33%)',
    debit: 'hsl(346 70% 55%)',
    failed: 'hsl(346 70% 55%)',
    investment: 'grey'
  };

  const transactionIconBg = {
    credit: 'bg-primary/15',
    debit: 'bg-gray-100 dark:bg-gray-800/70',
    failed: 'bg-red-100 dark:bg-red-900/30',
  };

  const transactionColors = {
    credit: 'text-primary',
    debit: 'text-foreground',
    failed: 'text-destructive',
  };

  const formatAmount = (amount: number, type: Types) => {
    const prefix = type === Types.DEPOSIT ? '+₦' : '-₦';
    return `${prefix}${amount.toLocaleString()}`;
  };

export default function TransactionItems({transaction, className}: { transaction: ITransaction, className?: string }){
    const Icon = transactionIcons[transaction.type as keyof typeof transactionIcons] || Send;

              const iconColor =
                transaction.type === Types.WITHDRAWAL
                  ? transactionIconColor.debit
                  : transaction.type === Types.INVESTMENT
                    ? transactionIconColor.investment
                    : transaction.type === Types.DEPOSIT
                      ? transactionIconColor.credit
                      : transaction.type === Types.DISBURSEMENT
                        ? transactionIconColor.credit
                        : transaction.type === Types.REPAYMENT
                          ? transactionIconColor.debit
                          : transaction.type === Types.LOAN
                            ? transactionIconColor.credit
                            : transactionIconColor[
                            transaction.type as keyof typeof transactionIconColor
                            ];

              const bgClass =
                transaction.type === Types.WITHDRAWAL
                  ? "bg-destructive/10"
                  : transaction.type === Types.INVESTMENT
                    ? "bg-yellow-100 dark:bg-yellow-900/30"
                    : transaction.type === Types.DISBURSEMENT
                      ? transactionIconBg.credit
                      : transaction.type === Types.DEPOSIT
                        ? transactionIconBg.credit
                        : transactionIconBg[
                        transaction.type as keyof typeof transactionIconBg
                        ];
              return (
                <View key={transaction.id} className={cn("flex flex-row items-center justify-between p-4 bg-white dark:bg-card rounded-xl", className)}>
                  <View className="flex flex-row items-center gap-2">
                    <View className={cn("flex items-center justify-center h-10 w-10 rounded-full",
                      transaction.type === Types.WITHDRAWAL ? 'bg-destructive/10' :
                        transaction.type === Types.INVESTMENT ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                          transaction.type === Types.DISBURSEMENT ? transactionIconBg['credit'] :
                            transaction.type === Types.DEPOSIT ? transactionIconBg['credit'] :
                              transactionIconBg[transaction.type as keyof typeof transactionIconBg]
                    )}>
                      <Icon strokeWidth={3} size={18} color={iconColor} className={iconColor} />

                    </View>
                    <View>
                      <Text className="font-semibold text-sm text-black dark:text-white">{transaction.title}</Text>
                      <Text className="text-xs text-gray-700 dark:text-muted-foreground">{formatDate(transaction.createdAt)}</Text>
                    </View>
                  </View>
                  <Text className={cn("font-bold text-sm whitespace-nowrap",
                    transaction.type === Types.WITHDRAWAL ? 'text-destructive' :
                      transaction.type === Types.INVESTMENT ? 'text-yellow-600 dark:text-yellow-400' :
                        transaction.type === Types.DISBURSEMENT ? transactionColors['credit'] :
                          transaction.type === Types.DEPOSIT ? transactionColors['credit'] :
                            transactionColors[transaction.type as keyof typeof transactionColors]
                  )}>
                    {formatAmount(transaction.amount, transaction.type)}
                  </Text>
                </View>
              );
}