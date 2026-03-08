// import { Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { QUIZ_DATA } from '../data/quizData';

// const CORRECT_SFX = require('./correct.mpeg');
// const WRONG_SFX = require('./wrong.mpeg');
// const FINISH_SFX = require('./levelup.mpeg');

// const COLORS = {
//   PRIMARY: '#10B981',
//   ERROR: '#EF4444',
//   DARK_BG: '#0F172A',
//   CARD_BG: '#1E293B',
//   TEXT_MAIN: '#F8FAFC',
//   TEXT_SUB: '#94A3B8',
//   ACCENT: '#38BDF8',
// };

// export default function QuizScreen() {
//   const router = useRouter();
//   const { lessonId, lessonTitle } = useLocalSearchParams<{ lessonId: string; lessonTitle: string }>();

//   const questions = QUIZ_DATA[lessonId as string] || [];
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState<number | null>(null);
//   const [score, setScore] = useState(0);
//   const [isFinished, setIsFinished] = useState(false);

//   // Sound Objects State
//   const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
//   const [wrongSound, setWrongSound] = useState<Audio.Sound | null>(null);
//   const [finishSound, setFinishSound] = useState<Audio.Sound | null>(null);

//   // Load all sounds on mount
//   useEffect(() => {
//     async function loadSounds() {
//       try {
//         const { sound: cSound } = await Audio.Sound.createAsync(CORRECT_SFX);
//         const { sound: wSound } = await Audio.Sound.createAsync(WRONG_SFX);
//         const { sound: fSound } = await Audio.Sound.createAsync(FINISH_SFX);
        
//         setCorrectSound(cSound);
//         setWrongSound(wSound);
//         setFinishSound(fSound);
//       } catch (error) {
//         console.error("Failed to load sounds", error);
//       }
//     }

//     loadSounds();

//     return () => {
//       correctSound?.unloadAsync();
//       wrongSound?.unloadAsync();
//       finishSound?.unloadAsync();
//     };
//   }, []);

//   // Play Level Up sound as soon as the quiz finishes
//   useEffect(() => {
//     if (isFinished && finishSound) {
//       finishSound.replayAsync();
//     }
//   }, [isFinished, finishSound]);

//   const handleAnswer = async (index: number) => {
//     if (selectedOption !== null) return;
//     setSelectedOption(index);

//     const isCorrect = index === questions[currentIndex].correct;

//     if (isCorrect) {
//       setScore((prev) => prev + 1);
//       await correctSound?.replayAsync(); 
//     } else {
//       await wrongSound?.replayAsync();
//     }

//     setTimeout(() => {
//       if (currentIndex < questions.length - 1) {
//         setCurrentIndex((prev) => prev + 1);
//         setSelectedOption(null);
//       } else {
//         setIsFinished(true); // Triggers the play sound useEffect
//       }
//     }, 800);
//   };

//   const baseLessonXP = 10;
//   const quizBonusXP = score * 5;
//   const totalEarned = baseLessonXP + quizBonusXP;

//   if (isFinished) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <StatusBar barStyle="light-content" />
//         <View style={styles.resultCard}>
//           <View style={styles.iconCircle}>
//             <Ionicons name="trophy" size={54} color="#FFD700" />
//           </View>
//           <Text style={styles.scoreTitle}>Snack Mastered!</Text>
//           <Text style={styles.lessonSubtitle}>{lessonTitle}</Text>
//           <View style={styles.xpBox}>
//             <Text style={styles.xpValue}>+{totalEarned} XP</Text>
//             <Text style={styles.xpLabel}>TOTAL REWARDS EARNED</Text>
//           </View>
//           <View style={styles.breakdownContainer}>
//             <View style={styles.breakdownRow}>
//               <Text style={styles.breakdownLabel}>Lesson Completion</Text>
//               <Text style={styles.breakdownValue}>+10 XP</Text>
//             </View>
//             <View style={styles.breakdownRow}>
//               <Text style={styles.breakdownLabel}>Quiz Bonus ({score} correct)</Text>
//               <Text style={styles.breakdownValue}>+{quizBonusXP} XP</Text>
//             </View>
//           </View>
//           <TouchableOpacity style={styles.finishBtn} onPress={() => router.dismissAll()}>
//             <Text style={styles.finishBtnText}>Continue Journey</Text>
//             <Ionicons name="chevron-forward" size={20} color={COLORS.DARK_BG} />
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   const currentQ = questions[currentIndex];

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
//           <Ionicons name="close" size={24} color={COLORS.TEXT_SUB} />
//         </TouchableOpacity>
//         <View style={styles.progressTrack}>
//           <View style={[styles.progressFill, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]} />
//         </View>
//         <Text style={styles.counterText}>{currentIndex + 1}/{questions.length}</Text>
//       </View>
//       <View style={styles.quizContent}>
//         <Text style={styles.questionText}>{currentQ?.question}</Text>
//         {currentQ?.options.map((option, index) => {
//           const isCorrect = index === currentQ.correct;
//           const isSelected = selectedOption === index;
//           const showFeedback = selectedOption !== null;
//           return (
//             <TouchableOpacity
//               key={index}
//               activeOpacity={0.9}
//               style={[
//                 styles.optionBtn,
//                 showFeedback && isCorrect && styles.correctBtn,
//                 showFeedback && isSelected && !isCorrect && styles.wrongBtn,
//                 !showFeedback && isSelected && styles.activeBorder,
//               ]}
//               onPress={() => handleAnswer(index)}
//               disabled={showFeedback}
//             >
//               <Text style={[styles.optionText, showFeedback && (isCorrect || isSelected) && { color: COLORS.DARK_BG }]}>
//                 {option}
//               </Text>
//               {showFeedback && isCorrect && <Ionicons name="checkmark-circle" size={24} color={COLORS.DARK_BG} />}
//               {showFeedback && isSelected && !isCorrect && <Ionicons name="close-circle" size={24} color={COLORS.DARK_BG} />}
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.DARK_BG },
//   header: { flexDirection: 'row', alignItems: 'center', padding: 24, gap: 15 },
//   closeBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.CARD_BG, justifyContent: 'center', alignItems: 'center' },
//   progressTrack: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' },
//   progressFill: { height: '100%', backgroundColor: COLORS.PRIMARY },
//   counterText: { color: COLORS.TEXT_SUB, fontWeight: '800', fontSize: 14, letterSpacing: 1 },
//   quizContent: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
//   questionText: { fontSize: 28, fontWeight: '900', marginBottom: 40, color: COLORS.TEXT_MAIN, letterSpacing: -1, lineHeight: 36 },
//   optionBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 22, borderRadius: 24, backgroundColor: COLORS.CARD_BG, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
//   optionText: { fontSize: 17, fontWeight: '700', color: COLORS.TEXT_MAIN, letterSpacing: -0.3 },
//   activeBorder: { borderColor: COLORS.ACCENT },
//   correctBtn: { backgroundColor: COLORS.PRIMARY, borderColor: COLORS.PRIMARY },
//   wrongBtn: { backgroundColor: COLORS.ERROR, borderColor: COLORS.ERROR },
//   resultCard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
//   iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255, 215, 0, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.3)' },
//   scoreTitle: { fontSize: 32, fontWeight: '900', color: COLORS.TEXT_MAIN, letterSpacing: -1.5 },
//   lessonSubtitle: { fontSize: 16, color: COLORS.TEXT_SUB, marginBottom: 10, fontWeight: '600' },
//   xpBox: { backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: 30, borderRadius: 32, marginVertical: 30, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.2)' },
//   xpValue: { fontSize: 52, fontWeight: '900', color: COLORS.ACCENT, letterSpacing: -2 },
//   xpLabel: { fontSize: 11, color: COLORS.ACCENT, fontWeight: '900', letterSpacing: 2, marginTop: 4 },
//   breakdownContainer: { width: '100%', marginBottom: 40 },
//   breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 15 },
//   breakdownLabel: { color: COLORS.TEXT_SUB, fontWeight: '600', fontSize: 15 },
//   breakdownValue: { color: COLORS.TEXT_MAIN, fontWeight: '800', fontSize: 15 },
//   finishBtn: { backgroundColor: COLORS.PRIMARY, paddingVertical: 22, width: '100%', borderRadius: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, shadowColor: COLORS.PRIMARY, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
//   finishBtnText: { color: COLORS.DARK_BG, fontWeight: '900', fontSize: 18, letterSpacing: -0.5 }
// });

import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { QUIZ_DATA } from '../data/quizData';
import { learningData } from '../data/learningData';
import { useAuth } from '@/context/AuthContext';

// 1. Requirements at top level for Metro bundler
const CORRECT_SFX = require('./correct.mpeg');
const WRONG_SFX = require('./wrong.mpeg');
const FINISH_SFX = require('./levelup.mpeg');

const COLORS = {
  PRIMARY: '#10B981',
  ERROR: '#EF4444',
  DARK_BG: '#0F172A',
  CARD_BG: '#1E293B',
  TEXT_MAIN: '#F8FAFC',
  TEXT_SUB: '#94A3B8',
  ACCENT: '#38BDF8',
};

export default function QuizScreen() {
  const router = useRouter();
  const {
    lessonId,
    lessonTitle,
    topicTitle,
    categoryKey,
    topicKey,
    timeLimit,
  } = useLocalSearchParams<{
    lessonId: string;
    lessonTitle?: string;
    topicTitle?: string;
    categoryKey?: string;
    topicKey?: string;
    timeLimit?: string;
  }>();
  const { addLessonXp } = useAuth();

  const questions = QUIZ_DATA[lessonId as string] || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Sound Objects State
  const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
  const [wrongSound, setWrongSound] = useState<Audio.Sound | null>(null);
  const [finishSound, setFinishSound] = useState<Audio.Sound | null>(null);

  // Load all sounds on mount
  useEffect(() => {
    async function loadSounds() {
      try {
        const { sound: cSound } = await Audio.Sound.createAsync(CORRECT_SFX);
        const { sound: wSound } = await Audio.Sound.createAsync(WRONG_SFX);
        const { sound: fSound } = await Audio.Sound.createAsync(FINISH_SFX);
        
        setCorrectSound(cSound);
        setWrongSound(wSound);
        setFinishSound(fSound);
      } catch (error) {
        console.error("Failed to load sounds", error);
      }
    }

    loadSounds();

    return () => {
      correctSound?.unloadAsync();
      wrongSound?.unloadAsync();
      finishSound?.unloadAsync();
    };
  }, []);

  // Play Level Up sound as soon as the quiz finishes
  useEffect(() => {
    if (isFinished && finishSound) {
      finishSound.replayAsync();
    }
  }, [isFinished, finishSound]);

  const handleAnswer = async (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);

    const isCorrect = index === questions[currentIndex].correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      await correctSound?.replayAsync(); 
    } else {
      await wrongSound?.replayAsync();
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true); // Triggers the play sound useEffect
      }
    }, 800);
  };

  const baseLessonXP = 10;
  const quizBonusXP = score * 5;
  const totalEarned = baseLessonXP + quizBonusXP;

  const handleContinueJourney = () => {
    if (!categoryKey || !topicKey) {
      router.replace('/');
      return;
    }
    const category = learningData[categoryKey as keyof typeof learningData];
    const topic = category?.topics?.[topicKey as keyof typeof category.topics] as { title?: string; lessons?: { id: string; title: string }[] } | undefined;
    const allLessons = topic?.lessons ?? [];
    const minutes = parseInt(timeLimit ?? '5', 10);
    const limit = Math.floor(minutes / 5);
    const unlocked = allLessons.slice(0, limit);
    const currentIndex = unlocked.findIndex((l) => l.id === lessonId);
    const nextLesson = currentIndex >= 0 && currentIndex + 1 < unlocked.length ? unlocked[currentIndex + 1] : null;
    if (nextLesson) {
      router.replace({
        pathname: '/lesson-details',
        params: {
          lessonId: nextLesson.id,
          lessonTitle: nextLesson.title,
          topicTitle: topicTitle ?? topic?.title ?? '',
          categoryKey,
          topicKey,
          timeLimit: timeLimit ?? '5',
        },
      });
    } else {
      router.replace('/');
    }
  };

  // Award XP once when the quiz is finished - add locally without syncing yet
  // XP will be synced when user returns home
  useEffect(() => {
    if (!isFinished) return;
    if (!lessonId) return;

    const lessonKey = String(lessonId);
    const amount = totalEarned;
    if (!Number.isFinite(amount) || amount <= 0) return;

    (async () => {
      try {
        // Add XP locally without syncing immediately
        // sync: false means it will be added to pendingXp and synced when returning home
        await addLessonXp(amount, { sync: false, lessonId: lessonKey });
      } catch (e) {
        console.warn('Failed to award lesson XP', e);
      }
    })();
  }, [isFinished, lessonId, totalEarned, addLessonXp]);

  if (isFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.resultCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="trophy" size={54} color="#FFD700" />
          </View>
          <Text style={styles.scoreTitle}>Snack Mastered!</Text>
          <Text style={styles.lessonSubtitle}>{lessonTitle}</Text>
          <View style={styles.xpBox}>
            <Text style={styles.xpValue}>+{totalEarned} XP</Text>
            <Text style={styles.xpLabel}>TOTAL REWARDS EARNED</Text>
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
          <TouchableOpacity style={styles.finishBtn} onPress={handleContinueJourney}>
            <Text style={styles.finishBtnText}>Continue Journey</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.DARK_BG} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={COLORS.TEXT_SUB} />
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]} />
        </View>
        <Text style={styles.counterText}>{currentIndex + 1}/{questions.length}</Text>
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
              activeOpacity={0.9}
              style={[
                styles.optionBtn,
                showFeedback && isCorrect && styles.correctBtn,
                showFeedback && isSelected && !isCorrect && styles.wrongBtn,
                !showFeedback && isSelected && styles.activeBorder,
              ]}
              onPress={() => handleAnswer(index)}
              disabled={showFeedback}
            >
              <Text style={[styles.optionText, showFeedback && (isCorrect || isSelected) && { color: COLORS.DARK_BG }]}>
                {option}
              </Text>
              {showFeedback && isCorrect && <Ionicons name="checkmark-circle" size={24} color={COLORS.DARK_BG} />}
              {showFeedback && isSelected && !isCorrect && <Ionicons name="close-circle" size={24} color={COLORS.DARK_BG} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.DARK_BG },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24, gap: 15 },
  closeBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.CARD_BG, justifyContent: 'center', alignItems: 'center' },
  progressTrack: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.PRIMARY },
  counterText: { color: COLORS.TEXT_SUB, fontWeight: '800', fontSize: 14, letterSpacing: 1 },
  quizContent: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  questionText: { fontSize: 28, fontWeight: '900', marginBottom: 40, color: COLORS.TEXT_MAIN, letterSpacing: -1, lineHeight: 36 },
  optionBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 22, borderRadius: 24, backgroundColor: COLORS.CARD_BG, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  optionText: { fontSize: 17, fontWeight: '700', color: COLORS.TEXT_MAIN, letterSpacing: -0.3 },
  activeBorder: { borderColor: COLORS.ACCENT },
  correctBtn: { backgroundColor: COLORS.PRIMARY, borderColor: COLORS.PRIMARY },
  wrongBtn: { backgroundColor: COLORS.ERROR, borderColor: COLORS.ERROR },
  resultCard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255, 215, 0, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.3)' },
  scoreTitle: { fontSize: 32, fontWeight: '900', color: COLORS.TEXT_MAIN, letterSpacing: -1.5 },
  lessonSubtitle: { fontSize: 16, color: COLORS.TEXT_SUB, marginBottom: 10, fontWeight: '600' },
  xpBox: { backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: 30, borderRadius: 32, marginVertical: 30, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.2)' },
  xpValue: { fontSize: 52, fontWeight: '900', color: COLORS.ACCENT, letterSpacing: -2 },
  xpLabel: { fontSize: 11, color: COLORS.ACCENT, fontWeight: '900', letterSpacing: 2, marginTop: 4 },
  breakdownContainer: { width: '100%', marginBottom: 40 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 15 },
  breakdownLabel: { color: COLORS.TEXT_SUB, fontWeight: '600', fontSize: 15 },
  breakdownValue: { color: COLORS.TEXT_MAIN, fontWeight: '800', fontSize: 15 },
  finishBtn: { backgroundColor: COLORS.PRIMARY, paddingVertical: 22, width: '100%', borderRadius: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, shadowColor: COLORS.PRIMARY, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
  finishBtnText: { color: COLORS.DARK_BG, fontWeight: '900', fontSize: 18, letterSpacing: -0.5 }
});