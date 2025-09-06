'use client'

import { Card, CardContent, TextField, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

async function handleSignUp(name: string, username: string, password: string, confirmPassword: string, email: string) {
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const reqBody = {
    name,
    username,
    password,
    email
  };
  
  try {
    await axios.post('http://localhost:3005/signup', reqBody);
    alert("Sign up successful!");
    
  } catch (error) {
    console.error("Error signing up:", error);
    alert("Sign up failed!");
  }
}

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Sign Up</Typography>
        <Typography variant="body2">
          Create your account to start borrowing and lending items
        </Typography>

        <TextField
          id="name"
          label="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          id="username"
          label="Enter your username"
          value={username}              
          onChange={(e) => setUsername(e.target.value)}  
          fullWidth
          margin="normal"
        />

        <TextField
          id="password"
          label="Enter your password"
          type="password"
          value={password}             
          onChange={(e) => setPassword(e.target.value)}  
          fullWidth
          margin="normal"
        />

        <TextField
          id="confirm-password"
          label="Confirm your password"
          type="password"
          value={confirmPassword}       
          onChange={(e) => setConfirmPassword(e.target.value)}  
          fullWidth
          margin="normal"
        />

        <TextField
          id="email"
          label="Enter your email"
          type="email"
          value={email}                 
          onChange={(e) => setEmail(e.target.value)}     
          fullWidth
          margin="normal"
        />

        <Button 
          variant="contained" 
          onClick={() => handleSignUp(name,username, password, confirmPassword, email)}
          fullWidth
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
      </CardContent>
    </Card>
  );
}
