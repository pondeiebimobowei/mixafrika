import { View, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Bell, Mail, MessageSquare } from 'lucide-react-native';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function NotificationPreferences() {
    const [preferences, setPreferences] = useState({
        push: true,
        email: true,
        sms: false,
        transactions: true,
        investment: true,
        security: true,
        market: true,
    });

    const toggle = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <View className="mb-6">
            <Text className="text-gray-500 font-bold mb-2 px-1 text-xs uppercase tracking-wider">{title}</Text>
            <View className="bg-[#111827] rounded-xl overflow-hidden border border-gray-800">{children}</View>
        </View>
    );

    const Item = ({
        label,
        description,
        value,
        onToggle,
        icon,
        isLast
    }: {
        label: string;
        description?: string;
        value: boolean;
        onToggle: () => void;
        icon?: React.ReactNode;
        isLast?: boolean;
    }) => (
        <View className={cn("flex-row items-center justify-between p-4", !isLast && "border-b border-gray-800")}>
            <View className="flex-row items-center gap-4 flex-1">
                {icon && (
                    <View className="w-10 h-10 items-center justify-center bg-[#1f2937] rounded-lg">
                        {icon}
                    </View>
                )}
                <View className="flex-1">
                    <Text className="text-white text-base font-bold">{label}</Text>
                    {description && <Text className="text-gray-400 text-xs mt-0.5">{description}</Text>}
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={'#fff'}
            />
        </View>
    );

    return (
        <SafeAreaView edges={[]} className="flex-1 bg-black p-4">
            <ScrollView>
                <Section title="Channels">
                    <Item
                        label="Push Notifications"
                        value={preferences.push}
                        onToggle={() => toggle('push')}
                        icon={<Bell size={20} color="#9ca3af" />}
                    />
                    <Item
                        label="Email"
                        value={preferences.email}
                        onToggle={() => toggle('email')}
                        icon={<Mail size={20} color="#9ca3af" />}
                    />
                    <Item
                        label="SMS Messages"
                        value={preferences.sms}
                        onToggle={() => toggle('sms')}
                        icon={<MessageSquare size={20} color="#9ca3af" />}
                        isLast
                    />
                </Section>

                <Section title="Alert Types">
                    <Item
                        label="Transactions"
                        description="Deposits, Withdrawals, Payouts"
                        value={preferences.transactions}
                        onToggle={() => toggle('transactions')}
                    />
                    <Item
                        label="Investment Updates"
                        description="Maturity, Cycles, Delays"
                        value={preferences.investment}
                        onToggle={() => toggle('investment')}
                    />
                    <Item
                        label="Security Alerts"
                        description="Login attempts, Password changes"
                        value={preferences.security}
                        onToggle={() => toggle('security')}
                    />
                    <Item
                        label="Market News"
                        description="Weekly digest, Market trends"
                        value={preferences.market}
                        onToggle={() => toggle('market')}
                        isLast
                    />
                </Section>

                {/* Placeholder for visual consistency with screenshot */}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
