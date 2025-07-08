# GitHub PR Tracker

A Node.js server that uses GitHub CLI to track pull requests for specific users.

## Prerequisites

1. Node.js installed
2. GitHub CLI installed and available in PATH
   - Install from: https://cli.github.com/

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make sure GitHub CLI is installed and available in your PATH
4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- `GET /api/auth/status` - Check GitHub CLI authentication status
- `POST /api/auth/login` - Initiate GitHub CLI login flow

### Pull Requests

- `GET /api/prs?users=user1,user2` - Get pull requests for specified users
  - Query Parameters:
    - `users`: Comma-separated list of GitHub usernames

## Example Usage

1. First authenticate using GitHub CLI:
   ```bash
   curl -X POST http://localhost:3001/api/auth/login
   ```

2. Check authentication status:
   ```bash
   curl http://localhost:3001/api/auth/status
   ```

3. Get PRs for specific users:
   ```bash
   curl -X POST http://localhost:3001/api/prs?users=octocat,defunkt
   ```
