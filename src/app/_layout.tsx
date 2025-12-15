import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { configureAmplify } from '../lib/amplify-config';
import { useAuthUser } from '../hooks/useAuthUser';
import { colors } from '../utils/colors';

/**
 * Root layout component
 * Initializes Amplify and provides authentication context
 */
export default function RootLayout() {
  useEffect(() => {
    configureAmplify();
  }, []);

  const { user, isLoading, error } = useAuthUser();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 16, color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: 20 }}>
        <Text style={{ color: colors.error, fontSize: 16, textAlign: 'center' }}>
          Error loading user: {error.message}
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.text }}>No user found</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary
        },
        headerTintColor: colors.background,
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Treasures of Titan',
          headerShown: true
        }}
      />
    </Stack>
  );
}
