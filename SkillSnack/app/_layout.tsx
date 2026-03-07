import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* 'index' is your CategoryScreen */}
        <Stack.Screen name="index" options={{ title: 'Categories' }} />
        
        {/* 'topic' is your TopicScreen */}
        <Stack.Screen name="topic" options={{ title: 'Topics' }} />
        
        {/* 'lesson' is your LessonScreen */}
        <Stack.Screen name="lesson" options={{ title: 'Lessons' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}