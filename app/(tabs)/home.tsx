import { Image } from 'expo-image';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, FlatList, Alert, TextInput, Modal } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useRef, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

import { StatusBar } from 'expo-status-bar';


export default function HomeScreen() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);
    const [activeBanner, setActiveBanner] = useState(0);

    const handlePress = (route: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(route as any);
    };

    const banners = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
            tag: 'VALENTINE SPECIAL',
            title: 'Get 50% OFF on all Laser Treatments',
            sub: 'Offer valid till 14th Feb',
            link: '/service/laser-facials',
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop',
            tag: 'NEW LAUNCH',
            title: 'Body Slimming & Contouring',
            sub: 'Sculpt your dream body today',
            link: '/service/body-slimming',
            tagColor: '#4CAF50',
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800&auto=format&fit=crop',
            tag: 'BEST SELLER',
            title: 'Full Body Laser Hair Reduction',
            sub: 'Painless & Permanent Results',
            link: '/service/laser-hair-reduction',
            tagColor: '#FF9800',
        },
    ];

    const concerns = [
        { id: 'unwanted-hair', title: 'Hair', image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=400&auto=format&fit=crop' },
        { id: 'acne', title: 'Acne', image: 'https://images.unsplash.com/photo-1505944270275-e884d56c7623?q=80&w=400&auto=format&fit=crop' },
        { id: 'pigmentation', title: 'Spots', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop' },
        { id: 'dull-skin', title: 'Glow', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=400&auto=format&fit=crop' },
        { id: 'anti-aging', title: 'Ageless', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=400&auto=format&fit=crop' },
    ];

    const trendingTreatments = [
        { id: 1, title: 'Laser Hair Reduction', category: 'Body', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop', rating: 4.9, reviews: 120, link: '/service/laser-hair-reduction' },
        { id: 2, title: 'Chemical Peels', category: 'Face', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop', rating: 4.8, reviews: 85, link: '/service/chemical-peels' },
        { id: 3, title: 'Hydra Facial', category: 'Face', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=600&auto=format&fit=crop', rating: 4.9, reviews: 200, link: '/service/hydra-facial' },
    ];

    // Auto-scroll logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (activeBanner < banners.length - 1) {
                flatListRef.current?.scrollToIndex({ index: activeBanner + 1, animated: true });
                setActiveBanner(prev => prev + 1);
            } else {
                flatListRef.current?.scrollToIndex({ index: 0, animated: true });
                setActiveBanner(0);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [activeBanner]);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems && viewableItems.length > 0) {
            setActiveBanner(viewableItems[0].index ?? 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;


    const doctors = [
        {
            id: 1,
            name: 'Dr. Priya Sharma',
            specialty: 'Senior Dermatologist',
            rating: 4.9,
            reviews: '500+',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop',
            desc: 'Senior Dermatologist with 10+ years of experience. Specializes in advanced acne treatments and anti-aging therapies.',
            exp: '10+ Years',
            fee: 1500
        },
        {
            id: 2,
            name: 'Dr. Rahul Mehta',
            specialty: 'Cosmetologist',
            rating: 4.8,
            reviews: '450+',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop',
            desc: 'Leading Cosmetologist known for non-surgical hair restoration and scalp treatments.',
            exp: '8+ Years',
            fee: 1200
        },
        {
            id: 3,
            name: 'Dr. Anjali Gupta',
            specialty: 'Skin Specialist',
            rating: 5.0,
            reviews: '600+',
            image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2070&auto=format&fit=crop',
            desc: 'Renowned Skin Specialist with expertise in laser therapies and pigmentation correction.',
            exp: '12+ Years',
            fee: 1800
        }
    ];

    const [doctorModalVisible, setDoctorModalVisible] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

    // Booking Form State within Doctor Modal
    const [bookingStep, setBookingStep] = useState<'details' | 'form'>('details');
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());
    const [selectedTime, setSelectedTime] = useState('10:00 AM');
    const [address, setAddress] = useState('123, Green Park, New Delhi');

    const handleDoctorPress = (doctor: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedDoctor(doctor);
        setBookingStep('details'); // Reset to details view
        setDoctorModalVisible(true);
    };

    const confirmDoctorBooking = async () => {
        if (!selectedDoctor) return;

        try {
            const newBooking = {
                id: Date.now().toString(),
                serviceId: `doc-${selectedDoctor.id}`,
                title: `Consultation: ${selectedDoctor.name}`,
                price: selectedDoctor.fee,
                date: selectedDate,
                time: selectedTime,
                address: address,
                status: 'Upcoming',
                image: selectedDoctor.image,
                duration: '45 mins', // Default duration for consultation
                isDoctor: true,
                doctorName: selectedDoctor.name,
                specialty: selectedDoctor.specialty
            };

            // Save to Local Storage
            const existingBookingsStr = await AsyncStorage.getItem('bookings');
            const existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
            const updatedBookings = [...existingBookings, newBooking];
            await AsyncStorage.setItem('bookings', JSON.stringify(updatedBookings));

            setDoctorModalVisible(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Navigate to Bookings Tab to show the new booking
            // We use a small timeout to allow modal to close smoothly
            setTimeout(() => {
                router.push('/bookings');
            }, 300);

        } catch (error) {
            console.error('Error saving booking:', error);
            Alert.alert('Error', 'Failed to save booking');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* 1. Modern Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greetingText}>Good Morning,</Text>
                        <Text style={styles.userName}>
                            {(() => {
                                if (!isLoaded) return 'Loading...';
                                if (!user) return 'Not Signed In';

                                const displayName =
                                    user.firstName ||
                                    user.fullName ||
                                    user.username ||
                                    user.primaryEmailAddress?.emailAddress?.split('@')[0] ||
                                    user.primaryPhoneNumber?.phoneNumber ||
                                    user.id?.slice(0, 8) ||
                                    'User';

                                return displayName;
                            })()}
                        </Text>
                    </View>
                </View>

                {/* 2. Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999" />
                    <TextInput
                        placeholder="Search treatments, doctors..."
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                    />
                    <View style={styles.filterBtn}>
                        <Ionicons name="options-outline" size={20} color="#fff" />
                    </View>
                </View>

                {/* 3. Hero Carousel (Auto-Sliding) */}
                <View style={[styles.carouselContainer, { marginBottom: 20 }]}>
                    <FlatList
                        ref={flatListRef}
                        data={banners}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item?.id?.toString() ?? Math.random().toString()}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                        renderItem={({ item }) => {
                            if (!item) return null;
                            return (
                                <TouchableOpacity
                                    style={[styles.heroCard, { width: width - 40, marginHorizontal: 0 }]}
                                    activeOpacity={0.9}
                                    onPress={() => handlePress(item.link)}
                                >
                                    <Image source={{ uri: item.image }} style={styles.heroImage} contentFit="cover" />
                                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.heroOverlay}>
                                        <View style={[styles.heroTag, item.tagColor ? { backgroundColor: item.tagColor } : {}]}>
                                            <Text style={styles.heroTagText}>{item.tag}</Text>
                                        </View>
                                        <Text style={styles.heroTitle}>{item.title}</Text>
                                        <Text style={styles.heroSub}>{item.sub}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            )
                        }}
                    />
                    {/* Pagination Dots */}
                    <View style={styles.paginationContainer}>
                        {banners.map((_, index) => (
                            <View
                                key={index}
                                style={[styles.paginationDot, activeBanner === index && styles.paginationDotActive]}
                            />
                        ))}
                    </View>
                </View>

                {/* Membership Banner */}
                <TouchableOpacity
                    style={styles.membershipBanner}
                    activeOpacity={0.9}
                    onPress={() => handlePress('/membership')}
                >
                    <LinearGradient
                        colors={['#1a1a1a', '#000']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.membershipGradient}
                    >
                        <View>
                            <View style={styles.membershipBadge}>
                                <Text style={styles.membershipBadgeText}>ELITE</Text>
                            </View>
                            <Text style={styles.membershipTitle}>Join PrettyMe Elite</Text>
                            <Text style={styles.membershipSub}>Get 15% OFF on every booking</Text>
                        </View>
                        <Ionicons name="diamond-outline" size={40} color="#FFD700" />
                    </LinearGradient>
                </TouchableOpacity>

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
                                onPress={() => handlePress(`/service/${item.id}`)}
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
                                activeOpacity={0.8}
                                onPress={() => handlePress(item.link)}
                            >
                                <Image source={{ uri: item.image }} style={styles.trendingImg} contentFit="cover" />
                                <View style={styles.trendingContent}>
                                    <Text style={styles.trendingTitle} numberOfLines={1}>{item.title}</Text>
                                    <View style={styles.ratingBadge}>
                                        <Ionicons name="star" size={10} color="#FFD700" />
                                        <Text style={styles.ratingNum}>{item.rating}</Text>
                                    </View>
                                </View>
                                <Text style={styles.trendingSub}>{item.category} • {item.reviews} Reviews</Text>
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

                {/* 9. Before & After Gallery */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Real Results</Text>
                        <TouchableOpacity><Text style={styles.seeAll}>See More</Text></TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        <View style={styles.beforeAfterCard}>
                            <Image source={{ uri: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9' }} style={styles.beforeAfterImg} contentFit="cover" />
                            <View style={styles.beforeAfterLabel}>
                                <Text style={styles.beforeAfterText}>Laser Facial</Text>
                            </View>
                        </View>
                        <View style={styles.beforeAfterCard}>
                            <Image source={{ uri: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8' }} style={styles.beforeAfterImg} contentFit="cover" />
                            <View style={styles.beforeAfterLabel}>
                                <Text style={styles.beforeAfterText}>Hair Removal</Text>
                            </View>
                        </View>
                        <View style={styles.beforeAfterCard}>
                            <Image source={{ uri: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881' }} style={styles.beforeAfterImg} contentFit="cover" />
                            <View style={styles.beforeAfterLabel}>
                                <Text style={styles.beforeAfterText}>Skin Treatment</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>

                {/* 10. Expert Dermatologists */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Meet Our Experts</Text>
                        <TouchableOpacity><Text style={styles.seeAll}>View All</Text></TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {doctors.map((doc) => (
                            <TouchableOpacity
                                key={doc.id}
                                style={styles.doctorCard}
                                activeOpacity={0.9}
                                onPress={() => handleDoctorPress(doc)}
                            >
                                <Image source={{ uri: doc.image }} style={styles.doctorImg} contentFit="cover" />
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                                    <Text style={styles.verifiedText}>Verified</Text>
                                </View>
                                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.doctorOverlay}>
                                    <Text style={styles.doctorName}>{doc.name}</Text>
                                    <Text style={styles.doctorSpec}>{doc.specialty}</Text>
                                    <View style={styles.doctorRating}>
                                        <Ionicons name="star" size={12} color="#FFB800" />
                                        <Text style={styles.doctorRatingText}>{doc.rating} ({doc.reviews} Reviews)</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* 11. Customer Reviews */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>What Our Clients Say</Text>
                        <View style={styles.overallRating}>
                            <Ionicons name="star" size={16} color="#FFB800" />
                            <Text style={styles.overallRatingText}>4.9</Text>
                        </View>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        <View style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <View style={styles.reviewerInfo}>
                                    <View style={styles.reviewerAvatar}>
                                        <Text style={styles.reviewerInitial}>S</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.reviewerName}>Sneha Patel</Text>
                                        <View style={styles.reviewStars}>
                                            <Ionicons name="star" size={12} color="#FFB800" />
                                            <Ionicons name="star" size={12} color="#FFB800" />
                                            <Ionicons name="star" size={12} color="#FFB800" />
                                            <Ionicons name="star" size={12} color="#FFB800" />
                                            <Ionicons name="star" size={12} color="#FFB800" />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.reviewText}>Amazing results! The laser hair removal treatment was painless and effective. Highly recommend!</Text>
                            <Text style={styles.reviewDate}>2 days ago</Text>
                        </View>
                        <View style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <View style={styles.reviewerInfo}>
                                    <View style={[styles.reviewerAvatar, { backgroundColor: '#4CAF50' }]}>
                                        <Text style={styles.reviewerInitial}>R</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.reviewerName}>Riya Sharma</Text>
                                        <View style={styles.reviewStars}>
                                            <Ionicons name="star" size={12} color="#FFB800" />
                                            <Ionicons name="star" size={12} color="#FFB800" />
                                            <Ionicons name="star" size={12} color="#FFB800" />
                                            <Ionicons name="star" size={12} color="#FFB800" />
                                            <Ionicons name="star" size={12} color="#FFB800" />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.reviewText}>Best facial I've ever had! My skin is glowing and the staff is so professional.</Text>
                            <Text style={styles.reviewDate}>1 week ago</Text>
                        </View>
                    </ScrollView>
                </View>

                {/* 12. Why Choose Pretty Me */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { paddingHorizontal: 20, marginBottom: 15 }]}>Why Choose PrettyMe?</Text>
                    <View style={styles.benefitsGrid}>
                        <View style={styles.benefitItem}>
                            <View style={styles.benefitIcon}>
                                <Ionicons name="shield-checkmark" size={20} color="#333" />
                            </View>
                            <View style={styles.benefitContent}>
                                <Text style={styles.benefitTitle}>100% Safe</Text>
                                <Text style={styles.benefitDesc} numberOfLines={2}>FDA Approved</Text>
                            </View>
                        </View>
                        <View style={styles.benefitItem}>
                            <View style={styles.benefitIcon}>
                                <Ionicons name="people" size={20} color="#333" />
                            </View>
                            <View style={styles.benefitContent}>
                                <Text style={styles.benefitTitle}>Expert Team</Text>
                                <Text style={styles.benefitDesc} numberOfLines={2}>Top Dermatologists</Text>
                            </View>
                        </View>
                        <View style={styles.benefitItem}>
                            <View style={styles.benefitIcon}>
                                <Ionicons name="pricetag" size={20} color="#333" />
                            </View>
                            <View style={styles.benefitContent}>
                                <Text style={styles.benefitTitle}>Best Prices</Text>
                                <Text style={styles.benefitDesc} numberOfLines={2}>Guaranteed Low</Text>
                            </View>
                        </View>
                        <View style={styles.benefitItem}>
                            <View style={styles.benefitIcon}>
                                <Ionicons name="flash" size={20} color="#333" />
                            </View>
                            <View style={styles.benefitContent}>
                                <Text style={styles.benefitTitle}>Quick Results</Text>
                                <Text style={styles.benefitDesc} numberOfLines={2}>In 2-3 Sessions</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 13. Special Offer Banner */}
                <TouchableOpacity style={styles.offerBanner} onPress={() => handlePress('/categories')}>
                    <LinearGradient colors={['#FF6F61', '#C44569']} style={styles.offerGradient}>
                        <View>
                            <Text style={styles.offerTitle}>Limited Time Offer!</Text>
                            <Text style={styles.offerSubtitle}>Get 40% OFF on all services</Text>
                        </View>
                        <Ionicons name="arrow-forward-circle" size={32} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>

            </ScrollView>

            {/* Doctor Details Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={doctorModalVisible}
                onRequestClose={() => setDoctorModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {selectedDoctor && bookingStep === 'details' && (
                                <>
                                    <Image source={{ uri: selectedDoctor.image }} style={styles.modalImg} contentFit="cover" />
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>{selectedDoctor.name}</Text>
                                        <View style={styles.verifiedBadge}>
                                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                                            <Text style={styles.verifiedText}>Verified Professional</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.modalSpec}>{selectedDoctor.specialty} • {selectedDoctor.exp} Experience</Text>

                                    <View style={styles.modalRating}>
                                        <Ionicons name="star" size={16} color="#FFB800" />
                                        <Text style={{ fontWeight: 'bold' }}> {selectedDoctor.rating}</Text>
                                        <Text style={{ color: '#666' }}> ({selectedDoctor.reviews} reviews)</Text>
                                    </View>

                                    <View style={styles.divider} />

                                    <Text style={styles.modalSectionTitle}>About Doctor</Text>
                                    <Text style={styles.modalDesc}>{selectedDoctor.desc}</Text>

                                    <View style={styles.modalFeeContainer}>
                                        <Text style={styles.modalFeeLabel}>Consultation Fee</Text>
                                        <Text style={styles.modalFee}>₹{selectedDoctor.fee}</Text>
                                    </View>

                                    <TouchableOpacity style={styles.bookBtn} onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setBookingStep('form');
                                    }}>
                                        <Text style={styles.bookBtnText}>Book Appointment</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            {selectedDoctor && bookingStep === 'form' && (
                                <>
                                    <View style={styles.modalHeader}>
                                        <TouchableOpacity onPress={() => setBookingStep('details')}>
                                            <Ionicons name="arrow-back" size={24} color="#000" />
                                        </TouchableOpacity>
                                        <Text style={[styles.modalTitle, { marginLeft: 10 }]}>Confirm Booking</Text>
                                    </View>

                                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                                        <Text style={styles.modalSectionTitle}>Your Details</Text>

                                        <View style={styles.inputGroup}>
                                            <Text style={styles.inputLabel}>Select Date</Text>
                                            <TextInput
                                                style={styles.modalInput}
                                                value={selectedDate}
                                                onChangeText={setSelectedDate}
                                                placeholder="DD/MM/YYYY"
                                            />
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <Text style={styles.inputLabel}>Select Time</Text>
                                            <TextInput
                                                style={styles.modalInput}
                                                value={selectedTime}
                                                onChangeText={setSelectedTime}
                                                placeholder="e.g. 10:00 AM"
                                            />
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <Text style={styles.inputLabel}>Address</Text>
                                            <TextInput
                                                style={[styles.modalInput, { height: 80, textAlignVertical: 'top' }]}
                                                value={address}
                                                onChangeText={setAddress}
                                                multiline
                                                placeholder="Enter your address"
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.modalFeeContainer}>
                                        <Text style={styles.modalFeeLabel}>Total to Pay</Text>
                                        <Text style={styles.modalFee}>₹{selectedDoctor.fee}</Text>
                                    </View>

                                    <TouchableOpacity style={styles.bookBtn} onPress={confirmDoctorBooking}>
                                        <Text style={styles.bookBtnText}>Confirm & Pay</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>
                        <TouchableOpacity style={styles.closeModalBtn} onPress={() => setDoctorModalVisible(false)}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        fontFamily: 'Inter_400Regular',
    },
    userName: {
        fontSize: 20,
        color: '#333',
        fontFamily: 'Inter_700Bold',
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
        fontFamily: 'Inter_400Regular',
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
        fontFamily: 'Inter_700Bold',
    },
    heroTitle: {
        color: '#fff',
        fontSize: 18,
        width: '80%',
        marginBottom: 4,
        fontFamily: 'Inter_700Bold',
    },
    heroSub: {
        color: '#eee',
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
    },
    // Membership Banner
    membershipBanner: {
        marginHorizontal: 20,
        marginBottom: 25,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#FFD700',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    membershipGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    membershipBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    membershipBadgeText: {
        fontSize: 10,
        color: '#000',
        letterSpacing: 1,
        fontFamily: 'Inter_700Bold',
    },
    membershipTitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 4,
        fontFamily: 'Inter_700Bold',
    },
    membershipSub: {
        fontSize: 12,
        color: '#ccc',
        fontFamily: 'Inter_400Regular',
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
        color: '#333',
        fontFamily: 'Inter_700Bold',
    },
    weatherSub: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Inter_400Regular',
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
        color: '#333',
        fontFamily: 'Inter_700Bold',
    },
    seeAll: {
        fontSize: 12,
        color: '#FF6F61',
        fontFamily: 'Inter_600SemiBold',
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
        fontFamily: 'Inter_500Medium',
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
        color: '#333',
        flex: 1,
        fontFamily: 'Inter_700Bold',
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
        marginLeft: 3,
        fontFamily: 'Inter_700Bold',
    },
    trendingSub: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Inter_400Regular',
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
        color: '#333',
        marginTop: 5,
        fontFamily: 'Inter_600SemiBold',
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: '#eee',
    },
    // Package Cards
    packageCard: {
        width: 280,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginRight: 15,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    packageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    packageName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    discountBadge: {
        backgroundColor: '#FF6F61',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    discountText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    packageDesc: {
        fontSize: 12,
        color: '#666',
        marginBottom: 12,
    },
    packagePricing: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 15,
    },
    originalPrice: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    discountedPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    packageBtn: {
        backgroundColor: '#000',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    packageBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    // Before & After
    beforeAfterCard: {
        width: 200,
        height: 250,
        marginRight: 15,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    beforeAfterImg: {
        width: '100%',
        height: '100%',
    },
    beforeAfterLabel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 12,
    },
    beforeAfterText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    // Doctors
    doctorCard: {
        width: 180,
        height: 240,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    doctorImg: {
        width: '100%',
        height: '100%',
    },
    doctorOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        paddingTop: 40,
    },
    verifiedBadge: {
        position: 'absolute',
        top: 10, // Position relative to card top-right
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
        elevation: 2, // Add slight elevation for visibility
    },
    verifiedText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    doctorName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 2,
    },
    doctorSpec: {
        fontSize: 12,
        color: '#eee',
        marginBottom: 8,
    },
    doctorRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    doctorRatingText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#fff',
    },
    // Reviews
    overallRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    overallRatingText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    // Reviews
    reviewCard: {
        width: 300,
        minHeight: 180,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        marginRight: 15,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        justifyContent: 'space-between',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    reviewerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    reviewerAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FF6F61',
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewerInitial: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    reviewerName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    reviewStars: {
        flexDirection: 'row',
        gap: 2,
    },
    reviewText: {
        fontSize: 14,
        color: '#444',
        lineHeight: 24,
        marginBottom: 15,
        fontFamily: 'Inter_400Regular',
    },
    reviewDate: {
        fontSize: 12,
        color: '#888',
        fontFamily: 'Inter_500Medium',
        alignSelf: 'flex-start',
    },
    // Benefits / Why Choose
    benefitsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        gap: 12,
    },
    benefitItem: {
        width: '48%', // Ensure it fits
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 12,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        // Stronger shadow, cleaner look
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f5f5f5',
    },
    benefitIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0, // Don't shrink icon
    },
    benefitContent: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    benefitDesc: {
        fontSize: 10,
        color: '#666',
        flexWrap: 'wrap',
    },
    // Offer Banner
    offerBanner: {
        marginHorizontal: 20,
        marginBottom: 30,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    offerGradient: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    offerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    offerSubtitle: {
        color: '#fff',
        fontSize: 13,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        gap: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ddd',
    },
    paginationDotActive: {
        backgroundColor: '#1a1a1a',
        width: 20, // Elongated active dot for modern feel
        height: 8,
        borderRadius: 4,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        height: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    modalImg: {
        width: '100%',
        height: 250,
        borderRadius: 20,
        marginBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    modalSpec: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        fontWeight: '500',
    },
    modalRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        marginTop: 10,
    },
    modalDesc: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
        marginBottom: 20,
    },
    modalFeeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#F9F9F9',
        padding: 15,
        borderRadius: 12,
    },
    modalFeeLabel: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    modalFee: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    bookBtn: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    bookBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeModalBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
        marginBottom: 8,
    },
    modalInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 15,
        fontSize: 14,
        color: '#000',
    },
});
