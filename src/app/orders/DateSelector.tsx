import * as React from "react";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface Props {
  label?: string;
  value: Date | null;
  onChange: (newDate: Date | null) => void;
  sx?: object;
}

export default function DateSelector({ label, value, onChange, sx }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label= {label}
        value={value}
        onChange={onChange}
        slotProps={{
          textField: {
            size: "medium",
            sx,               // your width / margin styles
          },
        }}
      />
    </LocalizationProvider>
  );
}