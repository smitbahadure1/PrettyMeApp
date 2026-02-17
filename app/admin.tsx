
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Alert, Image } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function AdminScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user, isLoaded } = useUser();
    const [refreshing, setRefreshing] = useState(false);

    // Stats
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
            const authorizedAdmins = ['nidhisakpaludemy@gmail.com', 'admin@prettyme.com'];

            if (!email || !authorizedAdmins.includes(email)) {
                Alert.alert('Access Denied', 'You are not authorized to view this page.');
                router.replace('/account');
            } else {
                fetchDashboardData();
            }
        }
    }, [isLoaded, user]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch Users Count (assuming 'profiles' or 'users' table)
            // We'll try 'profiles' first as it's common with Supabase auth
            const { count: userCount, error: userError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (!userError) {
                setTotalUsers(userCount || 0);
            } else {
                // Fallback or just log
                console.log('Error fetching users:', userError);
                // Try 'users' table just in case
                const { count: userCount2 } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true });
                if (userCount2) setTotalUsers(userCount2);
            }

            // Fetch Orders/Bookings Count
            const { count: orderCount, error: orderError } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true });

            if (!orderError) {
                setTotalOrders(orderCount || 0);
            }

            // Fetch Recent Orders
            const { data: orders, error: recentError } = await supabase
                .from('bookings')
                .select('*') // Simplified to avoid join errors if FK missing
                .order('created_at', { ascending: false })
                .limit(10);

            if (orders) {
                setRecentOrders(orders);
            }

        } catch (e) {
            console.error('Admin fetch error:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        fetchDashboardData();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Admin Info */}
                <View style={styles.adminCard}>
                    <View style={styles.adminIcon}>
                        <MaterialIcons name="admin-panel-settings" size={30} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.adminName}>Admin Panel</Text>
                        <Text style={styles.adminEmail}>{user?.primaryEmailAddress?.emailAddress}</Text>
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                            <FontAwesome5 name="users" size={20} color="#1565C0" />
                        </View>
                        <Text style={styles.statNumber}>{totalUsers}</Text>
                        <Text style={styles.statLabel}>Total Users</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                            <FontAwesome5 name="shopping-bag" size={20} color="#2E7D32" />
                        </View>
                        <Text style={styles.statNumber}>{totalOrders}</Text>
                        <Text style={styles.statLabel}>Total Orders</Text>
                    </View>
                </View>

                {/* Recent Orders Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Orders</Text>
                    <TouchableOpacity onPress={fetchDashboardData}>
                        <Ionicons name="refresh" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                {loading && recentOrders.length === 0 ? (
                    <View style={styles.loadingContainer}>
                        <Text>Loading data...</Text>
                    </View>
                ) : recentOrders.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="inbox" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>No orders found in database.</Text>
                        <Text style={styles.emptySubText}>Orders stored locally on user devices will not appear here unless synced.</Text>
                    </View>
                ) : (
                    recentOrders.map((order, index) => (
                        <View key={index} style={styles.orderCard}>
                            <View style={styles.orderHeader}>
                                <Text style={styles.orderId}>Order #{String(order.id || '').slice(0, 8) || 'N/A'}</Text>
                                <Text style={[
                                    styles.statusBadge,
                                    { color: order.status === 'Completed' ? '#2E7D32' : '#F57C00' }
                                ]}>
                                    {order.status || 'Pending'}
                                </Text>
                            </View>
                            <Text style={styles.orderService}>{order.title || order.service_name || 'Service'}</Text>
                            <View style={styles.orderDetailRow}>
                                <Text style={styles.orderUser}>
                                    User: {order.profiles?.email || order.user_email || 'Unknown'}
                                </Text>
                                <Text style={styles.orderPrice}>₹{order.price || 0}</Text>
                            </View>
                            <Text style={styles.orderDate}>
                                {(() => {
                                    try {
                                        return new Date(order.created_at || Date.now()).toLocaleDateString();
                                    } catch (e) {
                                        return 'Unknown Date';
                                    }
                                })()}
                            </Text>
                        </View>
                    ))
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    backBtn: {
        padding: 5,
    },
    scrollContent: {
        padding: 20,
    },
    adminCard: {
        backgroundColor: '#333',
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    adminIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    adminName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    adminEmail: {
        fontSize: 12,
        color: '#ddd',
        marginTop: 2,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    statCard: {
        flex: 0.48,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    orderId: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Monospace',
    },
    statusBadge: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    orderService: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    orderDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    orderUser: {
        fontSize: 13,
        color: '#666',
    },
    orderPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    orderDate: {
        fontSize: 11,
        color: '#999',
        marginTop: 5,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginTop: 10,
    },
    emptySubText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginTop: 5,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    }
});
