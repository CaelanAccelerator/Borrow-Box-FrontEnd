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
  item_name: string;
  payment: number;
  start_date: string;
  end_time: string;
  renter_name: string;
}

export default function BasicSelect() {

  const [items, setItems] = useState<Item[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    console.log("🔄 useEffect fired");
    async function fetchData() {
      const api = "http://localhost:3001/orders";
      try {
        // const response = await axios.get<{
        //   data: Item[];
        //   total: number;
        //   limit: number;
        //   offset: number;
        // }>(api,);
        const response = await axios.get(api);
        setItems(response.data);
      }
      catch (err) {
        console.error('Error loading items:', err);
      }
    }
    fetchData();
  }, [startDate, endDate]);

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
            label="Search the ORDER NAME or ORDER ID"
          />
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
                <TableCell>Order Id</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Rent Start</TableCell>
                <TableCell>Rental End</TableCell>
                <TableCell>Renter</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.id} onClick={() => { router.push(`/Orders${row.id}`) }}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.item_name}</TableCell>
                  <TableCell>{row.payment}</TableCell>
                  <TableCell>{new Date(row.start_date).toLocaleString()}</TableCell>
                  <TableCell>{new Date(row.end_time).toLocaleString()}</TableCell>
                  <TableCell><a href="http://localhost:3000/profile">{row.renter_name}</a></TableCell>
                  <TableCell>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("have applied");       // ← actually call your handler
                      }}
                    >
                      Finish or Canncel Rental
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
