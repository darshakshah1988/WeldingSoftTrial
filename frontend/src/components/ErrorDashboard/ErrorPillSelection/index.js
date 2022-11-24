import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function ErrorPillSelection({
  errorInfo,
  setErrorInfo
}) {
  const { errorSet, selectedErrorCode, groupedErrorData } = errorInfo;
  // //console.log(errorInfo,"line 36")
  // //console.log(errorSet);
  // React.useEffect(() => {
  //   setErrorInfo({ ...errorInfo, selectedErrorCode: [] })
  // }, [...errorSet]);

  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setErrorInfo({ ...errorInfo, selectedErrorCode: value })
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 500 }}>
        <InputLabel id="demo-multiple-chip-label">Error Code</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          placeholder="Select error codes"
          value={selectedErrorCode || []}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {
            errorSet.map((name) => (

              <MenuItem
                onChange={handleChange}
                key={name}
                value={name}
              // style={getStyles(name, selectedErrorCode, theme)}
              >
                {name}

              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
}
