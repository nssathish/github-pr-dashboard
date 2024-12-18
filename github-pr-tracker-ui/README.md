# GitHub Pull Request Dashboard

## Overview
A React-based dashboard to view and manage GitHub pull requests across different repositories.

## Features
- Select and view pull requests for any GitHub repository
- Dark mode UI
- Responsive design
- Pull request details including ID, title, state, and author

## Prerequisites
- Node.js (v14 or later)
- npm or yarn
- GitHub Personal Access Token

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/github-pr-tracker-ui.git
cd github-pr-tracker-ui
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure GitHub Token
1. Create a GitHub Personal Access Token:
   - Go to GitHub Settings > Developer Settings > Personal Access Tokens
   - Generate a token with `repo` scope

2. Create a `.env` file in the project root
3. Add your token to the `.env` file:
```
REACT_APP_GITHUB_TOKEN=your_github_personal_access_token
```

### 4. Run the Application
```bash
npm start
```

## Usage
1. Enter a GitHub repository owner and name
2. Click "Load Pull Requests"
3. View the list of open pull requests

## Technologies
- React
- TypeScript
- Material-UI
- Octokit REST API

## Contributing
Pull requests are welcome. For major changes, please open an issue first.

## License
[MIT](https://choosealicense.com/licenses/mit/)
