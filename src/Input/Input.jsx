import { TextField } from '@mui/material';
import React, {useState} from 'react';


const Input = ({ label, value, onChange }) => {
    const handleChange = (event) => {
        onChange(event.target.value);
    }
    return (
        <>
            {/* <TextField type="text" label={label} id="filled-basic" className="estilo-input" value={value} onChange={handleChange}></TextField> */}
            <input type="text" placeholder={label} className="estilo-input" value={value} onChange={handleChange} />
        </>
    )
}

export default Input