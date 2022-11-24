import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { Alert, Button, Collapse, Slider } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import brandImage from "../../assets/Logo.png";
import GlobalContext from '../../Context/GlobalContextProvider';
import { AUTO_SWITCH_TO_REAL_TIME, POLLING_INDICATOR, TIME_FORMAT, VISUAL_MODES } from '../../Global/constants';
import CustomSwitch from '../../uicomponents/CustomSwitch';
import { infoToast } from '../../uicomponents/Notifications';
import { drawerItem, drawerItem2, drawerItem3 } from './constants';
import { removeItem, postItem } from '../../Api/localStorageHelpers';
import LogoutIcon from '@mui/icons-material/Logout';


const drawerWidth = 240;
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Sidebar({ children }) {
    const { mainHeading,
        role,
        setRole,
        setVisualMode,
        visualMode,
        pollingInterval,
        ispollingActive,
        durationInfo,
        isFetchingCustomDateData,
        setIsFetchingCustomDateData,
        setDurationInfo,
        setpollingInterval,
        setispollingActive,
    } = React.useContext(GlobalContext)
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate()
    const [isChecked, setisChecked] = React.useState(visualMode === VISUAL_MODES.DARK ? true : false)
    const [isValidationAlertVisible, setIsValidationAlertVisible] = React.useState(false);
    const { isDurationSelected, duration: { start, end } } = durationInfo;
    const isDateSelectioninTimeline = dayjs(end).isAfter(start)
    //`const [role, setRole] = React.useState();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleChange = (newValue, parameter) => {
        setDurationInfo({
            ...durationInfo,
            duration: { ...durationInfo.duration, [parameter]: new Date(newValue) }
        })
    };

    React.useEffect(() => {
        if (!isDateSelectioninTimeline) {
            setIsValidationAlertVisible(true);
            setDurationInfo({ ...durationInfo, isDurationSelected: false })
        }
    }, [start, end]);

    React.useEffect(() => {
        if (ispollingActive) {
            setIsValidationAlertVisible(false);
        }
        else {
            !isDateSelectioninTimeline && setIsValidationAlertVisible(true)
        }
    }, [ispollingActive])

    React.useEffect(() => {
        if (!open) {
            if (isDateSelectioninTimeline) {
                setIsFetchingCustomDateData(!ispollingActive)
            }
            if (!ispollingActive && !isDateSelectioninTimeline) {
                setIsValidationAlertVisible(false);
                setDurationInfo({ ...durationInfo, isDurationSelected: false });
                setispollingActive(true)
                setIsFetchingCustomDateData(false)
                infoToast(AUTO_SWITCH_TO_REAL_TIME)
            }
        }
    }, [open])

    const logout = () => {
        removeItem({ key: 'WeldersUserInfo' })
        removeItem({ key: 'userId' })
        navigate('/login')
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ width: "100%", display: 'flex ', justifyContent: " space-between", alignItems: 'center' }}>
                        {mainHeading}
                        <img src={brandImage} className="logo-img " style={{ height: '60px', }} />
                    </Typography>

                </Toolbar>

            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                {role == "AD" && <List>
                    {drawerItem.map(({ navigationName, navigationIcon, navigationRoute }, index) => (
                        <ListItem key={navigationName} disablePadding sx={{ display: 'block' }} onClick={() => navigate(navigationRoute)}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {navigationIcon}
                                </ListItemIcon>
                                <ListItemText primary={navigationName} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>

                    ))}
                    <ListItem disablePadding sx={{ display: 'block' }} onClick={() => setisChecked((isChecked) => {
                        setVisualMode(!isChecked ? VISUAL_MODES.DARK : VISUAL_MODES.LIGHT)
                        return !isChecked
                    })}>
                        <CustomSwitch isChecked={isChecked} />
                    </ListItem>


                    {open && <>
                        <ListItem disablePadding sx={{ display: 'block' }} onClick={() => setispollingActive(!ispollingActive)}>
                            <CustomSwitch isChecked={ispollingActive} label="Live refresh" />
                        </ListItem>
                        <Slider
                            aria-label="seconds"
                            value={pollingInterval / 1000}
                            valueLabelFormat={(value) => `${value} sec`}
                            valueLabelDisplay="auto on"
                            step={5}
                            marks
                            min={5}
                            max={60}
                            sx={{ width: "70%", alignSelf: "center", marginLeft: 2, marginTop: 4 }}
                            // valueLabelDisplay="on"
                            disabled={!ispollingActive}
                            onChange={(_, value) => setpollingInterval(value * 1000)}
                        />
                    </>}
                </List>}
                {role == 'MO' &&
                    <List>
                        {drawerItem2.map(({ navigationName, navigationIcon, navigationRoute }, index) => (
                            <ListItem key={navigationName} disablePadding sx={{ display: 'block' }} onClick={() => navigate(navigationRoute)}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {navigationIcon}
                                    </ListItemIcon>
                                    <ListItemText primary={navigationName} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>

                        ))}
                        <ListItem disablePadding sx={{ display: 'block' }} onClick={() => setisChecked((isChecked) => {
                            setVisualMode(!isChecked ? VISUAL_MODES.DARK : VISUAL_MODES.LIGHT)
                            return !isChecked
                        })}>
                            <CustomSwitch isChecked={isChecked} />
                        </ListItem>


                        {open && <>
                            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => setispollingActive(!ispollingActive)}>
                                <CustomSwitch isChecked={ispollingActive} label="Live refresh" />
                            </ListItem>
                            <Slider
                                aria-label="seconds"
                                value={pollingInterval / 1000}
                                valueLabelFormat={(value) => `${value} sec`}
                                valueLabelDisplay="auto on"
                                step={5}
                                marks
                                min={5}
                                max={60}
                                sx={{ width: "70%", alignSelf: "center", marginLeft: 2, marginTop: 4 }}
                                // valueLabelDisplay="on"
                                disabled={!ispollingActive}
                                onChange={(_, value) => setpollingInterval(value * 1000)}
                            />
                        </>}
                    </List>
                }
                {role == 'MA' &&
                    <List>
                        {drawerItem3.map(({ navigationName, navigationIcon, navigationRoute }, index) => (
                            <ListItem key={navigationName} disablePadding sx={{ display: 'block' }} onClick={() => navigate(navigationRoute)}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {navigationIcon}
                                    </ListItemIcon>
                                    <ListItemText primary={navigationName} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>

                        ))}
                        <ListItem disablePadding sx={{ display: 'block' }} onClick={() => setisChecked((isChecked) => {
                            setVisualMode(!isChecked ? VISUAL_MODES.DARK : VISUAL_MODES.LIGHT)
                            return !isChecked
                        })}>
                            <CustomSwitch isChecked={isChecked} />
                        </ListItem>


                        {open && <>
                            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => setispollingActive(!ispollingActive)}>
                                <CustomSwitch isChecked={ispollingActive} label="Live refresh" />
                            </ListItem>
                            <Slider
                                aria-label="seconds"
                                value={pollingInterval / 1000}
                                valueLabelFormat={(value) => `${value} sec`}
                                valueLabelDisplay="auto on"
                                step={5}
                                marks
                                min={5}
                                max={60}
                                sx={{ width: "70%", alignSelf: "center", marginLeft: 2, marginTop: 4 }}
                                // valueLabelDisplay="on"
                                disabled={!ispollingActive}
                                onChange={(_, value) => setpollingInterval(value * 1000)}
                            />
                        </>}
                    </List>
                }

                {open && (
                    <><Typography variant='subtitle1' className="text-center" >Cutom time range selection</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <Box className='my-2 px-2'>
                                <DateTimePicker
                                    label="Start Date and time"
                                    value={durationInfo.duration.start}

                                    onChange={(newValue) => handleChange(newValue, "start")}
                                    renderInput={(params) => <TextField {...params} />}
                                    disabled={ispollingActive}
                                    disableFuture
                                />
                            </Box>
                            <Box className='my-2 px-2'>
                                <DateTimePicker
                                    label="End Date and time"
                                    value={durationInfo.duration.end}
                                    onChange={(newValue) => handleChange(newValue, "end")}
                                    renderInput={(params) => <TextField {...params} />}
                                    disabled={ispollingActive}
                                    disableFuture
                                />
                            </Box>
                        </LocalizationProvider>
                        <Collapse in={isValidationAlertVisible} >
                            <Alert
                                className='text-wrap'
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setIsValidationAlertVisible(false);
                                        }}

                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                sx={{ mb: 2 }}
                                severity="error"
                            >
                                End date and time should be in future of start date
                            </Alert>
                        </Collapse>
                    </>)}

                <ListItem disablePadding sx={{ display: 'block', mt: isValidationAlertVisible && role == 'AD' ? 14 : 2 }} onClick={logout} >
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            {<LogoutIcon />}
                        </ListItemIcon>
                        <ListItemText primary='Logout' sx={{ opacity: open ? 1 : 0 }} />

                    </ListItemButton>
                </ListItem>

            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {window.location.pathname != '/DataExport' && <Box className="mb-2">
                    <Alert severity="info">{ispollingActive ? POLLING_INDICATOR.POLLING_ACTIVE : POLLING_INDICATOR.DURATION_SELECTION_ACTIVE + `. Selected  Duration:${dayjs(start).format(TIME_FORMAT)} - ${dayjs(end).format(TIME_FORMAT)}`}</Alert>
                </Box>}
                {children}
            </Box>

        </Box >
    );
}
