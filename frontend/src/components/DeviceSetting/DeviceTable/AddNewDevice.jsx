import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { postCall } from "../../../Api/helpers";
import { DASHBOARD_DATA } from "../../../Api/apiPath"
import DeviceAddForm from "./DeviceAddForm";



export default function FormDialog({ LineData, message , notify,update }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  return (
    <Box>
      <Button variant="outlined" onClick={handleClickOpen} size="small">
        Add New Device
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" >
        <DialogTitle sx={{ width: "30vw", }} >Add New Device</DialogTitle>
        <DialogContent sx={{ width: "50vw" }} >
          <DeviceAddForm open={open} setOpen={setOpen} LineData={LineData} ></DeviceAddForm>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
