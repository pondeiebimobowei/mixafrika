import { KeyboardAvoidingView, Platform } from "react-native";

export default function KeyboardAvoidingAreaView({ children }: { children: React.ReactNode }) {
    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'android' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'android' ? 50 : 0}
            >
            {children}
        </KeyboardAvoidingView>
    )
}