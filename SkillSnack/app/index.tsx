import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
  PRIMARY: '#10B981',      // Neon Comical Green
  DARK_BG: '#0F172A',      // Deep Midnight Navy
  CARD_BG: '#1E293B',      // Slate Navy
  TEXT_MAIN: '#F8FAFC',    // Off-White
  TEXT_SUB: '#94A3B8',     // Muted Slate
  AMBER: '#F59E0B',        // Trophy Gold
};

const CATEGORIES = [
  { id: '1', title: 'Quantitative Finance', key: 'finance', icon: 'trending-up', color: '#10B981', description: 'Algorithmic trading & risk' },
  { id: '2', title: 'Science', key: 'science', icon: 'flask', color: '#3B82F6', description: 'Physics, Chemistry, Biology' },
  { id: '3', title: 'Mathematics', key: 'maths', icon: 'calculator', color: '#F59E0B', description: 'Calculus & Probability' },
];

export default function CategoryScreen() {
  const router = useRouter();
  const {
    user,
    session,
    initializing,
    pendingXp,
    syncXp,
    refreshXpFromServer,
  } = useAuth();

  // When user returns to home (e.g. after finishing quizzes), refresh XP so profile shows correct total
  useFocusEffect(
    useCallback(() => {
      if (user && session) {
        // Don't wipe local pending XP by refreshing from server.
        // If we have pending XP, sync it first; otherwise refresh from server.
        if (pendingXp > 0) {
          syncXp();
        } else {
          refreshXpFromServer();
        }
      }
    }, [user, session, pendingXp, syncXp, refreshXpFromServer])
  );

  // Guard: if not logged in, redirect to login screen.
  useEffect(() => {
    if (initializing) return;
    if (!user || !session) {
      router.replace('/login');
    }
  }, [initializing, user, session, router]);


  const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      style={styles.card} 
      onPress={() => router.push({ 
        pathname: '/topic', 
        params: { categoryKey: item.key, categoryTitle: item.title } 
      })}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
        <Ionicons name={item.icon as any} size={26} color={item.color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.description}</Text>
      </View>
      <View style={styles.arrowCircle}>
        <Ionicons name="chevron-forward" size={14} color={COLORS.TEXT_SUB} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Premium Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="flash" size={20} color={COLORS.DARK_BG} />
          </View>
          <Text style={styles.brandName}>Skill<Text style={styles.brandAccent}>Snack</Text></Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.push('/leaderboard')}
          >
            <Ionicons name="trophy" size={18} color={COLORS.AMBER} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.push('/badges')}
          >
            <Ionicons name="ribbon" size={18} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.profileBtn} 
            onPress={() => router.push('/profile')}
          >
            <View style={styles.avatarFrame}>
              <Ionicons name="person" size={20} color={COLORS.TEXT_SUB} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>Ready for a quick</Text>
        <Text style={styles.learningGoal}>learning session?</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PICK YOUR PATH</Text>
      </View>

      <FlatList
        data={CATEGORIES}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.DARK_BG },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: 15, 
    marginBottom: 20,
    zIndex: 10,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { 
    width: 38, height: 38, 
    backgroundColor: COLORS.PRIMARY, 
    borderRadius: 12, 
    justifyContent: 'center', alignItems: 'center', 
    marginRight: 10, 
    transform: [{ rotate: '-8deg' }],
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.5,
    shadowRadius: 10
  },
  brandName: { fontSize: 24, fontWeight: '900', color: COLORS.TEXT_MAIN, letterSpacing: -1 },
  brandAccent: { color: COLORS.TEXT_SUB, fontWeight: '400' },
  
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  leaderboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  leaderboardText: { fontSize: 12, fontWeight: '900', color: COLORS.AMBER, letterSpacing: 0.5 },

  profileBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  avatarFrame: { width: 40, height: 40, borderRadius: 14, backgroundColor: COLORS.CARD_BG, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  avatarFrameActive: { borderColor: COLORS.PRIMARY },

  dropdownMenu: { 
    position: 'absolute', top: 55, right: 0, 
    width: 160, backgroundColor: COLORS.CARD_BG, 
    borderRadius: 20, paddingVertical: 8, 
    elevation: 10, zIndex: 100, 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 
  },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  dropdownText: { fontSize: 14, fontWeight: '700', color: COLORS.TEXT_MAIN },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: 12 },

  welcomeSection: { paddingHorizontal: 24, marginTop: 10, marginBottom: 30 },
  greeting: { fontSize: 18, color: COLORS.TEXT_SUB, fontWeight: '500', letterSpacing: 0.5 },
  learningGoal: { 
    fontSize: 34, 
    fontWeight: '900', 
    color: COLORS.TEXT_MAIN, 
    marginTop: 4, 
    letterSpacing: -1.5 
  },

  sectionHeader: { paddingHorizontal: 24, marginBottom: 15 },
  sectionTitle: { fontSize: 12, fontWeight: '900', color: COLORS.PRIMARY, letterSpacing: 2 },

  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.CARD_BG,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  
  listContent: { paddingHorizontal: 24, paddingBottom: 40 },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.CARD_BG, 
    borderRadius: 28, 
    padding: 20, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5
  },
  iconContainer: { width: 58, height: 58, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1, marginLeft: 16 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: COLORS.TEXT_MAIN, letterSpacing: -0.5 },
  cardSubtitle: { fontSize: 14, color: COLORS.TEXT_SUB, marginTop: 4, fontWeight: '500' },
  arrowCircle: { width: 34, height: 34, borderRadius: 12, backgroundColor: COLORS.DARK_BG, justifyContent: 'center', alignItems: 'center' },

  streakWrapper: { alignItems: 'flex-end' },
  streakBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.DARK_BG,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  streakDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  streakDotActive: {
    backgroundColor: '#22C55E',
  },
  streakDotInactive: {
    backgroundColor: '#4B5563',
  },
  streakText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  streakTooltip: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.DARK_BG,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  streakTooltipText: {
    fontSize: 11,
    color: '#E5E7EB',
  },

  xpWrapper: { alignItems: 'flex-end', marginRight: 8 },
  xpBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  xpText: { fontSize: 12, fontWeight: '700', color: '#F9FAFB' },
  xpPendingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.PRIMARY,
  },
  syncBtn: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    gap: 4,
  },
  syncBtnDisabled: {
    opacity: 0.6,
  },
  syncBtnText: { fontSize: 10, fontWeight: '600', color: COLORS.DARK_BG },

  // Fix leaderboard route issue
  leaderboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  leaderboardText: { fontSize: 12, fontWeight: '900', color: COLORS.AMBER, letterSpacing: 0.5 },
});