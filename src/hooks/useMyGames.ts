import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { getGameCode } from '@/lib/game';

export interface MyGame {
  id: string;
  code: string;
  name: string;
  hostId: string;
  hostName: string;
  status: 'waiting' | 'active' | 'completed';
  playerCount: number;
  maxPlayers: number;
  myPlayerNumber: number;
  isHost: boolean;
  createdAt: string;
}

/**
 * Hook for fetching all games the current user is participating in
 */
export function useMyGames(userId: string) {
  const [games, setGames] = useState<MyGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGames = async () => {
    const client = generateClient<Schema>();

    try {
      setIsLoading(true);

      // Find all GamePlayer entries for this user
      const playerResult = await client.models.GamePlayer.list({
        filter: {
          userId: {
            eq: userId
          }
        }
      });

      const userGameParticipations = playerResult.data || [];

      if (userGameParticipations.length === 0) {
        setGames([]);
        setError(null);
        setIsLoading(false);
        return;
      }

      // Fetch game details for each participation
      const gamesWithDetails = await Promise.all(
        userGameParticipations.map(async (participation) => {
          // Get game info
          const gameResult = await client.models.Game.get({ id: participation.gameId });
          const game = gameResult.data;

          if (!game) return null;

          // Only include games that are waiting or active (not completed)
          if (game.status === 'completed') return null;

          // Get all players for this game
          const playersResult = await client.models.GamePlayer.list({
            filter: {
              gameId: {
                eq: game.id
              }
            }
          });
          const playerCount = playersResult.data?.length || 0;

          // Get host info
          const hostResult = await client.models.User.get({ id: game.hostId });
          const hostName = hostResult.data?.displayName || hostResult.data?.firstName || 'Unknown';

          return {
            id: game.id,
            code: getGameCode(game.id),
            name: game.name,
            hostId: game.hostId,
            hostName,
            status: game.status || 'waiting',
            playerCount,
            maxPlayers: game.maxPlayers || 4,
            myPlayerNumber: participation.playerNumber || 0,
            isHost: game.hostId === userId,
            createdAt: game.createdAt || new Date().toISOString()
          } as MyGame;
        })
      );

      // Filter out nulls and sort by creation date (newest first)
      const validGames = gamesWithDetails.filter((g): g is MyGame => g !== null);
      validGames.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setGames(validGames);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch games');
      setError(error);
      console.error('[useMyGames] Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGames();
    }
  }, [userId]);

  return {
    games,
    isLoading,
    error,
    refetch: fetchGames
  };
}
