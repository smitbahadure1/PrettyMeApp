import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // State for toggles
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [biometric, setBiometric] = useState(false);

    // Modals
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);

    // Profile Data
    const [name, setName] = useState('Smit');
    const [email, setEmail] = useState('smit@example.com');
    const [phone, setPhone] = useState('9876543210');

    // Password Data
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const storedSettings = await AsyncStorage.getItem('app_settings');
            if (storedSettings) {
                const { push, email: emailNotif, dark, bio } = JSON.parse(storedSettings);
                setPushNotifications(push);
                setEmailNotifications(emailNotif);
                setDarkMode(dark);
                setBiometric(bio);
            }

            const storedProfile = await AsyncStorage.getItem('user_profile');
            if (storedProfile) {
                const { name: n, email: e, phone: p } = JSON.parse(storedProfile);
                setName(n);
                setEmail(e);
                setPhone(p);
            }
        } catch (e) {
            console.error('Failed to load settings');
        }
    };

    const saveSettings = async (key: string, value: boolean) => {
        try {
            const current = { push: pushNotifications, email: emailNotifications, dark: darkMode, bio: biometric };
            const updated = { ...current, [key]: value };
            await AsyncStorage.setItem('app_settings', JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to save settings');
        }
    };

    const handleSaveProfile = async () => {
        if (!name || !email || !phone) {
            Alert.alert('Error', 'All fields are required');
            return;
        }
        await AsyncStorage.setItem('user_profile', JSON.stringify({ name, email, phone }));
        setProfileModalVisible(false);
        Alert.alert('Success', 'Profile updated successfully');
    };

    const handleChangePassword = () => {
        if (!currentPass || !newPass || !confirmPass) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        if (newPass !== confirmPass) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }
        // Simulate API call
        setPasswordModalVisible(false);
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        Alert.alert('Success', 'Password changed successfully');
    };

    return (
        <SafeAreaView style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SETTINGS</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Account Settings */}
                <Text style={styles.sectionTitle}>Account</Text>

                <TouchableOpacity style={styles.settingItem} onPress={() => setProfileModalVisible(true)}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Edit Profile</Text>
                        <Text style={styles.settingSub}>{name} • {phone}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={() => setPasswordModalVisible(true)}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Change Password</Text>
                        <Text style={styles.settingSub}>Update your login password</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                {/* Notification Settings */}
                <Text style={styles.sectionTitle}>Notifications</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Push Notifications</Text>
                        <Text style={styles.settingSub}>Receive updates and offers</Text>
                    </View>
                    <Switch
                        value={pushNotifications}
                        onValueChange={(val) => {
                            setPushNotifications(val);
                            saveSettings('push', val);
                        }}
                        trackColor={{ true: '#FF6F61', false: '#eee' }}
                        thumbColor="#fff"
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Email Notifications</Text>
                        <Text style={styles.settingSub}>Get invoices and receipts</Text>
                    </View>
                    <Switch
                        value={emailNotifications}
                        onValueChange={(val) => {
                            setEmailNotifications(val);
                            saveSettings('email', val);
                        }}
                        trackColor={{ true: '#FF6F61', false: '#eee' }}
                        thumbColor="#fff"
                    />
                </View>

                {/* App Settings */}
                <Text style={styles.sectionTitle}>App Preferences</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Dark Mode</Text>
                        <Text style={styles.settingSub}>Switch to dark theme</Text>
                    </View>
                    <Switch
                        value={darkMode}
                        onValueChange={(val) => {
                            setDarkMode(val);
                            saveSettings('dark', val);
                            if (val) Alert.alert('Theme', 'Dark mode is active (Simulated).');
                        }}
                        trackColor={{ true: '#333', false: '#eee' }}
                        thumbColor="#fff"
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Biometric Login</Text>
                        <Text style={styles.settingSub}>Use Fingerprint/FaceID</Text>
                    </View>
                    <Switch
                        value={biometric}
                        onValueChange={(val) => {
                            setBiometric(val);
                            saveSettings('bio', val);
                            if (val) Alert.alert('Security', 'Biometric authentication enabled.');
                        }}
                        trackColor={{ true: '#4CAF50', false: '#eee' }}
                        thumbColor="#fff"
                    />
                </View>

                {/* Danger Zone */}
                <Text style={[styles.sectionTitle, { color: '#FF4d4d', marginTop: 30 }]}>Danger Zone</Text>

                <TouchableOpacity style={styles.deleteButton} onPress={() => Alert.alert('Delete Account', 'Are you sure? This action is irreversible.', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Deleted', 'Your account has been permanently deleted.') }
                ])}>
                    <Ionicons name="trash-outline" size={20} color="#FF4d4d" />
                    <Text style={styles.deleteText}>Delete Account</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Profile Modal */}
            <Modal visible={profileModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>
                        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full Name" />
                        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
                        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setProfileModalVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                                <Text style={styles.saveText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Password Modal */}
            <Modal visible={passwordModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Password</Text>
                        <TextInput style={styles.input} value={currentPass} onChangeText={setCurrentPass} placeholder="Current Password" secureTextEntry />
                        <TextInput style={styles.input} value={newPass} onChangeText={setNewPass} placeholder="New Password" secureTextEntry />
                        <TextInput style={styles.input} value={confirmPass} onChangeText={setConfirmPass} placeholder="Confirm New Password" secureTextEntry />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setPasswordModalVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleChangePassword}>
                                <Text style={styles.saveText}>Update Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 5,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#888',
        marginBottom: 15,
        marginTop: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    settingInfo: {
        flex: 1,
        marginRight: 10,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    settingSub: {
        fontSize: 12,
        color: '#999',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFF5F5',
        borderRadius: 12,
        justifyContent: 'center',
        gap: 8,
    },
    deleteText: {
        color: '#FF4d4d',
        fontSize: 16,
        fontWeight: 'bold',
    },
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
