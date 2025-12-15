import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useGameLobby } from '@/hooks/useGameLobby';
import { useNPCUsers } from '@/hooks/useNPCUsers';
import { addNPCToGame } from '@/lib/game';
import { colors } from '@/utils/colors';

export default function LobbyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthUser();
  const { game, isLoading, error, refetch } = useGameLobby(id);
  const { npcs } = useNPCUsers();
  const [showNPCPicker, setShowNPCPicker] = useState(false);
  const [isAddingNPC, setIsAddingNPC] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading lobby...</Text>
      </View>
    );
  }

  if (error || !game) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load game lobby</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isHost = user?.id === game.hostId;
  const canAddNPC = isHost && game.players.length < game.maxPlayers;
  const usedNPCIds = new Set(
    game.players.filter((p) => p.isNPC).map((p) => p.userId)
  );
  const availableNPCs = npcs.filter((npc) => !usedNPCIds.has(npc.id));

  const handleAddNPC = async (npcId: string) => {
    setIsAddingNPC(true);
    try {
      const playerNumber = game.players.length + 1;
      await addNPCToGame(game.id, npcId, playerNumber);
      await refetch();
      setShowNPCPicker(false);
    } catch (error) {
      console.error('Failed to add NPC:', error);
      Alert.alert('Error', 'Failed to add NPC. Please try again.');
    } finally {
      setIsAddingNPC(false);
    }
  };

  const handleStartGame = () => {
    Alert.alert('Coming Soon', 'Game start functionality will be implemented next!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonHeader} onPress={() => router.back()}>
          <Text style={styles.backButtonHeaderText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Game Lobby</Text>
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Game Code:</Text>
          <Text style={styles.code}>{game.code}</Text>
        </View>
        <Text style={styles.subtitle}>{game.name}</Text>
      </View>

      <View style={styles.playersSection}>
        <Text style={styles.sectionTitle}>
          Players ({game.players.length}/{game.maxPlayers})
        </Text>

        <View style={styles.playersList}>
          {game.players.map((player, index) => (
            <View key={player.id} style={styles.playerCard}>
              <View style={styles.playerInfo}>
                <Text style={styles.playerNumber}>#{player.playerNumber}</Text>
                <Text style={styles.playerName}>
                  {player.displayName}
                  {player.isNPC && ' (NPC)'}
                  {player.userId === game.hostId && ' (Host)'}
                </Text>
              </View>
              {player.isReady && (
                <View style={styles.readyBadge}>
                  <Text style={styles.readyText}>Ready</Text>
                </View>
              )}
            </View>
          ))}

          {/* Empty slots */}
          {Array.from({ length: game.maxPlayers - game.players.length }).map((_, index) => (
            <View key={`empty-${index}`} style={styles.emptySlot}>
              <Text style={styles.emptySlotText}>Empty Slot</Text>
            </View>
          ))}
        </View>

        {canAddNPC && (
          <TouchableOpacity
            style={styles.addNPCButton}
            onPress={() => setShowNPCPicker(true)}
          >
            <Text style={styles.addNPCButtonText}>+ Add NPC</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actionsSection}>
        {isHost && (
          <TouchableOpacity
            style={[
              styles.primaryButton,
              game.players.length < 2 && styles.disabledButton
            ]}
            onPress={handleStartGame}
            disabled={game.players.length < 2}
          >
            <Text style={styles.primaryButtonText}>Start Game</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Leave Lobby</Text>
        </TouchableOpacity>
      </View>

      {/* NPC Picker Modal */}
      <Modal
        visible={showNPCPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNPCPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select NPC to Add</Text>

            {availableNPCs.length === 0 ? (
              <Text style={styles.noNPCsText}>No available NPCs</Text>
            ) : (
              <FlatList
                data={availableNPCs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.npcItem}
                    onPress={() => handleAddNPC(item.id)}
                    disabled={isAddingNPC}
                  >
                    <Text style={styles.npcName}>{item.displayName}</Text>
                    <Text style={styles.npcRating}>Rating: {item.rating}</Text>
                  </TouchableOpacity>
                )}
                style={styles.npcList}
              />
            )}

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowNPCPicker(false)}
              disabled={isAddingNPC}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    flex: 1
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
    marginBottom: 12
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  codeLabel: {
    fontSize: 16,
    color: colors.textSecondary
  },
  code: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 4
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary
  },
  playersSection: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16
  },
  playersList: {
    gap: 12
  },
  playerCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  playerNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    width: 30
  },
  playerName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600'
  },
  readyBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  readyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  emptySlot: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed'
  },
  emptySlotText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  addNPCButton: {
    marginTop: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary
  },
  addNPCButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold'
  },
  actionsSection: {
    padding: 20,
    gap: 12
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold'
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold'
  },
  disabledButton: {
    opacity: 0.5
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '70%'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center'
  },
  noNPCsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: 40
  },
  npcList: {
    marginBottom: 20
  },
  npcItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  npcName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4
  },
  npcRating: {
    fontSize: 14,
    color: colors.textSecondary
  },
  modalCancelButton: {
    backgroundColor: colors.background,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  modalCancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600'
  }
});
