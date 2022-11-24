import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { InputLabel, MenuItem, Select, FormControl, Button, FormHelperText, Switch } from '@mui/material';
import { putCall } from '../../../Api/helpers';
import { DEVICE_DATA } from "../../../Api/apiPath";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { notify, update } from '../../../uicomponents/Notifications/index';
import { GLOBAL_HEADING, REQUIRED_FIELDS } from "../../../Global/constants"

export default function DeviceUpdateForm({ setOpen, open, LineData, DeviceData }) {
    const [LineName, setLineName] = React.useState(LineData.find(line => line.lineNo == DeviceData.lineNo.toLowerCase()).lineNo);
    const [checked, setChecked] = React.useState(DeviceData.isDeviceDeactivated)
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const toastId = React.useRef(null);
    const callAPI = async (dataObj) => {
        notify(toastId);
        let {
            isApiConnectionSucceess,
            data,
        } = await putCall({ path: `${DEVICE_DATA}`, updatedData: dataObj });
        update(toastId, data.message, GLOBAL_HEADING.Device_Name);
        if (data.message == "Updated successfully") setOpen(false);

    }
    const onSubmit = (data) => {
        callAPI(data);
    };
    const handleChange = (event) => {
        setLineName(event.target.value);
    };
    const handleToggleChange = (event) => {
        setChecked(!checked)
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
                        defaultValue={
                            DeviceData.controllername
                        }
                        name="controllername"
                        {...register("controllername", { required: REQUIRED_FIELDS.CONTROLLER_NAME_REQUIRED })}
                        error={Boolean(errors.controllername)}
                        helperText={errors.controllername?.message}
                    />
                    <TextField
                        variant="standard"

                        id="demo-helper-text-aligned"
                        label="Customer Name*"
                        defaultValue={
                            DeviceData.customername
                        }
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
                        value={
                            DeviceData.devicenumber
                        }
                        name="devicenumber"
                        {...register("devicenumber")}
                        error={Boolean(errors.devicenumber)}
                        helperText={errors.devicenumber?.message}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <TextField
                        variant="standard"
                        id="demo-helper-text-aligned"
                        label="Gun Service Model*"
                        defaultValue={
                            DeviceData.gunservingmodel
                        }
                        {...register("gunservingmodel", { required: REQUIRED_FIELDS.GUN_SERIVCE_REQUIRED })}
                        error={Boolean(errors.gunservingmodel)}
                        helperText={errors.gunservingmodel?.message}
                    />
                    <TextField
                        variant="standard"
                        id="demo-helper-text-aligned"
                        label="Part Name*"
                        defaultValue={
                            DeviceData.partname
                        }
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
                        defaultValue={
                            DeviceData.spotcounterperjob
                        }
                        {...register("spotcounterperjob", { required: REQUIRED_FIELDS.SPOT_COUNTER_REQUIRED })}
                        error={Boolean(errors.spotcounterperjob)}
                        helperText={errors.spotcounterperjob?.message}
                    />
                    <TextField
                        variant="standard"
                        id="demo-helper-text-aligned"
                        label="Fixture Name*"
                        defaultValue={
                            DeviceData.fixturenumber
                        }
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
                        defaultValue={
                            DeviceData.tipdress
                        }
                        {...register("tipdress", { required: REQUIRED_FIELDS.TIP_ADDRESS_REQUIRED })}
                        error={Boolean(errors.tipdress)}
                        helperText={errors.tipdress?.message}
                    />
                    <TextField
                        variant="standard"
                        id="demo-helper-text-aligned"
                        label="Tip Change*"
                        defaultValue={
                            DeviceData.tipchange
                        }
                        {...register("tipchange", { required: REQUIRED_FIELDS.TIP_CHANGE_REQUIRED })}
                        error={Boolean(errors.tipchange)}
                        helperText={errors.tipchange?.message}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}   >
                    <Box>
                        <InputLabel id="demo-helper-text-aligned">Is Device Deactivated</InputLabel>
                        <Switch
                            variant="standard"
                            id="demo-helper-text-aligned"
                            label="Is Device Deactivated"
                            {...register("isDeviceDeactivated")}
                            error={Boolean(errors.isDeviceDeactivated)}
                            helperText={errors.isDeviceDeactivated?.message}
                            value={checked}
                            checked={checked}
                            onChange={handleToggleChange}
                            inputProps={{ 'aria-label': 'controlled' }}

                        />
                    </Box>
                    <TextField
                        variant="standard"
                        id="demo-helper-text-aligned"
                        label="Device Deactivated Reason"
                        defaultValue={
                            DeviceData.deactivatedReason
                        }
                        {...register("deactivatedReason")}
                        error={Boolean(errors.deactivatedReason)}
                        helperText={errors.deactivatedReason?.message}
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
