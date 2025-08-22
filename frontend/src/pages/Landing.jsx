
import React from 'react';
import { Container, Box, Typography, Button, Paper } from '@mui/material';

export default function Landing() {
  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper sx={{
        p: 5,
        textAlign: 'center',
        background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)',
        color: 'white',
      }} elevation={4}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 800, letterSpacing: '-2px', color: 'white' }}>MaD-Hub</Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)' }} gutterBottom>
          Manage projects, tasks, and teams in real time.<br />Collaborate. Organize. Succeed.
        </Typography>
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button href="/login" variant="contained" size="large" color="primary" sx={{ fontWeight: 700, background: '#1976d2', color: 'white' }}>Login</Button>
          <Button href="/register" variant="outlined" size="large" color="primary" sx={{ fontWeight: 700, borderColor: '#1976d2', color: 'white', ':hover': { borderColor: '#42a5f5', background: 'rgba(255,255,255,0.08)' } }}>Sign Up</Button>
        </Box>
      </Paper>
    </Container>
  );
}
