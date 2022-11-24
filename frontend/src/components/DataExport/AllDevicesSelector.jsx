import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getCall } from '../../Api/helpers';
import { useForm } from "react-hook-form";
import { GET_ALL_DEVICES } from '../../Api/apiPath';

export default function BasicSelect({ setSelectedDevice, SelectedDevice,setIsDeviceSelected }) {
    const [AllDeviceData, setAllDeviceData] = React.useState([]);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    React.useEffect(() => {
        getAllDevicesApi();
    }, [])

    const getAllDevicesApi = async function () {
        let { data } = await getCall({ path: `${GET_ALL_DEVICES}` })

        setAllDeviceData(data.data);

    }
    const handleChange = (event) => {
        setSelectedDevice(event.target.value);
        setIsDeviceSelected(true);
    };
    return (
        <div>
            <FormControl sx={{ m: 1, width: 248,mr:2 }}>
                <InputLabel id="demo-multiple-chip-label">Select Device</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    value={SelectedDevice}
                    label="Devices"
                    onChange={handleChange}
                

                >
                    {
                        AllDeviceData.map((device) => (

                            <MenuItem
                                onChange={handleChange}
                                key={device.devicenumber}
                                value={device.devicenumber}
                            // style={getStyles(name, selectedErrorCode, theme)}
                            >
                                {device.controllername}

                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        </div>
    );
}
