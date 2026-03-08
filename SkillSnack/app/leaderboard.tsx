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

const MOCK_LEADERBOARD = [
  { id: '1', rank: 1, name: 'Alex Rivera', xp: 2840 },
  { id: '2', rank: 2, name: 'Sam Chen', xp: 2520 },
  { id: '3', rank: 3, name: 'Jordan Lee', xp: 2190 },
  { id: '4', rank: 4, name: 'Morgan Blake', xp: 1850 },
  { id: '5', rank: 5, name: 'Casey Drew', xp: 1620 },
];

export default function LeaderboardScreen() {
  const router = useRouter();

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { backgroundColor: 'rgba(255, 215, 0, 0.2)', borderColor: '#FFD700' };
    if (rank === 2) return { backgroundColor: 'rgba(192, 192, 192, 0.2)', borderColor: '#C0C0C0' };
    if (rank === 3) return { backgroundColor: 'rgba(205, 127, 50, 0.2)', borderColor: '#CD7F32' };
    return { backgroundColor: COLORS.CARD_BG, borderColor: 'rgba(255,255,255,0.05)' };
  };

  const renderRow = ({ item }: { item: typeof MOCK_LEADERBOARD[0] }) => (
    <View style={[styles.row, getRankStyle(item.rank)]}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>#{item.rank}</Text>
      </View>
      <View style={styles.nameBlock}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.xpSub}>{item.xp} XP</Text>
      </View>
      <Ionicons name="trophy" size={20} color={item.rank <= 3 ? COLORS.AMBER : COLORS.TEXT_SUB} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.TEXT_MAIN} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={styles.iconPlaceholder} />
      </View>
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Top learners this week</Text>
      </View>
      <FlatList
        data={MOCK_LEADERBOARD}
        renderItem={renderRow}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.DARK_BG,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankText: { fontSize: 14, fontWeight: '900', color: COLORS.TEXT_MAIN },
  nameBlock: { flex: 1 },
  nameText: { fontSize: 17, fontWeight: '800', color: COLORS.TEXT_MAIN },
  xpSub: { fontSize: 13, color: COLORS.TEXT_SUB, marginTop: 2, fontWeight: '600' },
});
