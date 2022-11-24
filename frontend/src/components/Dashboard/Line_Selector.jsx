import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectAutoWidth() {
  const [line, setline] = React.useState('');

  const handleChange = (event) => {
    setline(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 80}}>
        <InputLabel id="demo-simple-select-autowidth-label" sx={{ color:"white" }}>All</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={line}
          onChange={handleChange}
          autoWidth
          label="All"
          sx={{ color:"white" }}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          <MenuItem value={10}>Line 1</MenuItem>
          <MenuItem value={21}>Line 2</MenuItem>
          <MenuItem value={22}>Line 3</MenuItem>
          <MenuItem value={22}>Line 4</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
