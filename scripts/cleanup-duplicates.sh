#!/bin/bash

# Find the GamePlayer table name from DynamoDB
echo "Finding GamePlayer table..."
TABLE_NAME=$(aws dynamodb list-tables --region us-east-1 --output json | \
  grep -o '"[^"]*"' | \
  grep -i "gameplayer" | \
  grep -v ":" | \
  tr -d '"' | \
  head -1)

if [ -z "$TABLE_NAME" ]; then
  echo "Error: Could not find GamePlayer table"
  echo "Please provide table name as argument: ./cleanup-duplicates.sh <table-name>"
  exit 1
fi

echo "Found table: $TABLE_NAME"
echo "Running cleanup script..."
node scripts/cleanup-duplicate-players.js "$TABLE_NAME"
