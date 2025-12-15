#!/usr/bin/env node

/**
 * Cleanup script to remove duplicate GamePlayer entries
 * Keeps the first entry for each unique gameId+userId combination
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

const GAME_PLAYER_TABLE = process.env.GAME_PLAYER_TABLE || process.argv[2];

if (!GAME_PLAYER_TABLE) {
  console.error('Usage: node cleanup-duplicate-players.js <game-player-table-name>');
  process.exit(1);
}

async function cleanupDuplicatePlayers() {
  console.log(`Scanning GamePlayer table: ${GAME_PLAYER_TABLE}`);

  try {
    // Scan all GamePlayer records
    const result = await docClient.send(
      new ScanCommand({
        TableName: GAME_PLAYER_TABLE
      })
    );

    const players = result.Items || [];
    console.log(`Found ${players.length} total GamePlayer records`);

    // Group by gameId+userId to find duplicates
    const playerMap = new Map();
    const duplicates = [];

    for (const player of players) {
      const key = `${player.gameId}:${player.userId}`;

      if (playerMap.has(key)) {
        // This is a duplicate - mark for deletion
        duplicates.push(player);
        console.log(`Found duplicate: ${player.id} (gameId: ${player.gameId.substring(0, 8)}..., userId: ${player.userId.substring(0, 8)}...)`);
      } else {
        // First occurrence - keep this one
        playerMap.set(key, player);
      }
    }

    if (duplicates.length === 0) {
      console.log('No duplicates found!');
      return;
    }

    console.log(`\nFound ${duplicates.length} duplicate records. Deleting...`);

    // Delete duplicates
    for (const duplicate of duplicates) {
      await docClient.send(
        new DeleteCommand({
          TableName: GAME_PLAYER_TABLE,
          Key: { id: duplicate.id }
        })
      );
      console.log(`Deleted: ${duplicate.id}`);
    }

    console.log(`\n✅ Cleanup complete! Removed ${duplicates.length} duplicate records.`);
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
}

cleanupDuplicatePlayers();
