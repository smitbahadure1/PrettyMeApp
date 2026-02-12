import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Dimensions, Alert } from 'react-native';
import { Ionicons, FontAwesome, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Reusable Menu Item Component
const MenuItem = ({ icon, label, onPress }: { icon: any, label: string, onPress?: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuIconContainer}>
            {icon}
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
        <Ionicons name="chevron-forward" size={20} color="#000" />
    </TouchableOpacity>
);

export default function AccountScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const navigateTo = (route: string) => {
        if (route === 'home') router.push('/home');
        if (route === 'categories') router.push('/categories');
        if (route === 'bookings') router.push('/bookings');
        if (route === 'support') router.push('/support');
        if (route === 'account') router.push('/account');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Profile Header */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hi, Smit</Text>
                    <TouchableOpacity>
                        <Text style={styles.editProfile}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Grid Section */}
                <View style={styles.gridContainer}>
                    {/* My Bookings */}
                    <TouchableOpacity style={styles.gridCard} onPress={() => navigateTo('bookings')}>
                        <Text style={styles.cardTitle}>My Bookings</Text>
                        <Text style={styles.redText}>No Bookings Available...</Text>
                    </TouchableOpacity>

                    {/* Help & Support */}
                    <TouchableOpacity style={styles.gridCard} onPress={() => navigateTo('support')}>
                        <Text style={styles.cardTitle}>Help & Support</Text>
                        <View style={{ marginTop: 5 }}>
                            <Text style={styles.grayText}>Working Hours:</Text>
                            <Text style={styles.grayText}>Mon-sun 10.00 AM- 8.00 PM</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Wallet */}
                    <View style={styles.gridCard}>
                        <Text style={styles.cardTitle}>Wallet</Text>
                        <Text style={styles.balanceText}>Balance: ₹0</Text>
                    </View>

                    {/* Loyalty Points */}
                    <View style={styles.gridCard}>
                        <Text style={styles.cardTitle}>Loyalty Points</Text>
                        <Text style={styles.redBalanceText}>Balance: ₹0</Text>
                    </View>
                </View>

                {/* Menu List */}
                <View style={styles.menuList}>
                    <MenuItem
                        icon={<Ionicons name="settings-outline" size={22} color="#000" />}
                        label="Settings"
                        onPress={() => router.push('/settings')}
                    />
                    <MenuItem
                        icon={<Ionicons name="location-outline" size={22} color="#000" />}
                        label="Manage Address"
                        onPress={() => router.push('/address')}
                    />
                    <MenuItem
                        icon={<Ionicons name="wallet-outline" size={22} color="#000" />}
                        label="Payment History"
                        onPress={() => router.push('/payments')}
                    />
                    <MenuItem
                        icon={<Ionicons name="star-outline" size={22} color="#000" />}
                        label="Rate Us"
                        onPress={() => {
                            // Open Play Store
                            Linking.openURL('market://details?id=com.prettyme.app').catch(() => {
                                Alert.alert('Rate Us', 'Could not open Play Store. Please rate us manually!');
                            });
                        }}
                    />
                    <MenuItem
                        icon={<Ionicons name="document-text-outline" size={22} color="#000" />}
                        label="Terms & Conditions"
                        onPress={() => router.push('/legal/terms')}
                    />
                    <MenuItem
                        icon={<Ionicons name="lock-closed-outline" size={22} color="#000" />}
                        label="Privacy & Policy"
                        onPress={() => router.push('/legal/privacy')}
                    />
                </View>

                {/* Social Links */}
                <View style={styles.socialSection}>
                    <Text style={styles.socialTitle}>Social Links</Text>
                    <View style={styles.socialIconsRow}>
                        <TouchableOpacity style={styles.socialIcon}>
                            <AntDesign name="instagram" size={30} color="#E1306C" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialIcon}>
                            <AntDesign name="youtube" size={30} color="#FF0000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialIcon}>
                            <FontAwesome name="facebook-square" size={30} color="#4267B2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialIcon}>
                            <FontAwesome name="linkedin-square" size={30} color="#0077b5" />
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Nav */}
            <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 10 }]}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('home')}>
                    <Ionicons name="home-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('categories')}>
                    <Ionicons name="grid-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Categories</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('bookings')}>
                    <Ionicons name="calendar-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Bookings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('support')}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Support</Text>
                </TouchableOpacity>
                <View style={styles.navItem}>
                    <Ionicons name="person" size={24} color="#000" />
                    <Text style={[styles.navText, { color: '#000', fontWeight: 'bold' }]}>Account</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 90,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fff',
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000',
    },
    editProfile: {
        fontSize: 14,
        color: '#666',
        textDecorationLine: 'underline',
    },
    // Grid
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    gridCard: {
        width: (width - 45) / 2, // 2 columns with padding
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        height: 100, // Fixed height for uniformity
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000',
    },
    redText: {
        fontSize: 12,
        color: '#FF4d4d', // Reddish
        lineHeight: 16,
    },
    grayText: {
        fontSize: 11,
        color: '#666',
        lineHeight: 14,
    },
    balanceText: {
        fontSize: 13,
        color: '#666',
    },
    redBalanceText: {
        fontSize: 13,
        color: '#FF4d4d',
    },
    // Menu
    menuList: {
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    menuIconContainer: {
        marginRight: 15,
        width: 24,
        alignItems: 'center',
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    // Social
    socialSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    socialTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    socialIconsRow: {
        flexDirection: 'row',
        gap: 20,
    },
    socialIcon: {
        // Optional styling if needed
    },
    // Bottom Nav
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingBottom: 5,
    },
    navItem: {
        alignItems: 'center',
    },
    navText: {
        fontSize: 10,
        marginTop: 4,
        color: '#999',
    },
});
