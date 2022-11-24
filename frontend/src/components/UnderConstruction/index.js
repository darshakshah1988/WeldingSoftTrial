import { Alert, AlertTitle } from '@mui/material'
import React from 'react'
import Sidebar from '../sidebar/Sidebar'

function UnderConstruction() {
    return (
        <Sidebar>
            <Alert severity="info">
                <AlertTitle>Info</AlertTitle>
                This section is under construction. Please visit us later.
            </Alert>
        </Sidebar>
    )
}

export default UnderConstruction