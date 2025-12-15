import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { getGameCode } from '@/lib/game';

export interface LobbyPlayer {
  id: string;
  userId: string;
  displayName: string;
  playerNumber: number;
  isReady: boolean;
  isNPC: boolean;
}

export interface LobbyGame {
  id: string;
  code: string;
  name: string;
  hostId: string;
  status: string;
  maxPlayers: number;
  players: LobbyPlayer[];
}

/**
 * Hook for managing game lobby data
 */
export function useGameLobby(gameId: string) {
  const [game, setGame] = useState<LobbyGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGameData = async () => {
    const client = generateClient<Schema>();

    try {
      setIsLoading(true);

      // Fetch game
      const gameResult = await client.models.Game.get({ id: gameId });
      if (!gameResult.data) {
        throw new Error('Game not found');
      }

      const gameData = gameResult.data;

      // Fetch players
      const playersResult = await client.models.GamePlayer.list({
        filter: {
          gameId: {
            eq: gameId
          }
        }
      });

      const gamePlayers = playersResult.data || [];

      // Fetch user data for each player
      const playersWithUserData = await Promise.all(
        gamePlayers.map(async (gp) => {
          const userResult = await client.models.User.get({ id: gp.userId });
          const userData = userResult.data;

          return {
            id: gp.id,
            userId: gp.userId,
            displayName: userData?.displayName || userData?.firstName || 'Unknown',
            playerNumber: gp.playerNumber || 0,
            isReady: gp.isReady || false,
            isNPC: userData?.role === 13
          };
        })
      );

      // Sort by player number
      playersWithUserData.sort((a, b) => a.playerNumber - b.playerNumber);

      setGame({
        id: gameData.id,
        code: getGameCode(gameData.id),
        name: gameData.name,
        hostId: gameData.hostId,
        status: gameData.status || 'waiting',
        maxPlayers: gameData.maxPlayers || 4,
        players: playersWithUserData
      });

      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch game data');
      setError(error);
      console.error('[useGameLobby] Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, [gameId]);

  return {
    game,
    isLoading,
    error,
    refetch: fetchGameData
  };
}
