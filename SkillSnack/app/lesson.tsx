import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { learningData } from '../data/learningData';

export default function LessonScreen() {
  const { categoryKey, topicKey, timeLimit } = useLocalSearchParams<{ 
    categoryKey: string; 
    topicKey: string; 
    timeLimit: string 
  }>();

  // 1. Safe Category Access
  const category = learningData[categoryKey as keyof typeof learningData];

  // 2. The Final Fix for the 'never' error:
  // We explicitly tell TS: "Get the topic, and treat it as an object that has lessons."
  const topic = category?.topics[topicKey as keyof typeof category.topics] as { 
    title: string, 
    lessons: { id: string, title: string }[] 
  } | undefined;

  // 3. Extract lessons safely
  const allLessons = topic?.lessons || [];

  // 4. Unlock Logic (1 lesson per 5 mins)
  const minutes = parseInt(timeLimit || "5");
  const limit = minutes / 5;
  const unlocked = allLessons.slice(0, limit);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{topic?.title || "Lessons"}</Text>
      <Text style={styles.goalText}>
        Target: {minutes} mins • {unlocked.length} lessons unlocked
      </Text>
      
      <FlatList
        data={unlocked}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.lessonCard}>
            <Text style={styles.lessonTitle}>{item.title}</Text>
            <Text style={styles.lessonSubtitle}>5 minute session</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  heading: { fontSize: 26, fontWeight: 'bold' },
  goalText: { fontSize: 16, color: '#4CAF50', fontWeight: '600', marginBottom: 25 },
  lessonCard: { 
    padding: 20, 
    backgroundColor: '#f0f7ff', 
    borderRadius: 15, 
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF'
  },
  lessonTitle: { fontSize: 18, color: '#0056b3', fontWeight: '600' },
  lessonSubtitle: { fontSize: 14, color: '#666', marginTop: 4 }
});