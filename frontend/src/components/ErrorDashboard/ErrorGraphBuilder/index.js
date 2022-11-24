import { Alert, Box } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Loader from '../../../uicomponents/Loader';
import Graph from '../../CommulativeDashboard/Charts/Graph';
import { errorDashboardDataGenerator } from '../../CommulativeDashboard/Charts/GraphDataGenerator';
import _ from "lodash";

function ErrorGraphBuilder({ errorInfo }) {
    const { errorSet, selectedErrorCode, groupedErrorData } = errorInfo;
    return (
        <>
            {selectedErrorCode.length > 0  ?
                <Box className="grid gap-x-3 my-3 grid-cols-1 grid-rows-1 w-100">
                    <Graph
                        {...errorDashboardDataGenerator(selectedErrorCode, groupedErrorData)}
                        type="bar"
                        graphTitle={"Error data graph"}
                        width={700}
                    />
                </Box > :
                <Alert severity="info" className='ml-2'>Select error code from dropdown to initiate graph compute</Alert>
            }
        </>)
}

export default ErrorGraphBuilder