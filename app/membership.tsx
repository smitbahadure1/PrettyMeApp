import { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated, Dimensions, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const BENEFITS = [
    {
        id: '1',
        title: 'Flat 15% OFF',
        desc: 'Get 15% discount on every single booking, no upper limit.',
        icon: 'pricetag',
    },
    {
        id: '2',
        title: 'Free Cancellation',
        desc: 'Last minute change of plans? Cancel anytime for free.',
        icon: 'calendar',
    },
    {
        id: '3',
        title: 'Priority Slots',
        desc: 'Get access to prime time slots even on busy weekends.',
        icon: 'star',
    },
    {
        id: '4',
        title: 'Free Expert Consult',
        desc: 'One free video consultation with a senior dermatologist every month.',
        icon: 'videocam',
    },
];

export default function MembershipScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const scrollY = useRef(new Animated.Value(0)).current;

    const handleJoin = () => {
        Alert.alert(
            "Join Elite?",
            "Proceed to payment of ₹999 for 1 Year Membership?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Pay ₹999", onPress: () => {
                        Alert.alert("Success", "Welcome to PrettyMe Elite! Your benefits are now active.");
                        router.back();
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {/* Hero Card */}
                <View style={styles.heroContainer}>
                    <LinearGradient
                        colors={['#1a1a1a', '#000']}
                        style={styles.card}
                    >
                        <View style={styles.patternOverlay}>
                            {[...Array(20)].map((_, i) => (
                                <View key={i} style={[styles.patternDot, { left: Math.random() * width, top: Math.random() * 300 }]} />
                            ))}
                        </View>

                        <View style={styles.cardHeader}>
                            <View style={styles.chip}>
                                <Text style={styles.chipText}>PREMIUM</Text>
                            </View>
                            <Ionicons name="sparkles" size={24} color="#FFD700" />
                        </View>

                        <View style={styles.cardBody}>
                            <Text style={styles.eliteText}>PrettyMe</Text>
                            <Text style={styles.eliteTitle}>ELITE</Text>
                            <Text style={styles.eliteSub}>Unlocking the best of beauty for you.</Text>
                        </View>

                        <View style={styles.cardFooter}>
                            <Text style={styles.price}>₹999<Text style={styles.duration}> / year</Text></Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Benefits List */}
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Membership Benefits</Text>

                    {BENEFITS.map((item, index) => (
                        <View key={item.id} style={styles.benefitRow}>
                            <View style={styles.iconBox}>
                                <Ionicons name={item.icon as any} size={24} color="#FFD700" />
                            </View>
                            <View style={styles.benefitText}>
                                <Text style={styles.benefitTitle}>{item.title}</Text>
                                <Text style={styles.benefitDesc}>{item.desc}</Text>
                            </View>
                        </View>
                    ))}

                    {/* Testimonial / Trust */}
                    <View style={styles.trustBox}>
                        <Text style={styles.trustText}>"The Elite membership paid for itself in just 2 bookings! Highly recommend."</Text>
                        <View style={styles.userRow}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>A</Text>
                            </View>
                            <Text style={styles.userName}>Ananya S.</Text>
                            <View style={styles.stars}>
                                <Ionicons name="star" size={12} color="#FFB800" />
                                <Ionicons name="star" size={12} color="#FFB800" />
                                <Ionicons name="star" size={12} color="#FFB800" />
                                <Ionicons name="star" size={12} color="#FFB800" />
                                <Ionicons name="star" size={12} color="#FFB800" />
                            </View>
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Sticky Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
                <View>
                    <Text style={styles.footerPrice}>₹999</Text>
                    <Text style={styles.footerSub}>billed yearly</Text>
                </View>
                <TouchableOpacity style={styles.joinBtn} onPress={handleJoin}>
                    <Text style={styles.joinText}>Join Elite Now</Text>
                    <Ionicons name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Back Button */}
            <TouchableOpacity style={[styles.backBtn, { top: insets.top + 10 }]} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    heroContainer: {
        height: 400,
        backgroundColor: '#000',
        paddingTop: 80,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    card: {
        width: '100%',
        height: 220,
        borderRadius: 20,
        padding: 25,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#FFD700',
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    patternOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.3,
    },
    patternDot: {
        position: 'absolute',
        width: 2,
        height: 2,
        backgroundColor: '#FFD700',
        opacity: 0.5,
        borderRadius: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chip: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    chipText: {
        color: '#FFD700',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    cardBody: {
        alignItems: 'flex-start',
    },
    eliteText: {
        color: '#ccc',
        fontSize: 14,
        letterSpacing: 2,
        marginBottom: 2,
    },
    eliteTitle: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 4,
        fontStyle: 'italic',
    },
    eliteSub: {
        color: '#888',
        fontSize: 12,
        marginTop: 5,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    price: {
        color: '#FFD700',
        fontSize: 24,
        fontWeight: 'bold',
    },
    duration: {
        color: '#aaa',
        fontSize: 14,
        fontWeight: 'normal',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    benefitRow: {
        flexDirection: 'row',
        marginBottom: 25,
        alignItems: 'flex-start',
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    benefitText: {
        flex: 1,
        paddingTop: 5,
    },
    benefitTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    benefitDesc: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    trustBox: {
        marginTop: 20,
        backgroundColor: '#F9F9F9',
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    trustText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#555',
        marginBottom: 15,
        lineHeight: 20,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 10,
    },
    stars: {
        flexDirection: 'row',
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    footerPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    footerSub: {
        fontSize: 10,
        color: '#666',
    },
    joinBtn: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    joinText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    backBtn: {
        position: 'absolute',
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
