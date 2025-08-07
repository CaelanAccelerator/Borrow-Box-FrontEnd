"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TableSortLabel, TextField } from "@mui/material";
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

interface Item {
  id: string;
  name: string;
  image_url: string;
  price: number;
  start_date: string;
  end_time: string;
}

const categoryList = [
  'Computers', 'XBox', 'Balls', 'Books', 'Furniture', 'Kitchenware',
  'Sports', 'Electronics', 'Musical Instruments', 'Camping Gear',
  'Clothing', 'Tools', 'Board Games', 'Baby Items', 'Bikes',
  'Drones', 'Cameras', 'Appliances', 'Home Decor', 'Fitness Equipment',
];

const priceListStart = [
  '10', '20', '30', '40'
];

const priceListEnd = [
  '20', '30', '40', '50', '60'
];


export default function BasicSelect() {

  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  type SortOrder = 'asc' | 'desc';
  const [order, setOrder] = useState<SortOrder>('asc');
  type OrderBy = 'price' | 'startDate' | 'EndDate';
  const [orderBy, setOrderBy] = useState<OrderBy>('price');

  useEffect(() => {
    console.log("🔄 useEffect fired");
    async function fetchData() {
      const api = "http://localhost:3005/";
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
            startDate: startDate || null,
            endDate: endDate || null,
            order,
            orderBy
          }
        });
        setItems(response.data.data);
      }
      catch (err) {
        console.error('Error loading items:', err);
      }
    }
    fetchData();
  }, [category, priceFrom, priceTo, startDate, endDate, order, orderBy]);

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

  const handleSort = (orderFactor: OrderBy) => {
    const isAsc: SortOrder = order === 'asc' ? 'desc' : 'asc';
    setOrderBy(orderFactor);
    setOrder(isAsc);
  }

  const router = useRouter();

  return (
    <div>
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
            value={startDate}
            onChange={(newDate) => { setStartDate(newDate); console.log("Selected start date:", newDate); }}
          />
        </FormControl>
        <FormControl size="medium" sx={{ width: 200 }}>
          <DateSelector
            label="End Date"
            value={endDate}
            onChange={(newDate) => { setEndDate(newDate); console.log("Selected end date:", newDate); }}
          />
        </FormControl>
      </Box>
      <Box sx={{ marginTop: 0, padding: 2 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>
                  <TableSortLabel direction={order} onClick={() => handleSort('price')} >Price</TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction={order} onClick={() => handleSort('startDate')}>Available Begin</TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction={order} onClick={() => handleSort('EndDate')}>Rental at end</TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.name} onClick={() => { router.push(`/listings/${row.id}`) }}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <img
                      src={row.image_url}
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
                      onClick={(e) => {
                        e.stopPropagation();        // ← prevent the row’s onClick
                        console.log("have added");       // ← actually call your handler
                      }}
                    >
                      Add in Item Chart
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}
