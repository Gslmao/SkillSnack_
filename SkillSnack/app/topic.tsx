import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { learningData } from '../data/learningData';

export default function TopicScreen() {
  const router = useRouter();
  const { categoryKey } = useLocalSearchParams<{ categoryKey: string }>();
  
  // Track which topic was clicked to pass it to the next screen
  const [selectedTopicKey, setSelectedTopicKey] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const category = learningData[categoryKey as keyof typeof learningData];
  const topicsArray = category ? Object.entries(category.topics) : [];

  const handleTopicPress = (topicKey: string) => {
    setSelectedTopicKey(topicKey);
    setModalVisible(true);
  };

  const startLessons = (minutes: number) => {
    setModalVisible(false);
    // Navigate to lesson.tsx and pass the chosen time
    router.push({
      pathname: '/lesson',
      params: { 
        categoryKey, 
        topicKey: selectedTopicKey, 
        timeLimit: minutes.toString() 
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{category?.name} Topics</Text>
      
      <FlatList
        data={topicsArray}
        keyExtractor={([key]) => key}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleTopicPress(item[0])}>
            <Text style={styles.topicText}>{item[1].title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Time Limit Selection Popup */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Daily Limit</Text>
            <Text style={styles.modalSub}>Each lesson is 5 mins. How long can you learn today?</Text>
            
            {[5, 10, 15].map(mins => (
              <TouchableOpacity key={mins} style={styles.timeBtn} onPress={() => startLessons(mins)}>
                <Text style={styles.timeBtnText}>{mins} Minutes</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 20, backgroundColor: '#f9f9f9', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  topicText: { fontSize: 18, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 30, borderRadius: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalSub: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  timeBtn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 10 },
  timeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelText: { color: 'red', marginTop: 10 }
});