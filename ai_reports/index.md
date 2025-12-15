# AI Reports Index

This directory contains technical documentation and architectural patterns discovered or implemented during the development of Treasures of Titan.

## Reports

### [Anonymous-to-Authenticated User Pattern](./anonymous_user_pattern.md)
**Purpose**: Enable frictionless user onboarding without requiring login at app launch

**Key Insight**: Users start as anonymous accounts with device-stored UUIDs, then optionally upgrade to full Cognito accounts later while preserving all their data

**Critical Implementation Detail**: Always fetch users by stored UUID (not awsSub) when linking accounts to prevent race condition duplicates

**Battle-tested**: This pattern was successfully implemented in Rivalry Club and prevents the duplicate user bug
