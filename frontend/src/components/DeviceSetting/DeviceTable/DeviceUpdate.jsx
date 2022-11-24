import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeviceUpdateForm from "./DeviceUpdateForm";


export default function FormDialog({ LineData,DeviceData, message , notify,update }) {
   
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
        Edit Device
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" >
        <DialogTitle sx={{ width: "30vw", }} >Edit Device</DialogTitle>
        <DialogContent sx={{ width: "50vw" }} >
          <DeviceUpdateForm open={open} setOpen={setOpen} LineData={LineData} DeviceData={DeviceData} ></DeviceUpdateForm>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
