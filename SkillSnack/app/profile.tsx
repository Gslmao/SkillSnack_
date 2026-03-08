import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const COLORS = {
  PRIMARY: '#10B981',
  DARK_BG: '#0F172A',
  CARD_BG: '#1E293B',
  TEXT_MAIN: '#F8FAFC',
  TEXT_SUB: '#94A3B8',
  AMBER: '#F59E0B',
};

export default function ProfileScreen() {
  const router = useRouter();
  const {
    user,
    xp,
    pendingXp,
    streak,
    bestStreak,
    syncXp,
    refreshXpFromServer,
    signOut,
  } = useAuth();
  const [syncing, setSyncing] = useState(false);

   // Whenever the user opens the profile screen, refresh XP/streak from the server
   useFocusEffect(
     useCallback(() => {
       if (user) {
         // If there is pending XP, sync it first; otherwise refresh from cloud.
         if (pendingXp > 0) {
           syncXp();
         } else {
           refreshXpFromServer();
         }
       }
     }, [user, pendingXp, refreshXpFromServer, syncXp])
   );

  const handleSyncXp = async () => {
    if (syncing) return;

    try {
      setSyncing(true);
      const result =
        pendingXp > 0 ? await syncXp() : await refreshXpFromServer();

      if (!result.success && result.error) {
        const msg =
          result.error === 'No pending XP to sync'
            ? 'Nothing to sync. XP is up to date.'
            : result.error;
        Alert.alert('Sync failed', msg);
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  const displayName =
    (user as any)?.full_name ||
    (user as any)?.name ||
    (user as any)?.email ||
    'Learner';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.TEXT_MAIN} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.iconPlaceholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatarBlock}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={32} color={COLORS.DARK_BG} />
          </View>
          <Text style={styles.nameText}>{displayName}</Text>
        </View>

        <View style={styles.cardRow}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="flash" size={18} color="#FBBF24" />
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <Text style={styles.statValue}>{xp}</Text>
            {pendingXp > 0 && (
              <Text style={styles.statSub}>
                +{pendingXp} XP waiting to sync
              </Text>
            )}
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="flame" size={18} color={COLORS.PRIMARY} />
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <Text style={styles.statValue}>{streak}d</Text>
            <Text style={styles.statSub}>Best streak: {bestStreak}d</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.syncBtn, syncing && styles.syncBtnDisabled]}
          onPress={handleSyncXp}
          disabled={syncing}
        >
          <Ionicons
            name={pendingXp > 0 ? 'cloud-upload-outline' : 'refresh'}
            size={18}
            color={COLORS.DARK_BG}
          />
          <Text style={styles.syncText}>
            {syncing
              ? 'Syncing...'
              : pendingXp > 0
              ? 'Sync XP to cloud'
              : 'Refresh from cloud'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#FCA5A5" />
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.DARK_BG },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.CARD_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.TEXT_MAIN,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.TEXT_MAIN,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.TEXT_SUB,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.TEXT_MAIN,
    marginBottom: 4,
  },
  statSub: {
    fontSize: 12,
    color: COLORS.TEXT_SUB,
    fontWeight: '500',
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
  },
  syncBtnDisabled: {
    opacity: 0.6,
  },
  syncText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.DARK_BG,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#1F2933',
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FCA5A5',
  },
});

