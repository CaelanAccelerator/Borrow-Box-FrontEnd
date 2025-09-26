"use client";

import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Button,
  CardMedia,
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
import { format} from 'date-fns';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserId, isLoggedIn } from '@/utils/auth';


interface Item {
  id: number;
  name: string;
  image_url: string[];
  price: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  owner: {
    name: string;
    id: string;
  };
  features: string[];
}
//   price: "99.99",
//   description: "High-end DSLR camera perfect for professional photography. Includes multiple lenses and accessories. Great for events and portrait photography.",
//   start_date: "2025-08-10",
//   end_date: "2025-08-20",
//   location: "Seattle, WA",
//   owner: "John Doe",
//   features: [
//     "24.2 Megapixel Full-Frame Sensor",
//     "4K Video Recording",
//     "Dual Memory Card Slots",
//     "Weather-Sealed Body"
//   ]
// };

export default function ItemDetail() {
  const [item, setItem] = useState<Item>();
  const [userInfo, setUserInfo] = useState<any>();
  const router = useRouter();
  const params = useParams();

 useEffect(() => {
    if (!isLoggedIn()) {
      alert('Please log in to access this page');
      router.push('/'); // Redirect to home instead of login
    }
  }, [router]);
  
  useEffect(() => {
    const fetchItemDetails = async () => {
      const item = await axios.get(`http://localhost:3005/uniqueItem`, { params });
      setItem(item.data);
      console.log("Fetched item details:", item.data);
      console.log("Fetched item details:", item.data.customer_id);
      const user = await axios.get(`http://localhost:3005/userInfo`, { params: { id: item.data.customer_id } });
      setUserInfo(user.data);
      console.log(user.data);
    };

    fetchItemDetails();
  }, []);

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
        {item?.image_url.slice(0, 9).map((url, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={3} sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardMedia
                component="img"
                image={url}
                alt={item?.name}
                sx={{
                  maxHeight: 320,
                  width: '100%',
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Right Column - Details */}
      <Grid size="grow">
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Title and Price */}
          <Typography variant="h4" component="h1" gutterBottom>
            {item?.name}
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
            {item?.price} per day
          </Typography>

          {/* Key Details */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size="grow">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="action" />
                <Typography>Owner: {userInfo?.name}</Typography>
              </Box>
            </Grid>
            <Grid size="grow">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="action" />
                <Typography>Location: </Typography>
              </Box>
            </Grid>
            <Grid size="grow">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonth color="action" />
                <Typography>
                  Available: {format(new Date(item?.start_date || Date.now()), 'MMM dd, yyyy')}
                  {' - '}
                  {format(new Date(item?.end_date || Date.now()), 'MMM dd, yyyy')}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Description */}
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1">
            {item?.description}
          </Typography>

          {/* Features */}
          {/* <Typography variant="h6" gutterBottom>
            Features
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {item?.features.map((feature, index) => (
              <Chip 
                key={index} 
                label={feature} 
                variant="outlined" 
                color="primary"
              />
            ))}
          </Box> */}

          {/* Action Button */}
          
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 'auto',
              py: 2
            }}
            disabled={getUserId() === userInfo?.id}
            onClick={async () => {
              try {
                console.log(params.id, getUserId());
                await axios.post('http://localhost:3005/borrowRequest', { itemId: params.id, userId: getUserId() });
                alert('Request sent successfully');
                router.push('/listings');
              } catch (error) {
                console.error('Failed to send request:', error);
              }
            }}
          >
            Request to Rent
          </Button>
        </Box>
      </Grid>
    </Container>
  );
}