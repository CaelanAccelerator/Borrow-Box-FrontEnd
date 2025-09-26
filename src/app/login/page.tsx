'use client'

import { 
  Button, 
  Card, 
  CardContent, 
  TextField, 
  Typography, 
  Box,
  Container,
  Avatar,
  Link,
  Alert
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogIn = async (username: string, password: string) => {
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    
    const reqBody = { username, password };
    
    try {
      const response = await axios.post('http://localhost:3005/login', reqBody);

      if (response.status === 200) {
        const user = response.data.user;
        const token = response.data.token;

        // Store in localStorage (for client-side access)
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('username', user.username);
        localStorage.setItem('email', user.email);

        // Store in cookies (for middleware access)
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;

        router.push('/listings');
      }
    } catch (error) {
      console.error("Log in request failed", error);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogIn(username, password);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card 
          sx={{ 
            mt: 8, 
            p: 4, 
            boxShadow: 3,
            borderRadius: 2,
            width: '100%',
            maxWidth: 400
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                <LockOutlined />
              </Avatar>
              
              <Typography component="h1" variant="h4" gutterBottom>
                Welcome Back
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Sign in to your account
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  variant="outlined"
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Link 
                    component="button"
                    variant="body2"
                    onClick={() => router.push('/signup')}
                    sx={{ textDecoration: 'none' }}
                  >
                    Don't have an account? Sign Up
                  </Link>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

