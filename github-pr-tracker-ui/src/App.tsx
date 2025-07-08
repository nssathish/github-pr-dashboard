import React, { useState } from 'react';
import { 
  CssBaseline, 
  Container, 
  ThemeProvider, 
  createTheme,
  Box
} from '@mui/material';
import PullRequestList from './components/PullRequestList'
import RepositorySelector from './components/RepositorySelector';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1a1a2e',
      paper: '#252538'
    },
    primary: {
      main: '#6366f1'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to bottom right, rgba(99, 102, 241, 0.05), rgba(99, 102, 241, 0.02))',
          backdropFilter: 'blur(8px)',
          borderRadius: '12px',
          border: '1px solid rgba(99, 102, 241, 0.1)'
        }
      }
    }
  }
});

const App: React.FC = () => {
  const [selectedRepos, setSelectedRepos] = useState<{
    owners: string[];
    repos: string[];
    userOnly: boolean;
  } | null>(null);

  const handleRepositorySelect = (owners: string[], repos: string[], userOnly: boolean) => {
    setSelectedRepos({ owners, repos, userOnly });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #1f1f3a 100%)',
          pt: 4,
          pb: 8
        }}
      >
        <Container 
          maxWidth="lg"
          sx={{
            '& > *': {
              mb: 4
            }
          }}
        >
            <RepositorySelector
                onRepositorySelect={handleRepositorySelect}
            />
          {selectedRepos && (
            <PullRequestList
              repositories={selectedRepos.repos.join(',')}
              users={selectedRepos.owners.join(',')}
              userOnly={selectedRepos.userOnly}
            />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
