import React, { useState } from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box, TextField } from "@mui/material";
import DateSelector from "./DateSelector";

  const categoryList = [
    'Computers', 'XBox', 'Balls', 'Books', 'Furniture', 'Kitchenware',
    'Sports', 'Electronics', 'Musical Instruments', 'Camping Gear',
    'Clothing', 'Tools', 'Board Games', 'Baby Items', 'Bikes',
    'Drones', 'Cameras', 'Appliances', 'Home Decor', 'Fitness Equipment',
  ];

  const priceList = [
    'Below 10', '10 ~ 20', '20 ~ 30', '30 ~ 50', '50 ~ 100', 'Above 100'
  ];

export default () =>{

  const [category, setCategory] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const handleChange = (event: SelectChangeEvent) => {
      if (event.target.name === "category-select") {
        setCategory(event.target.value as string);
        console.log("Selected category:", event.target.value);
      }
      else if (event.target.name === "price-select") {
        setPrice(event.target.value as string);
        console.log("Selected price range:", event.target.value);
      }
    };
  
  return(
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
            name="price-select"
            value={price}
            label="Price"
            onChange={handleChange}
          >
            {priceList.map((price) => (
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
    </div>
  )
}
