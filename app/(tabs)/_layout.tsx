import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 60 + (insets.bottom > 0 ? insets.bottom : 10), // Dynamically adjust height
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 10, // Adjust padding for safe area
                    paddingTop: 10,
                    backgroundColor: '#fff',
                    borderTopColor: '#eee',
                    borderTopWidth: 1,
                },
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#999',
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    title: 'Categories',
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? "grid" : "grid-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="bookings"
                options={{
                    title: 'Bookings',
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? "calendar" : "calendar-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="support"
                options={{
                    title: 'Support',
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
