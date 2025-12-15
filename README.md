# Treasures of Titan

A mobile app representation of the Treasures of Titan board game, built with React Native and AWS Amplify.

## Overview

Treasures of Titan is a turn-based multiplayer strategy game where players compete in battles using cards from their hand, collect resources, and upgrade their corporations. This mobile app brings the physical board game experience to iOS and Android devices.

## Technology Stack

- **Framework**: Expo SDK 54 with React Native 0.81.5
- **Backend**: AWS Amplify Gen 2 (GraphQL, DynamoDB, Cognito)
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: Expo Router (file-based routing)
- **Language**: TypeScript
- **Linting/Formatting**: Biome
- **Testing**: Jest with React Testing Library

## Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- AWS account with appropriate permissions
- iOS Simulator (macOS) or Android Studio (for emulators)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Amplify Sandbox

The Amplify sandbox provides a cloud-based development environment:

```bash
npm run amplify:sandbox
```

This will deploy your backend resources (auth, API, database) to AWS and generate the necessary configuration files.

### 3. Start the Development Server

```bash
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## Project Structure

```
src/
├── app/              # Expo Router pages
├── components/       # Reusable UI components
├── models/          # Data models and types
├── controllers/     # Business logic layer
├── providers/       # Context providers
├── hooks/           # Custom React hooks
├── services/        # External service integrations
└── utils/           # Utility functions and constants

amplify/
├── auth/            # Cognito authentication config
├── data/            # GraphQL schema and resolvers
└── backend.ts       # Backend resource definitions
```

## Game Concepts

### Board Game Terminology

- **Card**: A digital playing card with specific attributes (color, value, type)
- **Hand**: Private cards that a player holds
- **Play a card**: Move a card from your hand to the battle area
- **Battle**: A round where players submit cards to compete
- **Resource**: Currency used to upgrade corporations (energy, food, lumber, mineral, wild)

### Card Types

- **Battle Cards**: Numbered 0-11 in four colors (purple, orange, blue, yellow)
- **Progress Cards**: Special abilities in four groups (alien, allied, military, native)

### Corporations

Players can upgrade five corporation types:
- Military
- Defense
- Utopia
- Resource Converter
- Shared Knowledge

## Development Workflow

### Running Tests

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # Coverage report
```

### Linting and Formatting

```bash
npm run lint          # Check code quality
npm run lint:fix      # Auto-fix issues
```

### Type Checking

```bash
npm run typecheck     # Run TypeScript compiler checks
```

### Deploying to Production

```bash
npm run amplify:deploy
```

## Architecture Patterns

This project follows the Model-Controller-Provider (MCP) pattern:

- **Models**: Define data structures and types
- **Controllers**: Handle business logic and state management
- **Providers**: Manage React context and global state

See `CLAUDE.md` for detailed architectural guidelines.

## Key Features

- Turn-based multiplayer gameplay
- Real-time game state synchronization
- User authentication with email/password
- Player rating system
- Corporation upgrades
- Resource management
- Battle submissions with card selection
- Progress card abilities

## Important Notes

- The `old_app/` directory contains reference code from the original AngularJS/Firebase implementation
- **Never edit or import from `old_app/`** - it's for reference only
- All new code should follow the modern stack patterns defined in this project

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Commit with descriptive messages
5. Push and create a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open a GitHub issue.
