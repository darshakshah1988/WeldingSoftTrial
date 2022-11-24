import DashboardIcon from '@mui/icons-material/Dashboard';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsIcon from '@mui/icons-material/Settings';
import ErrorIcon from '@mui/icons-material/Error';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';

export const drawerItem = [
    {
        navigationName: "Welding dashboard",
        navigationRoute: "/",
        navigationIcon: <DashboardIcon />
    },
    {
        navigationName: "Maintainaince",
        navigationRoute: "/Maintain",
        navigationIcon: <EngineeringIcon />


    }, {
        navigationName: "User Settings",
        navigationRoute: "/UserDetails",
        navigationIcon: <ManageAccountsIcon />



    }, {
        navigationName: "Device Settings",
        navigationRoute: "/AllDevice",
        navigationIcon: <SettingsIcon />

    }, {
        navigationName: "Error Remedy",
        navigationRoute: "/ErrorRemedy",
        navigationIcon: <ErrorIcon />
    },
    {
        navigationName: "Data Export",
        navigationRoute: "/DataExport",
        navigationIcon: <GetAppRoundedIcon />
    },
]
export const drawerItem2 = [
    {
        navigationName: "Welding dashboard",
        navigationRoute: "/",
        navigationIcon: <DashboardIcon />
    },
    {
        navigationName: "Data Export",
        navigationRoute: "/DataExport",
        navigationIcon: <GetAppRoundedIcon />
    },
]

export const drawerItem3 = [
    {
        navigationName: "Welding dashboard",
        navigationRoute: "/",
        navigationIcon: <DashboardIcon />
    },
    {
        navigationName: "Maintainaince",
        navigationRoute: "/Maintain",
        navigationIcon: <EngineeringIcon />

    },
    {
        navigationName: "Data Export",
        navigationRoute: "/DataExport",
        navigationIcon: <GetAppRoundedIcon />
    },
]


