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
  CardMedia
} from "@mui/material";
import {
  Search,
  SwapHoriz,
  Security,
  Support
} from "@mui/icons-material";

// Feature cards data
const features = [
  {
    icon: <Search sx={{ fontSize: 40 }} />,
    title: "Browse Items",
    description: "Discover a wide variety of items available for borrowing in your community."
  },
  {
    icon: <SwapHoriz sx={{ fontSize: 40 }} />,
    title: "Easy Lending",
    description: "List your items and earn by lending them to trusted borrowers."
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" gutterBottom>
                Borrow Box
              </Typography>
              <Typography variant="h5" gutterBottom>
                Share Resources, Build Community
              </Typography>
              <Typography variant="body1" paragraph>
                Join our platform to borrow what you need and lend what you don't use.
                Save money, reduce waste, and connect with your community.
              </Typography>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={() => router.push('/listings')}
                sx={{ mr: 2 }}
              >
                Start Browsing
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="inherit"
                onClick={() => router.push('/ItemManagement')}
              >
                List Your Items
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Image
                src="/hero-image.png"
                alt="Sharing Economy"
                width={500}
                height={400}
                style={{
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 2
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Join our growing community of sharers and borrowers today.
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/listings')}
            >
              Explore Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
