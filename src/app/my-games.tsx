import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useMyGames } from '@/hooks/useMyGames';
import { colors } from '@/utils/colors';

export default function MyGamesScreen() {
  const router = useRouter();
  const { user } = useAuthUser();
  const { games, isLoading, error, refetch } = useMyGames(user?.id || '');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleGamePress = (gameId: string) => {
    router.push(`/lobby/${gameId}`);
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your games...</Text>
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

  const waitingGames = games.filter((g) => g.status === 'waiting');
  const activeGames = games.filter((g) => g.status === 'active');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Games</Text>
        <Text style={styles.subtitle}>
          {games.length} {games.length === 1 ? 'game' : 'games'}
        </Text>
      </View>

      {games.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No active games</Text>
          <Text style={styles.emptySubtext}>
            Create a new game or join an existing one
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
              onPress={() => handleGamePress(item.id)}
            >
              <View style={styles.gameHeader}>
                <View>
                  <View style={styles.codeRow}>
                    <Text style={styles.codeLabel}>CODE:</Text>
                    <Text style={styles.code}>{item.code}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <View style={[
                      styles.statusDot,
                      item.status === 'active' ? styles.statusDotActive : styles.statusDotWaiting
                    ]} />
                    <Text style={styles.statusText}>
                      {item.status === 'waiting' ? 'In Lobby' : 'In Progress'}
                    </Text>
                  </View>
                </View>
                <View style={styles.playerCountBadge}>
                  <Text style={styles.playerCountText}>
                    {item.playerCount}/{item.maxPlayers}
                  </Text>
                </View>
              </View>

              <Text style={styles.gameName}>{item.name}</Text>

              <View style={styles.gameInfo}>
                <Text style={styles.infoLabel}>
                  {item.isHost ? '👑 You are hosting' : `Host: ${item.hostName}`}
                </Text>
                <Text style={styles.infoLabel}>
                  Player #{item.myPlayerNumber}
                </Text>
              </View>

              <View style={styles.continueButton}>
                <Text style={styles.continueButtonText}>
                  {item.status === 'waiting' ? 'View Lobby' : 'Continue Game'}
                </Text>
              </View>
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
          ListHeaderComponent={
            (waitingGames.length > 0 && activeGames.length > 0) ? (
              <View style={styles.sectionHeaders}>
                {waitingGames.length > 0 && (
                  <Text style={styles.sectionTitle}>
                    Waiting ({waitingGames.length})
                  </Text>
                )}
                {activeGames.length > 0 && (
                  <Text style={styles.sectionTitle}>
                    Active ({activeGames.length})
                  </Text>
                )}
              </View>
            ) : null
          }
        />
      )}
    </View>
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
  sectionHeaders: {
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8
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
    alignItems: 'flex-start',
    marginBottom: 12
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary
  },
  code: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 2
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  statusDotWaiting: {
    backgroundColor: '#FFA726'
  },
  statusDotActive: {
    backgroundColor: '#4CAF50'
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary
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
    marginBottom: 8
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  continueButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold'
  }
});
