"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

interface ItemFormProps {
  initialData: Partial<Item>;
  onSubmit: (data: Item) => void;
  categories: string[];
}
}

export default function ItemForm({ initialData, onSubmit, categories }: ItemFormProps) {

  const [item, setItem] = useState<Partial<Item>>(initialData);

  const handleChange = (field: keyof Item) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setItem({ ...item, [field]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(item as Item);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6, px: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Item Listing
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                label="Item Name"
                value={item.name}
                onChange={handleChange('name')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={item.description}
                onChange={handleChange('description')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                select
                label="Category"
                value={item.category}
                onChange={handleChange('category')}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                label="Price per Day"
                type="number"
                value={item.price}
                onChange={handleChange('price')}
              />
            </Grid>

                
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Available From"
                  value={item.startDate}
                  onChange={(newValue) => setItem({ ...item, startDate: newValue })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Available Until"
                  value={item.endTime}
                  onChange={(newValue) => setItem({ ...item, endTime: newValue })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCamera />}
                sx={{ mr: 2 }}
              >
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                {item.imageUrl.length}/9 images uploaded
              </Typography>
            </Grid>

            {item.imageUrl.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Grid container spacing={1}>
                  {item.imageUrl.map((image, index) => (
                    <Grid key={index} size={{ xs: 4, sm: 3, md: 2 }}>
                      <Box
                        component="img"
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  Create Item
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}