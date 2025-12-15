import { a, type ClientSchema, defineData } from '@aws-amplify/backend';

/**
 * Treasures of Titan GraphQL Schema
 * Turn-based card battle game
 */
const schema = a.schema({
  // ============ USERS ============

  User: a
    .model({
      email: a.string().required(),
      firstName: a.string(),
      lastName: a.string(),
      displayName: a.string(),
      rating: a.integer().default(1200),
      gameParticipations: a.hasMany('GamePlayer', 'userId'),
      createdAt: a.datetime(),
      updatedAt: a.datetime()
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // ============ GAMES ============

  Game: a
    .model({
      name: a.string().required(),
      hostId: a.id().required(),
      status: a.enum(['waiting', 'active', 'completed']),
      currentTurnPlayerId: a.id(),
      currentBattleNumber: a.integer().default(0),
      maxPlayers: a.integer().default(4),
      players: a.hasMany('GamePlayer', 'gameId'),
      battles: a.hasMany('Battle', 'gameId'),
      createdAt: a.datetime(),
      completedAt: a.datetime()
    })
    .authorization((allow) => [allow.publicApiKey()]),

  GamePlayer: a
    .model({
      gameId: a.id().required(),
      game: a.belongsTo('Game', 'gameId'),
      userId: a.id().required(),
      user: a.belongsTo('User', 'userId'),
      playerNumber: a.integer(),
      score: a.integer().default(0),
      isReady: a.boolean().default(false),
      hasDefenseUpgrade: a.boolean().default(false),
      hasEconomyUpgrade: a.boolean().default(false),
      hasProgressCardsUpgrade: a.boolean().default(false),
      cards: a.hasMany('PlayerCard', 'gamePlayerId'),
      resources: a.hasMany('PlayerResource', 'gamePlayerId'),
      battleSubmissions: a.hasMany('BattleSubmission', 'gamePlayerId'),
      joinedAt: a.datetime()
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // ============ BATTLES ============

  Battle: a
    .model({
      gameId: a.id().required(),
      game: a.belongsTo('Game', 'gameId'),
      battleNumber: a.integer().required(),
      winnerId: a.id(),
      resourceRewardId: a.id(),
      submissions: a.hasMany('BattleSubmission', 'battleId'),
      status: a.enum(['pending', 'submitted', 'completed']),
      completedAt: a.datetime(),
      createdAt: a.datetime()
    })
    .secondaryIndexes((index) => [
      index('gameId').sortKeys(['battleNumber']).queryField('battlesByGameAndNumber')
    ])
    .authorization((allow) => [allow.publicApiKey()]),

  BattleSubmission: a
    .model({
      battleId: a.id().required(),
      battle: a.belongsTo('Battle', 'battleId'),
      gamePlayerId: a.id().required(),
      gamePlayer: a.belongsTo('GamePlayer', 'gamePlayerId'),
      card1Id: a.id().required(),
      card2Id: a.id().required(),
      card3Id: a.id().required(),
      totalValue: a.integer().required(),
      submittedAt: a.datetime()
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // ============ CARDS ============

  PlayerCard: a
    .model({
      gamePlayerId: a.id().required(),
      gamePlayer: a.belongsTo('GamePlayer', 'gamePlayerId'),
      cardType: a.enum(['battle', 'progress']),
      // For battle cards
      color: a.enum(['purple', 'orange', 'blue', 'yellow']),
      value: a.integer(),
      rank: a.integer().default(0),
      // For progress cards
      progressCardId: a.id(),
      group: a.enum(['alien', 'allied', 'military', 'native']),
      // State
      isInHand: a.boolean().default(true),
      isPlayed: a.boolean().default(false),
      playedAt: a.datetime(),
      createdAt: a.datetime()
    })
    .authorization((allow) => [allow.publicApiKey()]),

  ProgressCard: a
    .model({
      name: a.string().required(),
      description: a.string(),
      group: a.enum(['alien', 'allied', 'military', 'native']),
      rank: a.integer().required(),
      value: a.integer().required(),
      imageName: a.string(),
      createdAt: a.datetime()
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // ============ RESOURCES ============

  PlayerResource: a
    .model({
      gamePlayerId: a.id().required(),
      gamePlayer: a.belongsTo('GamePlayer', 'gamePlayerId'),
      resourceCardId: a.id().required(),
      acquiredAt: a.datetime()
    })
    .authorization((allow) => [allow.publicApiKey()]),

  ResourceCard: a
    .model({
      title: a.string().required(),
      resourceType: a.enum(['energy', 'food', 'lumber', 'mineral', 'wild']),
      tradeValue: a.integer().required(),
      imageName: a.string(),
      isWinnerCard: a.boolean().default(false),
      resources: a.json(), // Array of resource types this card provides
      createdAt: a.datetime()
    })
    .authorization((allow) => [allow.publicApiKey()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 365
    }
  }
});
