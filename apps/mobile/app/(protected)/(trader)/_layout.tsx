import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Pressable, TouchableOpacity } from 'react-native';

export default function ProfileStackLayout() {
    const router = useRouter()
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="(tabs)"
                options={{
                    title: "Home",
                    headerShown: false,
                }}
            />


            <Stack.Screen
                name="loan/apply"
                options={{
                    headerShown: true,
                    title: 'Apply for Funds',
                    headerStyle: {
                        backgroundColor: 'black',
                    },
                    headerTitleAlign: 'center',
                    headerTintColor: '#ffffff',
                    headerTitleStyle: {
                        fontWeight: '900',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => {
                                router.back();
                            }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen
                name="repayment-history"
                options={{
                    headerShown: true,
                    title: 'Loan Details',
                    headerStyle: {
                        backgroundColor: 'black',
                    },
                    headerTitleAlign: 'center',
                    headerTintColor: '#ffffff',
                    headerTitleStyle: {
                        fontWeight: '900',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => {
                                router.back();
                            }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen
                name="notification"
                options={{
                    headerShown: true,
                    title: 'Notification',
                    headerStyle: {
                        backgroundColor: '#1A1A1A',
                    },
                    headerTitleAlign: 'center',
                    headerTintColor: '#ffffff',
                    headerTitleStyle: {
                        fontWeight: '900',
                    },
                    headerLeft: () => (
                        <Pressable
                            onPress={() => {
                                router.back();
                            }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen
                name="esusu/target"
                options={{
                    headerShown: false,
                    title: 'Esusu - Target Savings',
                    headerStyle: {
                        backgroundColor: 'black',
                    },
                    headerTitleAlign: 'center',
                    headerTintColor: '#ffffff',
                    headerTitleStyle: {
                        fontWeight: '900',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => {
                                router.back();
                            }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen
                name="transactions"
                options={{
                    headerShown: true,
                    title: 'Transactions',
                    headerStyle: {
                        backgroundColor: 'rgb(23,26,33)',
                    },
                    headerTitleAlign: 'center',
                    headerTintColor: '#ffffff',
                    headerTitleStyle: {
                        fontWeight: '900',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => {
                                router.back();
                            }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),

                }}
            />


            <Stack.Screen
                name="esusu/fixed"
                options={{
                    headerShown: false,
                    title: 'Esusu - Fixed Savings',
                    headerStyle: {
                        // backgroundColor: 'white',
                    },
                    headerTitleAlign: 'center',
                    headerTintColor: '#ffffff',
                    headerTitleStyle: {
                        fontWeight: '900',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => {
                                router.back();
                            }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen
                name="settings"
                options={{
                    headerShown: true,
                    title: 'Settings',
                    headerStyle: {
                        backgroundColor: 'black',
                    },
                    headerTitleAlign: 'center',
                    headerTintColor: '#ffffff',
                    headerTitleStyle: {
                        fontWeight: '900',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => {
                                router.back();
                            }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen
                name="notifications"
                options={{
                    headerShown: true,
                    title: 'Notification Preferences',
                    headerStyle: {
                        backgroundColor: 'black',
                    },
                    headerTitleAlign: 'center',
                    headerTintColor: '#ffffff',
                    headerTitleStyle: {
                        fontWeight: '900',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => {
                                router.back();
                            }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen
                name="support"
                options={{
                    headerShown: true,
                    title: 'Help & Support',
                    headerStyle: {
                        backgroundColor: 'black',
                    },
                    headerTitleAlign: 'center',
                    headerTintColor: '#ffffff',
                    headerTitleStyle: {
                        fontWeight: '900',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => {
                                router.back();
                            }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="kyc"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}