"use client";

// ===============================
// Imports
// ===============================
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { Button, Fab, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TableSortLabel, TextField } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import DateSelector from "./DateSelector";

// ===============================
// Types & Interfaces
// ===============================
// Define the structure for item data
interface Item {
  id: number;
  name: string;
  image_url: string;
  price: String;
  start_date: string;
  end_time: string;
}

// Define possible sort orders and sortable fields
type SortOrder = 'asc' | 'desc';
type OrderBy = 'price' | 'start_date' | 'end_time';

// ===============================
// Constants
// ===============================
// Available categories for item filtering
const categoryList = [
  'Computers', 'XBox', 'Balls', 'Books', 'Furniture', 'Kitchenware',
  'Sports', 'Electronics', 'Musical Instruments', 'Camping Gear',
  'Clothing', 'Tools', 'Board Games', 'Baby Items', 'Bikes',
  'Drones', 'Cameras', 'Appliances', 'Home Decor', 'Fitness Equipment',
];

// Price range options for filtering
const priceListStart = ['0', '10', '20', '30', '40'];
const priceListEnd = ['20', '30', '40', '50', '60'];

// ===============================
// Main Component
// ===============================
export default function BasicSelect() {
  // ===============================
  // State Management
  // ===============================
  // Items data and filtering states
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  // Date range states
  const [start_date, setStartDate] = useState<Date | null>(new Date());
  const [end_time, setEndDate] = useState<Date | null>(null);

  // Sorting states
  const [order, setOrder] = useState<SortOrder>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('price');

  // Router for navigation
  const router = useRouter();

  // ===============================
  // Data Fetching
  // ===============================
  useEffect(() => {
    
    // Fetch items based on current filters and sorting
    async function fetchData() {
      const api = "http://localhost:3005/myItems";
      try {
        const response = await axios.get<{
          data: Item[];
          total: number;
          limit: number;
          offset: number;
        }>(api, {
          params: {
            userId: localStorage.getItem('userId'),
            category: category || null,
            priceFrom: priceFrom || null,
            priceTo: priceTo || null,
            start_date: start_date || null,
            end_time: end_time || null,
            order,
            orderBy,
          }
        });
        setItems(response.data.data);
        console.log(response.data.total);
        console.log(response.data.limit);
        console.log(api);
      }
      catch (err) {
        console.error('Error loading items:', err);
      }
    }
    fetchData();
  }, [category, priceFrom, priceTo, start_date, end_time, order, orderBy]);

  // ===============================
  // Event Handlers
  // ===============================
  // Handle changes in filter dropdowns
  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.name === "category-select") {
      setCategory(event.target.value as string);
      console.log("Selected category:", event.target.value);
    }
    else if (event.target.name === "price-select-from") {
      setPriceFrom(event.target.value as string);
      console.log("Selected price range:", event.target.value);
    }
    else if (event.target.name === "price-select-to") {
      setPriceTo(event.target.value as string);
      console.log("Selected price range:", event.target.value);
    }
  };

  // Handle sorting column clicks
  const handleSort = (orderFactor: OrderBy) => {
    const isAsc: SortOrder = order === 'asc' ? 'desc' : 'asc';
    setOrderBy(orderFactor);
    setOrder(isAsc);
  }

  // ===============================
  // Render
  // ===============================
  return (
    <div>
      {/* Filter Section */}
      <Box
        sx={{
          minWidth: 200,
          fillWidth: "100%",
          alignItems: "center",
          gap: 4,
          display: "flex",
          padding: 2,
        }}
      >
        {/* Search Input */}
        <FormControl size="medium" sx={{ width: 400 }}>
          <TextField
            id="listings-search-input"
            label="Search Items you are interested in"
          />
        </FormControl>

        {/* Category Filter */}
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

        {/* Price Range Filters */}
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

        {/* Date Range Selectors */}
        <FormControl size="medium" sx={{ width: 200 }}>
          <DateSelector
            label="Start Date"
            value={start_date}
            onChange={(newDate) => { setStartDate(newDate);  }}
          />
        </FormControl>
        <FormControl size="medium" sx={{ width: 200 }}>
          <DateSelector
            label="End Date"
            value={end_time}
            onChange={(newDate) => { setEndDate(newDate);}}
          />
        </FormControl>
      </Box>

      {/* Items Table */}
      <Box sx={{ marginTop: 0, padding: 2, position: 'relative', minHeight: '80vh' }}>
        <TableContainer component={Paper}>
          {/* Table Header with Sortable Columns */}
          <Table>

            {/* Table Header */}
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>
                  <TableSortLabel direction={order} onClick={() => handleSort('price')} >Price</TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction={order} onClick={() => handleSort('start_date')}>Available Begin</TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction={order} onClick={() => handleSort('end_time')}>Rental at end</TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body with Item Rows */}
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <img
                      src={row.image_url[0]}
                      alt={row.name}
                      width={400}
                      height={400}
                    />
                  </TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{new Date(row.start_date).toLocaleString()}</TableCell>
                  <TableCell>{new Date(row.end_time).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {     // ← prevent the row’s onClick
                        console.log("have added");
                        router.push(`/ItemManagement/updateItem/${row.id}`);       // ← actually call your handler
                      }}
                    >
                      Edit or Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Fab
          color="primary"
          sx={{
            position: 'absolute',  // Changed from 'fixed' to 'absolute'
            bottom: 24,           // Adjust this value as needed
            left: '50%',
            transform: 'translateX(-50%)',
            minWidth: 200,
            borderRadius: 1,
            zIndex: 1,           // Ensure button stays above table
          }}
        >
          <Button
            variant="contained"
            onClick={() => router.push('/ItemManagement/newItem')}
            sx={{ 
              width: '100%',
              height: '100%',
              borderRadius: 'inherit' // match parent's border radius
            }}
          >
            Add New Item
          </Button>
        </Fab>
      </Box>
    </div>
  );
}
