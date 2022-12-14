import { Box } from "@mui/system";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CUMMILATIVE_DASHBOARD_DATA } from "../../Api/apiPath";
import { getCall } from "../../Api/helpers";
import GlobalContext from "../../Context/GlobalContextProvider";
import { GLOBAL_HEADING } from "../../Global/constants";
import CummilativeCard from "../../uicomponents/CummilativeCard";
import Loader from "../../uicomponents/Loader";
import Sidebar from "../sidebar/Sidebar";
import Graph from "./Charts/Graph";
import { OK_STATUS_FOR_CUMMILATIVE_DATA } from "./constants";
import WorkerFunction from "./WebWorkers/WorkerFunction";
import WebWorker from "./WebWorkers/Workers";
var advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)

const CommulativeDashboard = () => {
  let { deviceID } = useParams();
  const navigate = useNavigate();

  const [{ options: optionForActualWeld, series: seriesForActualWeld }, setcurrent] = useState([])
  const [spotCounterGraphData, setSpotCounter] = useState([]);
  const [errorPerHourPerDayperTimeGraphData, setErrorperhour] = useState([]);
  const [powerFactorLineGraphData, setpowerfactor] = useState([]);
  const [actualWeldcycleLineGraphData, setActualWeldCycle] = useState([]);
  const [conductionAngleLineGraphData, setConductionAngle] = useState([]);
  const [errorCodeGroupingCountPieChartGraphData, setErrorcode] = useState([]);
  const [errorCountGroupingBarGraphGraphData, setErrorcount] = useState([]);
  const [weldingPressureLineGraphGraphData, setweldingpressure] = useState([]);
  const [programDistributionPieChartGraphData, setprogram] = useState([]);


  const { setMainHeading, pollingInterval,
    ispollingActive,
    durationInfo: { duration: { start, end } },
    isFetchingCustomDateData
  } = React.useContext(GlobalContext);
  const [cummilativeData, setcummilativeData] = useState([]);
  const cummilativeDataLength = cummilativeData.length;
  const [isDataLoading, setIsDataLoading] = useState(true);
  const workerInstance = useRef()

  const errorCount = useMemo(() => cummilativeData.reduce((prev, current) => current.error_code !== OK_STATUS_FOR_CUMMILATIVE_DATA ?
    prev = prev + 1 :
    prev, 0), [...cummilativeData, cummilativeData.length])

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
    console.log("<<<<<<<<<<<<<",data.data)
    setcummilativeData(data.data)
    setTimeout(() => {

      setIsDataLoading(false)
    }, 1000);
  }


  useEffect(() => {
    setMainHeading(GLOBAL_HEADING.CUMMILATIVE_DATA_DASHBOARD)
  }, [])

  useEffect(() => {
    workerInstance.current = new WebWorker(WorkerFunction);
    workerInstance.current && (workerInstance.current.onmessage = (message) => {
      if (message) {
        const dataObj = JSON.parse(message.data)
        setcurrent(dataObj.currentdata)
        setSpotCounter(dataObj.spotdata)
        setErrorperhour(dataObj.errorPerHour)
        setpowerfactor(dataObj.powerfactor)
        setErrorcode(dataObj.errorcodegrp);
        setErrorcount(dataObj.errorcountgrp);
        setweldingpressure(dataObj.weldingpressure);
        setprogram(dataObj.programchart)
        setActualWeldCycle(dataObj.actualWeldCycle)
        setConductionAngle(dataObj.conductionAngle)
      }
    })

    return () => workerInstance.current?.terminate()
  }, [])


  useEffect(() => {
    workerInstance.current?.postMessage(cummilativeData)
  }, [cummilativeData])
  const keyToShowDataFor = ["ActualCurrent", "ActualWeldTimeCycles", "ConductionAngle", "PowerFactor", "Program", "SetCurrent", "SpotCounter"];

  return <>
    <Sidebar>
      {isDataLoading ? <Loader /> : <>
        <Box className="grid grid-cols-5 grid-rows-1 gap-x-3">
          <CummilativeCard cardHeader={"Weld Count"} cardDesc={cummilativeData.length} />
          <CummilativeCard cardHeader={"Actual Current"} cardDesc={cummilativeData[cummilativeDataLength - 1]?.ActualCurrent} />
          <CummilativeCard cardHeader={"Weld pressure 1"} cardDesc={cummilativeData[cummilativeDataLength - 1]?.WeldingPressure1} />
          <CummilativeCard cardHeader={"Weld pressure 2"} cardDesc={cummilativeData[cummilativeDataLength - 1]?.WeldingPressure2} />
          <CummilativeCard cardHeader={"Actual weld cycle"} cardDesc={cummilativeData[cummilativeDataLength - 1]?.ActualWeldTimeCycles} />
          <CummilativeCard cardHeader={"Error Code"} cardDesc={errorCount} isCardActionREquired actonButtonName={"Error Dashboard"} cardActionOnClick={() => navigate(`/errorDashboard/${deviceID}`)} />
        </Box>
        <Box>
          <Box className="grid gap-x-3 my-3 grid-cols-1 grid-rows-1">
            <Graph
              options={{
                ...optionForActualWeld, tooltip: {
                  custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    return (
                      `<div class="flex flex-col bg-white p-2 ">
                    ${Object.entries(cummilativeData.reverse()[dataPointIndex]).map(([key, value], _) => `${keyToShowDataFor.includes(key) ? `<div class="text-xs text-black">${key}:${value}</div>` : ``}`).reduce((prev, current) => prev + current, "")}
                    </div>`
                    );
                  }
                }
              }}
              series={seriesForActualWeld}
              type="line"
              height={350}
              graphTitle={"Actual current and Spot current vs Timestamp"} />
          </Box>
          <Box className="grid gap-x-3 my-3 grid-cols-2 grid-rows-1">
            <Graph
              {...spotCounterGraphData} type="bar" graphTitle={"Spot counter vs time"} />
            <Graph
              {...errorPerHourPerDayperTimeGraphData} s
              type="bar"
              graphTitle={"Error count distribution"} />
          </Box>
          <Box className="grid gap-x-3 my-3 grid-cols-1 grid-rows-1">
            <Graph
              {...powerFactorLineGraphData}
              type="line"
              graphTitle={"Power factor vs timestamp"} />
          </Box>
          <Box className="grid gap-x-3 my-3 grid-cols-1 grid-rows-1">
            <Graph
              {...conductionAngleLineGraphData}
              type="line"
              graphTitle={"Conduction angle vs timestamp"} />
          </Box>
          <Box className="grid gap-x-3 my-3 grid-cols-2 grid-rows-1">
            <Graph
              {...errorCodeGroupingCountPieChartGraphData} type="donut" graphTitle={"Error code distribution"} />
            <Graph
              {...errorCountGroupingBarGraphGraphData} type="bar" graphTitle={"Error count per hour"} />
          </Box>
          <Box className="grid gap-x-3 my-3 grid-cols-1 grid-rows-1">
            <Graph
              {...weldingPressureLineGraphGraphData}
              type="line"
              graphTitle={"Welding pressure 1 and 2 vs timestamp"} />
          </Box>
          <Box className="grid gap-x-3 my-3 grid-cols-2 grid-rows-1">
            <Graph
              {...programDistributionPieChartGraphData}
              type="donut"
              graphTitle={"Program distribution"} />
          </Box>
        </Box>
      </>
      }
    </Sidebar>
  </>
}



export default CommulativeDashboard;
