import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login from "./components/login/Login";
import Welding_DashBoard from "./components/Dashboard/Welding_DashBoard";
import Sidebar from "./components/sidebar/Sidebar";
import {
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import React, { useState } from "react";
import CommulativeDashboard from "./components/CommulativeDashboard/CommulativeDashboard";
import GlobalContext from "./Context/GlobalContextProvider";
import ErrorDashboard from "./components/ErrorDashboard";
import UnderConstruction from "./components/UnderConstruction";
import DeviceSetting from "./components/DeviceSetting/index";
import DataExport from "./components/DataExport/DataExport";
import PasswordReset from "./components/PasswordReset/PasswordReset";
import { getCall } from "./Api/helpers";
import { getItem, isItem } from './Api/localStorageHelpers'
import UserAccordion from "./components/UserSettings/UserAccordion";
import { GET_USERS } from "./Api/apiPath";

function App() {
  const { visualMode, isauth, setUserAuth, role, setRole } =
    React.useContext(GlobalContext);
  const theme = createTheme({
    palette: {
      mode: visualMode,
    },
  });
  let id = getItem({ key: "userId" })
  React.useEffect(() => {
    authData();
    if (id != null) {
      getDataFromAPI(id);
    }
  }, []);

  const getDataFromAPI = async (id) => {
    let { isApiConnectionSucceess, data } = await getCall({
      path: `${GET_USERS}/${id}`,
    });
    setRole(data.data.role);
  };

  const authData = async () => {
    !getItem({ key: "WeldersUserInfo" }) && setUserAuth(false)
    if (getItem({ key: "WeldersUserInfo" })) {
      const token = getItem({ key: "WeldersUserInfo" });
      let { isApiConnectionSucceess, data } = await getCall({ path: `/api/userauth/${token}` });
      { (data.isUserAutenticated) && setUserAuth(true) }
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>

          <Route exact path="/login" element={<Login />} />
          <Route
            exact
            path="/resetPassword"
            element={!isauth ? <Login /> : <PasswordReset />}
          />
          <Route
            exact
            path="/"
            element={!isauth ? <Login /> : <Welding_DashBoard />}
          />
          <Route
            exact
            path="/dashboard/:deviceID"
            element={!isauth ? <Login /> : <CommulativeDashboard />}
          />
          <Route
            exact
            path="/errorDashboard/:deviceID"
            element={!isauth ? <Login /> : <ErrorDashboard />}
          />
          <Route
            exact
            path="/Maintain"
            element={!isauth ? <Login /> : role != "MO" ? <UnderConstruction /> : <Welding_DashBoard />}
          />
          <Route
            exact
            path="/UserDetails"
            element={!isauth ? <Login /> : role == "AD" ? <UserAccordion /> : <Welding_DashBoard />}
          />
          <Route
            exact
            path="/AllDevice"
            element={!isauth ? <Login /> : role == "AD" ? <DeviceSetting /> : <Welding_DashBoard />}
          />
          <Route
            exact
            path="/ErrorRemedy"
            element={!isauth ? <Login /> : role == "AD" ? <UnderConstruction /> : <Welding_DashBoard />}
          />
          <Route
            exact
            path="/DataExport"
            element={!isauth ? <Login /> : <DataExport />}
          />
          <Route path="*" element={<Welding_DashBoard />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
