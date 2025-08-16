"use client";

import { useParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  Card, 
  CardMedia, 
  Chip,
  Container, 
  Divider, 
  Grid, 
  Paper, 
  Typography 
} from '@mui/material';
import { 
  CalendarMonth, 
  ArrowBack,
  LocationOn,
  Person,
  AttachMoney 
} from '@mui/icons-material';
import { format } from 'date-fns';

// Mock data for testing - replace with real API call
const mockItem = {
  id: 1,
  name: "Professional DSLR Camera",
  image_url: "/ItemManagement/mock_image/20220602152901_7d355.jpg",
  price: "99.99",
  description: "High-end DSLR camera perfect for professional photography. Includes multiple lenses and accessories. Great for events and portrait photography.",
  start_date: "2025-08-10",
  end_date: "2025-08-20",
  location: "Seattle, WA",
  owner: "John Doe",
  features: [
    "24.2 Megapixel Full-Frame Sensor",
    "4K Video Recording",
    "Dual Memory Card Slots",
    "Weather-Sealed Body"
  ]
};

export default function ItemDetail() {
  const router = useRouter();
  const params = useParams();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button 
        startIcon={<ArrowBack />}
        onClick={() => router.back()}
        sx={{ mb: 4 }}
      >
        Back to Items
      </Button>

      <Grid container spacing={4}>
        {/* Left Column - Image */}
        <Grid size="grow">
          <Paper elevation={3}>
            <CardMedia
              component="img"
              height="500"
              image={mockItem.image_url}
              alt={mockItem.name}
              sx={{ 
                objectFit: 'cover',
                borderRadius: 1
              }}
            />
          </Paper>
        </Grid>

        {/* Right Column - Details */}
        <Grid size="grow">
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Title and Price */}
            <Typography variant="h4" component="h1" gutterBottom>
              {mockItem.name}
            </Typography>
            <Typography 
              variant="h5" 
              color="primary" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mb: 3 
              }}
            >
              <AttachMoney />
              {mockItem.price} per day
            </Typography>

            {/* Key Details */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size="grow">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person color="action" />
                  <Typography>Owner: {mockItem.owner}</Typography>
                </Box>
              </Grid>
              <Grid size="grow">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn color="action" />
                  <Typography>Location: {mockItem.location}</Typography>
                </Box>
              </Grid>
              <Grid size="grow">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonth color="action" />
                  <Typography>
                    Available: {format(new Date(mockItem.start_date), 'MMM dd, yyyy')} 
                    {' - '}
                    {format(new Date(mockItem.end_date), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Description */}
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {mockItem.description}
            </Typography>

            {/* Features */}
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              {mockItem.features.map((feature, index) => (
                <Chip 
                  key={index} 
                  label={feature} 
                  variant="outlined" 
                  color="primary"
                />
              ))}
            </Box>

            {/* Action Button */}
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                mt: 'auto',
                py: 2
              }}
            >
              Request to Rent
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}