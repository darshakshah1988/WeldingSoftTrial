import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import UserEditForm from './UserEditForm';
import { getCall } from "../../../Api/helpers";
import { GET_USERS } from "../../../Api/apiPath";
import { myStyle } from '../../../Global/StyleConstant';

export default function BasicModal({ username, id }) {
    const [open, setOpen] = React.useState(false);
    const[userData , setUserData]  =React.useState([]);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const cancelButtonHandler = () => {
        setOpen(false);
    }
    React.useEffect(() => {
        getDataFromAPI()

    },[])
    
    const getDataFromAPI = async () => {
        let { isApiConnectionSucceess, data } = await getCall({
            path: `${GET_USERS}/${id}`,
        });
        setUserData(data.data);
    };
    return (
        <div>
            <div onClick={handleOpen} style={{width: '250px'}} >{username}</div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={myStyle}>
                    <UserEditForm userData={userData} cancelButtonHandler={cancelButtonHandler}></UserEditForm>
                </Box>
            </Modal>
        </div>
    );
}
