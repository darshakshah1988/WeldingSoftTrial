import * as React from 'react';
import { InputLabel, IconButton, MenuItem, Select, FormControl, TextField, Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import "react-toastify/dist/ReactToastify.css";
import { notify, update } from '../../../uicomponents/Notifications/index';
import { useForm } from "react-hook-form";
import { putCall } from '../../../Api/helpers';
import { EDIT_USER } from "../../../Api/apiPath";
import { GLOBAL_HEADING, DEFAULT_PASSWORD_SET, REQUIRED_FIELDS, USER_ROLES } from '../../../Global/constants';
export default function UserEditForm({ cancelButtonHandler, userData }) {
    const [open, setOpen] = React.useState(false);
    const [isdisabled, setisdisabled] = React.useState(false);
    const [role, setRole] = React.useState(userData.role);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const toastId = React.useRef(null);
    const handleChangeEvent = (e) => {
        setRole(e.target.value);
    };
    const callAPI = async (dataObj) => {
        notify(toastId);
        let {
            isApiConnectionSucceess,
            data,
        } = await putCall({ path: `${EDIT_USER}`, updatedData: dataObj });
        update(toastId, data.message, GLOBAL_HEADING.Device_Name);
        if (data.message == "Updated successfully") {
            setOpen(false);
            cancelButtonHandler()
        }
    }
    const onSubmit = (data) => {
        let updatedObj = {
            id: userData.id,
            ...data,
            isPasswordReset: isdisabled,
            password: isdisabled?'abc@12345':userData.password
        }
        callAPI(updatedObj);
    };
    React.useEffect(() => {
        setRole(userData.role);
    }, [])
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "25px",
                }}
            >
                <Box>
                    <Typography
                        sx={{ textAlign: "center", textDecoration: "underline" }}
                    >
                        EDIT USER DETAILS
                    </Typography>
                </Box>

                <Collapse in={open}>
                    <Alert sx={{ mt: 4 }}
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
                    >
                        {DEFAULT_PASSWORD_SET}
                    </Alert>
                </Collapse>
                <TextField
                    sx={{ mt: 3 }}
                    id="standard-basic"
                    label="Username(prefilled)"
                    variant="standard"
                    defaultValue={userData.username}
                    name="username"
                    {...register("username", { required: REQUIRED_FIELDS.USERNAME_REQUIRED })}
                    error={Boolean(errors.username)}
                    helperText={errors.username?.message}
                />
                <TextField
                    id="standard-basic"
                    label="E-mail id(optional)"
                    variant="standard"
                    defaultValue={userData.email}
                    name="email"
                    {...register("email")}
                />
                <FormControl variant="standard">
                    <InputLabel id="demo-simple-select-standard-label">
                        Role Assigned
                    </InputLabel>
                    <Select
                        variant="standard"
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={role}
                        {...register("role", { required: "hello" })}
                        error={Boolean(errors.role)}
                        helperText={errors.role?.message}
                        label="role"
                        onChange={handleChangeEvent}

                    >
                        {Object.keys(USER_ROLES).map(key => {
                            return <MenuItem value={key}>{USER_ROLES[key]}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                <TextField
                    id="standard-basic"
                    label="What is the secret question?"
                    variant="standard"
                    name="secret_question"
                    defaultValue={userData.secret_question}
                    {...register("secret_question", { required: REQUIRED_FIELDS.SECRET_QUESTION_REQUIRED })}
                    error={Boolean(errors.secret_question)}
                    helperText={errors.secret_question?.message}
                />
                <TextField
                    id="standard-basic"
                    label="Answer"
                    variant="standard"
                    name="answer"
                    defaultValue={userData.answer}
                    {...register("answer", { required: REQUIRED_FIELDS.SECRET_ANSWER_REQUIRED })}
                    error={Boolean(errors.answer)}
                    helperText={errors.answer?.message}
                />
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
                        <Button
                            disabled={isdisabled}
                            variant="outlined"
                            onClick={() => {
                                setOpen(true);
                                setisdisabled(true)
                            }}
                        >
                            Reset Password
                        </Button>

                        <Button onClick={cancelButtonHandler}
                            size="medium"
                            variant="outlined"
                        >Cancel
                        </Button>
                        <Button
                            size="medium"
                            variant="outlined"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>

            </form>
        </>
    )
}
