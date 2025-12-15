import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useJoinableGames } from '@/hooks/useJoinableGames';
import { joinGame } from '@/lib/game';
import { colors } from '@/utils/colors';

export default function JoinGameScreen() {
  const router = useRouter();
  const { user } = useAuthUser();
  const { games, isLoading, error, refetch } = useJoinableGames();
  const [joiningGameId, setJoiningGameId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleJoinGame = async (gameId: string) => {
    if (!user) return;

    setJoiningGameId(gameId);
    try {
      await joinGame(gameId, user.id);
      router.push(`/lobby/${gameId}`);
    } catch (error) {
      console.error('Failed to join game:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to join game');
      setJoiningGameId(null);
    }
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading games...</Text>
      </View>
    );
  }

  if (error && !games.length) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load games</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonHeader} onPress={() => router.back()}>
          <Text style={styles.backButtonHeaderText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Join a Game</Text>
        <Text style={styles.subtitle}>
          {games.length} {games.length === 1 ? 'game' : 'games'} available
        </Text>
      </View>

      {games.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No games available</Text>
          <Text style={styles.emptySubtext}>
            Create a new game or wait for someone to start one
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.gameCard}
              onPress={() => handleJoinGame(item.id)}
              disabled={joiningGameId !== null || item.playerCount >= item.maxPlayers}
            >
              <View style={styles.gameHeader}>
                <View style={styles.codeContainer}>
                  <Text style={styles.codeLabel}>CODE:</Text>
                  <Text style={styles.code}>{item.code}</Text>
                </View>
                <View style={styles.playerCountBadge}>
                  <Text style={styles.playerCountText}>
                    {item.playerCount}/{item.maxPlayers}
                  </Text>
                </View>
              </View>

              <Text style={styles.gameName}>{item.name}</Text>
              <Text style={styles.hostName}>Host: {item.hostName}</Text>

              {joiningGameId === item.id ? (
                <View style={styles.joiningIndicator}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.joiningText}>Joining...</Text>
                </View>
              ) : item.playerCount >= item.maxPlayers ? (
                <View style={styles.fullBadge}>
                  <Text style={styles.fullText}>FULL</Text>
                </View>
              ) : (
                <View style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Join Game</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20
  },
  errorText: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  retryButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold'
  },
  backButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold'
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  backButtonHeader: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  backButtonHeaderText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24
  },
  listContent: {
    padding: 20,
    gap: 16
  },
  gameCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary
  },
  code: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 2
  },
  playerCountBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  playerCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text
  },
  gameName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4
  },
  hostName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  joinButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold'
  },
  joiningIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8
  },
  joiningText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600'
  },
  fullBadge: {
    backgroundColor: colors.background,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  fullText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: 'bold'
  }
});
