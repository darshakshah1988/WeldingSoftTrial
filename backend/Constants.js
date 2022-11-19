exports.RESPONSE_STATUS = {
    OK: 200,
    NOT_ACCEPTABLE: 406,
    INTERNAL_SERVER_ERRROR: 500
}

exports.SUCCESS_RESPONSE = {
    LOGIN_SUCESS: "Login sucessfull",
    FETCH_SUCESS: "Data fetched successfully",
    ADDITION_SUCCESSFULL: "Added successfully",
    UPDATE_SUCCESSFULL: "Updated successfully",
    DELETE_DEVICE_SUCCESSFULL: "Device deletion successfull",
    DEVICE_DEACTIVATED_SUCCESS: "Device deactivated successfuly",
    CREATED_SUCCESSFULLY: "Entry created successfully"
}

exports.FAILED_RESPONSE = {
    LOGIN_FAIL: "Invalid Username or Password",
    FETCH_FAILED: "Data fetched failed",
    ADDITION_FAILED: "Addition failed",
    UPDATE_FAILED: "Update failed",
    CONTROLLER_GET_DATA_FAILED: "Failed to get controller data",
    DELETE_DEVICE_FAILED: "Device deletion failed",
    DEVICE_DEACTIVATED_FAILED: "Device deactivation failed",
    DUBLICATE_ENTRY: "Entry alreay exist,cannot create new",
    CREATION_FAILED: "Entry creation failed."

}

exports.ErrorCodeDescriptionRegex = /([A-Z][0-9][0-9][0-9])/
exports.OK_STATUS_FOR_CONTROLLER_DATA = "E000";
