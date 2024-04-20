// HalfRating.js
import React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

export default function HalfRating({ value, readOnly, onChange }) {
    const handleChange = (event, newValue) => {
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <Stack spacing={1}>
            <Rating
                name="half-rating"
                value={value}
                precision={0.5}
                readOnly={readOnly}
                onChange={handleChange}
            />
        </Stack>
    );
}
