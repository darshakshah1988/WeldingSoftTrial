import React, { useEffect, useMemo, useRef, useState } from "react";
import { CUMMILATIVE_DASHBOARD_DATA } from "../../Api/apiPath";
import { getCall } from "../../Api/helpers";
import GlobalContext from "../../Context/GlobalContextProvider";
import { GLOBAL_HEADING } from "../../Global/constants";
import Loader from "../../uicomponents/Loader";
import Sidebar from "../sidebar/Sidebar";
import ErrorGraphBuilder from "./ErrorGraphBuilder";
import ErrorPillSelection from "./ErrorPillSelection";
import { useParams } from "react-router-dom";
import { Box, Divider } from "@mui/material";
import _ from "lodash";
import ErrorTable from "./ErrorTable/ErrorTable.jsx";
import dayjs from "dayjs";
function ErrorDashboard() {
  const { setMainHeading, pollingInterval,
    ispollingActive,
    durationInfo: { duration: { start, end } },
    isFetchingCustomDateData
  } = React.useContext(GlobalContext); let { deviceID } = useParams();
  const [cummilativeData, setcummilativeData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [triggerGraphGenerationCounter, settriggerGraphGenerationCounter] =
    useState(0);
  const [errorInfo, setErrorInfo] = useState({
    errorSet: [],
    groupedErrorData: {},
    selectedErrorCode: [],
    // currentErrorCode: [],
  })

  useEffect(() => {
    let groupedErrorData = _.groupBy(
      cummilativeData,
      (item) => item.error_code
    );
    setErrorInfo({...errorInfo,
      errorSet: Object.keys(groupedErrorData),
      groupedErrorData,
      // selectedErrorCode: [],
    })

  }, [cummilativeData])


  useEffect(() => {
    setMainHeading(GLOBAL_HEADING.ERROR_DASHBOARD);
  }, []);

  useEffect(() => {
    isFetchingCustomDateData && getDataFromAPI()
    if (ispollingActive) {
      const timer = setInterval(getDataFromAPI, pollingInterval)
      return () => clearTimeout(timer)
    }
  }, [ispollingActive, pollingInterval, isFetchingCustomDateData, start, end]);


  const getDataFromAPI = async () => {
    let {
      isApiConnectionSucceess,
      data
    } = await getCall({ path: `${CUMMILATIVE_DASHBOARD_DATA}/${deviceID}` + `${isFetchingCustomDateData ? `/${dayjs(start).format('x')}/${dayjs(end).format('x')}` : ``}` });
    setcummilativeData(data.data)
    setTimeout(() => {

      setIsDataLoading(false)
    }, 1000);
  }



  return (
    <Sidebar>
      {isDataLoading ? (
        <Loader />
      ) : (
        <Box>
          <ErrorPillSelection
            errorInfo={errorInfo}
            setErrorInfo={setErrorInfo}
          />
          <ErrorGraphBuilder
            errorInfo={errorInfo}
          />

          <ErrorTable errorInfo={cummilativeData} />
        </Box>
      )}
    </Sidebar>
  );
}

export default ErrorDashboard;
