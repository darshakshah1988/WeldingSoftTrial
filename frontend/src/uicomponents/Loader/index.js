import { Backdrop } from '@mui/material'
import React from 'react'
import HashLoader from "react-spinners/HashLoader";
import GlobalContext from '../../Context/GlobalContextProvider';


function Loader() {
    const { isDarkModeEnabled} = React.useContext(GlobalContext)

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
        >
            <HashLoader color={isDarkModeEnabled ? "#1976d2" : "black"} />
        </Backdrop>
        )
}

export default Loader