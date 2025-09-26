"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Paper,
  TextField,
  Grid,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Person,
  Security,
  Notifications,
  Edit as EditIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import axios from "axios";
import { getUserId, isLoggedIn, logout } from "@/utils/auth"; // Added logout import
import { useRouter } from "next/navigation";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  username: string;
  created_at: string;
}

export default function Profile() {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [originalUserInfo, setOriginalUserInfo] = useState<UserInfo | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const router = useRouter();

   useEffect(() => {
        if (!isLoggedIn()) {
          alert('Please log in to access this page');
          router.push('/'); // Redirect to home instead of login
        }else{
          console.log('UserId:', getUserId());
        }
      }, [router]);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const userInfo = await axios.get("http://localhost:3005/userInfo",{params: {id: getUserId()}});
        setUserInfo(userInfo.data);
        setOriginalUserInfo(userInfo.data); // Save original data for cancel
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    }
    fetchUserInfo();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const updateChanges = async () => {
    if (!userInfo?.name) {
      alert("Name cannot be empty.");
      return;
    }
    try {
      await axios.post("http://localhost:3005/userInfo", userInfo);
      setOriginalUserInfo(userInfo);
    } catch (error) {
      console.error("Failed to update user info:", error);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3005/changePassword", {
        userId: userInfo?.id,
        currentPassword,
        newPassword,
      });
      console.log(response);
      alert(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      alert("Failed to update password.");
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar
            sx={{ width: 120, height: 120 }}
            alt={userInfo?.name || ""}
            src="" // You can add avatar url if available
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {userInfo?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {userInfo?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Username: {userInfo?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since: {userInfo?.created_at
                ? new Date(userInfo.created_at).toLocaleDateString()
                : ""}
            </Typography>
          </Box>
          
          {/* Button Group */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(!isEditing)}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Settings Tabs */}
      <Paper sx={{ width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab icon={<Person />} label="Personal Info" />
          <Tab icon={<Security />} label="Security" />
          <Tab icon={<Notifications />} label="Notifications" />
        </Tabs>

        {/* Personal Info Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid size="auto">
              <TextField
                fullWidth
                label="Name"
                value={userInfo?.name || ""}
                disabled={!isEditing}
                onChange={e =>
                  setUserInfo(userInfo
                    ? { ...userInfo, name: e.target.value }
                    : null)
                }
              />
            </Grid>
            <Grid size="auto">
              <TextField
                fullWidth
                label="Email"
                value={userInfo?.email || ""}
                disabled={!isEditing}
                onChange={e =>
                  setUserInfo(userInfo
                    ? { ...userInfo, email: e.target.value }
                    : null)
                }
              />
            </Grid>
            <Grid size="auto">
              <TextField
                fullWidth
                label="Username"
                value={userInfo?.username || ""}
                disabled // Username is always disabled (unchangeable)
                // onChange removed since it's uneditable
              />
            </Grid>
            <Grid size="auto">
              <TextField
                fullWidth
                label="Member Since"
                value={
                  userInfo?.created_at
                    ? new Date(userInfo.created_at).toLocaleDateString()
                    : ""
                }
                disabled
              />
            </Grid>
            {isEditing && (
              <Grid size="auto">
                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setUserInfo(originalUserInfo); // Restore original values
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained"
                   onClick={() => {setIsEditing(false); updateChanges();}}>
                    Save Changes
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid size="auto">
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                sx={{ mb: 2 }}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
              <TextField
                fullWidth
                type="password"
                label="New Password"
                sx={{ mb: 2 }}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                sx={{ mb: 2 }}
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
              />
              <Button variant="contained" onClick={handleChangePassword}>
                Update Password
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid size="auto">
              <Typography variant="h6" gutterBottom>
                Email Notifications
              </Typography>
              {/* Add notification preferences here */}
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
}
