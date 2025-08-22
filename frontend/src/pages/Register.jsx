
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, TextField, Button, Alert, Paper, Link } from '@mui/material';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/auth/register`, form);
      window.location.href = '/login';
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }} elevation={3}>
        <Typography variant="h5" align="center" gutterBottom>Register</Typography>
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
          <TextField name="name" label="Name" value={form.name} onChange={handleChange} required />
          <TextField name="email" label="Email" value={form.email} onChange={handleChange} required type="email" />
          <TextField name="password" label="Password" value={form.password} onChange={handleChange} required type="password" />
          <Button type="submit" variant="contained">Register</Button>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
        <Box mt={2} textAlign="center">
          <Link href="/login" underline="hover">Already have an account? Login</Link>
        </Box>
      </Paper>
    </Container>
  );
}
