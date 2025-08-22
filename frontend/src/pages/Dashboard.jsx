import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../utils/auth';
import { Container, Typography, Button, Box, TextField, List, ListItem, ListItemText, Paper, Alert, CircularProgress, Divider, Link } from '@mui/material';

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Auth check
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      navigate('/login', { replace: true });
      return;
    }
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  async function fetchProjects() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/projects`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProjects(res.data);
    } catch (err) {
      setError('Failed to load projects');
    }
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/projects`, { name, description, deadline }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setName(''); setDescription(''); setDeadline('');
      setSuccess('Project created!');
      fetchProjects();
    } catch (err) {
      setError('Failed to create project');
    }
  }

  async function handleJoin(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/projects/join`, { inviteCode }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setInviteCode('');
      setSuccess('Joined project!');
      fetchProjects();
    } catch (err) {
      setError('Failed to join project');
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h3" color="primary" fontWeight={800} letterSpacing={-2}>MaD-Hub</Typography>
        <Button variant="outlined" color="secondary" onClick={logout}>Logout</Button>
      </Box>
  <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)', color: 'white' }} elevation={3}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Your Projects</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {loading ? <CircularProgress color="secondary" /> : (
          <List>
            {projects.map(p => (
              <ListItem key={p.id} divider sx={{ background: '#e3f2fd', borderRadius: 2, mb: 1 }}>
                <ListItemText
                  primary={<Link href={`/project/${p.id}`} underline="hover" sx={{ color: '#1976d2', fontWeight: 700, fontSize: 18 }}>{p.name}</Link>}
                  secondary={<span style={{ color: '#42a5f5' }}>Invite: {p.inviteCode}</span>}
                />
              </ListItem>
            ))}
            {projects.length === 0 && <ListItem><ListItemText primary="No projects yet." /></ListItem>}
          </List>
        )}
      </Paper>
      <Box display="flex" gap={3} flexWrap="wrap">
  <Paper sx={{ p: 2, flex: 1, minWidth: 280, background: '#f7fafd' }} elevation={2}>
          <Typography variant="subtitle1" color="primary" fontWeight={700} gutterBottom>Create Project</Typography>
          <Box component="form" onSubmit={handleCreate} display="flex" flexDirection="column" gap={2}>
            <TextField label="Name" value={name} onChange={e=>setName(e.target.value)} required />
            <TextField label="Description" value={description} onChange={e=>setDescription(e.target.value)} required />
            <TextField label="Deadline" type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} required InputLabelProps={{ shrink: true }} />
            <Button type="submit" variant="contained" color="primary">Create</Button>
          </Box>
        </Paper>
  <Paper sx={{ p: 2, flex: 1, minWidth: 280, background: '#f7fafd' }} elevation={2}>
          <Typography variant="subtitle1" color="primary" fontWeight={700} gutterBottom>Join Project</Typography>
          <Box component="form" onSubmit={handleJoin} display="flex" flexDirection="column" gap={2}>
            <TextField label="Invite Code" value={inviteCode} onChange={e=>setInviteCode(e.target.value)} required />
            <Button type="submit" variant="contained" color="secondary">Join</Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
