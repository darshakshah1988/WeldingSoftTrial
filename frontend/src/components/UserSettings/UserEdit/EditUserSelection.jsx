import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import UserEditModal from "./UserEditModal";
import { getCall } from "../../../Api/helpers";
import { GET_USERS } from "../../../Api/apiPath";

export default function BasicSelect() {
    const [selectedUser, setselectedUser] = React.useState("");
    const[userData , setUserData]  =React.useState([]);
    const handleChange = (event) => {
        setselectedUser(event.target.value);
    };

    React.useEffect(() => {
        getDataFromAPI()

    },[])

    const getDataFromAPI = async () => {
        let { isApiConnectionSucceess, data } = await getCall({
            path: `${GET_USERS}`,
        });
      setUserData(data.data);
    };
     
    return (
        <Box sx={{ minWidth: 70 }}>
            <FormControl sx={{ minWidth: 300 }} >
                <InputLabel id="demo-simple-select-label">Edit User</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedUser}
                    label="Users"
                    onChange={handleChange}
                >
                    {userData.map((user) => {
                        return <MenuItem key ={user.id}>
                            <UserEditModal username={user.username} id={user.id}></UserEditModal>
                        </MenuItem>
                    })}

                </Select>
            </FormControl>
        </Box >
    );
}
