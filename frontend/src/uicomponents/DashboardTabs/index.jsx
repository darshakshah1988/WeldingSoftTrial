import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { DashboardCard } from '../DashboardCard';
export default function DashboardTabs({ lineData, dashboardData }) {
    const [value, setValue] = React.useState(null);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab
                            value={null}
                            label={"All"}
                            wrapped
                        />
                        {lineData.map(({ lineNo, lineName }) => (
                            <Tab
                               
                                value={lineNo}
                                label={lineName}
                                wrapped
                            />
                        )
                        )}
                    </TabList>
                </Box>
                <TabPanel value={null}>
                    <DashboardCard
                        cardData={dashboardData}
                        lineData={lineData}
                    />
                </TabPanel>
                {lineData.map(({ lineNo, lineName }) => (
                    <TabPanel
                        value={lineNo}

                    >
                        <DashboardCard
                            cardData={dashboardData.filter(item => lineNo == item?.lineNo)}
                            lineData={lineData}
                        />
                    </TabPanel>
                )
                )}
            </TabContext>
        </Box>
    );
}