import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LESSON_DETAILS_CONTENT } from '../data/lessonContent';

export default function LessonDetailsScreen() {
  const router = useRouter();
  const { lessonId, lessonTitle, topicTitle } = useLocalSearchParams<{ 
    lessonId: string; 
    lessonTitle: string; 
    topicTitle: string; 
  }>();

  const content = LESSON_DETAILS_CONTENT[lessonId as string] || {
    body: "Content is being prepared...",
    tip: "Keep exploring!",
    duration: "5" 
  };

  // Simple Text Styler: Handles **Bold Headers** and • Bullet Points
  const renderContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return <Text key={index} style={styles.sectionHeader}>{trimmed.replace(/\*\*/g, '')}</Text>;
      }
      
      if (trimmed.startsWith('•')) {
        return (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bulletSymbol}>•</Text>
            <Text style={styles.bulletText}>{trimmed.replace('•', '').trim()}</Text>
          </View>
        );
      }

      if (trimmed.length > 0) {
        return <Text key={index} style={styles.bodyText}>{trimmed}</Text>;
      }

      return <View key={index} style={{ height: 8 }} />;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Navigation */}
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backCircle}>
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.progressCenter}>
          <Text style={styles.breadcrumb}>{topicTitle?.toUpperCase()}</Text>
          <View style={styles.progressBar}><View style={styles.progressFill} /></View>
        </View>
        <TouchableOpacity style={styles.backCircle}>
          <Ionicons name="share-outline" size={18} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title & Metadata */}
        <View style={styles.titleSection}>
          <View style={styles.tagRow}>
            <View style={styles.categoryTag}><Text style={styles.tagText}>FINANCE</Text></View>
            <Text style={styles.timeText}>{content.duration} MIN READ</Text>
          </View>
          <Text style={styles.title}>{lessonTitle}</Text>
        </View>

        {/* Styled Body Text */}
        <View style={styles.contentContainer}>
          {renderContent(content.body)}
        </View>

        {/* Tip/Insight Box */}
        <View style={styles.infoBox}>
          <View style={styles.tipHeader}>
            <Ionicons name="sparkles" size={16} color="#F59E0B" />
            <Text style={styles.tipLabel}>INSIGHT</Text>
          </View>
          <Text style={styles.tipText}>{content.tip}</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.quizBtn} 
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: '/quiz-screen', params: { lessonId, lessonTitle, duration: content.duration } })}
        >
          <Text style={styles.quizBtnText}>Test Your Knowledge</Text>
          <Ionicons name="chevron-forward" size={18} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.xpText}>Finish the quiz to earn +15 XP</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerNav: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  progressCenter: { flex: 1, alignItems: 'center' },
  progressBar: { height: 4, width: 60, backgroundColor: '#E2E8F0', borderRadius: 2, marginTop: 4 },
  progressFill: { height: '100%', width: '100%', backgroundColor: '#10B981', borderRadius: 2 },
  breadcrumb: { fontSize: 10, color: '#94A3B8', fontWeight: '800' },
  
  scrollContent: { padding: 24, paddingBottom: 40 },
  titleSection: { marginBottom: 24 },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  categoryTag: { backgroundColor: '#1E293B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  timeText: { color: '#64748B', fontSize: 10, fontWeight: '700' },
  title: { fontSize: 32, fontWeight: '900', color: '#0F172A', lineHeight: 38 },

  contentContainer: { marginBottom: 20 },
  sectionHeader: { fontSize: 22, fontWeight: '800', color: '#1E293B', marginTop: 20, marginBottom: 8 },
  bodyText: { fontSize: 18, lineHeight: 28, color: '#334155', marginBottom: 12 },
  bulletRow: { flexDirection: 'row', marginBottom: 10, paddingLeft: 4 },
  bulletSymbol: { fontSize: 20, color: '#10B981', marginRight: 10, fontWeight: 'bold' },
  bulletText: { flex: 1, fontSize: 17, lineHeight: 26, color: '#475569' },

  infoBox: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 16, marginBottom: 30, borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  tipLabel: { fontSize: 12, fontWeight: '900', color: '#F59E0B' },
  tipText: { fontSize: 15, color: '#475569', lineHeight: 22 },

  quizBtn: { backgroundColor: '#10B981', padding: 20, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  quizBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  xpText: { textAlign: 'center', color: '#94A3B8', fontSize: 12, marginTop: 12, fontWeight: '600' }
});