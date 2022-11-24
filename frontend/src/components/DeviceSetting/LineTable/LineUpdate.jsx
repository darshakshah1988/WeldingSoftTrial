import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormHelperText } from '@mui/material'
import { putCall } from "../../../Api/helpers";
import { DASHBOARD_DATA } from "../../../Api/apiPath"
import { useForm } from "react-hook-form";
import { GLOBAL_HEADING, LINE_TEXT_FILED_STYLE, REQUIRED_FIELDS } from "../../../Global/constants"
import { notify, update } from '../../../uicomponents/Notifications';
export default function FormDialog(lineInfo) {
    const [open, setOpen] = React.useState(false);
    const toastId = React.useRef(null);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const handleClickOpen = () => {
        setOpen(true);
    };
    const onSubmit = (data) => {
        // //console.log(data)
        putDataFromAPI(data.updatedName)
    };
    const putDataFromAPI = async (updatedName) => {
        notify(toastId);
        let {
            isApiConnectionSucceess,
            data
        } = await putCall({ path: `${DASHBOARD_DATA}/${lineInfo.lineInfo.lineNo}`, updatedData: updatedName });
        //console.log(data.message);
        update(toastId, data.message, GLOBAL_HEADING.Line_Name);
        if (data.message == "Updated successfully") setOpen(false);

    }
    const handleClose = () => {

        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen} size="small">
                Edit Line
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ width: "30vw" }}>Update Line Name</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent sx={{ width: "30vw" }}>


                        <TextField
                            variant={LINE_TEXT_FILED_STYLE.variant}
                            id={LINE_TEXT_FILED_STYLE.id}
                            label="Update Line Name*"
                            fullWidth
                            {...register("updatedName", { required: REQUIRED_FIELDS.UPDATE_LINE_REQUIRED })}
                            error={Boolean(errors.updatedName)}
                            helperText={errors.updatedName?.message}
                        />
                        <FormHelperText style={{ color: '#d32f2f' }}>{errors.tnc?.message}</FormHelperText>
                    </DialogContent>
                    <DialogActions sx={{ width: "30vw" }}>
                        <Button onClick={handleClose} variant="outlined"
                            color="error" className='mx-4' >Cancel</Button>
                        <Button variant="outlined" type="submit">Update</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}
