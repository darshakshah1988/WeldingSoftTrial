import React, { useEffect, useState } from 'react'
import { TextField, Switch, Button, InputLabel, Container, Typography, Collapse, IconButton } from '@mui/material'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { LOGIN_FIELDS, MODES, USER } from '../../Global/constants';
import { useNavigate } from 'react-router-dom'
import { EDIT_USER } from '../../Api/apiPath';
import { putCall,getCall } from '../../Api/helpers';
import { Box } from '@mui/system';
import { useForm, Controller, set } from "react-hook-form";
import CloseIcon from '@mui/icons-material/Close';
import GlobalContext from '../../Context/GlobalContextProvider';
import "react-toastify/dist/ReactToastify.css";
import { GET_USERS } from "../../Api/apiPath";
import { notify, update } from '../../uicomponents/Notifications/index';
import { removeItem,postItem } from '../../Api/localStorageHelpers';

export default function PasswordReset() {
    const {
        userId,
        token,
        setRole,
        setUserAuth
    } = React.useContext(GlobalContext)
    const history = useNavigate();
    const [open, setOpen] = React.useState(true);
    const [mode, setMode] = useState('primary');
    const [checked, setChecked] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isPasswordMatch, setIspasswordMatch] = useState(true)

    const toastId = React.useRef(null);

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
    const callAPI = async (dataObj) => {
        dataObj = {
            password: dataObj.newPassword,
            id: userId,
            isPasswordReset: false
        }
        notify(toastId);
        postItem({ key: 'WeldersUserInfo', data: token })
        let { isApiConnectionSucceess, data } = await putCall({ path: `${EDIT_USER}`, updatedData: dataObj })
        update(toastId, data.message, '');
        if (data.data) {
            postItem({ key: 'WeldersUserInfo', data: token })
            postItem({ key: 'userId', data: userId })
            setRole(data.data.role)
            setUserAuth(true)
            history('/')
        }
        else{
            removeItem({key:'WeldersUserInfo'})
        }
    }
    const getDataFromAPI = async () => {
        postItem({ key: 'userId', data: userId })
        let { isApiConnectionSucceess, data } = await getCall({
            path: `${GET_USERS}/${userId}`,
        });
        setRole(data.data.role);
    };

    const onSubmit = (dataObj) => {
        if (dataObj.newPassword == dataObj.rePassword) {
            callAPI(dataObj);
            getDataFromAPI()
        }
        else {
            setIspasswordMatch(false)
            setTimeout(() => {
                setIspasswordMatch(true);
            }, 5000);
        }
    };

    return (
        <Container className='d-flex flex-column align-items-center justify-content-end w-100' sx={{height:'67vh'}}  >

            <Box className='d-flex align-items-center justify-content-end w-100'>
                <Box >
                    <Switch color={mode} checked={checked} onChange={changeMode} />
                </Box>
            </Box>
            <Box>
                <Stack sx={{ width: '100%', align: 'center', marginBottom: "10%" }} spacing={2}>
                    <Collapse in={open}>
                        <Alert severity="warning"
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                        >
                            {LOGIN_FIELDS.RESET_PASSWORD}

                        </Alert>
                        {!isPasswordMatch && <Alert severity="error"
                            sx={{ mb: 2 }}>Passwords do not Match</Alert>}
                    </Collapse>
                </Stack>
                <Box className='w-100'>
                    <Box className='d-flex flex-column align-items-center justify-content-center'>
                        <Box className='d-flex flex-column align-items-center justify-content-center'>
                            <Typography variant='h3' color={mode} >Password Reset</Typography>
                        </Box>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box className='d-flex flex-column align-items-center justify-content-center' >

                                <Box className='d-flex flex-column w-100'>
                                    <TextField
                                        sx={{ mt: 1 }}
                                        variant="standard"
                                        id="demo-helper-text-aligned"
                                        label="New Password*"
                                        name="newPassword"
                                        {...register("newPassword", { required: USER.NEW_PASSWORD_REQUIRED })}
                                        error={Boolean(errors.rePassword)}
                                        helperText={errors.newPassword?.message}
                                    />
                                    <TextField
                                        sx={{ mt: 1 }}
                                        variant="standard"
                                        id="demo-helper-text-aligned"
                                        label="Reenter Password*"
                                        name="rePassword"
                                        {...register("rePassword", { required: USER.RE_PASSWORD_REQUIRED })}
                                        error={Boolean(errors.rePassword)}
                                        helperText={errors.rePassword?.message}
                                    />

                                </Box>

                                <Box sx={{ marginTop: "40px" }}>
                                    <Button variant="outlined" type="submit" style={{ width: "400px", height: "40px" }} color={mode} >Reset</Button>
                                </Box>
                            </Box>
                        </form>

                    </Box>
                </Box >
            </Box>

        </Container >
    )
}
