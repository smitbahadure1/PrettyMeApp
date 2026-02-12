import { Image } from 'expo-image';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();

    const concerns = [
        { id: 'unwanted-hair', title: 'Hair', image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070&auto=format&fit=crop' },
        { id: 'acne', title: 'Acne', image: 'https://images.unsplash.com/photo-1556228552-603be9389234?q=80&w=1974&auto=format&fit=crop' },
        { id: 'pigmentation', title: 'Spots', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop' },
        { id: 'dull-skin', title: 'Glow', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop' },
        { id: 'anti-aging', title: 'Ageless', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop' },
    ];

    const trendingTreatments = [
        { id: 'laser-hair-reduction', title: 'Laser Hair Reduction', subtitle: 'Painless & Permanent', image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8' },
        { id: 'laser-facials', title: 'Carbon Laser Peel', subtitle: 'Hollywood Glow', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9' },
        { id: 'face-prp', title: 'Vampire Facial', subtitle: 'Natural Regeneration', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* 1. Modern Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greetingText}>Good Morning,</Text>
                        <Text style={styles.userName}>Smit</Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Ionicons name="notifications-outline" size={24} color="#333" />
                            <View style={styles.badge} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Ionicons name="cart-outline" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 2. Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999" />
                    <TextInput placeholder="Search 'Laser hair reduction'" placeholderTextColor="#999" style={styles.searchInput} />
                    <TouchableOpacity style={styles.filterBtn}>
                        <Ionicons name="options-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* 3. Hero Carousel */}
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.carouselContainer}>
                    <TouchableOpacity style={styles.heroCard} activeOpacity={0.9} onPress={() => router.push('/service/laser-facials')}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881' }} style={styles.heroImage} contentFit="cover" />
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.heroOverlay}>
                            <View style={styles.heroTag}>
                                <Text style={styles.heroTagText}>VALENTINE SPECIAL</Text>
                            </View>
                            <Text style={styles.heroTitle}>Get 50% OFF on all Laser Treatments</Text>
                            <Text style={styles.heroSub}>Offer valid till 14th Feb</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.heroCard} activeOpacity={0.9} onPress={() => router.push('/service/body-slimming')}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1' }} style={styles.heroImage} contentFit="cover" />
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.heroOverlay}>
                            <View style={[styles.heroTag, { backgroundColor: '#4CAF50' }]}>
                                <Text style={styles.heroTagText}>NEW LAUNCH</Text>
                            </View>
                            <Text style={styles.heroTitle}>Body Slimming & Contouring</Text>
                            <Text style={styles.heroSub}>Sculpt your dream body today</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>

                {/* 4. Skin Weather Widget */}
                <View style={styles.weatherWidget}>
                    <View style={styles.weatherInfo}>
                        <Ionicons name="sunny" size={24} color="#FFD700" />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.weatherTitle}>UV Index: High (8.0)</Text>
                            <Text style={styles.weatherSub}>Wear SPF 50+ today!</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>

                {/* 5. Concerns (Stories Style) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Shop by Concern</Text>
                        <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {concerns.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.storyItem}
                                onPress={() => router.push(`/service/${item.id}`)}
                            >
                                <View style={styles.storyRing}>
                                    <Image source={{ uri: item.image }} style={styles.storyImg} />
                                </View>
                                <Text style={styles.storyText}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* 6. Trending Treatments (Large Cards) */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Trending Now</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {trendingTreatments.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.trendingCard}
                                onPress={() => router.push(`/service/${item.id}`)}
                            >
                                <Image source={{ uri: item.image }} style={styles.trendingImg} contentFit="cover" />
                                <View style={styles.trendingContent}>
                                    <Text style={styles.trendingTitle}>{item.title}</Text>
                                    <View style={styles.ratingBadge}>
                                        <Ionicons name="star" size={10} color="#fff" />
                                        <Text style={styles.ratingNum}>4.9</Text>
                                    </View>
                                </View>
                                <Text style={styles.trendingSub}>{item.subtitle}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* 7. Trust Markers */}
                <View style={styles.trustSection}>
                    <View style={styles.trustItem}>
                        <MaterialCommunityIcons name="shield-check-outline" size={24} color="#000" />
                        <Text style={styles.trustText}>FDA Approved</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.trustItem}>
                        <MaterialCommunityIcons name="doctor" size={24} color="#000" />
                        <Text style={styles.trustText}>Dermat Led</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.trustItem}>
                        <Feather name="award" size={24} color="#000" />
                        <Text style={styles.trustText}>Shark Tank</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <View style={styles.navItem}>
                    <Ionicons name="home" size={24} color="#000" />
                    <Text style={[styles.navText, { color: '#000', fontWeight: 'bold' }]}>Home</Text>
                </View>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/categories')}>
                    <Ionicons name="grid-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Categories</Text>
                </TouchableOpacity>
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
        backgroundColor: '#FAFAFA', // Slightly off-white for premium feel
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    greetingText: {
        fontSize: 14,
        color: '#888',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 15,
    },
    iconBtn: {
        padding: 5,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF4D4D',
    },
    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#333',
    },
    filterBtn: {
        backgroundColor: '#000',
        padding: 6,
        borderRadius: 8,
    },
    // Hero Carousel
    carouselContainer: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    heroCard: {
        width: width - 40,
        height: 180,
        marginRight: 10,
        borderRadius: 20,
        overflow: 'hidden',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 20,
    },
    heroTag: {
        backgroundColor: '#FF6F61',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    heroTagText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    heroTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        width: '80%',
        marginBottom: 4,
    },
    heroSub: {
        color: '#eee',
        fontSize: 12,
    },
    // Widget
    weatherWidget: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF9E6', // Light yellow
        marginHorizontal: 20,
        padding: 15,
        borderRadius: 12,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#FFE4B5',
    },
    weatherInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    weatherSub: {
        fontSize: 12,
        color: '#666',
    },
    // Sections
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    seeAll: {
        fontSize: 12,
        color: '#FF6F61',
        fontWeight: '600',
    },
    horizontalScroll: {
        paddingLeft: 20,
    },
    // Stories
    storyItem: {
        alignItems: 'center',
        marginRight: 20,
    },
    storyRing: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#FF6F61', // Brand color border
        padding: 3,
        marginBottom: 8,
    },
    storyImg: {
        width: '100%',
        height: '100%',
        borderRadius: 35,
    },
    storyText: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
    },
    // Trending Cards
    trendingCard: {
        width: 200,
        marginRight: 20,
        marginBottom: 10,
    },
    trendingImg: {
        width: 200,
        height: 140,
        borderRadius: 15,
        marginBottom: 10,
    },
    trendingContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    trendingTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    ratingNum: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 3,
    },
    trendingSub: {
        fontSize: 12,
        color: '#666',
    },
    // Trust
    trustSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    trustItem: {
        alignItems: 'center',
    },
    trustText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#333',
        marginTop: 5,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: '#eee',
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
