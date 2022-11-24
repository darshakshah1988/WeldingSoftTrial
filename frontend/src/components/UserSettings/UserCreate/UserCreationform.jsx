import * as React from 'react'
import { InputLabel, MenuItem, Select, FormControl, TextField, Button, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useForm } from "react-hook-form";
import { GLOBAL_HEADING, REQUIRED_FIELDS, USER_ROLES } from '../../../Global/constants';
import { postCall } from '../../../Api/helpers';
import { CREATE_USER } from '../../../Api/apiPath';
import "react-toastify/dist/ReactToastify.css";
import { notify, update } from '../../../uicomponents/Notifications/index';
function UserCreationform() {

  const [roleEntry, setroleEntry] = React.useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const toastId = React.useRef(null);

  const handleChangeEvent = (event) => {
    setroleEntry(event.target.value)
  };
  const callAPI = async (dataObj) => {
    notify(toastId);
    let {
      isApiConnectionSucceess,
      data,
    } = await postCall({ path: `${CREATE_USER}`, Data: dataObj });
    update(toastId, data.message, GLOBAL_HEADING.Device_Name);
    reset();
    setroleEntry("");
  }
  const handlecancel = () => {
    reset();
    setroleEntry('');
  }
  const onSubmit = (data) => {
    callAPI(data)
  };
  return (
    <Box sx={{ boxShadow: "1px 1px 8px #ADB5BD", borderRadius: "10px", width: "500px", minHeight: "100%", margin: "auto", position: "relative" }}>
      <form onSubmit={handleSubmit(onSubmit)}>

        <Box sx={{ display: "flex", flexDirection: "column", padding: "25px 30px", height: "400px", justifyContent: "space-between" }}>
          
          <Box>
            <Typography sx={{ textAlign: "center", textDecoration: "underline" }}> CREATE USER </Typography>
          </Box>

          <TextField
            id="standard-basic" label="Username" variant="standard"
            name="username"
            {...register("username", { required: REQUIRED_FIELDS.USERNAME_REQUIRED })}
            error={Boolean(errors.username)}
            helperText={errors.username?.message}
          />

          <TextField
            sx={{ paddingTop: "17px" }}
            disabled id="standard-basic" variant="standard" defaultValue="Default Password: abc@12345"
          />

          <TextField
            id="standard-basic" label="E-mail id (Optional)" variant="standard"
            name="Email"
            {...register("email")}
          />

          <FormControl variant="standard">

            <InputLabel id="demo-simple-select-standard-label" >Role Assigned</InputLabel>

            <Select
              variant="standard"
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={roleEntry}
              {...register("role", { required: " " })}
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
            id="standard-basic" variant="standard" label="What is the secret question?"
            name="secret_question"
            {...register("secret_question", { required: REQUIRED_FIELDS.SECRET_QUESTION_REQUIRED })}
            error={Boolean(errors.secret_question)}
            helperText={errors.secret_question?.message}
          />

          <TextField
            id="standard-basic" variant="standard" label="Answer"
            name="Answer"
            {...register("answer", { required: REQUIRED_FIELDS.SECRET_ANSWER_REQUIRED })}
            error={Boolean(errors.answer)}
            helperText={errors.answer?.message}
          />
          <Button sx={{ width: "100px", position: "absolute", left: 25, bottom: 30 }} size='medium' variant="outlined" onClick={handlecancel} >CANCEL</Button>
          <Button sx={{ width: "100px", position: "absolute", right: 25, bottom: 30 }} size='medium' variant="outlined" type="submit">SUBMIT</Button>

        </Box>

      </form>
    </Box>
  )
}

export default UserCreationform