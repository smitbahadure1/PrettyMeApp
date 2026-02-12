import { useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Science-Led\nAesthetics',
        desc: 'Experience advanced dermatological treatments in the comfort of your home.',
        image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: '2',
        title: 'Expert\nDermatologists',
        desc: 'Curated treatments by certified professionals following strict medical protocols.',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop',
    },
    {
        id: '3',
        title: 'Premium\nProducts',
        desc: 'We use only top-tier, international beauty products for your skin.',
        image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=2074&auto=format&fit=crop',
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const finishOnboarding = async () => {
        try {
            await AsyncStorage.setItem('hasOnboarded', 'true');
            router.replace('/'); // Go to Login Screen
        } catch (e) {
            console.error(e);
        }
    };

    const handleNext = async () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            finishOnboarding();
        }
    };

    const handleScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        setCurrentIndex(roundIndex);
    };

    const renderSlide = ({ item }: { item: typeof SLIDES[0] }) => {
        return (
            <View style={[styles.slide, { width }]}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    contentFit="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
                    locations={[0, 0.4, 1]}
                    style={styles.gradient}
                >
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.desc}>{item.desc}</Text>
                    </View>
                </LinearGradient>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={renderSlide}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                bounces={false}
                initialNumToRender={1}
            />

            {/* Pagination & Controls Container */}
            <View style={[styles.footerContainer, { paddingBottom: insets.bottom + 20 }]}>

                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index ? styles.activeDot : styles.inactiveDot
                            ]}
                        />
                    ))}
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity onPress={finishOnboarding}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        {currentIndex === SLIDES.length - 1 ? (
                            <Text style={styles.nextText}>Get Started</Text>
                        ) : (
                            <Ionicons name="arrow-forward" size={24} color="#000" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: width,
        height: height,
        position: 'absolute',
    },
    gradient: {
        width: width,
        height: height,
        justifyContent: 'flex-end',
        paddingBottom: 150, // Space for footer
    },
    textContainer: {
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        lineHeight: 48,
        letterSpacing: 0.5,
    },
    desc: {
        fontSize: 16,
        color: '#ddd',
        lineHeight: 24,
        maxWidth: '90%',
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 30,
    },
    pagination: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    dot: {
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    activeDot: {
        width: 25,
        backgroundColor: '#FF6F61', // Theme accent color
    },
    inactiveDot: {
        width: 6,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    skipText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        opacity: 0.8,
    },
    nextButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 70,
    },
    nextText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
