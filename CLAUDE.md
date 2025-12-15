# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Treasures of Titan** is a mobile-app representation of a physical board game. This is an Expo-based React Native application that digitizes the board game experience, allowing players to compete in card-based battles using their mobile devices.

This is a **duplication project** - we are recreating an existing board game app using modern technologies:
- **Old implementation**: AngularJS + Firebase (located in `old_app/` directory - **NEVER edit or import from this directory**)
- **New implementation**: Expo + React Native + AWS Amplify Gen 2 + TypeScript (following the architecture defined in `duplication_guide/`)

The `old_app/` directory exists **solely as a reference** to understand the game's original implementation and purpose. All new code should follow the modern stack defined in the duplication guide.

## Critical Board Game Terminology

When working with this codebase, it's essential to understand board game terminology commonly used on sites like Board Game Geek:

- **Card**: The digital equivalent of a physical playing card that someone holds in their hand when playing the game
  - Example: A player's "card" might have a value, color, or special ability
  - NOT a UI card component or information card

- **Hand**: The act of "holding" physical playing cards that other players cannot see
  - Example: "Cards in a player's hand" = cards only visible to that player
  - NOT a gesture or touch interaction

- **Play a card**: To move a card from your hand onto the board/table where it becomes visible to everyone
  - Example: "Playing a card" = revealing and using a card from your private hand
  - This is a core game mechanic, not a UI interaction

- **Deck**: A player's collection of cards (may include held cards and played cards)

- **Board**: The shared game space visible to all players where played cards appear

- **Battle**: A round where players submit cards to compete

These terms are standard in board game design and should be interpreted in their board game context, not as generic UI/UX terminology.

## Game Description

Based on the original implementation, Treasures of Titan is a card-based battle game where:
- Players have decks containing cards with values, colors, and ranks
- Players select cards from their hand to submit for battles
- There are shared resources available to all players
- Players compete in battles, with the system tracking battle outcomes
- The game supports multiple players in real-time

Some have suggested this game is similar to the card game "Splendor" by Space Cowboys.

## Development Approach

This project should be built **in stages**, with git commits at each major milestone. When implementing features:

1. **Ask questions** along the way if anything is unclear
2. **Commit changes in stages** - don't wait until everything is done
3. **Follow the duplication guide** (`duplication_guide/new_project_duplication_guide.md`) for architectural patterns
4. **Reference the old_app** to understand game mechanics, but never copy code directly
5. **Use modern best practices** from the duplication guide (React Query, TypeScript, Amplify Gen 2)

## Technology Stack

See `duplication_guide/new_project_duplication_guide.md` for the complete technology stack. Key technologies:

- **Expo SDK 54** - React Native framework with managed workflow
- **React Native 0.81.5** - Mobile development framework
- **TypeScript 5.9.2** - Type-safe JavaScript
- **Expo Router 6.0** - File-based routing system
- **AWS Amplify Gen 2** - Backend infrastructure
- **AWS Cognito** - Authentication (email/password)
- **AWS AppSync** - GraphQL API (via Amplify Data)
- **AWS DynamoDB** - NoSQL database (via Amplify Data)
- **React Query (@tanstack/react-query 5.90)** - Server state management
- **React Context** - Client state management
- **Biome 2.3.8** - Linting and formatting
- **Jest 29.7** - Testing framework

## Project Structure

This project should follow the structure defined in `duplication_guide/new_project_duplication_guide.md`:

```
treasures-of-titan/
├── app/                          # Expo Router pages (file-based routing)
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Home page (/)
│   └── [dynamic].tsx            # Dynamic routes
│
├── src/                          # Application code
│   ├── components/              # React components
│   │   ├── common/              # Reusable UI components
│   │   ├── screens/             # Screen-level components
│   │   │   └── parts/           # Screen sub-components
│   │   └── navigation/          # Navigation components
│   │
│   ├── controllers/             # React Query hooks (data layer)
│   │   ├── c-game.ts           # Game queries/mutations
│   │   ├── c-player.ts         # Player queries/mutations
│   │   └── c-battle.ts         # Battle queries/mutations
│   │
│   ├── models/                  # Domain models (extend API types)
│   │   ├── m-game.ts           # Game model
│   │   ├── m-player.ts         # Player model
│   │   ├── m-card.ts           # Card model
│   │   └── m-battle.ts         # Battle model
│   │
│   ├── providers/               # React Context providers
│   │   ├── game.tsx            # Game context
│   │   └── player.tsx          # Player context
│   │
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Utility functions
│   │   ├── styles.ts           # Global styles
│   │   ├── colors.ts           # Color palette
│   │   └── helpers.ts          # Helper functions
│   │
│   ├── types/                   # TypeScript type definitions
│   ├── lib/                     # Third-party library configs
│   └── axios/                   # REST API layer (if needed)
│
├── amplify/                      # Amplify Gen 2 backend
│   ├── auth/
│   │   └── resource.ts
│   ├── data/
│   │   └── resource.ts
│   └── backend.ts
│
├── __tests__/                    # Test files
├── __mocks__/                    # Jest mocks
├── assets/                       # Static assets
├── ai_reports/                   # AI-generated documentation
│
├── duplication_guide/           # Reference architecture (DO NOT EDIT)
├── old_app/                     # Original AngularJS app (DO NOT EDIT OR IMPORT)
│
├── amplify-config.ts            # Amplify configuration
├── App.tsx                       # Entry point
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                # TypeScript config
├── biome.jsonc                  # Biome config
├── jest.config.js               # Jest config
└── jest.setup.js                # Jest setup
```

## Important Conventions

### Naming Conventions

**Files**:
- `kebab-case.ts` for most files
- `PascalCase.tsx` for React components
- `[param].tsx` for Expo Router dynamic routes
- Prefix models with `m-` (e.g., `m-card.ts`, `m-player.ts`)
- Prefix controllers with `c-` (e.g., `c-game.ts`, `c-battle.ts`)

**Components**:
- PascalCase for component names
- Descriptive names (e.g., `BattleCard`, `PlayerHand`, not generic `Card` or `List`)

**Types**:
- Prefix interfaces/types with `M` for models (e.g., `MCard`, `MPlayer`, `MBattle`)
- Use `Props` suffix for component props (e.g., `BattleCardProps`)

### Code Style

- **Single quotes**: Preferred for strings
- **Trailing commas**: Recommended for multi-line structures
- **Styling**: Uses React Native StyleSheet and inline styles (no CSS-in-JS libraries)
- See `duplication_guide/reference/ai_reports/REFACTORING_PREFERENCES.md` for detailed style guidelines

## Architectural Patterns

This project follows the **Model-Controller-Provider** pattern defined in the duplication guide:

### 1. Model Pattern (M prefix)

Models extend GraphQL API types with computed properties and business logic.

**Location**: `src/models/`

**Example**: `m-card.ts`

```typescript
import type { Schema } from '../../amplify/data/resource';

// Base API type
type Card = Schema['Card']['type'];

// Extended model with computed properties
export interface MCard extends Card {
  isPlayable: boolean;
  displayName: string;
  baseCard: Card;
}

// Factory function to create model instances
export function getMCard({ card }: { card: Card }): MCard {
  return {
    ...card,
    baseCard: card,

    // Computed property
    get isPlayable() {
      return card.value > 0 && !card.isPlayed;
    },

    // Computed property
    get displayName() {
      return `${card.color} ${card.value}`;
    }
  };
}
```

### 2. Controller Pattern (C prefix)

Controllers are React Query hooks for data fetching and mutations.

**Location**: `src/controllers/`

**Example**: `c-battle.ts`

```typescript
import { generateClient } from 'aws-amplify/data';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Schema } from '../../amplify/data/resource';
import { getMBattle, type MBattle } from '../models/m-battle';

const client = generateClient<Schema>();

// Query hook
export function useBattleQuery(battleId: string) {
  return useQuery({
    queryKey: ['battle', battleId],
    queryFn: async () => {
      const { data, errors } = await client.models.Battle.get({ id: battleId });

      if (errors) {
        throw new Error(errors[0]?.message || 'Failed to fetch battle');
      }

      if (!data) {
        throw new Error('Battle not found');
      }

      return getMBattle({ battle: data });
    },
    enabled: !!battleId
  });
}

// Mutation hook
export function useSubmitCardsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ battleId, cardIds }: { battleId: string; cardIds: string[] }) => {
      // Submit cards logic
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['battle', data.id] });
    }
  });
}
```

### 3. Provider Pattern

Providers manage global state via React Context.

**Location**: `src/providers/`

See `duplication_guide/new_project_duplication_guide.md` for detailed examples.

## Development Workflow

### Initial Setup

Follow the duplication guide step-by-step:

1. Create Expo project with TypeScript
2. Install all dependencies
3. Copy configuration files (tsconfig.json, biome.jsonc, jest.config.js)
4. Set up Amplify Gen 2 backend
5. Configure project structure

### Running the App

```bash
# Terminal 1: Start Amplify sandbox (backend)
npm run amplify:sandbox

# Terminal 2: Start Expo (frontend)
npm start

# Then press 'i' for iOS or 'a' for Android
```

### Testing

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

### Code Quality

```bash
npx biome check --write  # Format and lint
npx biome format --write # Format only
npx biome lint           # Lint only
```

## Key Resources

1. **Duplication Guide**: `duplication_guide/new_project_duplication_guide.md` - Complete setup and architecture guide
2. **Reference CLAUDE.md**: `duplication_guide/reference/CLAUDE.md` - Example project documentation
3. **Refactoring Preferences**: `duplication_guide/reference/ai_reports/REFACTORING_PREFERENCES.md` - Code style guidelines
4. **Old App**: `old_app/` - Original implementation (reference only, **DO NOT EDIT OR IMPORT**)

## Git Workflow

Commit changes **in stages** throughout the duplication process:

- Initial setup (package.json, dependencies)
- Configuration files (tsconfig, biome, jest)
- Amplify backend setup
- Models implementation
- Controllers implementation
- Components implementation
- Each major feature completion

Use descriptive commit messages that explain what stage of duplication is complete.

## Questions and Clarifications

When in doubt:
- **Ask questions** about game mechanics or implementation details
- **Reference the duplication guide** for architectural patterns
- **Look at old_app** to understand the original game flow
- **Follow the established patterns** from the reference implementation

This is a collaborative process - questions are encouraged and expected along the way!

## AI Reports

When generating technical documentation or reports during development, place them in `ai_reports/` directory and update the index for easy reference.
