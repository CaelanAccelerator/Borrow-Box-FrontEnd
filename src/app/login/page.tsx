'use client'

import { Button, Card, TextField } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogIn = async (username: string, password: string) => {
    const reqBody = {
      username,
      password
    };
    try {
      const response = await axios.post('http://localhost:3005/login', reqBody);

      if (response.status === 200) {
        // ✅ Store user information in localStorage
        const user = response.data.user;
        const token = response.data.token;

        // Store user info
        localStorage.setItem('token', token); // If you have JWT token
        localStorage.setItem('userId', user.id);
        localStorage.setItem('username', user.username);
        localStorage.setItem('email', user.email);


        console.log('🔄 Storing user data...');
        console.log('Stored user:', localStorage.getItem('user'));
        console.log('Stored token:', localStorage.getItem('token'));
        console.log('Stored userId:', localStorage.getItem('userId'));
        console.log('Stored username:', localStorage.getItem('username'));

        alert("log in successful!");
        router.push('/listings');
      }
    } catch (error) {
      console.error("Log in request failed", error);
    }
  }

  return (
    <Card>
      <form onSubmit={() => handleLogIn(username, password)}>
        <TextField
          label="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleLogIn(username, password)}
        >登录</Button>
      </form>
    </Card>
  );
}

