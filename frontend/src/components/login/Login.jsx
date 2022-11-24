import React, { useState, useEffect } from 'react'
import { TextField, Switch, Button, InputLabel, Container, Typography, Modal, Alert } from '@mui/material'
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { VALIDATE_USER } from '../../Api/apiPath';
import { getCall } from '../../Api/helpers';
import { USER, LOGIN_FIELDS, MODES } from '../../Global/constants';
import { Box } from '@mui/system';
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { notify, update } from '../../uicomponents/Notifications/index';
import GlobalContext from '../../Context/GlobalContextProvider';
import PasswordReset from '../PasswordReset/PasswordReset';
import { getItem, postItem } from '../../Api/localStorageHelpers';
import { myStyle } from '../../Global/StyleConstant';

export default function Login() {
    const {
        setRole,
        setUserAuth,
        setToken,
        setUserId
    } = React.useContext(GlobalContext)
    const history = useNavigate();
    const toastId = React.useRef(null);
    const [mode, setMode] = useState('primary')
    const [open, setOpen] = React.useState(false);
    const [firstLogin, setReset] = React.useState(false)
    const [isLoggedIn, setLoggedIn] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [checked, setChecked] = useState(false)
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    useEffect(() => {
        if (mode === MODES.SECONDARY) {
            document.body.style.backgroundColor = '#212124'
        }
        else {
            document.body.style.backgroundColor = 'white'

        }
    }, [mode])
    const changeMode = (e) => {
        setChecked(e.target.checked)
        if (checked === false) {
            setMode(MODES.SECONDARY)
        }
        else {
            setMode(MODES.PRIMARY)
        }
    }
    const callLoginApi = async (dataobj) => {

        notify(toastId);
        let path = `${VALIDATE_USER}/${dataobj.username}/${dataobj.password}`;
        let { isApiConnectionSucceess, data } = await getCall({ path })
        update(toastId, data.message, '');
        if (data.data) {
            if (data.data.isPasswordReset == true) {
                setReset(true)
                setUserId(data.data.id)
            }
            else {
                postItem({ key: 'WeldersUserInfo', data: data.token })
                postItem({ key: 'userId', data: data.data.id })
                setRole(data.data.role)
                setUserAuth(true)
                history('/')
            }
            setToken(data.token)
            setLoggedIn(true)

        } else {
            reset()
        }
    }
    const onSubmit = (dataobj) => {
        callLoginApi(dataobj);
    };
    return (
        <>
            {firstLogin ? <PasswordReset /> :
                !getItem({ key: "WeldersUserInfo" }) ?
                    <Container className='d-flex flex-column align-items-center justify-content-end w-100' sx={{ height: '65vh' }} >
                        <Box className='d-flex align-items-center justify-content-end w-100'>
                            <Box >
                                <Switch color={mode} checked={checked} onChange={changeMode} />
                            </Box>
                        </Box>
                        <Box>
                            <Box className='w-100'>
                                <Box className='d-flex flex-column align-items-center justify-content-center'>
                                    <Box className='d-flex flex-column align-items-center justify-content-center'>
                                        <Typography variant='h3' color={mode} >Login</Typography>
                                    </Box>

                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Box className='d-flex flex-column align-items-center justify-content-center' >

                                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                <TextField
                                                    sx={{ mt: 2 }}
                                                    variant="standard"
                                                    id="demo-helper-text-aligned"
                                                    label="User Name*"
                                                    name="username"

                                                    {...register("username", { required: USER.USERNAME_REQUIRED })}
                                                    error={Boolean(errors.username)}
                                                    helperText={errors.username?.message}
                                                />
                                                <TextField
                                                    variant="standard"
                                                    sx={{ mt: 1 }}
                                                    id="demo-helper-text-aligned"
                                                    label="Password*"
                                                    name="password"
                                                    {...register("password", { required: USER.PASSWORD_REQUIRED })}
                                                    error={Boolean(errors.password)}
                                                    helperText={errors.password?.message}
                                                />
                                            </Box>

                                            <Box sx={{ marginTop: "40px" }}>
                                                <Button variant="outlined" type="submit" style={{ width: "400px", height: "40px" }} color={mode} >Login</Button>
                                            </Box>

                                            <Button size="small" color={mode} sx={{ ml: 'auto', mt: 1 }} onClick={handleOpen}>Forgot Password?</Button>
                                            <Modal
                                                open={open}
                                                onClose={handleClose}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={myStyle} >
                                                    <Alert
                                                        sx={{ mb: 2 }}
                                                        severity="info"
                                                    >
                                                        {LOGIN_FIELDS.FORGOT_PASSWORD}
                                                    </Alert>
                                                    <Box sx={{ display: 'flex', alignItems: "center", justifyContent: 'center' }}>

                                                        <Button variant="outlined" onClick={() => setOpen(false)}>Ok</Button>
                                                    </Box>

                                                </Box>
                                            </Modal>
                                        </Box>
                                    </form>

                                </Box>
                            </Box >
                        </Box>

                    </Container > : ""}
        </>
    )
}
