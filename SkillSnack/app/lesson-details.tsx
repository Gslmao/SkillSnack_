// import { Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import React from 'react';
// import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { LESSON_DETAILS_CONTENT } from '../data/lessonContent';

// export default function LessonDetailsScreen() {
//   const router = useRouter();
//   const { lessonId, lessonTitle, topicTitle } = useLocalSearchParams<{ 
//     lessonId: string; 
//     lessonTitle: string; 
//     topicTitle: string; 
//   }>();

//   const content = LESSON_DETAILS_CONTENT[lessonId as string] || {
//     body: "Content is being prepared...",
//     tip: "Keep exploring!",
//     duration: "5" 
//   };

//   // Simple Text Styler: Handles **Bold Headers** and • Bullet Points
//   const renderContent = (text: string) => {
//     return text.split('\n').map((line, index) => {
//       const trimmed = line.trim();
      
//       if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
//         return <Text key={index} style={styles.sectionHeader}>{trimmed.replace(/\*\*/g, '')}</Text>;
//       }
      
//       if (trimmed.startsWith('•')) {
//         return (
//           <View key={index} style={styles.bulletRow}>
//             <Text style={styles.bulletSymbol}>•</Text>
//             <Text style={styles.bulletText}>{trimmed.replace('•', '').trim()}</Text>
//           </View>
//         );
//       }

//       if (trimmed.length > 0) {
//         return <Text key={index} style={styles.bodyText}>{trimmed}</Text>;
//       }

//       return <View key={index} style={{ height: 8 }} />;
//     });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />
      
//       {/* Header Navigation */}
//       <View style={styles.headerNav}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backCircle}>
//           <Ionicons name="arrow-back" size={20} color="#1E293B" />
//         </TouchableOpacity>
//         <View style={styles.progressCenter}>
//           <Text style={styles.breadcrumb}>{topicTitle?.toUpperCase()}</Text>
//           <View style={styles.progressBar}><View style={styles.progressFill} /></View>
//         </View>
//         <TouchableOpacity style={styles.backCircle}>
//           <Ionicons name="share-outline" size={18} color="#1E293B" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         {/* Title & Metadata */}
//         <View style={styles.titleSection}>
//           <View style={styles.tagRow}>
//             <View style={styles.categoryTag}><Text style={styles.tagText}>FINANCE</Text></View>
//             <Text style={styles.timeText}>{content.duration} MIN READ</Text>
//           </View>
//           <Text style={styles.title}>{lessonTitle}</Text>
//         </View>

//         {/* Styled Body Text */}
//         <View style={styles.contentContainer}>
//           {renderContent(content.body)}
//         </View>

//         {/* Tip/Insight Box */}
//         <View style={styles.infoBox}>
//           <View style={styles.tipHeader}>
//             <Ionicons name="sparkles" size={16} color="#F59E0B" />
//             <Text style={styles.tipLabel}>INSIGHT</Text>
//           </View>
//           <Text style={styles.tipText}>{content.tip}</Text>
//         </View>

//         {/* Action Button */}
//         <TouchableOpacity 
//           style={styles.quizBtn} 
//           activeOpacity={0.8}
//           onPress={() => router.push({ pathname: '/quiz-screen', params: { lessonId, lessonTitle, duration: content.duration } })}
//         >
//           <Text style={styles.quizBtnText}>Test Your Knowledge</Text>
//           <Ionicons name="chevron-forward" size={18} color="#FFF" />
//         </TouchableOpacity>
//         <Text style={styles.xpText}>Finish the quiz to earn +15 XP</Text>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FFF' },
//   headerNav: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
//   backCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
//   progressCenter: { flex: 1, alignItems: 'center' },
//   progressBar: { height: 4, width: 60, backgroundColor: '#E2E8F0', borderRadius: 2, marginTop: 4 },
//   progressFill: { height: '100%', width: '100%', backgroundColor: '#10B981', borderRadius: 2 },
//   breadcrumb: { fontSize: 10, color: '#94A3B8', fontWeight: '800' },
  
//   scrollContent: { padding: 24, paddingBottom: 40 },
//   titleSection: { marginBottom: 24 },
//   tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
//   categoryTag: { backgroundColor: '#1E293B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
//   tagText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
//   timeText: { color: '#64748B', fontSize: 10, fontWeight: '700' },
//   title: { fontSize: 32, fontWeight: '900', color: '#0F172A', lineHeight: 38 },

//   contentContainer: { marginBottom: 20 },
//   sectionHeader: { fontSize: 22, fontWeight: '800', color: '#1E293B', marginTop: 20, marginBottom: 8 },
//   bodyText: { fontSize: 18, lineHeight: 28, color: '#334155', marginBottom: 12 },
//   bulletRow: { flexDirection: 'row', marginBottom: 10, paddingLeft: 4 },
//   bulletSymbol: { fontSize: 20, color: '#10B981', marginRight: 10, fontWeight: 'bold' },
//   bulletText: { flex: 1, fontSize: 17, lineHeight: 26, color: '#475569' },

//   infoBox: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 16, marginBottom: 30, borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
//   tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
//   tipLabel: { fontSize: 12, fontWeight: '900', color: '#F59E0B' },
//   tipText: { fontSize: 15, color: '#475569', lineHeight: 22 },

//   quizBtn: { backgroundColor: '#10B981', padding: 20, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
//   quizBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
//   xpText: { textAlign: 'center', color: '#94A3B8', fontSize: 12, marginTop: 12, fontWeight: '600' }
// });
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LESSON_DETAILS_CONTENT } from '../data/lessonContent';

const { width } = Dimensions.get('window');

// Midnight Premium Palette
const COLORS = {
  PRIMARY: '#10B981',      // Neon Comical Green
  SECONDARY: '#38BDF8',    // Electric Sky Blue
  DARK_BG: '#0F172A',      // Deep Midnight Navy
  CARD_BG: '#1E293B',      // Slate Navy for Cards
  TEXT_MAIN: '#F8FAFC',    // Off-White (Anti-Glare)
  TEXT_SUB: '#94A3B8',     // Muted Slate
  PILL_BG: 'rgba(56, 189, 248, 0.15)', // Transparent Blue
  AMBER: '#F59E0B'         // Tip Accent
};

export default function LessonDetailsScreen() {
  const router = useRouter();
  const { lessonId, lessonTitle, topicTitle } = useLocalSearchParams<{ 
    lessonId: string; 
    lessonTitle: string; 
    topicTitle: string; 
  }>();

  const content = LESSON_DETAILS_CONTENT[lessonId as string] || {
    body: "Prepping your lesson...",
    tip: "Stay curious!",
    animation: null,
    visualSteps: []
  };

  const renderInteractiveStory = (text: string) => {
    return text.split('\n').map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return <View key={index} style={{ height: 18 }} />;

      if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
        return (
          <View key={index} style={styles.chapterHeaderContainer}>
            <View style={styles.chapterBar} />
            <Text style={styles.chapterTitle}>{trimmed.replace(/\*/g, '')}</Text>
          </View>
        );
      }

      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      return (
        <Text key={index} style={styles.bodyText}>
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <Text key={i} style={styles.pillText}>
                  {part.replace(/\*\*/g, '')}
                </Text>
              );
            }
            return part;
          })}
        </Text>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Premium Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconCircle}>
          <Ionicons name="chevron-back" size={24} color={COLORS.TEXT_MAIN} />
        </TouchableOpacity>
        <View style={styles.progressTrack}>
           <Text style={styles.progressLabel}>{topicTitle?.toUpperCase() || 'FINANCE'}</Text>
           <View style={styles.progressEmpty}><View style={styles.progressFill} /></View>
        </View>
        <View style={styles.iconCircle}>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.TEXT_MAIN} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>{lessonTitle || "The Basics"}</Text>

        {/* Hero Visual Card */}
        {content.animation && (
          <View style={styles.heroCard}>
            <LottieView source={content.animation} autoPlay loop style={styles.heroLottie} />
          </View>
        )}

        {/* Story Section */}
        <View style={styles.storyCard}>
          {renderInteractiveStory(content.body)}
        </View>

        {/* Concept Breakout Cards */}
        {content.visualSteps && content.visualSteps.length > 0 && (
          <View style={styles.stepsContainer}>
            {content.visualSteps.map((step) => (
              <View key={step.id} style={styles.stepCard}>
                <View style={styles.stepIconWrapper}>
                  {step.animation ? (
                    <LottieView source={step.animation} autoPlay loop style={styles.miniLottie} />
                  ) : (
                    <Ionicons name={step.icon as any || 'flash'} size={24} color={COLORS.SECONDARY} />
                  )}
                </View>
                <View style={styles.stepTextWrapper}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Insight Banner */}
        <View style={styles.insightBanner}>
          <View style={styles.insightIconBox}>
             <Ionicons name="bulb" size={20} color={COLORS.AMBER} />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.insightLabel}>PRO TIP</Text>
            <Text style={styles.insightText}>{content.tip}</Text>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity 
          style={styles.ctaButton} 
          onPress={() => router.push({ pathname: '/quiz-screen', params: { lessonId } })}
        >
          <Text style={styles.ctaText}>Start Knowledge Check</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.DARK_BG} />
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.DARK_BG },
  
  // Header
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' },
  iconCircle: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.CARD_BG, justifyContent: 'center', alignItems: 'center' },
  progressTrack: { alignItems: 'center' },
  
  // FONT STYLE: "Overline" style for metadata
  progressLabel: { 
    fontSize: 11, 
    fontWeight: '900', 
    color: COLORS.TEXT_SUB, 
    marginBottom: 4, 
    letterSpacing: 2, // Extra wide tracking for that premium feel
    textTransform: 'uppercase' 
  },
  progressEmpty: { height: 4, width: 100, backgroundColor: '#334155', borderRadius: 2 },
  progressFill: { height: '100%', width: '70%', backgroundColor: COLORS.PRIMARY, borderRadius: 2 },

  scrollArea: { padding: 24 },

  // FONT STYLE: "Inter-style" Bold Header
  mainTitle: { 
    fontSize: 38, 
    fontWeight: '900', 
    color: COLORS.TEXT_MAIN, 
    marginBottom: 24, 
    letterSpacing: -1.5, // Tighter letters make it look more "designed"
    lineHeight: 42
  },

  // Hero Card
  heroCard: { width: '100%', height: 230, backgroundColor: COLORS.CARD_BG, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  heroLottie: { width: '85%', height: '85%' },

  // Story Styling
  storyCard: { backgroundColor: 'rgba(30, 41, 59, 0.4)', padding: 22, borderRadius: 28, marginBottom: 30 },
  chapterHeaderContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  chapterBar: { width: 4, height: 24, backgroundColor: COLORS.PRIMARY, borderRadius: 2, marginRight: 12 },
  
  // FONT STYLE: Secondary Heading
  chapterTitle: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: COLORS.PRIMARY, 
    letterSpacing: -0.5 
  },

  // FONT STYLE: The "Clean Code" Body
  bodyText: { 
    fontSize: 18, 
    lineHeight: 32, // More vertical space makes the font look different
    color: '#CBD5E1', 
    fontWeight: '500', 
    letterSpacing: 0.3,
    fontFamily: 'System' // iOS/Android will use their most modern variable font
  },
  
  // FONT STYLE: Contrast Highlight
  pillText: { 
    color: COLORS.SECONDARY, 
    fontWeight: '900',
    textTransform: 'uppercase', // Making highlights uppercase gives it a "tag" look
    fontSize: 16
  },

  // Step Cards
  stepsContainer: { marginBottom: 32 },
  stepCard: { flexDirection: 'row', backgroundColor: COLORS.CARD_BG, padding: 20, borderRadius: 28, marginBottom: 16, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'rgba(0,0,0,0.2)' },
  stepIconWrapper: { width: 56, height: 56, backgroundColor: COLORS.DARK_BG, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  miniLottie: { width: '100%', height: '100%' },
  stepTextWrapper: { flex: 1, marginLeft: 16 },
  
  stepTitle: { fontSize: 18, fontWeight: '800', color: COLORS.TEXT_MAIN, letterSpacing: -0.3 },
  stepDesc: { fontSize: 14, color: COLORS.TEXT_SUB, lineHeight: 22, marginTop: 4, fontWeight: '400' },

  // Banner
  insightBanner: { flexDirection: 'row', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 24, borderRadius: 28, marginBottom: 40, borderStyle: 'dashed', borderWidth: 1, borderColor: COLORS.AMBER },
  insightIconBox: { width: 44, height: 44, backgroundColor: COLORS.AMBER, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  insightLabel: { fontSize: 11, fontWeight: '900', color: COLORS.AMBER, marginBottom: 2, letterSpacing: 1 },
  insightText: { fontSize: 16, color: '#FDE68A', fontWeight: '600', lineHeight: 24 },

  // CTA Button
  ctaButton: { 
    backgroundColor: COLORS.PRIMARY, 
    paddingVertical: 22, 
    borderRadius: 28, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 12,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10
  },
  ctaText: { 
    color: COLORS.DARK_BG, 
    fontSize: 20, 
    fontWeight: '900', 
    letterSpacing: -0.5 
  }
});