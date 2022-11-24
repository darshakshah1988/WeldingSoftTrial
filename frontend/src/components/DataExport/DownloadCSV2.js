import LoadingButton from '@mui/lab/LoadingButton';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import React, { useState } from 'react'
import { CSVDownload, CSVLink } from "react-csv";
import { DOWNLOAD_FIELDS } from '../../Global/constants';


export default function DownloadCSV({ title, fetchData, isdisabled, controllerData, SelectedDevice, isDataLoading }) {
    const [refetchData, setrefetch] = useState(true);

    function handleClick() {
        setrefetch(false);
        if (SelectedDevice) {
            fetchData();
        }
        setTimeout(() => {
            setrefetch(true);
        }, 100);
    }

    return (
        <>
            <LoadingButton
                size="large"
                onClick={handleClick}
                variant="outlined"
                disabled={isdisabled}
                endIcon={<GetAppRoundedIcon />}
                sx={{ height: 56, width: 245 }}
            >
                Download CSV
            </LoadingButton>
            {/* {controllerData.length > 0 && refetchData && !isDataLoading ? <CSVDownload data={controllerData} filename={DOWNLOAD_FIELDS.fileName} target="_blank" /> : null} */}
        </>
    )
}
