import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import React from 'react'

function CummilativeCard({ cardHeader,
    cardDesc,
    isCardActionREquired = false,
    actonButtonName = "",
    cardActionOnClick = () => { } }) {
    return (
        <Card sx={{ minWidth: 275 }} className="my-1">
            <CardContent>
                <Typography variant="h5" component="div" className="text-center">
                    {cardHeader}
                </Typography>
                <Typography variant="h6" className="text-center mt-2">
                    {cardDesc}
                </Typography>
            </CardContent>
            {isCardActionREquired && <div className='flex flex-row justify-center items-center'>
                <Button
                    size="small"
                    onClick={cardActionOnClick}>
                    {actonButtonName}
                </Button>
            </div>
            }
        </Card>
    )
}

export default CummilativeCard