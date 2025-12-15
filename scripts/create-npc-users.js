#!/usr/bin/env node

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { randomUUID } = require('crypto');

// DynamoDB setup
const dynamoClient = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: {
    removeUndefinedValues: true
  }
});

// Get table name from command line argument or use default
const USER_TABLE = process.argv[2] || 'User-eufbm2g2krhd3kvltqwnkdayb4-NONE';

// Name lists for each letter
const NAMES = {
  a: ['Alice', 'Adam', 'Aaron', 'Abigail', 'Andrew', 'Adrian', 'Alexandra', 'Alex', 'Anthony', 'Amanda'],
  b: ['Bob', 'Ben', 'Brian', 'Blake', 'Brandon', 'Bradley', 'Bella', 'Bailey', 'Brianna', 'Beth'],
  c: ['Charlie', 'Chris', 'Carl', 'Cameron', 'Caleb', 'Chloe', 'Claire', 'Caroline', 'Cynthia', 'Cole'],
  d: ['David', 'Daniel', 'Derek', 'Dylan', 'Dean', 'Diana', 'Danielle', 'Daisy', 'Donna', 'Drew'],
  e: ['Emma', 'Emily', 'Ethan', 'Evan', 'Eric', 'Elizabeth', 'Elena', 'Ella', 'Evelyn', 'Eddie'],
  f: ['Frank', 'Fred', 'Felix', 'Finn', 'Faith', 'Fiona', 'Felicity', 'Frances', 'Fernando', 'Floyd'],
  g: ['George', 'Gary', 'Grant', 'Greg', 'Grace', 'Gabriella', 'Gemma', 'Gina', 'Gabriel', 'Gavin'],
  h: ['Henry', 'Harry', 'Howard', 'Hunter', 'Hannah', 'Haley', 'Harper', 'Hope', 'Helen', 'Hugh'],
  i: ['Isaac', 'Ian', 'Ivan', 'Isaiah', 'Isabella', 'Iris', 'Ivy', 'Irene', 'Isla', 'India'],
  j: ['Jack', 'James', 'John', 'Jake', 'Jordan', 'Jessica', 'Jennifer', 'Julia', 'Jasmine', 'Jane'],
  k: ['Kevin', 'Keith', 'Kyle', 'Ken', 'Katherine', 'Kelly', 'Kate', 'Kimberly', 'Kara', 'Kylie'],
  l: ['Luke', 'Logan', 'Leo', 'Lewis', 'Laura', 'Lucy', 'Lily', 'Lauren', 'Leah', 'Linda'],
  m: ['Mike', 'Matt', 'Mark', 'Max', 'Mason', 'Mary', 'Maria', 'Michelle', 'Megan', 'Madison'],
  n: ['Nathan', 'Nick', 'Noah', 'Neil', 'Nolan', 'Natalie', 'Nicole', 'Nina', 'Naomi', 'Nancy'],
  o: ['Oliver', 'Oscar', 'Owen', 'Omar', 'Olivia', 'Olive', 'Odette', 'Ophelia', 'Octavia', 'Orla'],
  p: ['Peter', 'Paul', 'Patrick', 'Philip', 'Parker', 'Piper', 'Paige', 'Penelope', 'Phoebe', 'Pearl'],
  q: ['Quinn', 'Quentin', 'Quincy', 'Queen', 'Quinton', 'Queenie', 'Quiana', 'Quilla', 'Quest', 'Quade'],
  r: ['Ryan', 'Robert', 'Richard', 'Roger', 'Ross', 'Rachel', 'Rebecca', 'Riley', 'Rose', 'Ruby'],
  s: ['Sam', 'Steve', 'Scott', 'Sean', 'Simon', 'Sarah', 'Sophia', 'Samantha', 'Stella', 'Sophie'],
  t: ['Tom', 'Tim', 'Tyler', 'Travis', 'Trevor', 'Tara', 'Taylor', 'Tiffany', 'Teresa', 'Tina'],
  u: ['Ulysses', 'Uriel', 'Urban', 'Umar', 'Ulrich', 'Uma', 'Ursula', 'Unity', 'Unique', 'Una'],
  v: ['Victor', 'Vincent', 'Vince', 'Vernon', 'Vaughn', 'Victoria', 'Violet', 'Vanessa', 'Vera', 'Valerie'],
  w: ['William', 'Walter', 'Wayne', 'Wesley', 'Wade', 'Wendy', 'Willow', 'Whitney', 'Wanda', 'Winnie'],
  x: ['Xavier', 'Xander', 'Xerxes', 'Xavi', 'Xylon', 'Xena', 'Ximena', 'Xyla', 'Xiomara', 'Xandra'],
  y: ['Yusuf', 'Yuri', 'Yale', 'Yosef', 'York', 'Yvonne', 'Yara', 'Yasmin', 'Yolanda', 'Yvette'],
  z: ['Zachary', 'Zane', 'Zack', 'Zeke', 'Zeus', 'Zoe', 'Zelda', 'Zara', 'Zuri', 'Zinnia']
};

// Generate a random name for a given letter
function getRandomName(letter) {
  const nameList = NAMES[letter.toLowerCase()];
  if (!nameList || nameList.length === 0) {
    return `NPC_${letter.toUpperCase()}`;
  }
  return nameList[Math.floor(Math.random() * nameList.length)];
}

// Create an NPC user in DynamoDB
async function createNPCUser(letter) {
  const userId = randomUUID();
  const displayName = getRandomName(letter);
  const email = `npc-${letter.toLowerCase()}@treasuresoftitan.local`;
  const now = new Date().toISOString();

  const userItem = {
    id: userId,
    email,
    firstName: displayName,
    lastName: 'Bot',
    displayName,
    role: 13, // NPC role
    awsSub: 'npc',
    rating: 1200,
    createdAt: now,
    updatedAt: now,
    __typename: 'User'
  };

  try {
    const putCommand = new PutCommand({
      TableName: USER_TABLE,
      Item: userItem
    });

    await docClient.send(putCommand);
    console.log(`✓ Created NPC ${letter.toUpperCase()}: ${displayName} (${email})`);
    return { letter, displayName, userId };
  } catch (error) {
    console.error(`✗ Failed to create NPC ${letter.toUpperCase()}: ${error.message}`);
    return null;
  }
}

// Main execution
async function main() {
  console.log('Creating NPC Users (A-Z)');
  console.log('='.repeat(60));
  console.log(`Table: ${USER_TABLE}`);
  console.log('='.repeat(60));
  console.log('');

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const results = [];

  for (const letter of alphabet) {
    const result = await createNPCUser(letter);
    if (result) {
      results.push(result);
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log(`✅ Created ${results.length} NPC users successfully!`);
  console.log('='.repeat(60));
  console.log('');
  console.log('NPC Users:');
  results.forEach(({ letter, displayName }) => {
    console.log(`  ${letter.toUpperCase()}: ${displayName}`);
  });
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
