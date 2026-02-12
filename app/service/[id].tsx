import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Image as RNImage, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

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
    }
};

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
    const [activeTab, setActiveTab] = useState<'Before' | 'After'>('Before');

    // Get Data based on ID
    const serviceId = Array.isArray(id) ? id[0] : id;
    const data = servicesData[serviceId || ''] || defaultService;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="share-social-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Hero Image */}
                <Image source={{ uri: data.heroImage }} style={styles.heroImage} contentFit="cover" />

                <View style={styles.content}>
                    {/* Title Section */}
                    <View style={styles.tagContainer}>
                        <Text style={styles.tagText}>{data.tag}</Text>
                    </View>
                    <Text style={styles.title}>{data.title}</Text>

                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingText}>{data.rating}</Text>
                        <FontAwesome name="star" size={14} color="#FFD700" style={{ marginHorizontal: 4 }} />
                        <FontAwesome name="star" size={14} color="#FFD700" style={{ marginHorizontal: 4 }} />
                        <FontAwesome name="star" size={14} color="#FFD700" style={{ marginHorizontal: 4 }} />
                        <FontAwesome name="star" size={14} color="#FFD700" style={{ marginHorizontal: 4 }} />
                        <FontAwesome name="star-half-empty" size={14} color="#FFD700" style={{ marginHorizontal: 4 }} />
                        <Text style={styles.durationText}><Ionicons name="time-outline" size={14} /> {data.duration}</Text>
                    </View>

                    {/* Price Section */}
                    <View style={styles.priceContainer}>
                        <View>
                            <Text style={styles.startsFrom}>starts from</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.finalPrice}>₹{data.price.toLocaleString()}</Text>
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>{data.discount}</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.addBtn}>
                            <Text style={styles.addBtnText}>ADD</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Highlights */}
                    <View style={styles.highlightsRow}>
                        <View style={styles.highlightItem}>
                            <Ionicons name="home-outline" size={24} color="#333" />
                            <Text style={styles.highlightText}>At home services</Text>
                        </View>
                        <View style={styles.highlightItem}>
                            <Ionicons name="medkit-outline" size={24} color="#333" />
                            <Text style={styles.highlightText}>Dermatologist monitored</Text>
                        </View>
                        <View style={styles.highlightItem}>
                            <Ionicons name="star-outline" size={24} color="#333" />
                            <Text style={styles.highlightText}>4.7 rated Exx</Text>
                        </View>
                    </View>

                    {/* Explained */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>{data.title}, Explained</Text>
                        <Text style={styles.sectionSubHeader}>Safe, smart & skin-friendly</Text>
                        <Text style={styles.descriptionText}>{data.description}</Text>
                    </View>

                    {/* How It Works */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>How It Works</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stepsScroll}>
                            {data.steps.map((step: any) => (
                                <View key={step.id} style={styles.stepCard}>
                                    <Image source={{ uri: step.img }} style={styles.stepImg} />
                                    <View style={styles.stepFooter}>
                                        <Text style={styles.stepTitle}>{step.title}</Text>
                                        <Text style={styles.stepDesc}>{step.desc}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Accordions */}
                    <View style={styles.section}>
                        <AccordionItem title="Treatment frequency" content="Recommended sessions vary by individual skin type and goals. Consult our expert for a personalized plan." />
                        <AccordionItem title="Ideal for" content="Individuals looking for professional skin solutions at home." />
                        <AccordionItem title="Not Ideal for" content="Pregnant women or those with active skin infections." />
                    </View>

                    {/* Before/After Care */}
                    <View style={styles.careSection}>
                        <View style={styles.tabHeader}>
                            <TouchableOpacity
                                style={[styles.tabBtn, activeTab === 'Before' && styles.tabBtnActive]}
                                onPress={() => setActiveTab('Before')}
                            >
                                <Text style={[styles.tabText, activeTab === 'Before' && styles.tabTextActive]}>Before Treatment</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tabBtn, activeTab === 'After' && styles.tabBtnActive]}
                                onPress={() => setActiveTab('After')}
                            >
                                <Text style={[styles.tabText, activeTab === 'After' && styles.tabTextActive]}>After Treatment</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.tabContent}>
                            {activeTab === 'Before' ? (
                                <>
                                    <View style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>Keep your skin hydrated leading up to the treatment.</Text></View>
                                    <View style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>Avoid direct sun exposure for at least one week.</Text></View>
                                    <View style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>Do not use retinol 24h before.</Text></View>
                                </>
                            ) : (
                                <>
                                    <View style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>Apply sunscreen generously if going out.</Text></View>
                                    <View style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>Drink plenty of water.</Text></View>
                                </>
                            )}
                        </View>
                    </View>

                    {/* FAQs */}
                    {data.faqs && (
                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
                            <View style={{ marginTop: 10 }}>
                                {data.faqs.map((faq: any, idx: number) => (
                                    <AccordionItem key={idx} title={faq.q} content={faq.a} />
                                ))}
                            </View>
                        </View>
                    )}

                </View>
            </ScrollView>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    backBtn: {
        padding: 5,
    },
    heroImage: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: 20,
    },
    tagContainer: {
        backgroundColor: '#eee',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 10,
    },
    tagText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#666',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 5,
    },
    durationText: {
        marginLeft: 15,
        fontSize: 12,
        color: '#666',
    },
    // Price
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    startsFrom: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    finalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    discountBadge: {
        backgroundColor: '#E6FFEA',
        borderColor: '#95D5B2',
        borderWidth: 1,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2D6A4F',
    },
    addBtn: {
        backgroundColor: '#000',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 6,
    },
    addBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    // Highlights
    highlightsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 20,
    },
    highlightItem: {
        alignItems: 'center',
        flex: 1,
    },
    highlightText: {
        fontSize: 10,
        textAlign: 'center',
        marginTop: 5,
        color: '#555',
        lineHeight: 14,
    },
    // Section
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000',
    },
    sectionSubHeader: {
        fontSize: 12,
        color: '#888',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 13,
        color: '#555',
        lineHeight: 20,
    },
    // Steps
    stepsScroll: {
        marginTop: 10,
        marginHorizontal: -20, // To bleed to edges
        paddingHorizontal: 20,
    },
    stepCard: {
        width: 140,
        marginRight: 15,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        overflow: 'hidden',
    },
    stepImg: {
        width: '100%',
        height: 100,
    },
    stepFooter: {
        padding: 10,
    },
    stepTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    stepDesc: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
    },
    // Accordion
    accordionContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 10,
        overflow: 'hidden',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    accordionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    accordionContent: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    accordionText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },
    // Care Section
    careSection: {
        marginBottom: 30,
    },
    tabHeader: {
        flexDirection: 'row',
        marginBottom: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 25,
        padding: 4,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 22,
    },
    tabBtnActive: {
        backgroundColor: '#000',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    tabTextActive: {
        color: '#fff',
    },
    tabContent: {
        paddingHorizontal: 5,
    },
    bulletRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    bullet: {
        fontSize: 14,
        marginRight: 8,
        color: '#555',
    },
    bulletText: {
        fontSize: 13,
        color: '#555',
        lineHeight: 20,
        flex: 1,
    },
});
