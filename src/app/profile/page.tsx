"use client";

import { useState } from "react";
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
} from "@mui/icons-material";

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

export default function Profile() {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar
            sx={{ width: 120, height: 120 }}
            alt="User Name"
            src="/path/to/avatar.jpg"
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              John Doe
            </Typography>
            <Typography variant="body1" color="text.secondary">
              john.doe@example.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since: January 2023
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(!isEditing)}
          >
            Edit Profile
          </Button>
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
                label="First Name"
                defaultValue="John"
                disabled={!isEditing}
              />
            </Grid>
            <Grid size="auto">
              <TextField
                fullWidth
                label="Last Name"
                defaultValue="Doe"
                disabled={!isEditing}
              />
            </Grid>
            <Grid size="auto">
              <TextField
                fullWidth
                label="Email"
                defaultValue="john.doe@example.com"
                disabled={!isEditing}
              />
            </Grid>
            <Grid size="auto">
              <TextField
                fullWidth
                label="Phone"
                defaultValue="+1 234 567 8900"
                disabled={!isEditing}
              />
            </Grid>
            <Grid size="auto">
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                defaultValue="123 Main St, City, Country"
                disabled={!isEditing}
              />
            </Grid>
            {isEditing && (
              <Grid size="auto">
                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                  <Button variant="outlined" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={() => setIsEditing(false)}>
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
              />
              <TextField
                fullWidth
                type="password"
                label="New Password"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                sx={{ mb: 2 }}
              />
              <Button variant="contained">Update Password</Button>
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
