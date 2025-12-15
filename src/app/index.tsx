import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthUser } from '../hooks/useAuthUser';
import { useCreateGame } from '../hooks/useCreateGame';
import { colors, cardColors } from '../utils/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { user, updateDisplayName } = useAuthUser();
  const { createGame, isCreating } = useCreateGame();
  const [showEditName, setShowEditName] = useState(false);
  const [newName, setNewName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) {
    return null; // This won't render because _layout.tsx handles the loading/error states
  }

  const handleUpdateName = async () => {
    if (!newName.trim()) return;

    setIsUpdating(true);
    try {
      await updateDisplayName(newName.trim());
      setShowEditName(false);
      setNewName('');
    } catch (error) {
      console.error('Failed to update name:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNewGame = async () => {
    try {
      const game = await createGame(user.id);
      if (game) {
        router.push(`/lobby/${game.id}`);
      } else {
        Alert.alert('Error', 'Failed to create game. Please try again.');
      }
    } catch (error) {
      console.error('Error creating game:', error);
      Alert.alert('Error', 'Failed to create game. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Treasures of Titan</Text>
        <Text style={styles.subtitle}>A Strategic Card Battle Game</Text>
      </View>

      <View style={styles.userCard}>
        <Text style={styles.userLabel}>Welcome,</Text>
        <Text style={styles.userName}>{user.displayName || user.firstName || 'Player'}</Text>
        <TouchableOpacity
          style={styles.editNameButton}
          onPress={() => {
            setNewName(user.displayName || user.firstName || '');
            setShowEditName(true);
          }}
        >
          <Text style={styles.editNameButtonText}>Change Name</Text>
        </TouchableOpacity>
        <Text style={styles.userRating}>Rating: {user.rating}</Text>
      </View>

      <TouchableOpacity
        style={styles.myGamesButton}
        onPress={() => router.push('/my-games')}
      >
        <Text style={styles.myGamesButtonText}>📋 My Games</Text>
      </TouchableOpacity>

      <View style={styles.colorPreview}>
        <Text style={styles.colorPreviewTitle}>Card Colors</Text>
        <View style={styles.colorRow}>
          <View style={[styles.colorSwatch, { backgroundColor: cardColors.purple }]} />
          <View style={[styles.colorSwatch, { backgroundColor: cardColors.orange }]} />
          <View style={[styles.colorSwatch, { backgroundColor: cardColors.blue }]} />
          <View style={[styles.colorSwatch, { backgroundColor: cardColors.yellow }]} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleNewGame}
          disabled={isCreating}
        >
          {isCreating ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.primaryButtonText}>New Game</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/join-game')}
        >
          <Text style={styles.secondaryButtonText}>Join Game</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showEditName}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditName(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Display Name</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter your name"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowEditName(false)}
                disabled={isUpdating}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleUpdateName}
                disabled={isUpdating || !newName.trim()}
              >
                {isUpdating ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text style={styles.modalSaveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center'
  },
  userCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  userLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12
  },
  editNameButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 12
  },
  editNameButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600'
  },
  userRating: {
    fontSize: 16,
    color: colors.textSecondary
  },
  myGamesButton: {
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  myGamesButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold'
  },
  colorPreview: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center'
  },
  colorPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12
  },
  colorSwatch: {
    width: 60,
    height: 60,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4
  },
  buttonContainer: {
    gap: 16
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
    borderColor: colors.primary
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border
  },
  modalCancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600'
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.primary
  },
  modalSaveButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600'
  }
});
