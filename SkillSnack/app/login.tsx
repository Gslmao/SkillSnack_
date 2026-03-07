import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export default function LoginScreen() {
  const router = useRouter();
  const { session, initializing, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length >= 6 && !loading;

  // If we already have a session restored from storage, skip the login screen.
  useEffect(() => {
    if (!initializing && session) {
      router.replace("/");
    }
  }, [initializing, session, router]);

  async function handleLogin() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          typeof json?.error === "string"
            ? json.error
            : "Unable to log in. Please check your details and try again.";
        setError(message);
        return;
      }

      if (!json?.user || !json?.session) {
        setError("Unexpected response from server. Please try again.");
        return;
      }

      // Persist the session so the user stays logged in across app restarts.
      await signIn({ user: json.user, session: json.session });

      router.replace("/");
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <View style={styles.logoIcon}>
            <Ionicons name="flash" size={22} color="#FFF" />
          </View>
          <Text style={styles.brandName}>
            Skill<Text style={styles.brandAccent}>Snack</Text>
          </Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Log in to continue your learning streak and keep earning XP.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#94A3B8"
                style={styles.inputIcon}
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#94A3B8"
                style={styles.inputIcon}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Minimum 6 characters"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                textContentType="password"
                style={styles.input}
              />
            </View>
          </View>

          {error ? (
            <View style={styles.errorPill}>
              <Ionicons name="alert-circle-outline" size={18} color="#B91C1C" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            disabled={!canSubmit}
            onPress={handleLogin}
            activeOpacity={0.9}
            style={[styles.primaryButton, !canSubmit && styles.primaryDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>Log in</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Continue as guest</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            New here? <Text style={styles.footerAccent}>Create an account</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    backgroundColor: "#0F172A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  logoIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#10B981",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    transform: [{ rotate: "-8deg" }],
  },
  brandName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F9FAFB",
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: "#9CA3AF",
    fontWeight: "400",
  },
  hero: {
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#F9FAFB",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#CBD5F5",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#0B1220",
    borderRadius: 28,
    padding: 22,
    shadowColor: "#0F172A",
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 6,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#F9FAFB",
  },
  primaryButton: {
    marginTop: 10,
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryDisabled: {
    backgroundColor: "#047857",
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E5E7EB",
  },
  errorPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  footerAccent: {
    color: "#F9FAFB",
    fontWeight: "600",
  },
});
