"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { Login, PersonAdd } from "@mui/icons-material";

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1b1c20ff 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={6} alignItems="center">
          {/* Welcome Text */}
          <Box textAlign="center">
            <Typography
              variant="h2"
              sx={{
                color: "white",
                fontWeight: 700,
                mb: 2,
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Welcome to Borrow Box
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.9)",
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Your community sharing platform. Borrow what you need, lend what you
              don't use.
            </Typography>
          </Box>

          {/* Action Cards */}
          <Grid container spacing={4} sx={{ width: "100%", maxWidth: 600 }}>
            {/* Log In Card */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                sx={{
                  height: 250,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    background: "rgba(255,255,255,1)",
                  },
                }}
                onClick={() => router.push("/login")}
              >
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    p: 3,
                  }}
                >
                  <Box
                    sx={{
                      color: "#1976d2",
                      mb: 2,
                      p: 2,
                      borderRadius: "50%",
                      backgroundColor: "#1976d215",
                    }}
                  >
                    <Login sx={{ fontSize: 40 }} />
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: "#1976d2",
                      mb: 1,
                    }}
                  >
                    Log In
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.5,
                    }}
                  >
                    Access your account to start borrowing and lending items
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Sign Up Card */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                sx={{
                  height: 250,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    background: "rgba(255,255,255,1)",
                  },
                }}
                onClick={() => router.push("/signup")}
              >
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    p: 3,
                  }}
                >
                  <Box
                    sx={{
                      color: "#2e7d32",
                      mb: 2,
                      p: 2,
                      borderRadius: "50%",
                      backgroundColor: "#2e7d3215",
                    }}
                  >
                    <PersonAdd sx={{ fontSize: 40 }} />
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: "#2e7d32",
                      mb: 1,
                    }}
                  >
                    Sign Up
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.5,
                    }}
                  >
                    Create a new account to join our sharing community
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Additional Info */}
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.8)",
              textAlign: "center",
              mt: 4,
            }}
          >
            Already have an account? Log in to access your dashboard
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

