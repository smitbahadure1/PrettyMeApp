import { Image } from 'expo-image';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const womenData = [
    { id: 'laser-hair-reduction', title: 'Laser Hair Reduction', subtitle: 'Smooth Skin Forever', image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8', trending: true },
    { id: 'laser-facials', title: 'Laser Facials', subtitle: 'Hollywood Glow', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9', trending: true },
    { id: 'body-slimming', title: 'Body Contouring', subtitle: 'Sculpt & Shape', image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1', trending: false },
    { id: 'hair-treatments', title: 'Hair Treatment', subtitle: 'Voluminous Locks', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702', trending: false },
    { id: 'face-prp', title: 'Face PRP', subtitle: 'Youthful Regeneration', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881', trending: false },
    { id: 'permanent-makeup', title: 'Permanent Makeup', subtitle: 'Wake Up Ready', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f', trending: false },
    { id: 'skin-rejuvenation', title: 'Skin Rejuvenation', subtitle: 'Timeless Beauty', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9', trending: false },
    { id: 'chemical-peels', title: 'Chemical Peels', subtitle: 'Fresh Radiance', image: 'https://images.unsplash.com/photo-1512290923902-8a9281bf7719', trending: false },
];

const menData = [
    { id: 'laser-hair-reduction-men', title: 'Laser Hair Removal', subtitle: 'Clean & Sharp', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9', trending: true },
    { id: 'body-slimming-men', title: 'Body Sculpting', subtitle: 'Define Muscles', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b', trending: false },
    { id: 'laser-facials-men', title: 'Laser Facials', subtitle: 'Clear Complexion', image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6', trending: true },
    { id: 'face-prp-men', title: 'Hair Restoration', subtitle: 'Regrow Confidence', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be', trending: false },
    { id: 'permanent-makeup-men', title: 'Grooming', subtitle: 'Essential Care', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', trending: false },
    { id: 'skin-rejuvenation-men', title: 'Skin Care', subtitle: 'Healthy Glow', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce', trending: false },
    { id: 'hair-treatments-men', title: 'Scalp Care', subtitle: 'Dandruff Control', image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31', trending: false },
    { id: 'chemical-peels-men', title: 'De-Tan Peels', subtitle: 'Brighten Up', image: 'https://images.unsplash.com/photo-1617325247661-675e8b37b201', trending: false },
];

export default function CategoriesScreen() {
    const router = useRouter();
    const [selectedGender, setSelectedGender] = useState<'Women' | 'Men'>('Women');

    const currentData = selectedGender === 'Women' ? womenData : menData;
    const trendingItems = currentData.filter(item => item.trending);
    const otherItems = currentData.filter(item => !item.trending);

    return (
        <SafeAreaView style={styles.container}>

            {/* 1. Header with Search */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.pageTitle}>Categories</Text>
                    {/* Gender Toggle */}
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[styles.toggleBtn, selectedGender === 'Women' && styles.toggleBtnActive]}
                            onPress={() => setSelectedGender('Women')}
                        >
                            <Text style={[styles.toggleText, selectedGender === 'Women' && styles.textActive]}>Women</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleBtn, selectedGender === 'Men' && styles.toggleBtnActive]}
                            onPress={() => setSelectedGender('Men')}
                        >
                            <Text style={[styles.toggleText, selectedGender === 'Men' && styles.textActive]}>Men</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999" />
                    <TextInput
                        placeholder={`Search ${selectedGender}'s treatments...`}
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 2. Trending Section (Horizontal) */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Trending Now</Text>
                    <MaterialCommunityIcons name="fire" size={20} color="#FF6F61" />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
                    {trendingItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.trendingCard}
                            onPress={() => router.push(`/service/${item.id}`)}
                        >
                            <Image source={{ uri: item.image }} style={styles.trendingImg} contentFit="cover" />
                            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.cardOverlay}>
                                <Text style={styles.trendingTitle}>{item.title}</Text>
                                <Text style={styles.trendingSub}>{item.subtitle}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* 3. All Categories (Grid) */}
                <Text style={[styles.sectionTitle, { marginTop: 25, marginBottom: 15 }]}>All Services</Text>
                <View style={styles.grid}>
                    {otherItems.concat(trendingItems).map((item) => (
                        <TouchableOpacity
                            key={item.id + 'grid'}
                            style={styles.gridCard}
                            onPress={() => router.push(`/service/${item.id}`)}
                        >
                            <View style={styles.iconCircle}>
                                <Image source={{ uri: item.image }} style={styles.iconImg} />
                            </View>
                            <Text style={styles.gridTitle}>{item.title}</Text>
                            <Text style={styles.gridSub}>{item.subtitle}</Text>
                            <TouchableOpacity style={styles.arrowBtn}>
                                <Ionicons name="arrow-forward" size={16} color="#000" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
                    <Ionicons name="home-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>
                <View style={styles.navItem}>
                    <Ionicons name="grid" size={24} color="#000" />
                    <Text style={[styles.navText, { color: '#000', fontWeight: 'bold' }]}>Categories</Text>
                </View>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/bookings')}>
                    <Ionicons name="calendar-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Book</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/support')}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Support</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/account')}>
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
        backgroundColor: '#FCFCFC',
    },
    // Header
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        borderRadius: 25,
        padding: 4,
    },
    toggleBtn: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    toggleBtnActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#888',
    },
    textActive: {
        color: '#333',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 45,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#333',
    },
    // Content
    scrollContent: {
        paddingTop: 25,
        paddingBottom: 100,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    // Trending
    trendingScroll: {
        paddingLeft: 20,
    },
    trendingCard: {
        width: 250,
        height: 150,
        marginRight: 15,
        borderRadius: 15,
        overflow: 'hidden',
    },
    trendingImg: {
        width: '100%',
        height: '100%',
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 15,
    },
    trendingTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    trendingSub: {
        color: '#ddd',
        fontSize: 12,
        fontWeight: '500',
    },
    // Grid
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        gap: 15,
    },
    gridCard: {
        width: (width - 55) / 2, // 2 cols with gap
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f9f9f9',
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
    },
    iconImg: {
        width: '100%',
        height: '100%',
    },
    gridTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 4,
    },
    gridSub: {
        fontSize: 10,
        color: '#888',
        textAlign: 'center',
        marginBottom: 10,
    },
    arrowBtn: {
        marginTop: 'auto',
        backgroundColor: '#F5F5F5',
        padding: 6,
        borderRadius: 20,
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
