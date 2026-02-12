import {
    StyleSheet, View, Text, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function LegalScreen() {
    const router = useRouter();
    const { type } = useLocalSearchParams();

    // Example Content
    const title = type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions';
    const content = type === 'privacy'
        ? "Your privacy is important to us. \n\n1. Information Collection: We collect name, address, and usage data.\n2. Usage: To provide beauty services.\n3. Sharing: We do not share data with 3rd parties without consent."
        : "Welcome to Pretty Me. \n\n1. Service: We provide at-home beauty services.\n2. Booking: Subject to availability.\n3. Cancellation: Free up to 4 hours before slot.\n4. Liability: We use certified pros but are not liable for allergic reactions unless due to negligence.";

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="#000" onPress={() => router.back()} />
                <Text style={styles.headerTitle}>{title.toUpperCase()}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.text}>{content}</Text>

                {/* Simulated long text */}
                <Text style={[styles.text, { marginTop: 20 }]}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#eee', gap: 15 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    text: { fontSize: 14, lineHeight: 22, color: '#333' },
});
