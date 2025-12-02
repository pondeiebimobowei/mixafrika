import React from 'react';
import { View, Text, ScrollView, Image, Pressable, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Sun, Moon, BarChart3 } from 'lucide-react-native';
import { useAuthStore, useWallet } from '@/store';
import { useColorScheme } from 'nativewind';
import InvestorBalanceCard from '@/components/cards/investor-balance-card';
import InvestorStatsCard from '@/components/cards/investor-stats-card';
import InvestorEarningsChart from '@/components/cards/investor-earnings-chart';
import FinancialGoalsCard from '@/components/cards/financial-goals-card';
import PortfolioItem, { PortfolioItemProps } from '@/components/list-items/portfolio-item';
import { useFetchWallet } from '@/store/hooks/wallet.hook';

const Investments: PortfolioItemProps[] = [
    {
        name: "Kano Rice Mills",
        category: "Agriculture",
        duration: "90 Days",
        investedAmount: 15000,
        currentReturn: 1250,
        status: "Pending",
        repaymentProgress: 65,
        iconType: "agriculture",
    },
    {
        name: "Aba Textile Co.",
        category: "Manufacturing",
        duration: "30 Days",
        investedAmount: 8500,
        currentReturn: 980,
        status: "Active",
        repaymentProgress: 82,
        iconType: "manufacturing",
    },
    {
        name: "Lekki Tech Hub",
        category: "Technology",
        duration: "60 Days",
        investedAmount: 22000,
        currentReturn: 2130,
        status: "Active",
        repaymentProgress: 45,
        iconType: "technology",
    },
]
// useFetchWallet()

export default function InvestorDashboard() {
    const { user } = useAuthStore();
    const { amount } = useWallet();
    const { colorScheme, toggleColorScheme } = useColorScheme();

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-gray-100 dark:bg-black px-4 pt-0 pb-6">
            {/* Header Section */}
            <View className="flex flex-row items-center justify-between py-4 mb-2">
                <View className="flex flex-row gap-3 items-center">
                    {user?.image ? (
                        <Image
                            className="w-10 h-10 rounded-full"
                            source={{ uri: user.image }}
                        />
                    ) : (
                        <View className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <Text className="text-foreground font-bold">
                                {user?.first_name?.charAt(0) || 'I'}
                            </Text>
                        </View>
                    )}

                    <View>
                        <Text className="text-black dark:text-white text-lg font-bold">Dashboard</Text>
                    </View>
                </View>

                <View className="flex flex-row gap-4 items-center">
                    <Pressable>
                        <Bell size={24} className="text-foreground dark:text-white" color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </Pressable>
                    <Pressable onPress={toggleColorScheme}>
                        {colorScheme === 'dark' ? (
                            <Sun size={24} className="text-foreground dark:text-white" color="white" />
                        ) : (
                            <Moon size={24} className="text-foreground dark:text-black" color="black" />
                        )}
                    </Pressable>
                </View>
            </View>

            {/* <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 20 }}> */}
            <FlatList
                data={[1]} // dummy 1-item list to render the entire screen
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 20, paddingBottom: 40 }}
                renderItem={() => (
                    <>
                        {/* Balance Section */}
                        <InvestorBalanceCard
                            balance={amount || 2450.00}
                            onDeposit={() => console.log('Deposit')}
                            onWithdraw={() => console.log('Withdraw')}
                        />

                        {/* Stats Section */}
                        <View className="flex-row gap-4">
                            <InvestorStatsCard
                                label="Total Investment"
                                amount={125430}
                            />
                            <InvestorStatsCard
                                label="Total Earnings"
                                amount={15880}
                                icon={<BarChart3 size={16} color="#22c55e" />}
                            />
                        </View>

                        {/* Earnings Chart */}
                        <InvestorEarningsChart
                            amount={210.55}
                            percentageChange={1.5}
                        />

                        {/* Financial Goals */}
                        <FinancialGoalsCard />

                        {/* Portfolio Section */}
                        <View>
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-bold text-black dark:text-white">
                                    Your Portfolio
                                </Text>
                                <TouchableOpacity>
                                    <Text className="text-green-500 font-semibold text-sm">View Analytics</Text>
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={Investments}
                                renderItem={({item}) => (
                                    <PortfolioItem
                                        name={item.name}
                                        category={item.category}
                                        duration={item.duration}
                                        investedAmount={item.investedAmount}
                                        currentReturn={item.currentReturn}
                                        status={item.status}
                                        repaymentProgress={item.repaymentProgress}
                                        iconType={item.iconType}
                                    />
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </>
                )}
            />
            {/* </ScrollView> */}
        </SafeAreaView>
    );
}
