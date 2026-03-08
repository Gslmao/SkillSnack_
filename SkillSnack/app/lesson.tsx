// import { Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import React from 'react';
// import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { learningData } from '../data/learningData';

// export default function LessonScreen() {
//   const router = useRouter();
//   const { categoryKey, topicKey, timeLimit } = useLocalSearchParams<{ 
//     categoryKey: string; 
//     topicKey: string; 
//     timeLimit: string 
//   }>();

//   // 1. Data Retrieval
//   const category = learningData[categoryKey as keyof typeof learningData];
//   const topic = category?.topics[topicKey as keyof typeof category.topics] as any;
//   const allLessons = topic?.lessons || [];

//   // 2. Unlock Logic: 1 lesson per 5 mins
//   const minutes = parseInt(timeLimit || "5");
//   const limit = Math.floor(minutes / 5);
//   const unlocked = allLessons.slice(0, limit);

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.heading}>{topic?.title || "Lessons"}</Text>
//         <View style={styles.badgeRow}>
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>{minutes} MIN SESSION</Text>
//           </View>
//           <Text style={styles.subtext}>{unlocked.length} modules unlocked</Text>
//         </View>
//       </View>
      
//       <FlatList
//         data={unlocked}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.list}
//         renderItem={({ item, index }) => (
//           <TouchableOpacity 
//             style={styles.lessonCard} 
//             onPress={() => router.push({
//               pathname: '/lesson-details',
//               params: { 
//                 lessonId: item.id, 
//                 lessonTitle: item.title,
//                 topicTitle: topic?.title 
//               }
//             })}
//           >
//             <View style={styles.indexCircle}>
//               <Text style={styles.indexText}>{index + 1}</Text>
//             </View>
//             <View style={styles.cardInfo}>
//               <Text style={styles.lessonTitle}>{item.title}</Text>
//               <Text style={styles.lessonMeta}>5 minute snack</Text>
//             </View>
//             <Ionicons name="play-circle" size={24} color="#007AFF" />
//           </TouchableOpacity>
//         )}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   header: { padding: 25, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
//   heading: { fontSize: 28, fontWeight: '900', color: '#1a1a1a' },
//   badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
//   badge: { backgroundColor: '#E3F2FD', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginRight: 10 },
//   badgeText: { color: '#007AFF', fontSize: 12, fontWeight: 'bold' },
//   subtext: { color: '#666', fontSize: 14 },
//   list: { padding: 20 },
//   lessonCard: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     backgroundColor: '#F8F9FA', 
//     padding: 18, 
//     borderRadius: 16, 
//     marginBottom: 12 
//   },
//   indexCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
//   indexText: { fontWeight: 'bold', color: '#555' },
//   cardInfo: { flex: 1, marginLeft: 15 },
//   lessonTitle: { fontSize: 17, fontWeight: '700', color: '#333' },
//   lessonMeta: { fontSize: 13, color: '#888', marginTop: 2 }
// });

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { learningData } from '../data/learningData';

// Syncing with your LessonDetails Palette
const COLORS = {
  PRIMARY: '#10B981',      // Neon Comical Green
  SECONDARY: '#38BDF8',    // Electric Sky Blue
  DARK_BG: '#0F172A',      // Deep Midnight Navy
  CARD_BG: '#1E293B',      // Slate Navy for Cards
  TEXT_MAIN: '#F8FAFC',    // Off-White
  TEXT_SUB: '#94A3B8',     // Muted Slate
};

export default function LessonScreen() {
  const router = useRouter();
  const { categoryKey, topicKey, timeLimit } = useLocalSearchParams<{ 
    categoryKey: string; 
    topicKey: string; 
    timeLimit: string 
  }>();

  const category = learningData[categoryKey as keyof typeof learningData];
  const topic = category?.topics[topicKey as keyof typeof category.topics] as any;
  const allLessons = topic?.lessons || [];

  const minutes = parseInt(timeLimit || "5");
  const limit = Math.floor(minutes / 5);
  const unlocked = allLessons.slice(0, limit);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Premium Dark Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           <Ionicons name="chevron-back" size={24} color={COLORS.TEXT_MAIN} />
        </TouchableOpacity>
        
        <Text style={styles.heading}>{topic?.title || "Modules"}</Text>
        
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{minutes} MIN SESSION</Text>
          </View>
          <Text style={styles.subtext}>{unlocked.length} units unlocked</Text>
        </View>
      </View>
      
      <FlatList
        data={unlocked}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={styles.lessonCard} 
            activeOpacity={0.8}
            onPress={() => router.push({
              pathname: '/lesson-details',
              params: { 
                lessonId: item.id, 
                lessonTitle: item.title,
                topicTitle: topic?.title,
                categoryKey,
                topicKey,
                timeLimit: timeLimit || '5',
              }
            })}
          >
            {/* Index with Neon Accent */}
            <View style={styles.indexContainer}>
              <Text style={styles.indexText}>0{index + 1}</Text>
              <View style={styles.indexDot} />
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={14} color={COLORS.TEXT_SUB} />
                <Text style={styles.lessonMeta}>5 min read</Text>
              </View>
            </View>

            <View style={styles.playCircle}>
               <Ionicons name="play" size={16} color={COLORS.DARK_BG} />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.DARK_BG },
  
  // Header Styling
  header: { padding: 24, paddingTop: 20 },
  backButton: { marginBottom: 16, width: 40 },
  
  heading: { 
    fontSize: 36, 
    fontWeight: '900', 
    color: COLORS.TEXT_MAIN,
    letterSpacing: -1.5, // Tight "Inter-style" font look
  },
  
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  badge: { 
    backgroundColor: 'rgba(16, 185, 129, 0.15)', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 8, 
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)'
  },
  badgeText: { 
    color: COLORS.PRIMARY, 
    fontSize: 11, 
    fontWeight: '900', 
    letterSpacing: 1 
  },
  subtext: { 
    color: COLORS.TEXT_SUB, 
    fontSize: 13, 
    fontWeight: '600',
    letterSpacing: 0.2 
  },

  // List & Card Styling
  list: { padding: 20, paddingBottom: 40 },
  
  lessonCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.CARD_BG, 
    padding: 20, 
    borderRadius: 24, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    // Shadow for Android/iOS
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  indexContainer: { alignItems: 'center', marginRight: 18 },
  indexText: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: COLORS.PRIMARY, 
    fontFamily: 'System' 
  },
  indexDot: { 
    width: 4, 
    height: 4, 
    borderRadius: 2, 
    backgroundColor: COLORS.SECONDARY, 
    marginTop: 2 
  },

  cardInfo: { flex: 1 },
  lessonTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: COLORS.TEXT_MAIN,
    letterSpacing: -0.5,
    marginBottom: 4
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  lessonMeta: { 
    fontSize: 13, 
    color: COLORS.TEXT_SUB, 
    fontWeight: '600' 
  },

  playCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: COLORS.PRIMARY, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: 10
  }
});