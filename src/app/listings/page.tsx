"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import FilterBars from "./FilterBars";
import { TableSortLabel} from "@mui/material";
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
import { Button } from "antd";

interface Item {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  startTime: string;
  endTime: string;
}

export default function BasicSelect() {
  const [category, setCategory] = React.useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [price, setPrice] = React.useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  type SortOrder = 'asc' | 'desc';
  const [order, setOrder] = useState<SortOrder>('asc');
  type OrderBy = 'price' | 'startDate' | 'EndDate';
  const [orderBy, setOrderBy] = useState<OrderBy>('price');

  useEffect(() => {
    console.log("🔄 useEffect fired");
    async function fetchData() {
      const api = "http://localhost:4000/items";
      try {
        const response = await axios.get<Item[]>(api, {
          params: {
            category: category || null,
            price: price || null,
            startDate: startDate || null,
            endDate: endDate || null,
            order,
            orderBy
          }
        });
        setItems(response.data);
      }
      catch (err) {
        console.error('Error loading items:', err);
      }
    }
    fetchData();
  }, [category, price, startDate, endDate, order, orderBy]);

  

  const handleSort = (orderFactor: OrderBy) => {
    const isAsc: SortOrder = order === 'asc' ? 'desc' : 'asc';
    setOrderBy(orderFactor);
    setOrder(isAsc);
  }

  const router = useRouter();

  return (
    <div>
      <FilterBars/>
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
                      src={row.imageUrl}
                      alt={row.name}
                      width={400}
                      height={400}
                    />
                  </TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.startTime}</TableCell>
                  <TableCell>{row.endTime}</TableCell>
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
