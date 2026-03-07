import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { learningData } from '../data/learningData';

export default function TopicScreen() {
  const router = useRouter();
  const { categoryKey, categoryTitle } = useLocalSearchParams<{ categoryKey: string, categoryTitle: string }>();
  
  // State for Modal
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
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.heading}>{categoryTitle || category?.name}</Text>
        <Text style={styles.subheading}>Master these modules to level up</Text>
      </View>
      
      <FlatList
        data={topicsArray}
        keyExtractor={([key]) => key}
        contentContainerStyle={styles.listPadding}
        renderItem={({ item }) => {
          const topicKey = item[0];
          const topicData = item[1];
          const themeColor = getCategoryColor(categoryKey);

          return (
            <View style={[styles.card, { borderLeftColor: themeColor }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.topicText}>{topicData.title}</Text>
                <View style={styles.moduleBadge}>
                   <Text style={styles.moduleBadgeText}>{topicData.lessons.length} Modules</Text>
                </View>
              </View>

              <View style={styles.lessonList}>
                {topicData.lessons.map((lesson: any) => (
                  <View key={lesson.id} style={styles.lessonItem}>
                    <Ionicons name="radio-button-on" size={14} color={themeColor} style={{ opacity: 0.5 }} />
                    <Text style={styles.lessonTitleText} numberOfLines={1}>
                      {lesson.title}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.startBtn} 
                onPress={() => handleTopicPress(topicKey)}
              >
                <Text style={styles.startBtnText}>Start Learning</Text>
                <Ionicons name="play-circle" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {/* Time Selection Popup */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.timerIconContainer, { backgroundColor: `${getCategoryColor(categoryKey)}15` }]}>
              <Ionicons name="time" size={40} color={getCategoryColor(categoryKey)} />
            </View>
            <Text style={styles.modalTitle}>Set Your Session</Text>
            <Text style={styles.modalSub}>
              How much time do you want to dedicate to {category?.name} right now?
            </Text>
            
            <View style={styles.buttonGroup}>
              {[5, 10, 15].map(mins => (
                <TouchableOpacity 
                  key={mins} 
                  style={[styles.timeBtn, { backgroundColor: getCategoryColor(categoryKey) }]} 
                  onPress={() => startLessons(mins)}
                >
                  <Text style={styles.timeBtnText}>{mins} Minutes</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text style={styles.cancelText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const getCategoryColor = (key?: string) => {
  return key === 'finance' ? '#10B981' : '#6366F1';
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerSection: { padding: 24, paddingTop: 10 },
  backBtn: { 
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', 
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
  },
  heading: { fontSize: 32, fontWeight: '900', color: '#1E293B' },
  subheading: { fontSize: 16, color: '#64748B', marginTop: 4 },
  listPadding: { paddingHorizontal: 24, paddingBottom: 40 },
  card: { 
    padding: 24, backgroundColor: '#fff', borderRadius: 28, marginBottom: 20, borderLeftWidth: 8,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05, shadowRadius: 20, elevation: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  topicText: { fontSize: 22, fontWeight: '800', color: '#1E293B', flex: 1, marginRight: 10 },
  moduleBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  moduleBadgeText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  lessonList: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 15, marginBottom: 20 },
  lessonItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  lessonTitleText: { flex: 1, fontSize: 15, color: '#475569', fontWeight: '500', marginLeft: 12 },
  startBtn: { backgroundColor: '#1E293B', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 20, gap: 10 },
  startBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: '#fff', padding: 32, borderRadius: 36, alignItems: 'center' },
  timerIconContainer: { marginBottom: 20, padding: 24, borderRadius: 100 },
  modalTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', marginBottom: 8 },
  modalSub: { fontSize: 16, color: '#64748B', marginBottom: 30, textAlign: 'center', lineHeight: 24 },
  buttonGroup: { width: '100%' },
  timeBtn: { padding: 20, borderRadius: 24, width: '100%', alignItems: 'center', marginBottom: 12, elevation: 2 },
  timeBtnText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  closeBtn: { marginTop: 15 },
  cancelText: { color: '#94A3B8', fontWeight: '700', fontSize: 16 }
});