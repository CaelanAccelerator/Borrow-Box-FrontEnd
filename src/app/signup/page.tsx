'use client'

import { 
  Card, 
  CardContent, 
  TextField, 
  Typography, 
  Button,
  Box,
  Container,
  Avatar,
  Link,
  Alert
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpPage() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSignUp(name: string, username: string, password: string, confirmPassword: string, email: string) {
    if (!name || !username || !password || !confirmPassword || !email) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError('');

    const reqBody = { name, username, password, email };
    
    try {
      await axios.post('http://localhost:3005/signup', reqBody);
      alert("Sign up successful!");
      router.push('/login');
    } catch (error) {
      console.error("Error signing up:", error);
      setError("Sign up failed! Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignUp(name, username, password, confirmPassword, email);
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
            mt: 4, 
            p: 4, 
            boxShadow: 3,
            borderRadius: 2,
            width: '100%',
            maxWidth: 500
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
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <PersonAdd />
              </Avatar>
              
              <Typography component="h1" variant="h4" gutterBottom>
                Create Account
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                Join our community to start borrowing and lending items with your neighbors
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
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  variant="outlined"
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="confirm-password"
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="outlined"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Link 
                    component="button"
                    variant="body2"
                    onClick={() => router.push('/login')}
                    sx={{ textDecoration: 'none' }}
                  >
                    Already have an account? Sign In
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
