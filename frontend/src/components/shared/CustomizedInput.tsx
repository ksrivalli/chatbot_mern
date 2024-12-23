import React from 'react';
import { TextField } from '@mui/material';

type Props = {
  name: string;
  type: 'text' | 'password' | 'email';
  label: string;
};

const CustomizedInput = (props: Props) => {
  return (
    <TextField
    margin='normal'
      name={props.name}
      label={props.label}
      type={props.type}
      sx={{
        '& .MuiInputLabel-root': { color: 'white' }, // Label color
        '& .MuiOutlinedInput-root': {
          borderRadius: 10, // Rounded corners for the input field
          fontSize: 20, // Input text font size
          '& fieldset': { borderColor: 'white' }, // Border color
          '&:hover fieldset': { borderColor: 'lightgray' }, // Hover border color
          '&.Mui-focused fieldset': { borderColor: 'white' }, // Focused border color
        },
        '& .MuiInputBase-input': {
          color: 'white', // Input text color
          width: '400px', // Input width
        },
      }}
    />
  );
};

export default CustomizedInput;