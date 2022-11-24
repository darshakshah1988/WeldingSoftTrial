import React, { Component, useEffect, useMemo, useRef, useState } from "react";
import { Typography, Box, Button, Paper } from '@mui/material';
import LineTable from "./LineTable/LineTable";
import DeviceTable from "./DeviceTable/DeviceTable";

import Sidebar from "../sidebar/Sidebar";
import Loader from "../../uicomponents/Loader/index";
import { DASHBOARD_DATA } from "../../Api/apiPath";
import { DEVICE_DATA } from "../../Api/apiPath";

import { getCall } from "../../Api/helpers";
import AddNewLine from "./LineTable/AddNewLine";
import AddNewDevice from "./DeviceTable/AddNewDevice";

import { GLOBAL_HEADING } from "../../Global/constants";
import GlobalContext from "../../Context/GlobalContextProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DeviceSetting() {

   
    const [LineData, setLineData] = useState([]);
    const [DeviceData, setDeviceData] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const { setMainHeading, isDarkModeEnabled, } = React.useContext(GlobalContext)

    useEffect(() => {

        getDataFromAPI();
        setMainHeading(GLOBAL_HEADING.WELDING_DASHBOARD)

    }, []);

  
    



    const getDataFromAPI = async () => {
        let { isApiConnectionSucceess, data } = await getCall({
            path: `${DASHBOARD_DATA}`,
        });
    
        setLineData(data.data.lineData);

        data = await getCall({
            path: `${DEVICE_DATA}`,
        });

        setDeviceData(data.data.data);


        setIsDataLoading(false);
    };


    return (
        <Sidebar>
            {isDataLoading ? (
                <Loader />
            ) : (

                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <Paper sx={{ width: "88vw", padding: "10px", }} >
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "5px" }}>
                            <LineTable lineInfo={LineData} ></LineTable>
                            <Box sx={{ display: 'flex', justifyContent: 'end', width: 500, alignSelf: "center" }}>
                                <AddNewLine LineData={LineData}></AddNewLine>
                            </Box>

                        </Box>


                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "5px" }}>
                            <DeviceTable  deviceInfo={DeviceData} lineInfo={LineData} ></DeviceTable>
                            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                <AddNewDevice LineData={LineData}></AddNewDevice>
                            </Box>

                        </Box>
                    </Paper>
                </Box>
            )}
        </Sidebar>
    )
}
export default DeviceSetting;