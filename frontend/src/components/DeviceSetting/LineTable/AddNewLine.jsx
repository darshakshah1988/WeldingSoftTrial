import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { postCall } from "../../../Api/helpers";
import { DASHBOARD_DATA } from "../../../Api/apiPath"
import { isEmpty } from 'lodash';
import { useForm } from "react-hook-form";
import { FormHelperText } from '@mui/material';
import { notify, update } from '../../../uicomponents/Notifications';
import {  GLOBAL_HEADING, LINE_TEXT_FILED_STYLE, REQUIRED_FIELDS } from "../../../Global/constants";

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const toastId = React.useRef(null);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const callAPI = async (NewLineName) => {
    notify(toastId);
    let {
      isApiConnectionSucceess,
      data
    } = await postCall({ path: `${DASHBOARD_DATA}`, Data: NewLineName });
    //console.log(data.message);
    update(toastId, data.message, GLOBAL_HEADING.Line_Name);

    if (data.message == "Added successfully") setOpen(false);
  }
  const onSubmit = (data) => {
    //console.log(data)
    callAPI(data.NewLineName)
  };
  const handleClose = () => {
    // callAPI();
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} size="small">
        Add New Line
      </Button>
      <Dialog open={open} onClose={handleClose} >
        <DialogTitle sx={{ width: "30vw" }} >Add Line Name
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} >
          <DialogContent sx={{ width: "30vw" }}>

            <TextField
              variant={LINE_TEXT_FILED_STYLE.variant}
              id={LINE_TEXT_FILED_STYLE.id}
              label="New Line Name*"
              fullWidth
              {...register("NewLineName", { required:REQUIRED_FIELDS.ADD_LINE_REQUIRED })}
              error={Boolean(errors.NewLineName)}
              helperText={errors.NewLineName?.message}
            />
            <FormHelperText style={{ color: '#d32f2f' }}>{errors.tnc?.message}</FormHelperText>
          </DialogContent>
          <DialogActions sx={{ width: "30vw" }}>
            <Button onClick={handleClose} variant="outlined"
              color="error" className='mx-4'>Cancel</Button>
            <Button variant="outlined" type="submit">Add Line</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div >
  );
}
