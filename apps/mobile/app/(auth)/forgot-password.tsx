import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function ForgotPassword() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background p-6">
            <TouchableOpacity onPress={() => router.back()} className="mb-6">
                <ArrowLeft size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground">Forgot Password</Text>
            <Text className="text-muted-foreground mt-2">
                Enter your email to reset your password.
            </Text>
            {/* Placeholder content */}
        </SafeAreaView>
    );
}
