import React, { useState } from 'react'
import Sidebar from '../components/sidebar/Sidebar';
import { VISUAL_MODES } from '../Global/constants'
const GlobalContext = React.createContext({})

export function GlobalContextProvider({ children }) {
  const [visualMode, setVisualMode] = useState(VISUAL_MODES.LIGHT);
  const [mainHeading, setMainHeading] = useState("");
  const [pollingInterval, setpollingInterval] = useState(2000);
  const [ispollingActive, setispollingActive] = useState(true);
  const [role, setRole] = useState('')
  const [token, setToken] = useState('')
  const [userId,setUserId] = useState('')
  const [isauth, setUserAuth] = useState(false)
  const [durationInfo, setDurationInfo] = useState(
    {
      isDurationSelected: false,
      duration: {
        start: new Date(),
        end: new Date()
      }
    }
  );
  const [isFetchingCustomDateData, setIsFetchingCustomDateData] = useState(false)


  return (
    <GlobalContext.Provider value={
      {
        userId,
        isauth,
        role,
        visualMode,
        mainHeading,
        isDarkModeEnabled: visualMode === VISUAL_MODES.DARK,
        pollingInterval,
        ispollingActive,
        durationInfo,
        isFetchingCustomDateData,
        token,
        setUserAuth,
        setRole,
        setIsFetchingCustomDateData,
        setDurationInfo,
        setpollingInterval,
        setispollingActive,
        setVisualMode,
        setMainHeading,
        setToken,
        setUserId
      }
    }
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalContext