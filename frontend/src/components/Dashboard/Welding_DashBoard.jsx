import { Box, Card, CardContent, Typography } from '@mui/material';
import dayjs from 'dayjs';
import _ from "lodash";
import React, { useEffect, useState } from 'react';
import { DASHBOARD_DATA } from '../../Api/apiPath';
import { getCall } from '../../Api/helpers';
import GlobalContext from '../../Context/GlobalContextProvider';
import { GLOBAL_HEADING } from '../../Global/constants';
import DashboardTabs from '../../uicomponents/DashboardTabs';
import Loader from '../../uicomponents/Loader';
import Sidebar from '../sidebar/Sidebar';
import "./welding_DashBoard.css";
var advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)

function Welding_DashBoard() {
    const {
        setMainHeading,
        isDarkModeEnabled,
        pollingInterval,
        ispollingActive,
        durationInfo: { duration: { start, end } },
        isFetchingCustomDateData
    } = React.useContext(GlobalContext)

    const [isDataLoading, setisDataLoading] = useState(true);
    const [apiData, setApiData] = useState({});
    const [selectedLine, setselectedLine] = useState(null)
    const [isPolling, setisPolling] = useState(false)

    useEffect(() => {
        isFetchingCustomDateData && setMainHeading(GLOBAL_HEADING.WELDING_DASHBOARD);
        setisPolling(true)
        !ispollingActive && getAllLineData()
        if (ispollingActive) {
            const timer = setInterval(getAllLineData, pollingInterval)
            return () => clearTimeout(timer)
        }
    }, [ispollingActive, pollingInterval, isFetchingCustomDateData, start, end]);

    const getAllLineData = async () => {
        !ispollingActive && !_.isEmpty(apiData) && setisDataLoading(true)
        let { isApiConnectionSucceess, data } = await getCall({ path: DASHBOARD_DATA + `${isFetchingCustomDateData ? `/${dayjs(start).format('x')}/${dayjs(end).format('x')}` : ``}` });
        isApiConnectionSucceess && setisDataLoading(false)
        isApiConnectionSucceess && setApiData(data.data)
    }


    return (
        <Sidebar>
            {isDataLoading ?
                <Loader />
                :
                <Box>
                    <Card sx={{ minWidth: 275, textVerticalAlign: "center" }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 20 }}  >
                                Total Welding machines: {apiData?.dashboardData?.length}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Box className="mt-2">
                        <DashboardTabs lineData={apiData?.lineData} dashboardData={apiData?.dashboardData} />
                    </Box>
                </Box>
            }
        </Sidebar>
    )
}

export default Welding_DashBoard;