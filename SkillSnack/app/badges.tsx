import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
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

const BADGES = [
  {
    id: '1',
    title: 'First Steps',
    icon: 'star' as const,
    color: '#10B981',
    description: 'This badge gets unlocked at Level 1 when you complete your first lesson.',
  },
  {
    id: '2',
    title: 'Streak Starter',
    icon: 'flame' as const,
    color: '#F59E0B',
    description: 'This badge gets unlocked at Level 2 when you maintain a 3-day streak.',
  },
  {
    id: '3',
    title: 'Quiz Master',
    icon: 'help-circle' as const,
    color: '#3B82F6',
    description: 'This badge gets unlocked at Level 3 when you score 100% on any quiz.',
  },
  {
    id: '4',
    title: 'Century Club',
    icon: 'ribbon' as const,
    color: '#8B5CF6',
    description: 'This badge gets unlocked at Level 4 when you reach 100 total XP.',
  },
  {
    id: '5',
    title: 'SkillSnack Champion',
    icon: 'trophy' as const,
    color: '#FBBF24',
    description: 'This badge gets unlocked at Level 5 when you complete all categories.',
  },
];

export default function BadgesScreen() {
  const router = useRouter();

  const renderBadge = ({ item }: { item: typeof BADGES[0] }) => (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={32} color={item.color} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.TEXT_MAIN} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Badges</Text>
        <View style={styles.iconPlaceholder} />
      </View>
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Earn badges as you level up</Text>
      </View>
      <FlatList
        data={BADGES}
        renderItem={renderBadge}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.CARD_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: { width: 40, height: 40 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.TEXT_MAIN,
    letterSpacing: 0.5,
  },
  subHeader: { paddingHorizontal: 24, marginBottom: 20 },
  subHeaderText: { fontSize: 14, color: COLORS.TEXT_SUB, fontWeight: '600' },
  listContent: { paddingHorizontal: 24, paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  textWrap: { flex: 1 },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.TEXT_MAIN,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: COLORS.TEXT_SUB,
    lineHeight: 20,
    fontWeight: '500',
  },
});
