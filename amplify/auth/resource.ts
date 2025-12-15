import { defineAuth } from '@aws-amplify/backend';

/**
 * Treasures of Titan Authentication
 * Email/password authentication for turn-based gameplay
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true
  },
  userAttributes: {
    email: {
      required: true,
      mutable: true
    },
    givenName: {
      required: false,
      mutable: true
    },
    familyName: {
      required: false,
      mutable: true
    }
  },
  accountRecovery: 'EMAIL_ONLY',
  multifactor: {
    mode: 'OFF'
  }
  // Email verification disabled for faster development
  // Enable in production by adding: autoVerifiedAttributes: ['email']
});
