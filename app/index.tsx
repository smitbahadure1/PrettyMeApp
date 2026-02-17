import { Image } from 'expo-image';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useState, useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSignUp, useSignIn, useAuth, useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser'; // Required for OAuth
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser';

// This is required for OAuth to work correctly in Expo
WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    useWarmUpBrowser(); // Optimizes browser startup for OAuth

    const router = useRouter();
    const { isLoaded, signUp, setActive } = useSignUp();
    const { signIn } = useSignIn();
    const { isSignedIn } = useAuth();

    // OAuth hook for Google
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [pendingVerification, setPendingVerification] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [mode, setMode] = useState<'signin' | 'signup'>('signin'); // Toggle between Sign In / Sign Up

    useEffect(() => {
        checkOnboarding();
        if (isSignedIn) {
            router.replace('/home');
        }
    }, [isSignedIn]);

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

    // --- Google OAuth Handler ---
    const onGoogleSignIn = useCallback(async () => {
        try {
            setLoading(true);
            const { createdSessionId, setActive: setOAuthActive, signUp: oAuthSignUp, signIn: oAuthSignIn } = await startOAuthFlow();

            if (createdSessionId) {
                await setOAuthActive!({ session: createdSessionId });
                // Router listener will handle redirect
            } else {
                // Use signIn or signUp for next steps such as MFA
                // For simplicity, we assume successful flow here or handle missing requirements
                if (oAuthSignIn?.firstFactorVerification.status === 'transferable') {
                    // Handle MFA if needed
                }
            }
        } catch (err: any) {
            console.error("OAuth error", err);
            Alert.alert("Google Sign In Error", err.errors?.[0]?.message || "Something went wrong with Google Sign In.");
        } finally {
            setLoading(false);
        }
    }, [startOAuthFlow]);


    // --- Email Flow Handler ---
    const onEmailPress = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
            if (mode === 'signup') {
                // Sign Up Flow
                await signUp.create({ emailAddress: email, password });
                await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
                setPendingVerification(true);
            } else {
                // Sign In Flow
                const { supportedFirstFactors } = await signIn!.create({ identifier: email });

                // Check for password factor
                const passwordFactor = supportedFirstFactors?.find((f: any) => f.strategy === 'password');
                const emailCodeFactor = supportedFirstFactors?.find((f: any) => f.strategy === 'email_code');

                if (passwordFactor) {
                    setShowPasswordInput(true);
                } else if (emailCodeFactor) {
                    const { emailAddressId } = emailCodeFactor as any;
                    await signIn!.prepareFirstFactor({ strategy: 'email_code', emailAddressId });
                    setPendingVerification(true);
                } else {
                    Alert.alert("Login", "No supported login method found. Please use Google Sign In.");
                }
            }
        } catch (err: any) {
            console.error("Email auth error:", JSON.stringify(err, null, 2));

            // Helpful Auto-Switching
            // Explicit Error Handling
            if (mode === 'signup' && err.errors?.[0]?.code === 'form_identifier_exists') {
                const isGmail = email.trim().toLowerCase().endsWith('@gmail.com');
                Alert.alert(
                    "Account Already Exists",
                    isGmail
                        ? "This email is already registered.\n\nSince it's a Gmail address, you likely used 'Continue with Google' originally.\n\nPlease press the 'Continue with Google' button above to log in."
                        : "This email is already registered.\n\nPlease switch to 'Sign In' or use 'Continue with Google'."
                );
            } else if (mode === 'signin' && err.errors?.[0]?.code === 'form_identifier_not_found') {
                Alert.alert("Account Not Found", "No account found for 'Email Sign In'.\n\nIf you have signed up before, you probably used Google Sign In.\n\nPlease try the 'Continue with Google' button.");
            } else {
                const msg = err.errors?.[0]?.message || "An error occurred during authentication.";
                Alert.alert("Authentication Error", msg);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Verify OTP or Password ---
    const onPressVerify = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
            if (showPasswordInput) {
                const completeSignIn = await signIn!.attemptFirstFactor({ strategy: 'password', password });
                if (completeSignIn.status === 'complete') {
                    await setActive({ session: completeSignIn.createdSessionId });
                    await AsyncStorage.removeItem('guest_mode');
                } else {
                    Alert.alert("Login Failed", "Incorrect password or incomplete login.");
                }
                return;
            }

            if (!code) return; // Code required if not password

            if (mode === 'signup') {
                // If the signup is already complete (e.g. from a previous attempt that didn't redirect), just set active
                if (signUp.status === 'complete') {
                    if (signUp.createdSessionId) {
                        await setActive({ session: signUp.createdSessionId });
                        await AsyncStorage.removeItem('guest_mode');
                        return; // Done
                    }
                }

                // Attempt verification
                const completeSignUp = await signUp.attemptEmailAddressVerification({ code });

                if (completeSignUp.status === 'complete') {
                    await setActive({ session: completeSignUp.createdSessionId });
                    await AsyncStorage.removeItem('guest_mode');
                } else {
                    console.log("Signup incomplete", completeSignUp);
                    Alert.alert("Verification Incomplete", "Please check your email and try again.");
                }
            } else {
                const completeSignIn = await signIn!.attemptFirstFactor({ strategy: 'email_code', code });
                if (completeSignIn.status === 'complete') {
                    await setActive({ session: completeSignIn.createdSessionId });
                    await AsyncStorage.removeItem('guest_mode');
                } else {
                    console.log("Signin incomplete", completeSignIn);
                    Alert.alert("Verification Incomplete", "Please check your email and try again.");
                }
            }
        } catch (err: any) {
            console.error("Verify error full obj:", JSON.stringify(err, null, 2));
            const errorMessage = err.errors?.[0]?.message || JSON.stringify(err);
            const errorCode = err.errors?.[0]?.code || "";

            // Check for specific "Zombie" state errors
            if (errorCode === "client_state_invalid") {
                Alert.alert("Session Expired", "Your sign-up session has expired or is invalid. Please go back, clear the email field, and try again from the start.");
                setPendingVerification(false);
                setCode('');
                return;
            }

            // Check for "already verified" errors
            if (errorMessage.includes("already verified") ||
                errorMessage.includes("already been verified") ||
                errorCode === "verification_already_verified") {

                // SIMPLIFIED RECOVERY:
                // The backend says it's verified. The client SDK might be confused.
                // We will trust the backend and force the user to "Sign In" with this email now.
                // Often, after verification is complete, the user just needs to start a fresh "Sign In" flow.

                Alert.alert(
                    "Email Verified!",
                    "Your email is successfully verified.\n\nPlease tap 'Sign In' to log in to your account now.",
                    [
                        {
                            text: "Go to Sign In",
                            onPress: async () => {
                                setMode('signin');
                                setCode('');
                                setPendingVerification(false);
                            }
                        }
                    ]
                );
                return;
            } else {
                Alert.alert("Verification Failed", errorMessage || "Invalid code. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>

                {/* Background Image Header */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop' }}
                        style={styles.image}
                        contentFit="cover"
                    />
                </View>

                {/* Main Card */}
                <View style={styles.cardContainer}>
                    {/* Header Text */}
                    <Text style={styles.title}>
                        {mode === 'signin' ? 'Sign in to Pretty Me' : 'Create Account'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {mode === 'signin' ? 'Welcome back! Please sign in to continue' : 'Join us to start your beauty journey'}
                    </Text>

                    {/* Google Button */}
                    <TouchableOpacity style={styles.googleButton} onPress={onGoogleSignIn} disabled={loading}>
                        <AntDesign name="google" size={20} color="#fff" style={{ marginRight: 10 }} />
                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.line} />
                        <Text style={styles.orText}>or</Text>
                        <View style={styles.line} />
                    </View>

                    {/* Inputs */}
                    {showPasswordInput ? (
                        <>
                            <View style={styles.inputLabelContainer}>
                                <Text style={styles.inputLabel}>Password</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#999"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity style={styles.mainButton} onPress={onPressVerify} disabled={loading}>
                                {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.mainButtonText}>Sign In</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowPasswordInput(false)}>
                                <Text style={[styles.linkText, { textAlign: 'center', marginBottom: 20 }]}>Back to Email Code</Text>
                            </TouchableOpacity>
                        </>
                    ) : !pendingVerification ? (
                        <>
                            <View style={styles.inputLabelContainer}>
                                <Text style={styles.inputLabel}>Email address</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email address"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={(text) => setEmail(text.trim().toLowerCase())}
                                editable={!loading}
                            />

                            <TouchableOpacity
                                style={[styles.mainButton, { backgroundColor: mode === 'signin' ? '#fff' : '#4CAF50' }]}
                                onPress={onEmailPress}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color={mode === 'signin' ? '#000' : '#fff'} />
                                ) : (
                                    <Text style={[styles.mainButtonText, { color: mode === 'signin' ? '#000' : '#fff' }]}>
                                        {mode === 'signin' ? 'Sign In' : 'Create Account'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <View style={styles.inputLabelContainer}>
                                <Text style={styles.inputLabel}>Verification Code</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter code sent to email"
                                placeholderTextColor="#999"
                                keyboardType="number-pad"
                                value={code}
                                onChangeText={setCode}
                                editable={!loading}
                            />

                            <TouchableOpacity style={styles.mainButton} onPress={onPressVerify} disabled={loading}>
                                {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.mainButtonText}>Verify & Login</Text>}
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Footer Toggle */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                        </Text>
                        <TouchableOpacity onPress={() => {
                            setMode(mode === 'signin' ? 'signup' : 'signin');
                            setPendingVerification(false);
                            setShowPasswordInput(false);
                            setEmail('');
                            setCode('');
                            setPassword('');
                        }}>
                            <Text style={styles.linkText}>{mode === 'signin' ? 'Sign Up' : 'Sign In'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Skip for Guest */}
                    <TouchableOpacity style={styles.skipLink} onPress={async () => {
                        await AsyncStorage.setItem('guest_mode', 'true');
                        router.push('/home');
                    }}>
                        <Text style={styles.skipText}>Skip for now (Guest Mode)</Text>
                    </TouchableOpacity>

                    {/* Secured by Clerk Badge */}
                    <View style={styles.securedBy}>
                        <Text style={styles.securedText}>Secured by</Text>
                        <Ionicons name="shield-checkmark" size={12} color="#666" style={{ marginLeft: 4, marginRight: 2 }} />
                        <Text style={[styles.securedText, { fontWeight: '700' }]}>clerk</Text>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContent: {
        flexGrow: 1,
        backgroundColor: '#111', // Dark background to match screenshot vibe loosely or app theme
    },
    imageContainer: {
        height: height * 0.4,
        width: '100%',
        opacity: 0.6,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    cardContainer: {
        flex: 1,
        backgroundColor: '#1a1a1a', // Dark card
        marginTop: -30,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        color: '#aaa',
        marginBottom: 32,
        textAlign: 'center',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333',
        width: '100%',
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    googleButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#333',
    },
    orText: {
        marginHorizontal: 12,
        color: '#666',
        fontSize: 12,
    },
    inputLabelContainer: {
        width: '100%',
        marginBottom: 8,
    },
    inputLabel: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    input: {
        width: '100%',
        height: 48,
        backgroundColor: '#222',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
        paddingHorizontal: 16,
        color: '#fff',
        marginBottom: 16,
    },
    mainButton: {
        width: '100%',
        height: 48,
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    mainButtonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    footerText: {
        color: '#888',
        fontSize: 13,
    },
    linkText: {
        color: '#fff',
        fontSize: 13, // White for interaction
        fontWeight: '600',
    },
    skipLink: {
        padding: 8,
        marginBottom: 20,
    },
    skipText: {
        color: '#666',
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    securedBy: {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.6,
        marginTop: 10,
    },
    securedText: {
        color: '#666',
        fontSize: 10,
    },
});
