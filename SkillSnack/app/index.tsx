import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { learningData } from '../data/learningData';

export default function CategoryScreen() {
  const router = useRouter();

  // Convert the object keys into an array: ['finance', 'science', 'maths']
  const categoriesArray = Object.entries(learningData);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose a Category</Text>
      <FlatList
        data={categoriesArray}
        keyExtractor={([key]) => key}
        renderItem={({ item }) => {
          const [key, value] = item;
          return (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push({ 
                pathname: '/topic', 
                params: { categoryKey: key } 
              })}
            >
              <Text style={styles.cardText}>{value.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
  heading: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 25, backgroundColor: '#f8f9fa', borderRadius: 15, marginBottom: 15, elevation: 2 },
  cardText: { fontSize: 18, fontWeight: '600' }
});