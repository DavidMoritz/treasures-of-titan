import { useState } from 'react';
import { createGame, type GameWithCode } from '@/lib/game';

/**
 * Hook for creating a new game
 */
export function useCreateGame() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (hostId: string, gameName?: string): Promise<GameWithCode | null> => {
    setIsCreating(true);
    setError(null);

    try {
      const game = await createGame({ hostId, gameName });
      return game;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create game');
      setError(error);
      console.error('[useCreateGame] Error:', error);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createGame: create,
    isCreating,
    error
  };
}
