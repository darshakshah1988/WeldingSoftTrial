import { Alert, Button, TextField, Typography, } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Stack } from '@mui/system';
import { Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import React, { Component, useEffect, useState } from 'react';
import Loader from '../../uicomponents/Loader';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { GET_ALL_DEVICES, DEVICE_DATA } from '../../Api/apiPath';
import {downloadCSV} from './utils'

import Sidebar from "../sidebar/Sidebar";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getCall } from "../../Api/helpers";
import { CUMMILATIVE_DASHBOARD_DATA } from "../../Api/apiPath";
import "react-toastify/dist/ReactToastify.css";
import { notify, update, validate } from '../../uicomponents/Notifications/index';
import { GLOBAL_HEADING, REQUIRED_FIELDS } from "../../Global/constants"
import AllDevicesSelector from "./AllDevicesSelector";
import DownloadCSV from "./DownloadCSV"
import DownloadCSV2 from "./DownloadCSV2"
import dayjs from 'dayjs';
import { useForm } from "react-hook-form";
var advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)

export function DataExport() {
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [SelectedDevice, setSelectedDevice] = useState("");
    const [isDeviceSelected, setIsDeviceSelected] = useState(false);
    const [isValidationAlertVisible, setIsValidationAlertVisible] = useState(false);
    const [data, setData] = useState([])

    const [durationInfo, setDurationInfo] = useState(
        {
            duration: {
                start: new Date(),
                end: new Date()
            }
        }
    );

    const isDateSelectioninTimeline = dayjs(durationInfo.duration.end).isAfter(durationInfo.duration.start)

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const handleChange = (newValue, parameter) => {
        setDurationInfo({
            ...durationInfo,
            duration: { ...durationInfo.duration, [parameter]: new Date(newValue) }
        })

    };
    const toastId = React.useRef(null);
    const downloadCSVhandler = (novtech, GF_AC, GF_MF,filename, preData)=>{
        downloadCSV(GF_AC, `${filename}_AC`, preData)
        downloadCSV(novtech, `${filename}_Novtech`,preData)
        downloadCSV(GF_MF, `${filename}_MF`,preData)
    }
    const getAllDevicesApi = async () => {
        setIsDataLoading(true)
        notify(toastId);
        let { data } = await getCall({ path: `${CUMMILATIVE_DASHBOARD_DATA}/${SelectedDevice}` + `/${dayjs(durationInfo.duration.start).format('x')}/${dayjs(durationInfo.duration.end).format('x')}` });
        setData(data.data);
        validate(toastId, data.data.length, GLOBAL_HEADING.Device_Name);
        setIsDataLoading(false)
    }
    const downloadData = async()=>{
        setIsDataLoading(true)
        notify(toastId);
        let { data } = await getCall({ path: `${CUMMILATIVE_DASHBOARD_DATA}/${SelectedDevice}` + `/${dayjs(durationInfo.duration.start).format('x')}/${dayjs(durationInfo.duration.end).format('x')}` });
        let allData = data.data[0];
        let novtech = allData.Novtech.length;
        let GF_AC = allData.GF_AC.length;
        let GF_MF = allData.GF_MF.length;
        if(novtech > 0 || GF_AC > 0 || GF_MF > 0){
            let { data } = await getCall({ path: `${DEVICE_DATA}` });
            let filename = 'NO_NAME';
            let deviceSettingData = {};
            data && data.data && data.data.forEach((obj)=>{
                if(obj.devicenumber.includes(SelectedDevice)){
                    filename = obj.controllername;
                    deviceSettingData = {
                        "Gun Number":obj.controllername,
                        "Device Number":obj.devicenumber,
                        "Customer Name":obj.customername,
                        "Line No":obj.lineNo,
                        "Station Number":obj.fixturenumber,
                        "Controller Number":obj.gunservingmodel,
                        "Part Name":obj.partname,
                        "Tip Force KGF at 5bar":obj.spotcounterperjob,
                        "Throat Depth mm":obj.tipdress,
                        "Throat Gap mm":obj.tipchange,
                        "Is Device Deactivated":obj.isDeviceDeactivated,
                        "Deactivated Reason":obj.deactivatedReason,
                      }
                }
            })
            validate(toastId, 1, GLOBAL_HEADING.Device_Name);
            downloadCSVhandler(allData.Novtech,allData.GF_AC,allData.GF_MF,filename, deviceSettingData)
        } else{
            validate(toastId, 0, GLOBAL_HEADING.Device_Name);
        }
        setIsDataLoading(false)
    }




    React.useEffect(() => {
        if (!isDateSelectioninTimeline) {
            setIsValidationAlertVisible(true);
            setDurationInfo({ ...durationInfo, isDurationSelected: false })
        }
    }, [durationInfo.duration.start, durationInfo.duration.end]);

    return (
        <Sidebar>
            {isDataLoading ? (<Loader />) : (
                <Box>
                    <Box>
                        <Box className="mb-2">
                            <Alert severity="info">Select date of the duration you would like to fetch for</Alert>
                        </Box>
                        {!isDateSelectioninTimeline &&
                            <Collapse in={isValidationAlertVisible} >
                                <Alert
                                    className='text-wrap'
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setIsValidationAlertVisible(false);
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                    sx={{ mb: 2 }}
                                    severity="error"
                                >
                                    End date and time should be in future of start date
                                </Alert>
                            </Collapse>
                        }

                        <Box className="my-2">
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <form onSubmit={handleSubmit()}>
                                    <Stack direction="row" spacing={3} >

                                        <Box className='my-2 px-2'>
                                            <DateTimePicker
                                                label="Start Date and time"
                                                value={durationInfo.duration.start}
                                                onChange={(newValue) => handleChange(newValue, "start")}
                                                renderInput={(params) => <TextField {...params} />}
                                                disableFuture
                                            />
                                        </Box>
                                        <Box className='my-2 px-2'>
                                            <DateTimePicker
                                                label="End Date and time"
                                                value={durationInfo.duration.end}
                                                onChange={(newValue) => handleChange(newValue, "end")}
                                                renderInput={(params) => <TextField {...params} />}
                                                disableFuture
                                            />
                                        </Box>

                                    </Stack>

                                    <Stack direction="row" spacing={3}>
                                        <AllDevicesSelector SelectedDevice={SelectedDevice} setSelectedDevice={setSelectedDevice} setIsDeviceSelected={setIsDeviceSelected}> </AllDevicesSelector>
                                        <Box className='my-2 ml-6'>
                                            <DownloadCSV controllerData={data} fetchData={getAllDevicesApi} isdisabled={!isDateSelectioninTimeline || !isDeviceSelected} durationInfo={durationInfo} SelectedDevice={SelectedDevice} isDataLoading={isDataLoading}></DownloadCSV>
                                        </Box>
                                        <Box className='my-2 ml-6'>
                                            <DownloadCSV2 fetchData={downloadData} isdisabled={!isDateSelectioninTimeline || !isDeviceSelected} durationInfo={durationInfo} SelectedDevice={SelectedDevice} isDataLoading={isDataLoading}></DownloadCSV2>
                                        </Box>
                                    </Stack>

                                </form>

                            </LocalizationProvider>

                        </Box>
                    </Box>
                </Box>
            )
            }
        </Sidebar >
    )
}

export default DataExport