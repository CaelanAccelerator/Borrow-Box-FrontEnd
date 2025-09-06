"use client";

import Masonry from 'react-masonry-css';
import { Box, Card, CardContent, CardMedia, FormControl, InputLabel, MenuItem, 
         Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { useState, useEffect } from 'react';
import DateSelector from './DateSelector';

// ===============================
// Styled Components
// ===============================
const StyledMasonry = styled(Masonry)({
  display: 'flex',
  marginLeft: '-30px', 
  width: 'auto',
  '& .my-masonry-grid_column': {
    paddingLeft: '30px',
    backgroundClip: 'padding-box',
  }
});

// ===============================
// Types & Interfaces
// ===============================
interface Item {
  id: number;
  name: string;
  image_url: string[];
  price: String;
  start_date: string;
  end_time: string;
}

type SortOrder = 'asc' | 'desc';
type OrderBy = 'price' | 'start_date' | 'end_time';

// ===============================
// Constants
// ===============================
const DEFAULT_IMAGE = '/ItemManagement/mock_image/20220602152901_7d355.jpg';

const categoryList = [
  'Computers', 'XBox', 'Balls', 'Books', 'Furniture', 'Kitchenware',
  'Sports', 'Electronics', 'Musical Instruments', 'Camping Gear',
  'Clothing', 'Tools', 'Board Games', 'Baby Items', 'Bikes',
  'Drones', 'Cameras', 'Appliances', 'Home Decor', 'Fitness Equipment',
];

const priceListStart = ['10', '20', '30', '40'];
const priceListEnd = ['20', '30', '40', '50', '60'];

const breakpointCols = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

// ===============================
// Main Component
// ===============================
export default function ItemManagement() {
  // ===============================
  // State Management
  // ===============================
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [start_date, setStartDate] = useState<Date | null>(new Date());
  const [end_time, setEndDate] = useState<Date | null>(null);
  const [order, setOrder] = useState<SortOrder>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('price');

  // ===============================
  // Event Handlers
  // ===============================
  const handleCardClick = (itemId: number) => {
    router.push(`/listings/${itemId}`);
  };

  const handleChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    switch (name) {
      case "category-select":
        setCategory(value);
        console.log("Selected category:", value);
        break;
      case "price-select-from":
        setPriceFrom(value);
        console.log("Selected price from:", value);
        break;
      case "price-select-to":
        setPriceTo(value);
        console.log("Selected price to:", value);
        break;
    }
  };

  // ===============================
  // Data Fetching
  // ===============================
  useEffect(() => {
    console.log("🔄 useEffect fired");
    async function fetchData() {
      const api = "http://localhost:3005/items";
      try {
        const response = await axios.get<{
          data: Item[];
          total: number;
          limit: number;
          offset: number;
        }>(api, {
          params: {
            category: category || null,
            priceFrom: priceFrom || null,
            priceTo: priceTo || null,
            start_date: start_date || null,
            end_time: end_time || null,
            order,
            orderBy
          }
        });
        setItems(response.data.data);
      } catch (err) {
        console.error('Error loading items:', err);
      }
    }
    fetchData();
  }, [category, priceFrom, priceTo, start_date, end_time, order, orderBy]);

  // ===============================
  // Render
  // ===============================
  return (
    <div>
      {/* Filter Section */}
      <Box sx={{
        minWidth: 200,
        fillWidth: "100%",
        alignItems: "center",
        gap: 4,
        display: "flex",
        padding: 2,
      }}>
        <FormControl size="medium" sx={{ width: 400 }}>
          <TextField
            id="listings-search-input"
            label="Search Items you are interested in"
          />
        </FormControl>
        <FormControl size="medium" sx={{ width: 200 }}>
          <InputLabel id="listings-category-select-label">Category</InputLabel>
          <Select
            name="category-select"
            value={category}
            label="Category"
            onChange={handleChange}
          >
            {categoryList.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="medium" sx={{ width: 200 }}>
          <InputLabel id="listings-price-select-label">Price</InputLabel>
          <Select
            labelId="listings-price-select-label"
            name="price-select-from"
            value={priceFrom}
            label="Price"
            onChange={handleChange}
          >
            {priceListStart.map((price) => (
              <MenuItem key={price} value={price}>
                {price}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="medium" sx={{ width: 200 }}>
          <InputLabel id="listings-price-select-label">Price</InputLabel>
          <Select
            labelId="listings-price-select-label"
            name="price-select-to"
            value={priceTo}
            label="Price"
            onChange={handleChange}
          >
            {priceListEnd.map((price) => (
              <MenuItem key={price} value={price}>
                {price}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="medium" sx={{ width: 200 }}>
          <DateSelector
            label="Start Date"
            value={start_date}
            onChange={(newDate) => { setStartDate(newDate); console.log("Selected start date:", newDate); }}
          />
        </FormControl>
        <FormControl size="medium" sx={{ width: 200 }}>
          <DateSelector
            label="End Date"
            value={end_time}
            onChange={(newDate) => { setEndDate(newDate); console.log("Selected end date:", newDate); }}
          />
        </FormControl>
      </Box>

      {/* Items Grid Section */}
      <Box sx={{ p: 2 }}>
        <StyledMasonry
          breakpointCols={breakpointCols}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {items.map((item) => (
            <Card
              key={item.id}
              sx={{
                mb: 3,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out',
                  boxShadow: 3
                }
              }}
              onClick={() => handleCardClick(item.id)}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.image_url[0] || DEFAULT_IMAGE}
                alt={item.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = item.image_url[0] || DEFAULT_IMAGE;
                }}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {item.name}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography> */}
                <Typography variant="h6" color="primary">
                  ${item.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.start_date ? new Date(item.start_date).toLocaleDateString() : 'N/A'} -
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.end_time ? new Date(item.end_time).toLocaleDateString() : 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </StyledMasonry>
      </Box>
    </div>
  );
}