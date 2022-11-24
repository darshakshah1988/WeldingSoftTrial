import React from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export function DashboardCard({ cardData, lineData, lineNo }) {
    const navigate = useNavigate()
    return (
        <Box className='grid grid-cols-4 grid-rows-4 grid-span-1 gap-x-4 gap-y-4'>
            {
                cardData.map(({ controllerName, totalJoints, errorCount, DeviceID, lineNo, lineName }) => (
                    <Card sx={{ minWidth: 275 }}>

                        <CardContent>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                                Welding machine name: {controllerName}
                            </Typography>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                                Total Joints: {totalJoints}
                            </Typography> <Typography sx={{ fontSize: 14 }}  gutterBottom>
                                Error Count: {errorCount}
                            </Typography>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                                Device id: {DeviceID}
                            </Typography>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                                Line name: {lineName}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => navigate(`/dashboard/${DeviceID}`)}>Cummilative Data</Button>
                            <Button size="small" color="secondary" onClick={() => navigate(`/errorDashboard/${DeviceID}`)}>Error Data</Button>
                        </CardActions>
                    </Card>
                )
                )
            }
        </Box >
    )
}