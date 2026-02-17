import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function OAuthCallback() {
    // This route handles "exp://.../--/oauth-native-callback"
    // Clerk handles the session change, we just need to redirect to Home.
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
            <ActivityIndicator size="large" color="#fff" />
            <Redirect href="/home" />
        </View>
    );
}
