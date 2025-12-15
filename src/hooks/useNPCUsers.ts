import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

export interface NPCUser {
  id: string;
  displayName: string;
  rating: number;
}

/**
 * Hook for fetching available NPC users
 */
export function useNPCUsers() {
  const [npcs, setNpcs] = useState<NPCUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchNPCs() {
      const client = generateClient<Schema>();

      try {
        setIsLoading(true);

        const result = await client.models.User.list({
          filter: {
            role: {
              eq: 13
            }
          }
        });

        const npcUsers = (result.data || []).map((user) => ({
          id: user.id,
          displayName: user.displayName || user.firstName || 'Unknown NPC',
          rating: user.rating || 1200
        }));

        // Sort by display name
        npcUsers.sort((a, b) => a.displayName.localeCompare(b.displayName));

        setNpcs(npcUsers);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch NPCs');
        setError(error);
        console.error('[useNPCUsers] Error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNPCs();
  }, []);

  return {
    npcs,
    isLoading,
    error
  };
}
