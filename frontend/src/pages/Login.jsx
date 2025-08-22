
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, TextField, Button, Alert, Paper, Link } from '@mui/material';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      if (res.data.user && res.data.user.id) {
        localStorage.setItem('userId', res.data.user.id);
      }
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }} elevation={3}>
        <Typography variant="h5" align="center" gutterBottom>Login</Typography>
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
          <TextField name="email" label="Email" value={form.email} onChange={handleChange} required type="email" />
          <TextField name="password" label="Password" value={form.password} onChange={handleChange} required type="password" />
          <Button type="submit" variant="contained">Login</Button>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
        <Box mt={2} textAlign="center">
          <Link href="/register" underline="hover">Don't have an account? Register</Link>
        </Box>
      </Paper>
    </Container>
  );
}
