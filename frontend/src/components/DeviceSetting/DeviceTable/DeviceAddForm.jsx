import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { InputLabel, MenuItem, Select, FormControl, DialogActions, Button, FormHelperText, FormControlLabel } from '@mui/material';
import { postCall } from '../../../Api/helpers';
import { DEVICE_DATA } from "../../../Api/apiPath";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { notify, update } from '../../../uicomponents/Notifications/index';
import { GLOBAL_HEADING,REQUIRED_FIELDS } from "../../../Global/constants"

export default function HelperTextAligned({ setOpen, open, LineData, }) {
    const [LineName, setLineName] = React.useState('');

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const toastId = React.useRef(null);
    const callAPI = async (dataObj) => {
        notify(toastId);
        let {
            isApiConnectionSucceess,
            data,
        } = await postCall({ path: `${DEVICE_DATA}`, Data: dataObj });
        update(toastId, data.message, GLOBAL_HEADING.Device_Name);
        if (data.message == "Added successfully") setOpen(false);

    }
    const onSubmit = (data) => {
        callAPI(data);
    };
    const handleChange = (event) => {
        setLineName(event.target.value);
    };
    const handleClose = () => {
        setOpen(false);
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: "center",
                    '& > :not(style)': { m: 1 },
                    height: "100%"
                }}
            >

                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <TextField

                        variant="standard"
                        id="demo-helper-text-aligned"
                        label="Controller  Number*"

                        name="controllername"
                        {...register("controllername", { required: REQUIRED_FIELDS.CONTROLLER_NAME_REQUIRED })}
                        error={Boolean(errors.controllername)}
                        helperText={errors.controllername?.message}
                    />
                    <TextField
                        variant="standard"

                        id="demo-helper-text-aligned"
                        label="Customer Name*"

                        name="customername"
                        {...register("customername", { required: REQUIRED_FIELDS.CUSTOMER_NAME_REQUIRED })}
                        error={Boolean(errors.customername)}
                        helperText={errors.customername?.message}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <FormControl sx={{ minWidth: "25%" }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Line Name</InputLabel>
                        <Select
                            variant="standard"
                            // className="w-48"
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={LineName}
                            {...register("lineNo", { required: REQUIRED_FIELDS.LINE_NAME_REQUIRED })}
                            error={Boolean(errors.lineNo)}
                            helperText={errors.lineNo?.message}
                            label="Line Number*"
                            onChange={handleChange}
                        >
                            {LineData.map((line, i) => {
                                return <MenuItem value={line.lineNo} key={i}>{line.lineName}</MenuItem>

                            })}

                        </Select>
                    </FormControl>
                    <TextField
                        variant="standard"

                        id="demo-helper-text-aligned"
                        label="Device Number*"

                        name="devicenumber"
                        {...register("devicenumber", { required: REQUIRED_FIELDS.DEVICE_NAME_REQUIRED })}
                        error={Boolean(errors.devicenumber)}
                        helperText={errors.devicenumber?.message}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <TextField
                        variant="standard"
                        id="demo-helper-text-aligned"
                        label="Gun Service Model*"
                        {...register("gunservingmodel", { required: REQUIRED_FIELDS.GUN_SERIVCE_REQUIRED })}
                        error={Boolean(errors.gunservingmodel)}
                        helperText={errors.gunservingmodel?.message}
                    />
                    <TextField
                        variant="standard"
                        id="demo-helper-text-aligned"
                        label="Part Name*"
                        {...register("partname", { required: REQUIRED_FIELDS.PART_NAME_REQUIRED })}
                        error={Boolean(errors.partname)}
                        helperText={errors.partname?.message}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>

                    <TextField
                        variant="standard"
                        id="demo-helper-text-aligned"
                        label="Spot Counter Job*"
                        {...register("spotcounterperjob", { required: REQUIRED_FIELDS.SPOT_COUNTER_REQUIRED })}
                        error={Boolean(errors.spotcounterperjob)}
                        helperText={errors.spotcounterperjob?.message}
                        type="number"
                    />
                    <TextField
                        variant="standard"
                        id="demo-helper-text-aligned"
                        label="Fixture Name*"
                        {...register("fixturenumber", { required: REQUIRED_FIELDS.FIXTURE_REQUIRED })}
                        error={Boolean(errors.fixturenumber)}
                        helperText={errors.fixturenumber?.message}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}   >
                    <TextField
                        variant="standard"
                        id="demo-helper-text-aligned"
                        label="Tip Address*"
                        {...register("tipdress", { required: REQUIRED_FIELDS.TIP_ADDRESS_REQUIRED })}
                        error={Boolean(errors.tipdress)}
                        helperText={errors.tipdress?.message}
                        type="number"
                    />
                    <TextField
                        variant="standard"
                        id="demo-helper-text-aligned"
                        label="Tip Change*"
                        {...register("tipchange", { required: REQUIRED_FIELDS.TIP_CHANGE_REQUIRED })}
                        error={Boolean(errors.tipchange)}
                        helperText={errors.tipchange?.message}
                        type="number"
                    />
                </Box>
                <FormHelperText style={{ color: '#d32f2f' }}>{errors.tnc?.message}</FormHelperText>
                <Box>
                    <Button onClick={handleClose} variant="outlined"
                        color="error" className='mx-4'>Cancel</Button>
                    <Button variant="outlined" type="submit" >
                        Submit
                    </Button>
                </Box>

            </Box >
        </form>
    );
}
