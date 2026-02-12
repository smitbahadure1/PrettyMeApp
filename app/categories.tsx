import { Image } from 'expo-image';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
    const insets = useSafeAreaInsets();
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

                {/* Featured Banner */}
                <View style={styles.bannerSection}>
                    <TouchableOpacity style={styles.featuredBanner} onPress={() => router.push('/service/laser-hair-reduction')}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8' }}
                            style={styles.bannerImg}
                            contentFit="cover"
                        />
                        <LinearGradient colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']} style={styles.bannerOverlay}>
                            <View style={styles.bannerBadge}>
                                <Text style={styles.badgeText}>SPECIAL OFFER</Text>
                            </View>
                            <View style={styles.bannerContent}>
                                <Text style={styles.bannerTitle}>Get 50% Off</Text>
                                <Text style={styles.bannerSubtitle}>On Laser Hair Reduction</Text>
                                <View style={styles.bannerBtn}>
                                    <Text style={styles.bannerBtnText}>Book Now</Text>
                                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Quick Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScroll}
                    contentContainerStyle={styles.filterContent}
                >
                    <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
                        <Text style={[styles.filterText, styles.filterTextActive]}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterChip}>
                        <Text style={styles.filterText}>Face</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterChip}>
                        <Text style={styles.filterText}>Body</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterChip}>
                        <Text style={styles.filterText}>Hair</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterChip}>
                        <Text style={styles.filterText}>Skin</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* 2. Trending Section (Vertical Cards) */}
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
                            <View style={styles.trendingInfo}>
                                <View style={styles.trendingBadge}>
                                    <MaterialCommunityIcons name="fire" size={12} color="#FF6F61" />
                                    <Text style={styles.trendingBadgeText}>HOT</Text>
                                </View>
                                <Text style={styles.trendingTitle}>{item.title}</Text>
                                <Text style={styles.trendingSub}>{item.subtitle}</Text>
                                <View style={styles.trendingFooter}>
                                    <View style={styles.ratingBox}>
                                        <Ionicons name="star" size={12} color="#FFB800" />
                                        <Text style={styles.ratingText}>4.8</Text>
                                    </View>
                                    <Text style={styles.priceText}>₹999+</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* 3. All Services (Full-width Image Grid) */}
                <View style={[styles.sectionHeader, { marginTop: 25 }]}>
                    <Text style={styles.sectionTitle}>All Services</Text>
                    <Text style={styles.countBadge}>{currentData.length}</Text>
                </View>
                <View style={styles.grid}>
                    {currentData.map((item) => (
                        <TouchableOpacity
                            key={item.id + 'grid'}
                            style={styles.gridCard}
                            onPress={() => router.push(`/service/${item.id}`)}
                        >
                            <Image source={{ uri: item.image }} style={styles.gridImg} contentFit="cover" />
                            <View style={styles.gridContent}>
                                <View style={styles.gridHeader}>
                                    <View style={styles.gridTextContainer}>
                                        <Text style={styles.gridTitle}>{item.title}</Text>
                                        <Text style={styles.gridSub}>{item.subtitle}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.arrowBtn}>
                                        <Ionicons name="arrow-forward" size={18} color="#333" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.gridFooter}>
                                    <View style={styles.gridRating}>
                                        <Ionicons name="star" size={14} color="#FFB800" />
                                        <Text style={styles.gridRatingText}>4.9</Text>
                                        <Text style={styles.gridReviews}>(120)</Text>
                                    </View>
                                    <Text style={styles.gridPrice}>From ₹999</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            {/* Bottom Nav */}
            <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 10 }]}>
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
        paddingTop: 20,
        paddingBottom: 100,
    },
    // Featured Banner
    bannerSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    featuredBanner: {
        width: '100%',
        height: 180,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    bannerImg: {
        width: '100%',
        height: '100%',
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        padding: 20,
        justifyContent: 'space-between',
    },
    bannerBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FF6F61',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    bannerContent: {
        gap: 4,
    },
    bannerTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    bannerSubtitle: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 10,
    },
    bannerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        gap: 6,
    },
    bannerBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    // Filter Chips
    filterScroll: {
        marginBottom: 20,
    },
    filterContent: {
        paddingHorizontal: 20,
        gap: 10,
    },
    filterChip: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
    },
    filterChipActive: {
        backgroundColor: '#333',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    filterTextActive: {
        color: '#fff',
    },
    // Section Headers
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
    countBadge: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
    },
    // Trending (Vertical Cards)
    trendingScroll: {
        paddingLeft: 20,
        marginBottom: 10,
    },
    trendingCard: {
        width: 160,
        marginRight: 15,
        borderRadius: 15,
        backgroundColor: '#fff',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    trendingImg: {
        width: '100%',
        height: 140,
    },
    trendingInfo: {
        padding: 12,
    },
    trendingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#FFF5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
        marginBottom: 8,
    },
    trendingBadgeText: {
        color: '#FF6F61',
        fontSize: 10,
        fontWeight: 'bold',
    },
    trendingTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    trendingSub: {
        fontSize: 11,
        color: '#888',
        marginBottom: 8,
    },
    trendingFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    priceText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    // Grid (Full-width Image Cards)
    grid: {
        paddingHorizontal: 20,
        gap: 15,
    },
    gridCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 5,
    },
    gridImg: {
        width: '100%',
        height: 160,
    },
    gridContent: {
        padding: 15,
    },
    gridHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    gridTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    gridTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    gridSub: {
        fontSize: 12,
        color: '#888',
    },
    gridFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    gridRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    gridRatingText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
    },
    gridReviews: {
        fontSize: 12,
        color: '#999',
    },
    gridPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    arrowBtn: {
        backgroundColor: '#F5F5F5',
        padding: 8,
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
