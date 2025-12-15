import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { getGameCode } from '@/lib/game';

export interface JoinableGame {
  id: string;
  code: string;
  name: string;
  hostId: string;
  hostName: string;
  playerCount: number;
  maxPlayers: number;
  createdAt: string;
}

/**
 * Hook for fetching all games that can be joined (waiting status)
 */
export function useJoinableGames() {
  const [games, setGames] = useState<JoinableGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGames = async () => {
    const client = generateClient<Schema>();

    try {
      setIsLoading(true);

      // Fetch all games with waiting status
      const gamesResult = await client.models.Game.list({
        filter: {
          status: {
            eq: 'waiting'
          }
        }
      });

      if (!gamesResult.data) {
        setGames([]);
        return;
      }

      // Fetch player counts and host info for each game
      const gamesWithDetails = await Promise.all(
        gamesResult.data.map(async (game) => {
          // Get player count
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
            playerCount,
            maxPlayers: game.maxPlayers || 4,
            createdAt: game.createdAt || new Date().toISOString()
          };
        })
      );

      // Sort by creation date (newest first)
      gamesWithDetails.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setGames(gamesWithDetails);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch games');
      setError(error);
      console.error('[useJoinableGames] Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return {
    games,
    isLoading,
    error,
    refetch: fetchGames
  };
}
