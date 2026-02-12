import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddressScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    // Form State
    const [newLabel, setNewLabel] = useState('');
    const [newAddr, setNewAddr] = useState('');

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const stored = await AsyncStorage.getItem('user_addresses');
            if (stored) {
                setAddresses(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load addresses');
        }
    };

    const saveAddresses = async (newAddresses: any[]) => {
        try {
            await AsyncStorage.setItem('user_addresses', JSON.stringify(newAddresses));
            setAddresses(newAddresses);
        } catch (e) {
            console.error('Failed to save addresses');
        }
    };

    const handleAddAddress = () => {
        if (!newLabel || !newAddr) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        const newAddress = {
            id: Date.now().toString(),
            label: newLabel,
            address: newAddr,
            primary: addresses.length === 0 // Make first address primary
        };
        const updated = [...addresses, newAddress];
        saveAddresses(updated);

        setModalVisible(false);
        setNewLabel('');
        setNewAddr('');
    };

    const handleDelete = (id: string) => {
        Alert.alert('Delete', 'Are you sure?', [
            { text: 'Cancel' },
            {
                text: 'Delete', onPress: () => {
                    const updated = addresses.filter(a => a.id !== id);
                    saveAddresses(updated);
                }
            }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>MANAGE ADDRESS</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="add" size={28} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {addresses.length === 0 ? (
                    <Text style={styles.emptyText}>No addresses found. Tap + to add one.</Text>
                ) : (
                    addresses.map((item) => (
                        <View key={item.id} style={styles.addressCard}>
                            <View style={styles.addressIcon}>
                                <Ionicons name={item.label.toLowerCase().includes('home') ? 'home' : 'business'} size={24} color="#666" />
                            </View>
                            <View style={styles.addressInfo}>
                                <View style={styles.labelRow}>
                                    <Text style={styles.addressLabel}>{item.label}</Text>
                                    {item.primary && <Text style={styles.primaryBadge}>PRIMARY</Text>}
                                </View>
                                <Text style={styles.addressText}>{item.address}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                <Ionicons name="trash-outline" size={20} color="#FF4d4d" />
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Add Address Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Address</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Label (e.g., Home, Work)"
                            value={newLabel}
                            onChangeText={setNewLabel}
                        />
                        <TextInput
                            style={[styles.input, { height: 80 }]}
                            placeholder="Full Address"
                            multiline
                            value={newAddr}
                            onChangeText={setNewAddr}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleAddAddress}>
                                <Text style={styles.saveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    backButton: {
        padding: 5,
        marginRight: 10,
    },
    emptyText: { textAlign: 'center', color: '#888', marginTop: 50 },
    addressCard: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#f9f9f9', borderRadius: 12, marginBottom: 15 },
    addressIcon: { marginRight: 15 },
    addressInfo: { flex: 1 },
    labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    addressLabel: { fontWeight: 'bold', fontSize: 16, marginRight: 8 },
    primaryBadge: { fontSize: 10, backgroundColor: '#E6FFEA', color: '#2D6A4F', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    addressText: { color: '#666' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { backgroundColor: '#f0f0f0', borderRadius: 10, padding: 12, marginBottom: 15 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    cancelBtn: { flex: 1, padding: 15, alignItems: 'center', backgroundColor: '#eee', borderRadius: 10 },
    saveBtn: { flex: 1, padding: 15, alignItems: 'center', backgroundColor: '#000', borderRadius: 10 },
    cancelText: { fontWeight: 'bold' },
    saveText: { color: '#fff', fontWeight: 'bold' },
});
