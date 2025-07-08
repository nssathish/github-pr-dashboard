import React, {useState, useEffect} from 'react';
import {
    Button,
    Box,
    Typography,
    Autocomplete,
    TextField,
    Chip
} from '@mui/material';
import axios from 'axios';

interface RepositorySelectorProps {
    onRepositorySelect: (owners: string[], repos: string[], userOnly: boolean) => void
}

const RepositorySelector: React.FC<RepositorySelectorProps> = ({onRepositorySelect}) => {
    const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
    const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
    const [availableOwners, setAvailableOwners] = useState<string[]>([]);
    const [availableRepos, setAvailableRepos] = useState<string[]>([]);
    const [userOnly, setUserOnly] = useState<boolean>(false);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const org = process.env.REACT_APP_DEFAULT_OWNER;
                const response = await axios.get(`${process.env.REACT_APP_GITHUB_PR_TRACKER_API_URL}/api/${org}/members`);
                if (!response.status) {
                    console.error('Failed to fetch members');
                }
                const members = await response.data;
                setAvailableOwners(members);
            } catch (error) {
                console.error('Error fetching members:', error);
                // Set a fallback or show an error message to the user
            }
        };

        fetchMembers().then(() => console.log('members fetched'));
    }, []);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const org = process.env.REACT_APP_DEFAULT_OWNER; // Replace with your organization name
                const response = await axios.get(`${process.env.REACT_APP_GITHUB_PR_TRACKER_API_URL}/api/${org}/repos`);
                if (!response.status) {
                    console.error('Failed to fetch members');
                }
                const members = await response.data;
                setAvailableRepos(members);
            } catch (error) {
                console.error('Error fetching members:', error);
                // Set a fallback or show an error message to the user
            }
        };

        fetchRepos().then(() => console.log('repos fetched'));
    }, []);

    const handleSubmit = () => {
        if (selectedOwners.length > 0 && (selectedRepos.length > 0 || userOnly)) {
            onRepositorySelect(selectedOwners, selectedRepos, userOnly);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            maxWidth: 600,
            margin: 'auto',
            padding: 3,
            backgroundColor: 'background.paper',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider'
        }}>
            <Typography variant="h5" sx={{
                textAlign: 'center',
                color: 'primary.main',
                fontWeight: 600,
                mb: 1
            }}>
                Select GitHub Pull Requests
            </Typography>

            <Autocomplete
                multiple
                options={availableOwners}
                value={selectedOwners}
                onChange={(_, newValue) => setSelectedOwners(newValue)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Repository Owners"
                        placeholder="Select owners"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                    borderWidth: '2px'
                                }
                            }
                        }}
                    />
                )}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            label={option}
                            {...getTagProps({index})}
                            key={option}
                            sx={{
                                backgroundColor: 'primary.dark',
                                '& .MuiChip-deleteIcon': {
                                    color: 'primary.light',
                                    '&:hover': {
                                        color: 'primary.main'
                                    }
                                }
                            }}
                        />
                    ))
                }
            />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <input
                    type="checkbox"
                    style={{ marginRight: '8px' }}
                    onChange={(e) => {setUserOnly(e.target.checked)}}
                />
                <label style={{ color: '#fff' }}>User Only Mode</label>
            </Box>

            <Autocomplete
                multiple
                options={availableRepos}
                value={selectedRepos}
                onChange={(_, newValue) => setSelectedRepos(newValue)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Repository Names"
                        placeholder="Select repositories"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                    borderWidth: '2px'
                                }
                            }
                        }}
                    />
                )}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            label={option}
                            {...getTagProps({index})}
                            key={option}
                            sx={{
                                backgroundColor: 'primary.dark',
                                '& .MuiChip-deleteIcon': {
                                    color: 'primary.light',
                                    '&:hover': {
                                        color: 'primary.main'
                                    }
                                }
                            }}
                        />
                    ))
                }
                hidden={userOnly}
            />

            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={selectedOwners.length === 0 || (selectedRepos.length === 0 && !userOnly)}
                sx={{
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                    '&:hover': {
                        boxShadow: '0 6px 16px rgba(99, 102, 241, 0.3)'
                    }
                }}
            >
                Load Pull Requests
            </Button>
        </Box>
    );
};

export default RepositorySelector;
