import React from "react";
import dayjs from "dayjs";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

function DatePickerInput({
    label = "Select Date",
    value,
    onChange,
    minDate,
    disablePast,
    slotProps,
    className,
    isDateTimePicker = false,
}) {
    const handleDateChange = (newValue) => {
        onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
    };

    const currentValue = value ? dayjs(value) : null;

    const commonProps = {
        label,
        value: currentValue,
        onChange: handleDateChange,
        className,
        minDate: minDate ? dayjs(minDate) : undefined,
        disablePast,
        slotProps: {
            textField: {
                fullWidth: true,
                ...slotProps?.textField,
            },
            ...slotProps
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {isDateTimePicker ? (
                <DateTimePicker {...commonProps} />
            ) : (
                <DatePicker {...commonProps} />
            )}
        </LocalizationProvider>
    );
}

export default DatePickerInput;