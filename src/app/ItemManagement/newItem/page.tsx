"use client";

import { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from 'axios';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { getToken, getUserId, isLoggedIn } from '@/utils/auth'; 
import { uploadMultipleImages, validateMultipleImages } from '../cloud/cloud';

const categories = [
  'Computers', 'XBox', 'Balls', 'Books', 'Furniture', 'Kitchenware',
  'Sports', 'Electronics', 'Musical Instruments', 'Camping Gear',
];

interface NewItem {
  name: string;
  description: string;
  category: string;
  price: string;
  imageUrl: string[];
  startDate: Date | null;
  endTime: Date | null;
}

export default function NewItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [item, setItem] = useState<NewItem>({
    name: '',
    description: '',
    category: '',
    price: '',
    imageUrl: [],
    startDate: null,
    endTime: null,
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      alert('Please login first');
      router.push('/login');
    }
  }, [router]);

  // Image upload handler (only save files, do not upload immediately)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);

      if (selectedFiles.length + newFiles.length > 9) {
        alert('Maximum 9 images allowed');
        return;
      }

      // Validate images
      const validation = validateMultipleImages(newFiles);
      if (!validation.isValid) {
        setUploadError(validation.errors.join('\n'));
        alert(validation.errors.join('\n'));
        return;
      }

      setSelectedFiles(prev => [...prev, ...newFiles]);
      setUploadError(null);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setItem(prev => ({
      ...prev,
      imageUrl: prev.imageUrl.filter((_, i) => i !== index)
    }));
  };

  // Handle form field change
  const handleChange = (field: keyof NewItem) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setItem({ ...item, [field]: event.target.value });
  };

  // Form submit handler (upload images to cloud on submit)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setUploadingImages(true);
    try {
      // Upload all image files to cloud
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        imageUrls = await uploadMultipleImages(selectedFiles);
      }

      const token = getToken();
      const dataToBackend = {
        customerId: Number(getUserId()),
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        imageUrl: imageUrls, // Use the URLs just uploaded
        startDate: item.startDate?.toISOString(),
        endTime: item.endTime?.toISOString(),
      };

      console.log('Submitting dataToBackend:', dataToBackend);

      await axios.post('http://localhost:3005/createItem', dataToBackend, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      alert('Item created successfully!');
      router.push('/ItemManagement');
    } catch (error: any) {
      console.error('Error creating item:', error);
      if (error.response?.status === 401) {
        alert('Authentication failed. Please login again.');
        router.push('/login');
      } else {
        alert('Failed to create item. Please try again.');
      }
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  /*
    ****************************************************************
    UI Section
    ****************************************************************
  */
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

            {/* Image upload area */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={uploadingImages ? <CircularProgress size={20} /> : <PhotoCamera />}
                  disabled={uploadingImages || item.imageUrl.length >= 9}
                >
                  {uploadingImages ? 'Uploading...' : 'Upload Images'}
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary">
                  {selectedFiles.length}/9 images uploaded
                </Typography>
              </Box>
              {uploadError && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {uploadError}
                </Typography>
              )}
            </Grid>

            {/* Selected images preview */}
            {selectedFiles.length > 0 && (
              <Grid size={{ xs: 24 }}>
                <Typography variant="h6" gutterBottom>
                  Selected Images:
                </Typography>
                <Grid container spacing={2}>
                  {selectedFiles.map((file, index) => (
                    <Grid key={index} size={{ xs: 16, sm: 12, md: 8 }}>
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removeImage(index)}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            minWidth: 'auto',
                            p: 0.5,
                          }}
                        >
                          remove
                        </Button>
                      </Box>
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
                  disabled={loading || uploadingImages}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || uploadingImages || selectedFiles.length === 0}
                >
                  {loading ? 'Creating...' : 'Create Item'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}