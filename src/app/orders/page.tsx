"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
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
import { getUserId } from "@/utils/auth";

interface Orders {
  id: string;
  item_name: string;
  payment: number;
  start_date: string;
  end_time: string;
  renter: {
    name: string;
  };
  renter_id: string;
  borrower_id: string;
  status: string;
}

const orderTypes = ['My Rentals', 'My Borrowings'];
const orderStatuses = ['ALL', 'PENDING', 'ACTIVE', 'CANCELLED', 'COMPLETED'];

export default function BasicSelect() {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [ordersType, setOrdersType] = useState(orderTypes[0]);
  const [orderStatus, setOrderStatus] = useState('ALL');

  const onOrderTypeChange = (event: SelectChangeEvent<typeof orderTypes[number]>) => {
    setOrdersType(event.target.value);
  };

  const onOrderStatusChange = (event: SelectChangeEvent<typeof orderStatuses[number]>) => {
    setOrderStatus(event.target.value);
  };

  useEffect(() => {
    console.log("🔄 useEffect fired");
    async function fetchData() {
      const api = "http://localhost:3005/orders";
      console.log(orderStatus);
      try {
        const id = localStorage.getItem('userId');
        console.log("User ID:", id);
        const response = await axios.get(api, {
          params: {
            start_date: startDate ? startDate.toISOString() : undefined,
            end_date: endDate ? endDate.toISOString() : undefined,
            user_id: id,
            status: orderStatus !== 'ALL' ? orderStatus : undefined,
          },
        });

        console.log("Fetched orders:", response.data);
        if (ordersType === 'My Rentals') {
          // Filter orders for 'My Rentals'
          const filteredOrders = response.data.rentOrders;
          console.log("Filtered Rent Orders:", filteredOrders);
          setOrders(filteredOrders);

        } else if (ordersType === 'My Borrowings') {
          // Filter orders for 'My Borrowings'
          const filteredOrders = response.data.borrowOrders;
          console.log("Filtered Borrow Orders:", filteredOrders);
          setOrders(filteredOrders);
        }

      }
      catch (err) {
        console.error('Error loading items:', err);
        setOrders([]); // set orders to empty array on error
      }
    }
    fetchData();
  }, [startDate, endDate, ordersType, orderStatus]); // add orderStatus and ordersType as a dependency

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
          <InputLabel id="orders-types-select-label">Order Type</InputLabel>
          <Select
            labelId="orders-types-select-label"
            name="orders-types-select"
            value={ordersType}
            label="Order Type"
            onChange={onOrderTypeChange}
          >
            {orderTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="medium" sx={{ width: 200 }}>
          <InputLabel id="orders-status-select-label">Order Status</InputLabel> {/* 改变 id */}
          <Select
            labelId="orders-status-select-label"
            name="orders-status-select"
            value={orderStatus}
            label="Order Status"
            onChange={onOrderStatusChange}
          >
            {orderStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
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
                <TableCell>Order Id</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Rent Start</TableCell>
                <TableCell>Rental End</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Renter</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.item_name}</TableCell>
                  <TableCell>{row.payment}</TableCell>
                  <TableCell>{new Date(row.start_date).toLocaleString()}</TableCell>
                  <TableCell>{new Date(row.end_time).toLocaleString()}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{String(row.renter.name)}</TableCell>
                  <TableCell>
                    {
                     (row.status === "PENDING" && getUserId() === row.renter_id) && 
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                            await axios.post(`http://localhost:3005/accept-order`, { orderId: row.id });
                            alert("Order Accepted");
                            router.push("/orders");
                        }}
                      >
                        Accept
                      </Button>
                    }
                  </TableCell>
                  <TableCell>
                    {
                     (row.status === "PENDING" && getUserId() === row.renter_id) && 
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                            await axios.post(`http://localhost:3005/reject-order`, { orderId: row.id });
                            alert("Order Rejected");
                            router.push("/orders");
                        }}
                      >
                        Reject
                      </Button>
                    }
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
