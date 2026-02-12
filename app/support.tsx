import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const { width } = Dimensions.get('window');

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQItem = ({ question, answer, isOpen, onTap }: { question: string, answer: string, isOpen: boolean, onTap: () => void }) => {
    return (
        <TouchableOpacity style={styles.faqItem} onPress={onTap} activeOpacity={0.8}>
            <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{question}</Text>
                <Ionicons name={isOpen ? "remove" : "add"} size={20} color="#666" />
            </View>
            {isOpen && (
                <View style={styles.faqBody}>
                    <Text style={styles.faqAnswer}>{answer}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default function SupportScreen() {
    const router = useRouter();
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // First one open by default

    const toggleFaq = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const navigateTo = (route: string) => {
        if (route === 'home') router.push('/home');
        if (route === 'categories') router.push('/categories');
        if (route === 'bookings') router.push('/bookings');
        if (route === 'support') router.push('/support');
        if (route === 'account') router.push('/account');
    };

    const faqs = [
        { q: "How do I book a treatment with Pretty Me?", a: "You can book a treatment through our website or app in just a few clicks — choose your treatment, select no. of sessions, your order gets confirmed. Post that you can select date & time to schedule a booking." },
        { q: "What happens once I book a treatment?", a: "Once booked, our professional will arrive at your scheduled time with all necessary equipment." },
        { q: "Are Pretty Me services available in clinics too?", a: "Currently, we operate as an at-home service provider to bring the clinic to your doorstep." },
        { q: "How does Pretty Me ensure quality and hygiene?", a: "Our professionals follow strict hygiene protocols, use sterilized equipment, and wear protective gear." },
        { q: "How experienced are Pretty Me's therapists?", a: "All our therapists are certified professionals with extensive training and background checks." },
        { q: "Are laser and injectable treatments safe at home?", a: "Yes, we use FDA-approved portable devices and train our staff specifically for home safety." },
        { q: "Can I talk to a doctor before booking?", a: "Yes, we offer free consultations with our dermatologists before you commit to a treatment." },
        { q: "How do I prepare for my treatment?", a: "Instructions will be sent to you upon booking, generally involving cleaning the area and avoiding sun exposure." },
        { q: "What if I need to cancel or reschedule?", a: "You can manage your bookings in the 'My Bookings' section of the app up to 4 hours before the appointment." },
        { q: "Do you offer EMI or payment flexibility?", a: "Yes, we have partnerships with major banks to offer EMI options on packages." },
    ];

    return (
        <SafeAreaView style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>SUPPORT</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <Text style={styles.greetingTitle}>Welcome to Pretty Me Support</Text>
                <Text style={styles.greetingSub}>We're here to help</Text>

                {/* Form */}
                <View style={styles.formContainer}>
                    <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#aaa" />
                    <TextInput style={styles.input} placeholder="Mobile Number" placeholderTextColor="#aaa" keyboardType="phone-pad" />
                    <TextInput style={styles.input} placeholder="Your Query" placeholderTextColor="#aaa" />

                    <TouchableOpacity style={styles.submitBtn}>
                        <Text style={styles.submitBtnText}>SUBMIT</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.orText}>OR</Text>

                {/* Contact Buttons */}
                <View style={styles.contactRow}>
                    <TouchableOpacity style={styles.contactBtn}>
                        <Ionicons name="call-outline" size={20} color="#000" style={{ marginRight: 8 }} />
                        <Text style={styles.contactBtnText}>CALL US</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contactBtn}>
                        <FontAwesome name="whatsapp" size={20} color="#000" style={{ marginRight: 8 }} />
                        <Text style={styles.contactBtnText}>WHATSAPP</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.workingHours}>Working hours: Mon-Sun 10.00 AM- 8.00 PM</Text>

                {/* Address Card */}
                <View style={styles.addressCard}>
                    <Text style={styles.addressTitle}>Contact Information</Text>
                    <Text style={styles.addressSub}>Tap address to open Google Maps</Text>

                    <View style={styles.addressRow}>
                        <Ionicons name="location-outline" size={24} color="#000" style={{ marginRight: 15 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.companyName}>Misya Beauty Tech Private Limited</Text>
                            <Text style={styles.addressText}>2, Shambhu Dyal Marg, Okhla Phase III, Bahapur, New Delhi, Delhi 110065</Text>
                        </View>
                    </View>
                </View>

                {/* FAQ Section */}
                <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
                <View style={styles.faqContainer}>
                    {faqs.map((item, index) => (
                        <FAQItem
                            key={index}
                            question={item.q}
                            answer={item.a}
                            isOpen={openFaqIndex === index}
                            onTap={() => toggleFaq(index)}
                        />
                    ))}
                </View>

            </ScrollView>

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
                <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('bookings')}>
                    <Ionicons name="calendar-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Bookings</Text>
                </TouchableOpacity>
                <View style={styles.navItem}>
                    <Ionicons name="chatbubble-ellipses" size={24} color="#000" />
                    <Text style={[styles.navText, { color: '#000', fontWeight: 'bold' }]}>Support</Text>
                </View>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('/account')}
                >
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
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 90,
    },
    greetingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    greetingSub: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 20,
    },
    formContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 10,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#eee',
    },
    submitBtn: {
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 5,
    },
    submitBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
    },
    orText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 15,
        color: '#666',
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    contactBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    contactBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    workingHours: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        marginBottom: 25,
    },
    addressCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    addressTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    addressSub: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        marginBottom: 15,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    companyName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    addressText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },
    faqTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'left',
    },
    faqContainer: {
        marginBottom: 20,
    },
    faqItem: {
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        overflow: 'hidden',
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
    },
    faqQuestion: {
        fontSize: 13,
        fontWeight: '500',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    faqBody: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    faqAnswer: {
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
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
