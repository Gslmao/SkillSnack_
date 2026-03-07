import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { learningData } from '../data/learningData';

export default function LessonScreen() {
  const router = useRouter();
  const { categoryKey, topicKey, timeLimit } = useLocalSearchParams<{ 
    categoryKey: string; 
    topicKey: string; 
    timeLimit: string 
  }>();

  // 1. Data Retrieval
  const category = learningData[categoryKey as keyof typeof learningData];
  const topic = category?.topics[topicKey as keyof typeof category.topics] as any;
  const allLessons = topic?.lessons || [];

  // 2. Unlock Logic: 1 lesson per 5 mins
  const minutes = parseInt(timeLimit || "5");
  const limit = Math.floor(minutes / 5);
  const unlocked = allLessons.slice(0, limit);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>{topic?.title || "Lessons"}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{minutes} MIN SESSION</Text>
          </View>
          <Text style={styles.subtext}>{unlocked.length} modules unlocked</Text>
        </View>
      </View>
      
      <FlatList
        data={unlocked}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={styles.lessonCard} 
            onPress={() => router.push({
              pathname: '/lesson-details',
              params: { 
                lessonId: item.id, 
                lessonTitle: item.title,
                topicTitle: topic?.title 
              }
            })}
          >
            <View style={styles.indexCircle}>
              <Text style={styles.indexText}>{index + 1}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.lessonMeta}>5 minute snack</Text>
            </View>
            <Ionicons name="play-circle" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 25, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  heading: { fontSize: 28, fontWeight: '900', color: '#1a1a1a' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  badge: { backgroundColor: '#E3F2FD', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginRight: 10 },
  badgeText: { color: '#007AFF', fontSize: 12, fontWeight: 'bold' },
  subtext: { color: '#666', fontSize: 14 },
  list: { padding: 20 },
  lessonCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F8F9FA', 
    padding: 18, 
    borderRadius: 16, 
    marginBottom: 12 
  },
  indexCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  indexText: { fontWeight: 'bold', color: '#555' },
  cardInfo: { flex: 1, marginLeft: 15 },
  lessonTitle: { fontSize: 17, fontWeight: '700', color: '#333' },
  lessonMeta: { fontSize: 13, color: '#888', marginTop: 2 }
});