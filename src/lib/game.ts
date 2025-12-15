import type { Schema } from '@/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

/**
 * Game creation and management utilities
 */

export interface CreateGameParams {
  hostId: string;
  gameName?: string;
}

export interface GameWithCode {
  id: string;
  code: string;
  name: string;
  hostId: string;
  status: 'waiting' | 'active' | 'completed';
  maxPlayers: number;
  createdAt: string;
}

/**
 * Extract 5-character game code from game ID
 */
export function getGameCode(gameId: string): string {
  return gameId.substring(0, 5).toUpperCase();
}

/**
 * Create a new game and automatically join the host as the first player
 */
export async function createGame(
  params: CreateGameParams
): Promise<GameWithCode> {
  const client = generateClient<Schema>();
  const { hostId, gameName = 'New Game' } = params;

  try {
    // Create the game
    const gameResult = await client.models.Game.create({
      name: gameName,
      hostId,
      status: 'waiting',
      maxPlayers: 4,
      currentBattleNumber: 0,
      createdAt: new Date().toISOString()
    });

    if (!gameResult.data) {
      throw new Error('Failed to create game');
    }

    const game = gameResult.data;

    // Add the host as the first player
    const playerResult = await client.models.GamePlayer.create({
      gameId: game.id,
      userId: hostId,
      playerNumber: 1,
      score: 0,
      isReady: false,
      hasDefenseUpgrade: false,
      hasEconomyUpgrade: false,
      hasProgressCardsUpgrade: false,
      joinedAt: new Date().toISOString()
    });

    if (!playerResult.data) {
      throw new Error('Failed to add host as player');
    }

    return {
      id: game.id,
      code: getGameCode(game.id),
      name: game.name,
      hostId: game.hostId,
      status: game.status || 'waiting',
      maxPlayers: game.maxPlayers || 4,
      createdAt: game.createdAt || new Date().toISOString()
    };
  } catch (error) {
    console.error('[createGame] Error:', error);
    throw error;
  }
}

/**
 * Add an NPC player to a game
 */
export async function addNPCToGame(
  gameId: string,
  npcUserId: string,
  playerNumber: number
): Promise<void> {
  const client = generateClient<Schema>();

  try {
    const result = await client.models.GamePlayer.create({
      gameId,
      userId: npcUserId,
      playerNumber,
      score: 0,
      isReady: true, // NPCs are always ready
      hasDefenseUpgrade: false,
      hasEconomyUpgrade: false,
      hasProgressCardsUpgrade: false,
      joinedAt: new Date().toISOString()
    });

    if (!result.data) {
      throw new Error('Failed to add NPC to game');
    }
  } catch (error) {
    console.error('[addNPCToGame] Error:', error);
    throw error;
  }
}

/**
 * Search for a game by its 5-character code
 */
export async function findGameByCode(code: string): Promise<GameWithCode | null> {
  const client = generateClient<Schema>();

  try {
    // Get all games in 'waiting' status
    const result = await client.models.Game.list({
      filter: {
        status: {
          eq: 'waiting'
        }
      }
    });

    if (!result.data) {
      return null;
    }

    // Find game where the first 5 chars of ID match the code
    const upperCode = code.toUpperCase();
    const matchingGame = result.data.find((game) =>
      getGameCode(game.id) === upperCode
    );

    if (!matchingGame) {
      return null;
    }

    return {
      id: matchingGame.id,
      code: getGameCode(matchingGame.id),
      name: matchingGame.name,
      hostId: matchingGame.hostId,
      status: matchingGame.status || 'waiting',
      maxPlayers: matchingGame.maxPlayers || 4,
      createdAt: matchingGame.createdAt || new Date().toISOString()
    };
  } catch (error) {
    console.error('[findGameByCode] Error:', error);
    return null;
  }
}

/**
 * Join an existing game as a player
 */
export async function joinGame(gameId: string, userId: string): Promise<void> {
  const client = generateClient<Schema>();

  try {
    // Get current player count
    const playersResult = await client.models.GamePlayer.list({
      filter: {
        gameId: {
          eq: gameId
        }
      }
    });

    const currentPlayers = playersResult.data || [];
    const playerNumber = currentPlayers.length + 1;

    // Get game to check max players
    const gameResult = await client.models.Game.get({ id: gameId });
    const maxPlayers = gameResult.data?.maxPlayers || 4;

    if (currentPlayers.length >= maxPlayers) {
      throw new Error('Game is full');
    }

    // Add player to game
    const result = await client.models.GamePlayer.create({
      gameId,
      userId,
      playerNumber,
      score: 0,
      isReady: false,
      hasDefenseUpgrade: false,
      hasEconomyUpgrade: false,
      hasProgressCardsUpgrade: false,
      joinedAt: new Date().toISOString()
    });

    if (!result.data) {
      throw new Error('Failed to join game');
    }
  } catch (error) {
    console.error('[joinGame] Error:', error);
    throw error;
  }
}
