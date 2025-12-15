#!/bin/bash

# Extract table name from amplify_outputs.json
TABLE_NAME=$(node -e "
const config = require('./amplify_outputs.json');
// The tables are stored as keys in the modelIntrospection.models object
const models = config.data?.modelIntrospection?.models || {};
const tableSuffix = Object.keys(config.data || {})
  .find(key => key.startsWith('User-') || key.match(/User.*Table/));
console.log(tableSuffix || 'User-' + config.data.aws_appsync_apiId || 'User-UNKNOWN');
")

if [ -z "$TABLE_NAME" ] || [ "$TABLE_NAME" == "undefined" ]; then
  # Fallback: try to extract from AWS resources
  TABLE_NAME=$(aws dynamodb list-tables --region us-east-1 --query "TableNames[?contains(@, 'User-')]" --output text | head -1)
fi

if [ -z "$TABLE_NAME" ] || [ "$TABLE_NAME" == "undefined" ]; then
  echo "❌ Could not determine User table name from amplify_outputs.json"
  echo ""
  echo "Please run the script manually with:"
  echo "  node scripts/create-npc-users.js <TABLE_NAME>"
  echo ""
  echo "Find your table name by running:"
  echo "  aws dynamodb list-tables --region us-east-1"
  exit 1
fi

echo "📋 Using table: $TABLE_NAME"
echo ""

node scripts/create-npc-users.js "$TABLE_NAME"
