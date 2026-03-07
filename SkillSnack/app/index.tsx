import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = [
  { id: '1', title: 'Quantitative Finance', key: 'finance', icon: 'trending-up', color: '#10B981', description: 'Algorithmic trading & risk' },
  { id: '2', title: 'Science', key: 'science', icon: 'code-slash', color: '#3B82F6', description: 'Physics, Chemistry, Biology' },
  { id: '3', title: 'Mathematics', key: 'maths', icon: 'calculator', color: '#F59E0B', description: 'Calculus & Probability' },
];

export default function CategoryScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const {
    user,
    session,
    initializing,
    xp,
    pendingXp,
    streak,
    syncXp,
    signOut,
  } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [showStreakHint, setShowStreakHint] = useState(false);

  // Guard: if not logged in, redirect to login screen.
  useEffect(() => {
    if (initializing) return;
    if (!user || !session) {
      router.replace('/login');
    }
  }, [initializing, user, session, router]);

  const handleLogout = async () => {
    setMenuVisible(false);
    await signOut();
    router.replace('/login');
  };

  const handleSyncXp = async () => {
    if (syncing) return;
    try {
      setSyncing(true);
      await syncXp();
    } finally {
      setSyncing(false);
    }
  };

  const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      style={styles.card} 
      onPress={() => router.push({ 
        pathname: '/topic', 
        params: { categoryKey: item.key, categoryTitle: item.title } 
      })}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '10' }]}>
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.description}</Text>
      </View>
      <View style={styles.arrowCircle}>
        <Ionicons name="chevron-forward" size={14} color="#64748B" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}><Ionicons name="flash" size={20} color="#FFF" /></View>
          <Text style={styles.brandName}>Skill<Text style={styles.brandAccent}>Snack</Text></Text>
        </View>
        
        {/* Right Side Header Actions */}
        <View style={styles.headerActions}>
          {user && (
            <>
              <View style={styles.streakWrapper}>
                <TouchableOpacity
                  style={styles.streakBar}
                  activeOpacity={0.8}
                  onPress={() => setShowStreakHint((v) => !v)}
                >
                  {Array.from({ length: 5 }).map((_, index) => {
                    const isActive = streak >= index + 1;
                    return (
                      <View
                        key={index}
                        style={[
                          styles.streakDot,
                          isActive ? styles.streakDotActive : styles.streakDotInactive,
                        ]}
                      />
                    );
                  })}
                  <Text style={styles.streakText}>{streak}d</Text>
                </TouchableOpacity>
                {showStreakHint && (
                  <View style={styles.streakTooltip}>
                    <Text style={styles.streakTooltipText}>
                      You have {streak === 1 ? '1 day' : `${streak} days`} streak!
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.xpWrapper}>
                <View style={styles.xpBar}>
                  <Ionicons name="flash" size={14} color="#FBBF24" />
                  <Text style={styles.xpText}>{xp} XP</Text>
                  {pendingXp > 0 && <View style={styles.xpPendingDot} />}
                </View>
                {pendingXp > 0 && (
                  <TouchableOpacity
                    style={[styles.syncBtn, syncing && styles.syncBtnDisabled]}
                    onPress={handleSyncXp}
                    disabled={syncing}
                  >
                    <Ionicons
                      name="cloud-upload-outline"
                      size={14}
                      color={syncing ? "#9CA3AF" : "#0F172A"}
                    />
                    <Text style={styles.syncBtnText}>
                      {syncing ? 'Syncing' : 'Sync XP'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}

          <TouchableOpacity 
            style={styles.leaderboardBtn}
            onPress={() => router.push('/leaderboard')} // Assuming you have this route
          >
            <Ionicons name="trophy" size={16} color="#F59E0B" />
            <Text style={styles.leaderboardText}>LeaderBoard</Text>
          </TouchableOpacity>

          <View>
            <TouchableOpacity 
              style={styles.profileBtn} 
              onPress={() => setMenuVisible(!menuVisible)}
            >
              <Ionicons name="person-circle-outline" size={32} color={menuVisible ? "#10B981" : "#1E293B"} />
            </TouchableOpacity>

            {menuVisible && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity style={styles.dropdownItem}>
                  <Ionicons name="person-outline" size={18} color="#475569" />
                  <View style={styles.dropdownTextGroup}>
                    <Text style={styles.dropdownText}>Profile</Text>
                    {user && (
                      <Text numberOfLines={1} style={styles.dropdownSubtext}>
                        {(user as any).email ??
                          (user as any).user_metadata?.full_name ??
                          'Logged in'}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.dropdownItem}>
                  <Ionicons name="ribbon-outline" size={18} color="#475569" />
                  <Text style={styles.dropdownText}>Badges</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.dropdownItem}>
                  <Ionicons name="settings-outline" size={18} color="#475569" />
                  <Text style={styles.dropdownText}>Settings</Text>
                </TouchableOpacity>
                {user && (
                  <>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
                      <Ionicons name="log-out-outline" size={18} color="#DC2626" />
                      <Text style={[styles.dropdownText, { color: '#DC2626' }]}>Log out</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>
        </View>
      </View>

      {menuVisible && (
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuVisible(false)} />
      )}

      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>Ready for a quick</Text>
        <Text style={styles.learningGoal}>learning session?</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Learning Paths</Text>
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: 15, 
    marginBottom: 20,
    zIndex: 10,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 38, height: 38, backgroundColor: '#1E293B', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 10, transform: [{ rotate: '-8deg' }] },
  brandName: { fontSize: 24, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  brandAccent: { color: '#94A3B8', fontWeight: '400' },
  
  streakWrapper: { alignItems: 'flex-end' },
  streakBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
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
    backgroundColor: '#0F172A',
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
    backgroundColor: '#10B981',
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
  syncBtnText: { fontSize: 10, fontWeight: '600', color: '#0F172A' },

  // Leaderboard Style
  leaderboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  leaderboardText: { fontSize: 13, fontWeight: '700', color: '#B45309' },

  profileBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
  dropdownMenu: { position: 'absolute', top: 50, right: 0, width: 150, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 8, elevation: 10, zIndex: 100, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  dropdownTextGroup: { flexDirection: 'column', flex: 1 },
  dropdownText: { fontSize: 14, fontWeight: '600', color: '#334155' },
  dropdownSubtext: { marginTop: 2, fontSize: 11, color: '#9CA3AF', maxWidth: 110 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 12 },
  welcomeSection: { paddingHorizontal: 24, marginTop: 10, marginBottom: 30 },
  greeting: { fontSize: 16, color: '#64748B', fontWeight: '500' },
  learningGoal: { fontSize: 32, fontWeight: '900', color: '#0F172A', marginTop: 2 },
  sectionHeader: { paddingHorizontal: 24, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  listContent: { paddingHorizontal: 24, paddingBottom: 40 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 24, padding: 18, marginBottom: 16, elevation: 2 },
  iconContainer: { width: 54, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1, marginLeft: 16 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B' },
  cardSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  arrowCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
});