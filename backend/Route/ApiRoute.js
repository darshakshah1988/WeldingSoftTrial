const route = require("express").Router();
const { Router } = require("express");
const controller = require("../Controller/ApiController");
const { controllerdata } = require("../database/Models");

route.get("/shift/:id",  controller.getSingleShiftById);

route.post(
  "/createShift",
   controller.protectRoute,
  controller.createShift
);
route.put(
  "/updateShift",
   controller.protectRoute,
  controller.updateShift
);

route.get("/shiftdate/:stDate/:endDate",controller.getShiftData)
route.get("/getallshifts",controller.getAllShifts );
route.get(
  "/ControllerData/:deviceId",
  controller.protectRoute,
  controller.getControllerData
);
// localhost:9000/api//ControllerData/GetAllWithDates/19-07-2022/25-07-2022
route.get(
  "/ControllerData/:deviceId/:stDate/:endDate",
  controller.protectRoute,
  controller.getControllerDataViaDate
);

route.get("/Device", controller.protectRoute, controller.getDevices);
route.delete(
  "/Device/:deviceId",
  controller.protectRoute,
  controller.deleteDevices
);

route.post("/Device", controller.protectRoute, controller.addDevices);
route.put("/Device", controller.protectRoute, controller.updateDevices);
route.get(
  "/ControllerData/getsingle/:DeviceID",
  controller.protectRoute,
  controller.getSingleController
);
route.post(
  "/postControllerData",
  controller.addControllerData
);
route.post(
  "/postBulkControllerData",
  controller.addBulkControllerData
);
route.delete(
  "/deactiveDevice/:deviceNumber/:deactivatedReason",
  controller.protectRoute,
  controller.setDeviceAsDeactivated
);
route.get(
  "/getErrorCodeDetails",
  controller.protectRoute,
  controller.getErrorCodeDetailsByErrorCode
);

route.get(
  "/errorCode/:errorCode/:deviceId/:stDate/:endDate",
  controller.protectRoute,
  controller.getErrorCodeDataViaDate
)

route.get(
  "/errorCode/:errorCode/:deviceId",
  controller.protectRoute,
  controller.getErrorCodeData
)

route.get(
  "/ErrorCodes",
  controller.protectRoute,
  controller.getErrorCodes
);

route.put(
  "/updateErrorCodeDetails",
  controller.protectRoute,
  controller.updateErrorCodeDetails
);
route.post(
  "/insertErrorCode",
  controller.protectRoute,
  controller.insertErrorCode
);

route.get(
  "/User/validateUser/:email/:password",
  controller.validateUser
);
route.get(
  "/User/validateUser",
  controller.protectRoute,
  controller.validateUserDemo
);
route.get("/User", controller.protectRoute, controller.getUsers);
route.delete(
  "/User/:ControllerId",
  controller.protectRoute,
  controller.getUserByControllerId
);

route.get("/ErrorRemedy", controller.protectRoute, controller.getErrorRemedy);
route.get(
  "/DeviceSetting",
  controller.protectRoute,
  controller.getDeviceSettings
);
route.get(
  "/DeviceSettings",
  controller.protectRoute,
  controller.getDeviceSetting
);
route.get("/LiveDevice", controller.protectRoute, controller.getLiveDevice);

route.get("/Line/:LineNo", controller.protectRoute, controller.getSingleLineData);
route.get("/Line", controller.protectRoute, controller.getAllLinesData);
route.get(
  "/Line/:stDate/:endDate",
  controller.protectRoute,
  controller.getLinesDateViaDate
);
route.put("/Line/:LineNo", controller.updateLineData);

// user authentication
route.get("/userauth/:token", controller.userAuth)


route.post(
  "/Line",
  controller.protectRoute,
  controller.addLine
);

// Get controllerData via Date

route.get("/getErrorData/:deviceId",
  controller.protectRoute,
  controller.getErrorDataForDashboard)

route.post("/DeviceSetting",
  controller.protectRoute,
  controller.addDeviceSetting)
route.put("/DeviceSetting",
  controller.protectRoute,
  controller.updateDeviceSetting)


  route.get("/AllDevicesNew",controller.protectRoute, controller.getAllDevicesNew)
route.get("/AllDevices",controller.protectRoute, controller.getAllDevices)
// route.get("/getErrorDetails/:errorCode",
// controller.protectRoute,
// controller.getErrorDataForErrorDashboard)


//user apis
route.post(
  "/createuser",
   controller.protectRoute,
  controller.createUser
);
route.put(
  "/updateuser",
   controller.protectRoute,
  controller.updateUser
);


route.get(
  "/User/:id",
  controller.protectRoute,
  controller.getSingleUserById
)

module.exports = route;
