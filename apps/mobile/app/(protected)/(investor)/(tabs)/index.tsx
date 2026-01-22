import React from 'react';
import { View, Text, Image, Pressable, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Sun, Moon, BarChart3, IdCard, CreditCard, Wallet, Rocket, PiggyBank, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { useAuthStore, useWallet } from '@/store';
import { useColorScheme } from 'nativewind';
import InvestorBalanceCard from '@/components/cards/investor-balance-card';
import InvestorStatsCard from '@/components/cards/investor-stats-card';
import InvestorEarningsChart from '@/components/cards/investor-earnings-chart';
import FinancialGoalsCard from '@/components/cards/financial-goals-card';
import PortfolioItem, { PortfolioItemProps } from '@/components/list-items/portfolio-item';
import { useRouter } from 'expo-router';
import { useFetchWallet } from '@/store/hooks/wallet.hook';
import { useFetchUser } from '@/store/hooks/user.hook';

const Investments: PortfolioItemProps[] = []

export default function InvestorDashboard() {
    const { user } = useAuthStore();
    const { available_balance, total_growth_earned, active_investment_principal } = useWallet();
    const { colorScheme, toggleColorScheme } = useColorScheme();

    const router = useRouter()
    useFetchWallet();
    useFetchUser();

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-gray-100 dark:bg-black px-4 pt-0 pb-6">
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

            { <FlatList
                data={[1]} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 20, paddingBottom: 40 }}
                renderItem={() => (
                    <>
                        { user?.verification?.status !== 'verified' && <View className='bg-primary p-6 rounded-2xl mb-6'>
                            <View className=''>
                                <ShieldCheck size={28} color={'white'}/>
                            </View>

                            <View className='my-8'>
                                <Text className='text-2xl text-white font-bold mb-2'>Verify Identity</Text>
                                <Text className='text-white'>Unlock trading in African clusters and access zero-interest business loans.</Text>
                            </View>

                            <Pressable onPress={() => router.push('/personal-verification')} className='bg-secondary rounded-lg flex gap-2 flex-row px-2 py-4 items-center justify-center'><Text className='text-white'>Verify Now</Text><ArrowRight size={18} color={'white'} /></Pressable>
                        </View>}
                        <>
                            <InvestorBalanceCard
                                balance={available_balance}
                                onDeposit={() => console.log('Deposit')}
                                onWithdraw={() => console.log('Withdraw')}
                            />

                        </>
                        {user?.verification?.status === 'verified' && (
                            <>
                                <View className="flex-row gap-4 my-6">
                                    <InvestorStatsCard
                                        label="Total Investment"
                                        amount={active_investment_principal}
                                    />
                                    <InvestorStatsCard
                                        label="Total Earnings"
                                        amount={total_growth_earned}
                                        icon={<BarChart3 size={16} color="#22c55e" />}
                                    />
                                </View>

                                <InvestorEarningsChart
                                    amount={210.55}
                                    percentageChange={1.5}
                                />

                                <FinancialGoalsCard />

                            </>
                        )}

                        <View>
                            <View className="flex-row justify-between items-center mb-4 mt-6">
                                <Text className="text-lg font-bold text-black dark:text-white">
                                    Your Portfolio
                                </Text>
                                <TouchableOpacity>
                                    <Text className="text-green-500 font-semibold text-sm">View Analytics</Text>
                                </TouchableOpacity>
                            </View>

                            {
                                Investments.length > 0 ? (
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
                                ): (

                    <View>
                    <View className="bg-[#0f172a] rounded-3xl p-8 items-center justify-center border border-dashed border-gray-800 h-[300px]">
                            <View className="w-16 h-16 bg-[#1f2937] rounded-full items-center justify-center mb-4">
                                <PiggyBank size={32} color="#6b7280" />
                            </View>
                            <Text className="text-white font-bold text-lg mb-2">No active investments</Text>
                            <Text className="text-gray-400 text-center mb-6 px-8 text-xs leading-5">
                                Start your journey by exploring available market clusters.
                            </Text>
                            <TouchableOpacity
                                className="bg-[#10b981] px-6 py-3 rounded-xl"
                                onPress={() => router.push('/(protected)/(investor)/(tabs)/explore')}
                            >
                                <Text className="text-white font-bold">Explore Markets</Text>
                            </TouchableOpacity>
                        </View>
                        </View>

                                )
                            }
                        </View>
                    </>
                )}
            />}

        </SafeAreaView>
    );
}



    const SETUP_STEPS = [
        {
            icon: IdCard,
            title: "Verify Identity",
            route: "/(protected)/(investor)/verification"
        },
        {
            icon: CreditCard,
            title: "Add Payment Method",
            route: "/(protected)/(investor)/payment-methods"
        },
        {
            icon: Wallet,
            title: "Make First Deposit",
            route: "/(protected)/(investor)/deposit"
        },
        {
            icon: Rocket,
            title: "Invest in a Cluster",
            route: "/(protected)/(investor)/(tabs)/explore"
        }
    ];