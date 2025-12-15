import { generateClient } from 'aws-amplify/data';
import { useEffect, useState } from 'react';
import type { Schema } from '../../amplify/data/resource';
import { generateDisplayName, getOrCreateUserUuid } from '../lib/user-identity';

interface AuthUser {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  role: number;
  awsSub: string;
  rating: number;
}

type AmplifyClient = ReturnType<typeof generateClient<Schema>>;

function throwIfErrors(errors: { message: string }[] | null | undefined, prefix: string): void {
  if (errors && errors.length > 0) {
    throw new Error(`${prefix}: ${errors[0].message}`);
  }
}

/**
 * Fetches or creates an anonymous user
 */
async function fetchOrCreateAnonymousUser(client: AmplifyClient): Promise<AuthUser> {
  const uuid = await getOrCreateUserUuid();
  const getResult = await client.models.User.get({ id: uuid });

  if (getResult.data) {
    return getResult.data as AuthUser;
  }

  // Create new anonymous user
  const displayName = generateDisplayName(uuid);
  const createResult = await client.models.User.create({
    id: uuid,
    email: `${displayName}@anonymous.local`,
    firstName: displayName,
    lastName: null,
    displayName: displayName,
    role: 9, // Anonymous user role
    awsSub: 'anonymous',
    rating: 1200
  });

  throwIfErrors(createResult.errors, 'Failed to create user');

  if (!createResult.data) {
    throw new Error('User creation returned no data');
  }

  return createResult.data as AuthUser;
}

/**
 * Hook to manage anonymous user authentication
 * For now, this only handles anonymous users
 * Future enhancement: Add Cognito authentication support
 */
export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setIsLoading(true);
        setError(null);

        const client = generateClient<Schema>();
        const authUser = await fetchOrCreateAnonymousUser(client);

        setUser(authUser);
      } catch (err) {
        console.error('[useAuthUser] Error:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  /**
   * Updates the user's display name
   */
  const updateDisplayName = async (newDisplayName: string): Promise<void> => {
    if (!user) {
      throw new Error('No user to update');
    }

    try {
      const client = generateClient<Schema>();
      const updateResult = await client.models.User.update({
        id: user.id,
        displayName: newDisplayName,
        firstName: newDisplayName
      });

      throwIfErrors(updateResult.errors, 'Failed to update display name');

      if (updateResult.data) {
        setUser(updateResult.data as AuthUser);
      }
    } catch (err) {
      console.error('[useAuthUser] Update error:', err);
      throw err;
    }
  };

  return {
    user,
    isLoading,
    error,
    updateDisplayName
  };
}
