import { Image } from 'expo-image';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const [mobile, setMobile] = useState('');
    const [agreed, setAgreed] = useState(false); // Initial T&C on form
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [consentGiven, setConsentGiven] = useState(false); // Second specific data consent

    useEffect(() => {
        checkOnboarding();
    }, []);

    const checkOnboarding = async () => {
        try {
            const value = await AsyncStorage.getItem('hasOnboarded');
            if (value !== 'true') {
                router.replace('/onboarding');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleContinue = () => {
        // Logic for after consent is given (e.g., OTP)
        console.log("Consent given, proceed to OTP");
        setShowConsentModal(false);
        router.push('/home');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="light" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                {/* Top Image Section - Now inside ScrollView */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop' }}
                        style={styles.image}
                        contentFit="cover"
                    />
                </View>

                {/* Bottom Sheet */}
                <View style={styles.bottomSheet}>

                    {/* Logo Placeholder */}
                    <View style={styles.logoContainer}>
                        {/* Sparkles icon for Pretty Me */}
                        <Ionicons name="sparkles" size={28} color="#000" style={styles.logoIcon} />
                        <View>
                            <Text style={styles.logoTitle}>PRETTY ME</Text>
                            <Text style={styles.logoSubtitle}>SKIN & WELLNESS</Text>
                        </View>
                    </View>

                    <Text style={styles.formTitle}>LOGIN or SIGN UP</Text>
                    <Text style={styles.formSubtitle}>Enter your no. to start the journey towards your best Pretty Me</Text>

                    {/* Mobile Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.countryCode}>+91</Text>
                        <View style={styles.verticalDivider} />
                        <TextInput
                            style={styles.input}
                            placeholder="Mobile Number"
                            placeholderTextColor="#999"
                            keyboardType="phone-pad"
                            value={mobile}
                            onChangeText={setMobile}
                            maxLength={10}
                        />
                    </View>

                    {/* Terms & Conditions (Initial) */}
                    <View style={styles.termsContainer}>
                        <TouchableOpacity
                            onPress={() => setAgreed(!agreed)}
                            style={[styles.checkbox, agreed && styles.checkboxActive]}
                        >
                            {agreed && <Ionicons name="checkmark" size={16} color="#fff" />}
                        </TouchableOpacity>
                        <Text style={styles.termsText}>
                            By continuing, I accept the <Text style={styles.link}>Terms & Conditions</Text> and <Text style={styles.link}>Privacy Policy</Text>
                        </Text>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, { backgroundColor: mobile.length === 10 ? '#333' : '#888' }]}
                        onPress={() => setShowConsentModal(true)}
                        disabled={mobile.length !== 10}
                    >
                        <Text style={styles.submitButtonText}>SUBMIT</Text>
                    </TouchableOpacity>

                    {/* Skip Button */}
                    <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/home')}>
                        <Text style={styles.skipButtonText}>SKIP FOR NOW</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Consent Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showConsentModal}
                onRequestClose={() => setShowConsentModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            By clicking on the box you agree to our <Text style={styles.modalBold}>Terms and Conditions</Text> and acknowledge that you have read our <Text style={styles.modalBold}>Privacy Policy</Text> to learn how we collect and use your data.
                        </Text>

                        <TouchableOpacity
                            style={styles.modalCheckboxRow}
                            onPress={() => setConsentGiven(!consentGiven)}
                        >
                            <View style={[styles.largeCheckbox, consentGiven && styles.checkboxActive]}>
                                {consentGiven && <Ionicons name="checkmark" size={16} color="#fff" />}
                            </View>
                            <Text style={styles.modalCheckboxText}>I give consent for collection of data.</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.continueButton, { backgroundColor: consentGiven ? '#333' : '#ccc' }]}
                            onPress={handleContinue}
                            disabled={!consentGiven}
                        >
                            <Text style={[styles.continueButtonText, { color: consentGiven ? '#fff' : '#666' }]}>CONTINUE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Behind the image
    },
    scrollContent: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    imageContainer: {
        height: height * 0.5,
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    keyboardView: {
        flex: 1,
    },
    // Removed textOverlay styles as they are no longer used

    bottomSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        paddingVertical: 40,
        marginTop: -30, // Overlap the image slightly
        minHeight: height * 0.55,
        alignItems: 'center',
    },
    // Logo Styles
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    logoIcon: {
        marginRight: 10,
    },
    logoTitle: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 2,
        color: '#000',
    },
    logoSubtitle: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 3,
        color: '#000',
    },
    // Form Styles
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    formSubtitle: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
        lineHeight: 18,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 8,
        height: 50,
        width: '100%',
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    countryCode: {
        fontSize: 16,
        color: '#555',
        fontWeight: '500',
    },
    verticalDivider: {
        width: 1,
        height: '60%',
        backgroundColor: '#ccc',
        marginHorizontal: 15,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        height: '100%',
    },
    // Terms Styles
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 25,
        width: '100%',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 4,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    largeCheckbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 4,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: '#444',
        borderColor: '#444',
    },
    termsText: {
        flex: 1,
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },
    link: {
        textDecorationLine: 'underline',
        fontWeight: '500',
        color: '#333',
    },
    // Buttons
    submitButton: {
        width: '100%',
        height: 50,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
    skipButton: {
        padding: 10,
    },
    skipButtonText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 25,
        width: '100%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 22,
        textAlign: 'left',
        marginBottom: 25,
    },
    modalBold: {
        fontWeight: 'bold',
        color: '#000',
    },
    modalCheckboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 25,
    },
    modalCheckboxText: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    continueButton: {
        width: '100%',
        height: 50,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
});
