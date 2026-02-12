import {
    StyleSheet, View, Text, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentsScreen() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<any[]>([]);

    useFocusEffect(
        useCallback(() => {
            const fetchTransactions = async () => {
                try {
                    const storedBookings = await AsyncStorage.getItem('bookings');
                    if (storedBookings) {
                        const bookings = JSON.parse(storedBookings);
                        // Convert bookings to transactions
                        // Assuming each booking is a paid transaction on the date it was booked
                        const txns = bookings.map((b: any) => ({
                            id: b.id,
                            title: b.title,
                            date: b.date,
                            amount: b.price || 999, // Fallback price if missing
                            status: 'Success'
                        })).reverse();
                        setTransactions(txns);
                    }
                } catch (e) {
                    console.error('Failed to load transactions');
                }
            };

            fetchTransactions();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="#000" onPress={() => router.back()} />
                <Text style={styles.headerTitle}>PAYMENT HISTORY</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {transactions.length === 0 ? (
                    <Text style={styles.emptyText}>No payment history found.</Text>
                ) : (
                    transactions.map((item) => (
                        <View key={item.id} style={styles.transactionCard}>
                            <View style={styles.iconContainer}>
                                <Ionicons
                                    name="arrow-down-circle"
                                    size={28}
                                    color="#4CAF50"
                                />
                            </View>
                            <View style={styles.details}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.date}>{item.date}</Text>
                            </View>
                            <View style={styles.amountContainer}>
                                <Text style={[styles.amount, { color: '#4CAF50' }]}>
                                    -₹{item.amount.toLocaleString()}
                                </Text>
                                <Text style={[styles.status, { color: '#888' }]}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#eee', gap: 15 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    emptyText: { textAlign: 'center', color: '#888', marginTop: 50, fontSize: 16 },
    transactionCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderColor: '#f9f9f9' },
    iconContainer: { marginRight: 15 },
    details: { flex: 1 },
    title: { fontWeight: 'bold', fontSize: 16 },
    date: { color: '#888', fontSize: 12 },
    amountContainer: { alignItems: 'flex-end' },
    amount: { fontWeight: 'bold', fontSize: 16 },
    status: { fontSize: 10, marginTop: 2 },
});
