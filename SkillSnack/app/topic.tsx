import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { learningData } from '../data/learningData';

const COLORS = {
  PRIMARY: '#10B981',      // Neon Comical Green
  SECONDARY: '#6366F1',    // Indigo (for non-finance)
  DARK_BG: '#0F172A',      // Deep Midnight Navy
  CARD_BG: '#1E293B',      // Slate Navy
  TEXT_MAIN: '#F8FAFC',    // Off-White
  TEXT_SUB: '#94A3B8',     // Muted Slate
};

export default function TopicScreen() {
  const router = useRouter();
  const { categoryKey, categoryTitle } = useLocalSearchParams<{ categoryKey: string, categoryTitle: string }>();
  
  const [selectedTopicKey, setSelectedTopicKey] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const category = learningData[categoryKey as keyof typeof learningData];
  const topicsArray = category ? Object.entries(category.topics) : [];
  const themeColor = getCategoryColor(categoryKey);

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
      <StatusBar barStyle="light-content" />
      
      {/* Premium Header */}
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.TEXT_MAIN} />
        </TouchableOpacity>
        <Text style={styles.heading}>{categoryTitle || category?.name}</Text>
        <Text style={styles.subheading}>Master these modules to level up</Text>
      </View>
      
      <FlatList
        data={topicsArray}
        keyExtractor={([key]) => key}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const topicKey = item[0];
          const topicData = item[1];

          return (
            <View style={styles.card}>
              {/* Vertical Accent Line */}
              <View style={[styles.cardAccent, { backgroundColor: themeColor }]} />
              
              <View style={styles.cardHeader}>
                <Text style={styles.topicText}>{topicData.title}</Text>
                <View style={[styles.moduleBadge, { backgroundColor: `${themeColor}20` }]}>
                   <Text style={[styles.moduleBadgeText, { color: themeColor }]}>
                     {topicData.lessons.length} UNITS
                   </Text>
                </View>
              </View>

              <View style={styles.lessonList}>
                {topicData.lessons.slice(0, 3).map((lesson: any) => (
                  <View key={lesson.id} style={styles.lessonItem}>
                    <Ionicons name="flash" size={14} color={themeColor} style={{ opacity: 0.8 }} />
                    <Text style={styles.lessonTitleText} numberOfLines={1}>
                      {lesson.title}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity 
                style={[styles.startBtn, { backgroundColor: themeColor }]} 
                onPress={() => handleTopicPress(topicKey)}
              >
                <Text style={styles.startBtnText}>Unlock Session</Text>
                <Ionicons name="lock-open" size={18} color={COLORS.DARK_BG} />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {/* Modern Time Selection Popup */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.timerIconContainer, { backgroundColor: `${themeColor}15` }]}>
              <Ionicons name="time" size={44} color={themeColor} />
            </View>
            <Text style={styles.modalTitle}>Commit Time</Text>
            <Text style={styles.modalSub}>
              "15 minutes a day keeps the confusion away."
            </Text>
            
            <View style={styles.buttonGroup}>
              {[5, 10, 15].map(mins => (
                <TouchableOpacity 
                  key={mins} 
                  style={[styles.timeBtn, { borderColor: `${themeColor}40` }]} 
                  onPress={() => startLessons(mins)}
                >
                  <Text style={[styles.timeBtnText, { color: COLORS.TEXT_MAIN }]}>{mins} Minutes</Text>
                  <Ionicons name="chevron-forward" size={18} color={themeColor} />
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
  return key === 'finance' ? COLORS.PRIMARY : COLORS.SECONDARY;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.DARK_BG },
  
  headerSection: { padding: 24, paddingTop: 10 },
  backBtn: { 
    width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.CARD_BG, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'
  },
  
  heading: { 
    fontSize: 38, 
    fontWeight: '900', 
    color: COLORS.TEXT_MAIN,
    letterSpacing: -1.5,
  },
  subheading: { fontSize: 16, color: COLORS.TEXT_SUB, marginTop: 4, letterSpacing: 0.2 },
  
  listPadding: { paddingHorizontal: 24, paddingBottom: 40 },
  
  card: { 
    padding: 24, 
    backgroundColor: COLORS.CARD_BG, 
    borderRadius: 32, 
    marginBottom: 20, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  topicText: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: COLORS.TEXT_MAIN, 
    flex: 1, 
    marginRight: 10,
    letterSpacing: -0.5
  },
  moduleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  moduleBadgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  
  lessonList: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 18, marginBottom: 20 },
  lessonItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  lessonTitleText: { flex: 1, fontSize: 15, color: '#CBD5E1', fontWeight: '500', marginLeft: 12, letterSpacing: 0.2 },
  
  startBtn: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 18, 
    borderRadius: 20, 
    gap: 10,
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  startBtnText: { color: COLORS.DARK_BG, fontWeight: '900', fontSize: 16, letterSpacing: -0.2 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.9)', justifyContent: 'flex-end' },
  modalContent: { 
    backgroundColor: COLORS.CARD_BG, 
    padding: 32, 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  timerIconContainer: { marginBottom: 20, padding: 24, borderRadius: 100 },
  modalTitle: { fontSize: 28, fontWeight: '900', color: COLORS.TEXT_MAIN, marginBottom: 8, letterSpacing: -1 },
  modalSub: { fontSize: 16, color: COLORS.TEXT_SUB, marginBottom: 32, textAlign: 'center', lineHeight: 24 },
  
  buttonGroup: { width: '100%' },
  timeBtn: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 22, 
    borderRadius: 24, 
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 12, 
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.02)'
  },
  timeBtnText: { fontWeight: '800', fontSize: 18, letterSpacing: -0.5 },
  
  closeBtn: { marginTop: 20, paddingBottom: 10 },
  cancelText: { color: COLORS.TEXT_SUB, fontWeight: '700', fontSize: 16 }
});