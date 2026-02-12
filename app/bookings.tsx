import { Image } from 'expo-image';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function BookingsScreen() {
    const router = useRouter();

    const navigateTo = (route: string) => {
        if (route === 'home') router.push('/home');
        if (route === 'categories') router.push('/categories');
        if (route === 'bookings') router.push('/bookings');
        if (route === 'support') router.push('/support');
        if (route === 'account') router.push('/account');
    };

    return (
        <SafeAreaView style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>MY BOOKINGS</Text>
            </View>

            <View style={styles.content}>
                {/* Illustration */}
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7486/7486744.png' }} // Placeholder for the vector illustration
                    style={styles.illustration}
                    contentFit="contain"
                />

                <Text style={styles.title}>NO BOOKINGS YET</Text>
                <Text style={styles.subtitle}>Check out our latest offers and book a session.</Text>

                <TouchableOpacity style={styles.exploreBtn} onPress={() => navigateTo('categories')}>
                    <Text style={styles.exploreBtnText}>EXPLORE</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('home')}>
                    <Ionicons name="home-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('categories')}>
                    <Ionicons name="grid-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Categories</Text>
                </TouchableOpacity>
                <View style={styles.navItem}>
                    <Ionicons name="calendar" size={24} color="#000" />
                    <Text style={[styles.navText, { color: '#000', fontWeight: 'bold' }]}>Bookings</Text>
                </View>
                <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('support')}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Support</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('account')}>
                    <Ionicons name="person-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Account</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 1,
        color: '#000',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingBottom: 80, // Space for bottom nav
    },
    illustration: {
        width: 250,
        height: 250,
        marginBottom: 30,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#000',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 13,
        color: '#888',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
        maxWidth: '80%',
    },
    exploreBtn: {
        backgroundColor: '#000',
        paddingVertical: 15,
        width: '100%',
        borderRadius: 5,
        alignItems: 'center',
    },
    exploreBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
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
