import { Card, CardContent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Chart from "react-apexcharts";
import GlobalContext from '../../../Context/GlobalContextProvider';
import { VISUAL_MODES } from '../../../Global/constants';
import Loader from '../../../uicomponents/Loader';

function Graph({ graphTitle, height = 200, width = 275, ...graphProps }) {
    const [isloaded, setisLoaded] = useState(true)
    const { setMainHeading, isDarkModeEnabled } = React.useContext(GlobalContext);
    const theme = { mode: isDarkModeEnabled ? VISUAL_MODES.DARK : VISUAL_MODES.LIGHT }
    let { options } = graphProps
    options = { ...options, theme }

    return (
        <>
            {isloaded ? <Card sx={{ minWidth: width }}>
                <CardContent>
                    <Typography variant='h5' >{graphTitle}</Typography>
                    <Chart
                        {...graphProps}
                        options={options}
                        height={height}
                    />
                </CardContent>
            </Card> : <Loader />}
        </>
    )
}

export default Graph