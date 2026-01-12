import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Search, MessageSquare, Mail } from 'lucide-react-native';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function Support() {
    const FAQS = [
        {
            value: 'item-1',
            question: 'How are returns calculated?',
            answer: 'Returns are calculated based on the interest rate of the specific investment product and the duration of your investment. Interest accrues daily and is paid out at maturity.'
        },
        {
            value: 'item-2',
            question: 'When do I get my principal back?',
            answer: 'Your principal amount is returned to your wallet immediately upon the maturity date of your investment plan, along with the accrued interest.'
        },
        {
            value: 'item-3',
            question: 'Is my investment insured?',
            answer: 'Yes, all investments are insured up to a certain limit. We work with regulated partners to ensure the safety of your funds.'
        },
        {
            value: 'item-4',
            question: 'Can I withdraw before maturity?',
            answer: 'Early withdrawal is possible but may attract a penalty fee. The specific terms depend on the investment product you have chosen.'
        },
    ];

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-black p-4">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View className="bg-[#1f2937] rounded-xl flex-row items-center px-4 py-3 mb-8 border border-gray-700">
                    <Search size={20} color="#9ca3af" />
                    <TextInput
                        placeholder="How can we help?"
                        placeholderTextColor="#9ca3af"
                        className="flex-1 ml-3 text-white text-base"
                    />
                </View>

                {/* Contact Cards */}
                <View className="flex-row gap-4 mb-8">
                    <TouchableOpacity className="flex-1 bg-[#111827] p-6 rounded-2xl items-center border border-gray-800">
                        <View className="w-12 h-12 bg-[#1f2937] rounded-full items-center justify-center mb-3">
                            <MessageSquare size={24} color="#3b82f6" />
                        </View>
                        <Text className="text-white font-bold text-base mb-1">Live Chat</Text>
                        <Text className="text-gray-500 text-xs">Avg. wait: 2 mins</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-1 bg-[#111827] p-6 rounded-2xl items-center border border-gray-800">
                        <View className="w-12 h-12 bg-[#1f2937] rounded-full items-center justify-center mb-3">
                            <Mail size={24} color="#10b981" />
                        </View>
                        <Text className="text-white font-bold text-base mb-1">Email Us</Text>
                        <Text className="text-gray-500 text-xs">Response in 24h</Text>
                    </TouchableOpacity>
                </View>

                {/* FAQ Section */}
                <Text className="text-white font-bold text-lg mb-4">Frequently Asked Questions</Text>
                <Accordion type="single" collapsible className="w-full gap-2">
                    {FAQS.map((faq) => (
                        <AccordionItem key={faq.value} value={faq.value} className="bg-[#111827] rounded-xl border border-gray-800 overflow-hidden mb-2">
                            <AccordionTrigger className="px-4 py-4">
                                <Text className="text-white font-semibold text-base">{faq.question}</Text>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                                <Text className="text-gray-400 leading-6">{faq.answer}</Text>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
