import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { QUIZ_DATA } from '../data/quizData';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

export default function QuizScreen() {
  const router = useRouter();
  const { addLessonXp, updateStreak } = useAuth();
  
  // 1. CATCH only the lessonId (Duration no longer needed for XP)
  const { lessonId, lessonTitle } = useLocalSearchParams<{ lessonId: string, lessonTitle: string }>();
  
  const questions = QUIZ_DATA[lessonId as string] || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [xpApplied, setXpApplied] = useState(false);

  // 2. ANSWER LOGIC
  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    
    if (index === questions[currentIndex].correct) {
      setScore(prev => prev + 1);
    }

    // Auto-advance after 800ms
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
      }
    }, 800);
  };

  // 3. FLAT XP CALCULATION
  const baseLessonXP = 10; // Flat rate per lesson
  const quizBonusXP = score * 5; // 5 XP per correct answer
  const totalEarned = baseLessonXP + quizBonusXP;

  // Once the lesson quiz is finished, add XP locally, sync it to the backend,
  // and update the user's streak for the day.
  useEffect(() => {
    if (!isFinished || xpApplied || totalEarned <= 0) return;

    let cancelled = false;

    (async () => {
      try {
        await addLessonXp(totalEarned, { sync: true });
        // Update streak in the background; failure here is non-fatal.
        await updateStreak();
        if (!cancelled) {
          setXpApplied(true);
        }
      } catch (e) {
        // Non-fatal: XP will just not be synced this time.
        console.warn('Failed to apply lesson XP', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [addLessonXp, isFinished, totalEarned, updateStreak, xpApplied]);

  // 4. RESULT SCREEN
  if (isFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="trophy" size={50} color="#FFD700" />
          </View>
          
          <Text style={styles.scoreTitle}>Snack Mastered!</Text>
          <Text style={styles.lessonSubtitle}>{lessonTitle}</Text>
          
          <View style={styles.xpBox}>
            <Text style={styles.xpValue}>+{totalEarned} XP</Text>
            <Text style={styles.xpLabel}>Total Rewards Earned</Text>
          </View>

          <View style={styles.breakdownContainer}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Lesson Completion</Text>
              <Text style={styles.breakdownValue}>+10 XP</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Quiz Bonus ({score} correct)</Text>
              <Text style={styles.breakdownValue}>+{quizBonusXP} XP</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.finishBtn} onPress={() => router.dismissAll()}>
            <Text style={styles.finishBtnText}>Continue Journey</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#A0AEC0" />
        </TouchableOpacity>
        <View style={styles.progressTrack}>
           <View style={[styles.progressFill, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.quizContent}>
        <Text style={styles.questionText}>{currentQ?.question}</Text>

        {currentQ?.options.map((option, index) => {
          const isCorrect = index === currentQ.correct;
          const isSelected = selectedOption === index;
          const showFeedback = selectedOption !== null;

          return (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.optionBtn,
                showFeedback && isCorrect && styles.correctBtn,
                showFeedback && isSelected && !isCorrect && styles.wrongBtn
              ]} 
              onPress={() => handleAnswer(index)}
              disabled={showFeedback}
            >
              <Text style={[styles.optionText, showFeedback && (isCorrect || isSelected) && { color: '#fff' }]}>
                {option}
              </Text>
              {showFeedback && isCorrect && <Ionicons name="checkmark-circle" size={24} color="#fff" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 15 },
  progressTrack: { flex: 1, height: 8, backgroundColor: '#E2E8F0', borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#48BB78' },
  quizContent: { flex: 1, paddingHorizontal: 25, paddingTop: 20 },
  questionText: { fontSize: 24, fontWeight: '800', marginBottom: 35, color: '#1A202C' },
  optionBtn: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, borderRadius: 18, backgroundColor: '#FFF', marginBottom: 12,
    borderWidth: 1, borderColor: '#EDF2F7', elevation: 1
  },
  optionText: { fontSize: 17, fontWeight: '600', color: '#4A5568' },
  correctBtn: { backgroundColor: '#48BB78', borderColor: '#48BB78' },
  wrongBtn: { backgroundColor: '#F56565', borderColor: '#F56565' },
  resultCard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFFBEB', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  scoreTitle: { fontSize: 28, fontWeight: '900', color: '#1A202C' },
  lessonSubtitle: { fontSize: 16, color: '#718096', marginBottom: 10 },
  xpBox: { backgroundColor: '#EBF8FF', padding: 25, borderRadius: 25, marginVertical: 25, alignItems: 'center', width: '100%' },
  xpValue: { fontSize: 44, fontWeight: '900', color: '#2B6CB0' },
  xpLabel: { fontSize: 14, color: '#4A5568', fontWeight: '700' },
  breakdownContainer: { width: '100%', marginBottom: 35 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 10 },
  breakdownLabel: { color: '#718096', fontWeight: '600' },
  breakdownValue: { color: '#2D3748', fontWeight: '800' },
  finishBtn: { backgroundColor: '#1A202C', paddingVertical: 20, width: '100%', borderRadius: 20, alignItems: 'center' },
  finishBtnText: { color: '#fff', fontWeight: '800', fontSize: 18 }
});