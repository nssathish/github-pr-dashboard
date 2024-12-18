import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Link
} from '@mui/material';
import axios from "axios";

interface PullRequest {
  id: number;
  title: string;
  state: string;
  created_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
}

interface PullRequestFinderProps {
  users: string; // Comma-separated users
  repositories: string; // Comma-separated repositories in the format: owner/repo
}

const PullRequestFinder: React.FC<PullRequestFinderProps> = ({ users, repositories }) => {
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFilteredPullRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const repoArray = repositories.split(',').map((repo) => repo.trim());
        let allFilteredPullRequests: PullRequest[] = [];

        for (const repo of repoArray) {
          const [owner, repository] = [process.env.REACT_APP_DEFAULT_OWNER, repo];
          if (!owner || !repository) {
            setError(`Invalid repository format: ${repo}. Use owner/repo.`);
            continue;
          }

          try {
            const response = await axios.post(
              `${process.env.REACT_APP_GITHUB_PR_TRACKER_API_URL}/api/prs`,
              {
                users,
                repository,
                owner
              },
              {
                headers: {
                  "Access-Control-Allow-Origin": "http://localhost:3001",
                  "Access-Control-Allow-Methods": 'GET, POST, PUT',
                  "Access-Control-Allow-Headers": 'Content-Type'
                }
              }
            );

            const filteredPRs = response.data
              .map((pr: PullRequest) => ({
                id: pr.id,
                title: pr.title,
                state: pr.state,
                created_at: pr.created_at,
                user: {
                  login: pr.user!.login,
                  avatar_url: pr.user!.avatar_url,
                },
                html_url: pr.html_url,
              }));

            allFilteredPullRequests = [...allFilteredPullRequests, ...filteredPRs];
          } catch (err) {
            console.error(`Failed to fetch pull requests for ${repo}:`, err);
          }
        }

        setPullRequests(allFilteredPullRequests);
      } catch (err) {
        setError('Failed to fetch pull requests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredPullRequests();
  }, [users, repositories]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6" sx={{ textAlign: 'center', padding: 4 }}>
        {error}
      </Typography>
    );
  }

  if (pullRequests.length === 0) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', padding: 4 }}>
        No matching pull requests found for the given users and repositories
      </Typography>
    );
  }

  // Group PRs by owner
  const prsByOwner = pullRequests.reduce((acc, pr) => {
    const ownerLogin = pr.user.login;
    if (!acc[ownerLogin]) {
      acc[ownerLogin] = [];
    }
    acc[ownerLogin].push(pr);
    return acc;
  }, {} as Record<string, PullRequest[]>);

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography variant="h4" sx={{ 
        textAlign: 'center',
        color: 'primary.main',
        fontWeight: 600,
        mb: 4
      }}>
        Pull Requests by Owner
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(prsByOwner).map(([ownerLogin, ownerPRs]) => (
          <Grid item xs={12} md={6} lg={4} key={ownerLogin}>
            <Card sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardHeader
                avatar={
                  <Avatar
                    src={ownerPRs[0].user.avatar_url}
                    alt={ownerLogin}
                    sx={{ 
                      width: 48,
                      height: 48,
                      border: '2px solid',
                      borderColor: 'primary.main'
                    }}
                  />
                }
                title={
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {ownerLogin}
                  </Typography>
                }
                subheader={
                  <Typography variant="subtitle2" color="text.secondary">
                    {`${ownerPRs.length} Pull Request${ownerPRs.length !== 1 ? 's' : ''}`}
                  </Typography>
                }
              />
              <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                {ownerPRs.map((pr) => (
                  <Box 
                    key={pr.id} 
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      bgcolor: 'background.default', 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <Link
                      href={pr.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        display: 'block', 
                        mb: 1.5,
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          color: 'primary.light'
                        }
                      }}
                    >
                      {pr.title}
                    </Link>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center'
                    }}>
                      <Chip
                        label={pr.state}
                        color={pr.state === 'open' ? 'success' : 'default'}
                        size="small"
                        sx={{ 
                          textTransform: 'capitalize',
                          fontWeight: 'medium',
                          px: 1
                        }}
                      />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          fontWeight: 500
                        }}
                      >
                        {new Date(pr.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PullRequestFinder;