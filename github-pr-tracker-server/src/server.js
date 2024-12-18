const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({origin: 'http://localhost:3001'}));
app.use(express.json());

// GitHub CLI login endpoint
app.post('/api/auth/login',
    async (req, res) => res.json({
        message: 'run `gh auth login --web` in a terminal/bash'
    }));


// GitHub CLI auth status endpoint
app.get('/api/auth/status', async (req, res) => {
    try {
        const { stdout } = await execAsync('gh auth status');
        res.json({ status: 'authenticated', details: stdout });
    } catch (error) {
        res.json({ status: 'not authenticated', details: error.message });
    }
});

// GitHub organization members endpoint
app.get('/api/:org/members', async (req, res) => {
    try {
        const orgName = req.params.org;
        const { stdout } = await execAsync(`gh api orgs/${orgName}/members --paginate`);
        const members = JSON.parse(stdout);
        res.json(members.map(member => member.login));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GitHub organization repositories endpoint
app.get('/api/:org/repos', async (req, res) => {
    try {
        const orgName = req.params.org;
        const { stdout } = await execAsync(`gh repo list ${orgName} --limit 200 --json name`);
        const repos = JSON.parse(stdout);
        res.json(repos.map(repo => repo.name));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get PRs for specific users
app.post('/api/prs', async (req, res) => {
    let cmd_response;
    try {
        const {users, repository, owner} = req.body;

        if (!users) {
            return res.status(400).json({error: 'Users parameter is required'});
        }

        const userList = users.split(',').map(user => user.trim());
        const prs = [];

        for (const user of userList) {
            const query = `is:pr author:${user}`;
            const {stdout} = await execAsync(`gh pr list --repo ${owner}/${repository} --author "${user}" --json id,title,state,url,createdAt,headRefName,author`);
            // const user_avatar_url = await execAsync(`gh api /users/${user} --jq '.avatar_url'`);
            const user_avatar_url = 'https://avatars.githubusercontent.com/u/98375917?v=4';
            cmd_response = JSON.parse(stdout)[0];

            if (cmd_response === undefined) continue;

            prs.push({
                "id": cmd_response.id,
                "title": cmd_response.title,
                "state": cmd_response.state,
                "created_at": cmd_response.createdAt,
                "user": {
                    "login": cmd_response.author.login,
                    "avatar_url": user_avatar_url
                },
                html_url: cmd_response.url
            })
        }

        res.json(prs);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch PRs', details: error.message});
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});