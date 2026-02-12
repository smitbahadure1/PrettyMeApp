import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar, Alert, Modal, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Services Data Store
const servicesData: Record<string, any> = {
    // WOMEN SERVICES
    'laser-hair-reduction': {
        title: 'Full Body Laser Hair Reduction',
        tag: 'FOR UNWANTED HAIR',
        rating: 4.85,
        reviews: 120,
        duration: '180 mins',
        price: 7080,
        discount: '-50%',
        description: 'Laser hair reduction uses focused light to target and destroy hair follicles, reducing future hair growth. Since hair grows in cycles—active, transition, and resting—the laser only works on hair in the active phase. That\'s why multiple sessions are needed. Treated hair falls out gradually, and some regrowth may appear between sessions, but each session removes more active hair over time.',
        heroImage: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070&auto=format&fit=crop',
        steps: [
            { id: 1, title: 'STEP - 1', desc: 'Area is marked, cleansed and shaved', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881' },
            { id: 2, title: 'STEP - 2', desc: 'ECG gel is applied', img: 'https://images.unsplash.com/photo-1552693673-1bf958298935' },
            { id: 3, title: 'STEP - 3', desc: 'Laser treatment begins', img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9' },
        ],
        faqs: [
            { q: 'Is laser hair reduction safe for Indian skin tones?', a: 'Yes, Diode lasers, like the ones we use at Avataar, are safe and effective for Indian skin — minimizing the risk of burns, pigmentation, or scarring when performed by trained professionals.' },
            { q: 'Can I do laser hair reduction if I have PCOS?', a: 'Yes, it is effective but may require more maintainance sessions.' },
        ]
    },
    'laser-facials': {
        title: 'Carbon Laser Peel (Hollywood Peel)',
        tag: 'FOR GLOWING SKIN',
        rating: 4.9,
        reviews: 85,
        duration: '60 mins',
        price: 3499,
        discount: '-30%',
        description: 'A carbon laser peel is a revolutionary laser treatment that is completely painless with minimal-to-zero downtime. It is highly beneficial for people with oily skin, blackheads, enlarged pores, dull skin, and acne on the face or body. It effectively rejuvenates skin, giving it a fresh and youthful look.',
        heroImage: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop',
        steps: [
            { id: 1, title: 'STEP - 1', desc: 'Carbon paste application', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881' },
            { id: 2, title: 'STEP - 2', desc: 'Laser clears carbon & impurities', img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9' },
        ],
        faqs: [
            { q: 'Is there any downtime?', a: 'No, you can immediately return to daily activities.' },
            { q: 'How many sessions are needed?', a: 'Visible results are often seen after a single treatment, but a course of 4-6 sessions is recommended.' },
        ]
    },
    'body-slimming': {
        title: 'HIFU Body Contouring',
        tag: 'FOR FAT REDUCTION',
        rating: 4.7,
        reviews: 45,
        duration: '90 mins',
        price: 8999,
        discount: '-40%',
        description: 'High-Intensity Focused Ultrasound (HIFU) is a non-invasive treatment that targets stubborn fat cells. It uses ultrasound energy to heat and destroy fat cells beneath the skin, which are then naturally processed by the body.',
        heroImage: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2070&auto=format&fit=crop',
        steps: [
            { id: 1, title: 'STEP - 1', desc: 'Mapping target areas', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b' },
            { id: 2, title: 'STEP - 2', desc: 'HIFU energy application', img: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1' },
        ],
        faqs: [
            { q: 'Is it painful?', a: 'Most clients report only mild discomfort or a tingling sensation.' },
        ]
    },
    'hair-treatments': {
        title: 'Advanced Hair Fall Control',
        tag: 'FOR HAIR LOSS',
        rating: 4.8,
        reviews: 200,
        duration: '45 mins',
        price: 2499,
        discount: '-20%',
        description: 'Our advanced hair treatment nourishes the scalp and strengthens hair follicles. Using a blend of essential peptides and vitamins, it promotes hair growth and reduces comprehensive hair fall.',
        heroImage: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1776&auto=format&fit=crop',
        steps: [
            { id: 1, title: 'STEP - 1', desc: 'Scalp Analysis', img: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707' },
            { id: 2, title: 'STEP - 2', desc: 'Serum Infusion', img: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8' },
        ],
        faqs: [
            { q: 'How soon can I see results?', a: 'Reduction in hair fall is typically noticed after 3-4 sessions.' },
        ]
    },
    'face-prp': {
        title: 'Vampire Facial (PRP)',
        tag: 'FOR ANTI-AGING',
        rating: 4.9,
        reviews: 70,
        duration: '90 mins',
        price: 4999,
        discount: '-25%',
        description: 'Platelet-Rich Plasma (PRP) therapy uses your own blood platelets to stimulate collagen production. It improves skin texture, reduces fine lines, and diminishes acne scars.',
        heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop',
        steps: [
            { id: 1, title: 'STEP - 1', desc: 'Blood draw & separation', img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118' },
            { id: 2, title: 'STEP - 2', desc: 'Microneedling with PRP', img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9' },
        ],
        faqs: [
            { q: 'Is it safe?', a: 'Yes, since it uses your own blood, there is no risk of allergic reaction.' },
        ]
    },
    'permanent-makeup': {
        title: 'Microblading Eyebrows',
        tag: 'FOR PERFECT BROWS',
        rating: 4.6,
        reviews: 30,
        duration: '120 mins',
        price: 9999,
        discount: '-10%',
        description: 'Microblading is a semi-permanent tattooing technique to create fuller, natural-looking eyebrows. We use fine strokes to mimic natural hair.',
        heroImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2073&auto=format&fit=crop',
        steps: [
            { id: 1, title: 'STEP - 1', desc: 'Brow Mapping', img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702' },
            { id: 2, title: 'STEP - 2', desc: 'Microblading', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f' },
        ],
        faqs: [
            { q: 'How long does it last?', a: 'Typically 1-2 years, depending on skin type and lifestyle.' },
        ]
    },

    // CONCERN SPECIFIC LANDING PAGES
    'unwanted-hair': {
        title: 'Laser Hair Reduction',
        tag: 'FOR UNWANTED HAIR',
        rating: 4.9,
        reviews: 350,
        duration: 'Varies',
        price: 1999,
        discount: 'Starts @',
        description: 'Safe and effective laser hair reduction for all body parts. Whether you need facial hair removal, underarms, or full body, our US-FDA approved diode lasers ensure safe results for Indian skin.',
        heroImage: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070&auto=format&fit=crop',
        steps: [
            { id: 1, title: 'STEP - 1', desc: 'Consultation & Marking', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881' },
            { id: 2, title: 'STEP - 2', desc: 'Cooling Gel Application', img: 'https://images.unsplash.com/photo-1552693673-1bf958298935' },
            { id: 3, title: 'STEP - 3', desc: 'Laser Treatment', img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9' },
        ],
        faqs: [
            { q: 'Is it permanent?', a: 'It offers significant reduction (up to 90%). Maintenance sessions may be needed yearly.' },
            { q: 'Can I use it on face?', a: 'Yes, it is extremely safe for facial hair.' },
        ]
    },
    'acne': {
        title: 'Acne Control Treatments',
        tag: 'FOR CLEAR SKIN',
        rating: 4.8,
        reviews: 210,
        duration: '60 mins',
        price: 2499,
        discount: 'Starts @',
        description: 'Comprehensive acne solutions ranging from Chemical Peels to Carbon Lasers. We target active acne, reduce inflammation, and prevent future breakouts.',
        heroImage: 'https://images.unsplash.com/photo-1556228552-603be9389234?q=80&w=1974&auto=format&fit=crop',
        steps: [
            { id: 1, title: 'STEP - 1', desc: 'Deep Cleansing', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881' },
            { id: 2, title: 'STEP - 2', desc: 'Exfoliation/Peel', img: 'https://images.unsplash.com/photo-1512290923902-8a9281bf7719' },
        ],
        faqs: [
            { q: 'Will it increase acne initially?', a: 'Mild purging can happen but it settles quickly.' },
        ]
    },
    'pigmentation': {
        title: 'Pigmentation Correction',
        tag: 'FOR EVEN TONE',
        rating: 4.7,
        reviews: 180,
        duration: '75 mins',
        price: 3999,
        discount: 'Starts @',
        description: 'Target dark spots, melasma, and sun damage with our advanced pigmentation treatments including Q-Switch Laser and specialized peels.',
        heroImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop',
        steps: [
            { id: 1, title: 'STEP - 1', desc: 'Skin Analysis', img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9' },
            { id: 2, title: 'STEP - 2', desc: 'Laser Toning', img: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8' },
        ],
        faqs: [
            { q: 'How many sessions?', a: 'Typically 6-8 sessions are required for visible clearing.' },
        ]
    },
    'dull-skin': {
        title: 'Instant Glow Facials',
        tag: 'FOR DULLNESS',
        rating: 4.9,
        reviews: 500,
        duration: '60 mins',
        price: 2999,
        discount: 'Starts @',
        description: 'Revive tired, dull skin with our signature Hydra-Facials and Oxygen infusion therapies. Get instant radiance for special occasions.',
        heroImage: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop',
        steps: [
            { id: 1, title: 'STEP - 1', desc: 'Hydration Boost', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b' },
            { id: 2, title: 'STEP - 2', desc: 'Glow Mask', img: 'https://images.unsplash.com/photo-1617325247661-675e8b37b201' },
        ],
        faqs: [
            { q: 'Is it painful?', a: 'Not at all, it is a very relaxing experience.' },
        ]
    },

    // MEN SERVICES (Simplified Mapping for demo)
    'laser-hair-reduction-men': {
        title: 'Men\'s Beard Shaping Laser',
        tag: 'FOR GROOMING',
        rating: 4.8,
        reviews: 90,
        duration: '45 mins',
        price: 2500,
        discount: '-40%',
        description: 'Define your jawline and say goodbye to razor bumps with laser beard shaping. Targets unwanted hair on cheeks and neck for a sharp look.',
        heroImage: 'https://images.unsplash.com/photo-1621607512214-68297f31381e?q=80&w=2070&auto=format&fit=crop',
        steps: [
            { id: 1, title: 'STEP - 1', desc: 'Marking & Shaving', img: 'https://images.unsplash.com/photo-1621607512022-6aecc4fed814' },
            { id: 2, title: 'STEP - 2', desc: 'Laser Application', img: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8' },
        ],
        faqs: [
            { q: 'Will it look patchy?', a: 'No, we precisely target only the areas you want to remove.' },
        ]
    },
};

// Add Aliases and Missing Services using existing data
Object.assign(servicesData, {
    'body-slimming-men': {
        ...servicesData['body-slimming'],
        title: 'HIFU Body Contouring (Men)',
        heroImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop'
    },
    'laser-facials-men': {
        ...servicesData['laser-facials'],
        title: 'Carbon Laser Peel (Men)',
        heroImage: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=2070&auto=format&fit=crop'
    },
    'face-prp-men': {
        ...servicesData['face-prp'],
        title: 'Hair Restoration (Men)',
        heroImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop'
    },
    'permanent-makeup-men': {
        ...servicesData['permanent-makeup'],
        title: 'Grooming (Men)',
        heroImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop'
    },
    'skin-rejuvenation-men': {
        ...servicesData['laser-facials'],
        title: 'Skin Care (Men)',
        heroImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=2070&auto=format&fit=crop'
    },
    'hair-treatments-men': {
        ...servicesData['hair-treatments'],
        title: 'Scalp Care (Men)',
        heroImage: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1887&auto=format&fit=crop'
    },
    'chemical-peels-men': {
        ...servicesData['acne'],
        title: 'De-Tan Peels (Men)',
        heroImage: 'https://images.unsplash.com/photo-1617325247661-675e8b37b201?q=80&w=1887&auto=format&fit=crop'
    },
    'skin-rejuvenation': {
        ...servicesData['laser-facials'],
        title: 'Skin Rejuvenation'
    },
    'chemical-peels': {
        ...servicesData['acne'],
        title: 'Chemical Peels'
    }
});

// Fallback Data
const defaultService = servicesData['laser-hair-reduction'];

const AccordionItem = ({ title, content }: { title: string, content?: string | React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <View style={styles.accordionContainer}>
            <TouchableOpacity style={styles.accordionHeader} onPress={() => setIsOpen(!isOpen)}>
                <Text style={styles.accordionTitle}>{title}</Text>
                <Ionicons name={isOpen ? "remove" : "add"} size={20} color="#333" />
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.accordionContent}>
                    {typeof content === 'string' ? <Text style={styles.accordionText}>{content}</Text> : content}
                </View>
            )}
        </View>
    );
};

export default function ServiceDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<'Before' | 'After'>('Before');
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Get Data based on ID
    const serviceId = Array.isArray(id) ? id[0] : id;
    const data = servicesData[serviceId || ''] || defaultService;

    // Booking State
    const [bookingModalVisible, setBookingModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());
    const [selectedTime, setSelectedTime] = useState('10:00 AM');
    const [address, setAddress] = useState('123, Green Park, New Delhi');

    const handleBookNow = () => {
        setBookingModalVisible(true);
    };

    const confirmBooking = async () => {
        try {
            const newBooking = {
                id: Date.now().toString(),
                serviceId: serviceId || 'laser-hair-reduction',
                title: data.title,
                price: data.price,
                date: selectedDate,
                time: selectedTime,
                address: address,
                status: 'Upcoming',
                image: data.heroImage,
                duration: data.duration
            };

            const existingBookingsStr = await AsyncStorage.getItem('bookings');
            const existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];

            const updatedBookings = [...existingBookings, newBooking];
            await AsyncStorage.setItem('bookings', JSON.stringify(updatedBookings));

            setBookingModalVisible(false);
            Alert.alert('Success', 'Booking Confirmed!', [
                { text: 'View Bookings', onPress: () => router.push('/bookings') }
            ]);
        } catch (error) {
            console.error('Error saving booking:', error);
            Alert.alert('Error', 'Failed to save booking');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
                bounces={false}
            >
                {/* Hero Section */}
                <View style={styles.heroContainer}>
                    <Image source={{ uri: data.heroImage }} style={styles.heroImage} contentFit="cover" />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.1)']}
                        style={styles.heroGradient}
                    />

                    {/* Header Actions */}
                    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', gap: 15 }}>
                            <TouchableOpacity style={styles.iconBtn}>
                                <Ionicons name="share-social-outline" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => setIsBookmarked(!isBookmarked)}>
                                <Ionicons name={isBookmarked ? "heart" : "heart-outline"} size={24} color={isBookmarked ? "#FF4d4d" : "#fff"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Content Body */}
                <View style={styles.contentBody}>
                    {/* Title & Rating */}
                    <View style={styles.titleSection}>
                        <View style={styles.tagBadge}>
                            <Text style={styles.tagText}>{data.tag}</Text>
                        </View>
                        <Text style={styles.title}>{data.title}</Text>

                        <View style={styles.metaRow}>
                            <View style={styles.ratingBadge}>
                                <FontAwesome name="star" size={12} color="#fff" />
                                <Text style={styles.ratingValue}>{data.rating}</Text>
                            </View>
                            <Text style={styles.reviewCount}>{data.reviews} reviews</Text>
                            <View style={styles.dotSeparator} />
                            <Ionicons name="time-outline" size={14} color="#666" />
                            <Text style={styles.durationVal}>{data.duration}</Text>
                        </View>
                    </View>

                    {/* Highlights Cards */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlightsContainer}>
                        <View style={styles.highlightCard}>
                            <View style={styles.highlightIcon}>
                                <Ionicons name="home-outline" size={20} color="#333" />
                            </View>
                            <Text style={styles.highlightLabel}>At Home</Text>
                        </View>
                        <View style={styles.highlightCard}>
                            <View style={styles.highlightIcon}>
                                <Ionicons name="shield-checkmark-outline" size={20} color="#333" />
                            </View>
                            <Text style={styles.highlightLabel}>Safe & Secure</Text>
                        </View>
                        <View style={styles.highlightCard}>
                            <View style={styles.highlightIcon}>
                                <Ionicons name="medkit-outline" size={20} color="#333" />
                            </View>
                            <Text style={styles.highlightLabel}>Expert Care</Text>
                        </View>
                        <View style={styles.highlightCard}>
                            <View style={styles.highlightIcon}>
                                <Ionicons name="trophy-outline" size={20} color="#333" />
                            </View>
                            <Text style={styles.highlightLabel}>Top Rated</Text>
                        </View>
                    </ScrollView>

                    <View style={styles.divider} />

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About the Treatment</Text>
                        <Text style={styles.descriptionText}>{data.description}</Text>
                    </View>

                    {/* How It Works */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>How It Works</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stepsScroll}>
                            {data.steps.map((step: any) => (
                                <View key={step.id} style={styles.stepCard}>
                                    <View style={styles.stepImgContainer}>
                                        <Image source={{ uri: step.img }} style={styles.stepImg} contentFit="cover" />
                                        <View style={styles.stepNumberBadge}>
                                            <Text style={styles.stepNumber}>{step.id}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.stepFooter}>
                                        <Text style={styles.stepTitle}>{step.desc}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Before / After */}
                    <View style={styles.section}>
                        <View style={styles.careHeader}>
                            <Text style={styles.sectionTitle}>Essential Care</Text>
                            <View style={styles.careToggle}>
                                <TouchableOpacity
                                    style={[styles.careBtn, activeTab === 'Before' && styles.careBtnActive]}
                                    onPress={() => setActiveTab('Before')}>
                                    <Text style={[styles.careBtnText, activeTab === 'Before' && styles.careBtnTextActive]}>Pre-Care</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.careBtn, activeTab === 'After' && styles.careBtnActive]}
                                    onPress={() => setActiveTab('After')}>
                                    <Text style={[styles.careBtnText, activeTab === 'After' && styles.careBtnTextActive]}>Post-Care</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.careList}>
                            {activeTab === 'Before' ? (
                                <>
                                    <View style={styles.careItem}><Ionicons name="checkmark-circle" size={20} color="#4CAF50" /><Text style={styles.careText}>Ensure skin is clean and dry.</Text></View>
                                    <View style={styles.careItem}><Ionicons name="alert-circle" size={20} color="#FF9800" /><Text style={styles.careText}>Avoid direct sun exposure for 48h.</Text></View>
                                    <View style={styles.careItem}><Ionicons name="close-circle" size={20} color="#F44336" /><Text style={styles.careText}>No harsh chemicals or retinol.</Text></View>
                                </>
                            ) : (
                                <>
                                    <View style={styles.careItem}><Ionicons name="checkmark-circle" size={20} color="#4CAF50" /><Text style={styles.careText}>Apply moisturizer regularly.</Text></View>
                                    <View style={styles.careItem}><Ionicons name="alert-circle" size={20} color="#FF9800" /><Text style={styles.careText}>Use sunscreen outdoors.</Text></View>
                                </>
                            )}
                        </View>
                    </View>

                    {/* FAQs */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>FAQs</Text>
                        {data.faqs?.map((faq: any, idx: number) => (
                            <AccordionItem key={idx} title={faq.q} content={faq.a} />
                        ))}
                    </View>

                </View>
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Total Amount</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceValue}>₹{data.price.toLocaleString()}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.bookBtn} onPress={handleBookNow} activeOpacity={0.8}>
                    <Text style={styles.bookBtnText}>Book Now</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Booking Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={bookingModalVisible}
                onRequestClose={() => setBookingModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Confirm Booking</Text>
                            <TouchableOpacity onPress={() => setBookingModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.serviceName}>{data.title}</Text>
                            <Text style={styles.servicePrice}>Total: ₹{data.price.toLocaleString()}</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Select Date</Text>
                                <TextInput
                                    style={styles.input}
                                    value={selectedDate}
                                    onChangeText={setSelectedDate}
                                    placeholder="DD/MM/YYYY"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Select Time</Text>
                                <TextInput
                                    style={styles.input}
                                    value={selectedTime}
                                    onChangeText={setSelectedTime}
                                    placeholder="e.g. 10:00 AM"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Address</Text>
                                <TextInput
                                    style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                                    value={address}
                                    onChangeText={setAddress}
                                    multiline
                                    placeholder="Enter your full address"
                                />
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setBookingModalVisible(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmBtn} onPress={confirmBooking}>
                                <Text style={styles.confirmBtnText}>Confirm & Pay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // ... existing styles ...
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 25,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    servicePrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D6A4F',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 15,
        fontSize: 14,
        color: '#000',
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 20,
        marginBottom: 20,
    },
    cancelBtn: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    confirmBtn: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#000',
        alignItems: 'center',
    },
    cancelBtnText: {
        fontWeight: '600',
        color: '#333',
    },
    confirmBtnText: {
        fontWeight: '600',
        color: '#fff',
    },
    heroContainer: {
        height: 300,
        width: '100%',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)', // iOS only
    },

    // Content Body
    contentBody: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    titleSection: {
        marginBottom: 25,
    },
    tagBadge: {
        backgroundColor: '#F5F5F5',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        marginBottom: 10,
    },
    tagText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#666',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 10,
        lineHeight: 32,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2D6A4F',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
        gap: 4,
    },
    ratingValue: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    reviewCount: {
        color: '#666',
        fontSize: 13,
    },
    dotSeparator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#ccc',
        marginHorizontal: 10,
    },
    durationVal: {
        marginLeft: 5,
        fontSize: 13,
        color: '#666',
    },

    // Highlights
    highlightsContainer: {
        paddingVertical: 10,
        gap: 15,
        paddingRight: 20,
    },
    highlightCard: {
        alignItems: 'center',
        marginRight: 15,
    },
    highlightIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F8F8F8', // Neutral background
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    highlightLabel: {
        fontSize: 11,
        color: '#555',
        fontWeight: '500',
    },

    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 25,
    },

    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
    },

    // Steps
    stepsScroll: {
        paddingRight: 20,
        gap: 15,
    },
    stepCard: {
        width: 160,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f5f5f5', // Subtle border instead of shadow
        marginBottom: 10,
        marginRight: 15,
        overflow: 'hidden', // Ensure content respects border radius
    },
    stepImgContainer: {
        width: '100%',
        height: 120,
        position: 'relative',
    },
    stepImg: {
        width: '100%',
        height: '100%',
        // Border radius is handled by the container overflow: hidden
    },
    stepNumberBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(5px)',
    },
    stepNumber: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#fff',
    },
    stepFooter: {
        padding: 12,
    },
    stepTitle: {
        fontWeight: '600',
        fontSize: 13,
        color: '#1a1a1a',
        textAlign: 'left',
        lineHeight: 18,
    },

    // Care Section
    careHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    careToggle: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        padding: 4,
    },
    careBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    careBtnActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    careBtnText: {
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
    },
    careBtnTextActive: {
        color: '#333',
    },
    careList: {
        backgroundColor: '#FAFAFA',
        padding: 15,
        borderRadius: 12,
        gap: 12,
    },
    careItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    careText: {
        fontSize: 13,
        color: '#555',
        flex: 1,
    },

    // Bottom Bar
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingHorizontal: 20,
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        justifyContent: 'center',
    },
    priceLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
        fontWeight: '500',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    priceValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    bookBtn: {
        backgroundColor: '#1a1a1a',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bookBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Accordion
    accordionContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingVertical: 5,
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
    },
    accordionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    accordionContent: {
        paddingBottom: 15,
    },
    accordionText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
    },
});
