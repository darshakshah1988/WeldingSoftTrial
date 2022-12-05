const {
  controllerdata,
  maintains,
  devicesetting,
  errorcode,
  users,
  line,
  shift,
} = require("../database/Models");

const {Parser} = require('json2csv');


const fs = require('fs')

const { v4: uuidv4 } = require("uuid");

const jwt = require("jsonwebtoken");

const { Op } = require("sequelize");
const {
  RESPONSE_STATUS,
  SUCCESS_RESPONSE,
  FAILED_RESPONSE,
  ErrorCodeDescriptionRegex,
  OK_STATUS_FOR_CONTROLLER_DATA,
} = require("../Constants");
const { json } = require("body-parser");
const dayjs = require("dayjs");
const {
  inputFormatter,
  TYPE_OF_INPUT_CLEANER,
} = require("../Utlilities/Utilities");
const {
  pushControllerDataIntoDatabase, convertControllerData,
} = require("./ControllerReusbaleFunctions");
const sequelize = require("sequelize");
const { downloadCSV, appendPreloadData } = require("./downloadCsvUtils");

exports.createShift = async (req, res) => {
  let {
    shiftName,
    startTime,
    endTime
  } = req.body.data.Data;;
  try {
    let dataObj = await shift.create({
      shiftID: uuidv4(),
      shiftName,
      startTime,
      endTime
    });
    res.json({
      data: dataObj,
      message: SUCCESS_RESPONSE.ADDITION_SUCCESSFULL,
    });
  } catch (error) {
    res.json({
      error: error,
      message: FAILED_RESPONSE.ADDITION_FAILED,
    });
  }
};

exports.updateShift = async (req, res) => {
  const {
    shiftID,
    shiftName,
    startTime,
    endTime
  } = req.body.data.updatedData;;

  try {
    let data = await shift.update(
      {
        shiftName,
        startTime,
        endTime
      },
      {
        where: {
          shiftID,
        },
      }
    );
    res.json({
      data: data,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.UPDATE_SUCCESSFULL,
    });
  } catch (error) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.UPDATE_FAILED,
    });
  }
};

exports.getSingleShiftById = async (req, res) => {
  let shiftId = req.params.id;
  try {
    let data = await shift.findOne({ where: { shiftID: shiftId } });

    return res.json({
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
      data: data,
      status: RESPONSE_STATUS.OK,
    });
  } catch (error) {
    return res.json({
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      errorcode: error,
      message: FAILED_RESPONSE.FETCH_FAILED,
    });
  }
};

exports.getErrorCodeData = async (req, res) => {

  let { errorCode, deviceId } = req.params;
  try {
    let errorCodeData = await controllerdata.findAll({
      where: {
        error_code: errorCode,
        DeviceID: deviceId,

      },
      limit: 500,
      order: [["createdAt", "DESC"]],
    });
    console.log(errorCodeData.length);
    res.json({
      data: errorCodeData,
    });
  } catch (error) {
    res.json({
      error: error,
    });
  }
};
exports.getErrorCodeDataViaDate = async (req, res) => {

  let { errorCode, deviceId } = req.params;
  let startDate = dayjs(Number(req.params.stDate)).toDate();
  let endDate = dayjs(Number(req.params.endDate)).toDate();

  try {
    let errorCodeData = await controllerdata.findAll({
      where: {
        error_code: errorCode,
        DeviceID: deviceId,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    res.json({
      data: errorCodeData,
    });
  } catch (error) {
    res.json({
      error: error,
    });
  }
};

exports.getAllShifts = async (req, res) => {
  try {
    let allShifts = await shift.findAll({});
    res.json({
      data: allShifts,
      messgae: SUCCESS_RESPONSE.FETCH_SUCESS,
      status: RESPONSE_STATUS.OK,
    });
  } catch (e) {
    res.json({
      error: e,
      messgae: FAILED_RESPONSE.FETCH_FAILED,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
    });
  }
};

exports.getShiftData = async (req, res) => {
  try {
    let startDate = dayjs(Number(req.params.stDate)).toDate();
    let endDate = dayjs(Number(req.params.endDate)).toDate();
    let shiftdata = [];
    let shiftDeviceData = await devicesetting.findAll({
      attributes: ["devicenumber", "controllername"],
    });
    for (let t = 0; t < shiftDeviceData.length; t++) {
      let controllerData = await controllerdata.findAll({
        attributes: { exclude: ["id"] },
        where: {
          DeviceID: shiftDeviceData[t].devicenumber,
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      if (controllerData.length > 0)
        shiftdata.push(controllerData);

    }
    res.json({
      data: shiftdata,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
      status: RESPONSE_STATUS.OK,
    });
  } catch (error) {
    res.json({
      error: error,
      message: FAILED_RESPONSE.FETCH_FAILED,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
    });
  }
};
exports.createUser = async (req, res) => {
  let {
    username,
    email,
    password,
    secret_question,
    answer,
    role,
    isPasswordReset,
  } = req.body.data.Data;
  try {
    let dataObj = await users.create({
      id: uuidv4(),
      username,
      email,
      password,
      secret_question,
      answer,
      role,
      isPasswordReset,
    });
    res.json({
      data: dataObj,
      message: SUCCESS_RESPONSE.ADDITION_SUCCESSFULL,
    });
  } catch (error) {
    res.json({
      error: error,
      message: FAILED_RESPONSE.ADDITION_FAILED,
    });
  }
};
// To update user or reset password
exports.updateUser = async (req, res) => {
  const {
    id,
    username,
    email,
    password,
    secret_question,
    answer,
    role,
    isPasswordReset,
  } = req.body.data.updatedData;

  try {
    let data = await users.update(
      {
        username,
        email,
        password,
        secret_question,
        answer,
        role,
        isPasswordReset,
      },
      {
        where: {
          id,
        },
      }
    );
    res.json({
      data: data,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.UPDATE_SUCCESSFULL,
    });
  } catch (error) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.UPDATE_FAILED,
    });
  }
};

exports.getLiveDevice = async (req, res) => {
  let count = [];
  let ecount = [];
  let time = [];
  try {
    let userData = await devicesetting.findAll({
      attributes: ["devicenumber", "controllername"],
    });
    // Stores all unqiue device number and its name

    for (i = 0; i < userData.length; i++) {
      let controllerData = await controllerdata.findAll({
        where: {
          DeviceID: userData[i].devicenumber,
        },
      });
      count.push(controllerData.length); //sum of rows

      let errorCodes = await controllerdata.findAll({
        where: {
          DeviceID: userData[i].devicenumber,
          error_code: {
            [Op.ne]: OK_STATUS_FOR_CONTROLLER_DATA,
          },
        },
      });
      ecount.push(errorCodes.length); //sum of errors

      let lastTime = await controllerdata.findOne({
        attributes: ["updatedAt"],
        where: {
          DeviceID: userData[i].devicenumber,
        },
        order: [["updatedAt", "DESC"]],
      });
      time.push(lastTime.updatedAt); //to get last updated time
    }
   
    let resObj = [];
    for (i = 0; i < userData.length; i++) {
      resObj.push({
        controllerName: userData[i].controllername,
        sum: count[i],
        count: ecount[i],
        DateTime: time[i],
        DeviceID: userData[i].devicenumber,
      });
    }

    res.json({
      data: resObj,
      message: "SUCCESS_RESPONSE.DELETE_USER_SUCCESSFULL",
      status: RESPONSE_STATUS.OK,
    });
  } catch (error) {
    res.json({
      error: error,
      message: SUCCESS_RESPONSE.USER_GET_DATA_FAILED,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
    });
  }
};

exports.getDashBoardData = async (req, res) => {
  let weldcount;
  let ecount;
  let deviceId = req.params["deviceId"];
  try {
    let controllerData = await controllerdata.findAll({
      where: {
        DeviceID: deviceId,
      },
    });
    weldcount = controllerData.length; //sum of rows

    let errorCodes = await controllerdata.findAll({
      where: {
        DeviceID: deviceId,
        error_code: {
          [Op.ne]: OK_STATUS_FOR_CONTROLLER_DATA,
        },
      },
    });
    ecount = errorCodes.length; //sum of errors

    let lastRecord = await controllerdata.findOne({
      where: {
        DeviceID: deviceId,
      },
      order: [["updatedAt", "DESC"]],
    });

    let resobj = [];

    resobj.push({
      spotCounter: weldcount,
      ActualCurrent: lastRecord.ActualCurrent,
      WeldingPressure1: lastRecord.WeldingPressure1,
      WeldingPressure2: lastRecord.WeldingPressure2,
      error_code: ecount,
    });

    res.json({
      data: resobj,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
      status: RESPONSE_STATUS.OK,
    });
  } catch (error) {
    res.json({
      error: error,
      message: FAILED_RESPONSE.FETCH_FAILED,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
    });
  }
};
exports.updateLineData = async (req, res) => {
  const lineNo = req.params.LineNo;
  // const lineName = req.params.LineName;
  const lineName = req.body.data.updatedData;
  console.log(lineNo, lineName);
  // const {lineName}  = req.body;
  try {
    let lineObj = await line.update(
      {
        lineName,
      },
      {
        where: {
          lineNo,
        },
      }
    );
    res.json({
      data: lineObj,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.UPDATE_SUCCESSFULL,
    });
  } catch (error) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.UPDATE_FAILED,
    });
  }
};
// Get Data via Date
exports.getLinesDateViaDate = async (req, res) => {
  let result = [];
  try {
    let startDate = dayjs(Number(req.params.stDate)).toDate();
    let endDate = dayjs(Number(req.params.endDate)).toDate();

    let lines = await line.findAll({
      attributes: ["lineNo", "lineName"],
    });
    for (k = 0; k < lines.length; k++) {
      let lineNo = lines[k].lineNo;
      let lineName = lines[k].lineName;

      let userData = await devicesetting.findAll({
        attributes: ["devicenumber", "controllername"],
        where: {
          lineNo: lineNo,
        },
      });

      // Stores all device with given Line Number
      let count = [];
      let ecount = [];
      let time = [];
      let resObj = [];

      for (i = 0; i < userData.length; i++) {
        let controllerData = await controllerdata.findAll({
          where: {
            DeviceID: userData[i].devicenumber,
            createdAt: {
              [Op.between]: [startDate, endDate],
            },
          },
        });
        count.push(controllerData.length); //sum of rows

        let errorCodes = await controllerdata.findAll({
          where: {
            DeviceID: userData[i].devicenumber,
            error_code: {
              [Op.ne]: OK_STATUS_FOR_CONTROLLER_DATA,
            },
            createdAt: {
              [Op.lte]: endDate,
              [Op.gte]: startDate,
            },
          },
        });
        ecount.push(errorCodes.length); //sum of errors

        let lastTime = await controllerdata.findAll({
          attributes: ["updatedAt"],
          where: {
            DeviceID: userData[i].devicenumber,
            createdAt: {
              [Op.lte]: endDate,
              [Op.gte]: startDate,
            },
          },
          order: [["updatedAt", "DESC"]],
        });
        time.push(lastTime.updatedAt); //to get last updated time
      }
      for (i = 0; i < userData.length; i++) {
        resObj.push({
          controllerName: userData[i].controllername,
          totalJoints: count[i],
          errorCount: ecount[i],
          DateTime: time[i],
          DeviceID: userData[i].devicenumber,
          lineNo,
          lineName,
        });
      }
      result = [...result, ...resObj];
    }

    res.json({
      data: { lineData: lines, dashboardData: result },
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
      status: RESPONSE_STATUS.OK,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: error,
      message: FAILED_RESPONSE.FETCH_FAILED,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
    });
  }
};

exports.getDashBoardDataViaDate = async (req, res) => {
  let weldcount;
  let ecount;
  let deviceId = req.params["deviceId"];
  try {
    let startDate = dayjs(Number(req.params.stDate)).toDate();
    let endDate = dayjs(Number(req.params.endDate)).toDate();

    let controllerData = await controllerdata.findAll({
      where: {
        DeviceID: deviceId,
      },
      createdAt: {
        [Op.lte]: endDate,
        [Op.gte]: startDate,
      },
    });
    weldcount = controllerData.length; //sum of rows

    let errorCodes = await controllerdata.findAll({
      where: {
        DeviceID: deviceId,
        error_code: {
          [Op.ne]: OK_STATUS_FOR_CONTROLLER_DATA,
        },
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    ecount = errorCodes.length; //sum of errors

    let lastRecord = await controllerdata.findOne({
      where: {
        DeviceID: deviceId,
        createdAt: {
          [Op.lte]: endDate,
          [Op.gte]: startDate,
        },
      },
      order: [["updatedAt", "DESC"]],
    });

    let resobj = [];

    if (lastRecord) {
      resobj.push({
        spotCounter: weldcount,
        ActualCurrent: lastRecord.ActualCurrent,
        WeldingPressure1: lastRecord.WeldingPressure1,
        WeldingPressure2: lastRecord.WeldingPressure2,
        error_code: ecount,
      });
    }

    res.json({
      data: resobj,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
      status: RESPONSE_STATUS.OK,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: error,
      message: FAILED_RESPONSE.FETCH_FAILED,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
    });
  }
};

exports.updateLineData = async (req, res) => {
  const lineNo = req.params.LineNo;
  // const lineName = req.params.LineName;
  const lineName = req.body.data.updatedData;
  console.log(lineNo, lineName);
  // const {lineName}  = req.body;
  try {
    let lineObj = await line.update(
      {
        lineName,
      },
      {
        where: {
          lineNo,
        },
      }
    );
    res.json({
      data: lineObj,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.UPDATE_SUCCESSFULL,
    });
  } catch (error) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.UPDATE_FAILED,
    });
  }
};
exports.getAllLinesData = async (req, res) => {
  let result = [];
  try {
    let lines = await line.findAll({
      attributes: ["lineNo", "lineName"],
    });
    for (k = 0; k < lines.length; k++) {
      let lineNo = lines[k].lineNo;
      let lineName = lines[k].lineName;

      let userData = await devicesetting.findAll({
        attributes: ["devicenumber", "controllername"],
        where: {
          lineNo: lineNo,
        },
      });

      // Stores all device with given Line Number
      let count = [];
      let ecount = [];
      let time = [];
      let resObj = [];

      for (i = 0; i < userData.length; i++) {
        let controllerData = await controllerdata.findAll({
          where: {
            DeviceID: userData[i].devicenumber,
          },
        });
        count.push(controllerData.length); //sum of rows

        let errorCodes = await controllerdata.findAll({
          where: {
            DeviceID: userData[i].devicenumber,
            error_code: {
              [Op.ne]: OK_STATUS_FOR_CONTROLLER_DATA,
            },
          },
        });
        ecount.push(errorCodes.length); //sum of errors

        let lastTime = await controllerdata.findAll({
          attributes: ["updatedAt"],
          where: {
            DeviceID: userData[i].devicenumber,
          },
          order: [["updatedAt", "DESC"]],
        });
        time.push(lastTime.updatedAt); //to get last updated time
      }
      for (i = 0; i < userData.length; i++) {
        resObj.push({
          controllerName: userData[i].controllername,
          totalJoints: count[i],
          errorCount: ecount[i],
          DateTime: time[i],
          DeviceID: userData[i].devicenumber,
          lineNo,
          lineName,
        });
      }
      result = [...result, ...resObj];
    }

    res.json({
      data: { lineData: lines, dashboardData: result },
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
      status: RESPONSE_STATUS.OK,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: error,
      message: FAILED_RESPONSE.FETCH_FAILED,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
    });
  }
};

exports.getSingleLineData = async (req, res) => {
  let count = [];
  let ecount = [];
  let time = [];
  lineNo = req.params.LineNo;
  try {
    let userData = await devicesetting.findAll({
      attributes: ["devicenumber", "controllername"],
      where: {
        lineNo: lineNo,
      },
    });
    // Stores all device with given Line Number

    for (i = 0; i < userData.length; i++) {
      let controllerData = await controllerdata.findAll({
        where: {
          DeviceID: userData[i].devicenumber,
        },
      });
      count.push(controllerData.length); //sum of rows

      let errorCodes = await controllerdata.findAll({
        where: {
          DeviceID: userData[i].devicenumber,
          error_code: {
            [Op.ne]: OK_STATUS_FOR_CONTROLLER_DATA,
          },
        },
      });
      ecount.push(errorCodes.length); //sum of errors

      let lastTime = await controllerdata.findOne({
        attributes: ["updatedAt"],
        where: {
          DeviceID: userData[i].devicenumber,
        },
        order: [["updatedAt", "DESC"]],
      });
      time.push(lastTime.updatedAt); //to get last updated time
    }

    let resObj = [];
    for (i = 0; i < userData.length; i++) {
      resObj.push({
        controllerName: userData[i].controllername,
        sum: count[i],
        count: ecount[i],
        DateTime: time[i],
        DeviceID: userData[i].devicenumber,
      });
    }

    res.json({
      data: resObj,
      message: "SUCCESS_RESPONSE.FETCH_SUCCESS",
      status: RESPONSE_STATUS.OK,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: error,
      message: SUCCESS_RESPONSE.USER_GET_DATA_FAILED,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
    });
  }
};

exports.getControllerData = async (req, res) => {
  // run
  let deviceId = req.params["deviceId"];
  console.log(deviceId)
  try {
    let data = await controllerdata.findAll({
      attributes: { exclude: ["id"] },
      where: {
        DeviceID: deviceId,
      },
      limit: 500,
      order: [["createdAt", "DESC"]],
    });
    return res.json({
      data: data,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
    });
  } catch (error) {
    return res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.CONTROLLER_GET_DATA_FAILED,
    });
  }
};

exports.getControllerDataViaDate = async (req, res) => {
  try {
    let deviceId = req.params["deviceId"];
    let startDate = dayjs(Number(req.params.stDate)).toDate();
    let endDate = dayjs(Number(req.params.endDate)).toDate();

    let devicesData = await controllerdata.findAll({
      attributes: { exclude: ["id"] },
      where: {
        DeviceID: deviceId,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["createdAt", "ASC"]],
    });

    let convertedData = convertControllerData(devicesData);

    // 1378233028000
    // 2013-09-03T18:30:28.000Z
    // 2022-09-04T06:30:28.000Z

    // 1378233000000
    // 2013-09-03T18:30:00.000Z
    // 2013-09-04T06:30:00.000Z


    res.json({
      data: convertedData,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
      status: RESPONSE_STATUS.OK,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: error,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
    });
  }
};

exports.getDevices = async (req, res) => {
  // run
  try {
    let data = await maintains.findAll({});
    res.json({
      data: data,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
    });
  } catch (error) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.CONTROLLER_GET_DATA_FAILED,
    });
  }
};
exports.addLine = async (req, res) => {
  const lineName = req.body.data.Data;
  console.log(lineName);
  try {
    let data = await line.create({
      lineNo: "line-" + uuidv4(),
      lineName: lineName,
    });

    res.json({
      data: data,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.ADDITION_SUCCESSFULL,
    });
  } catch (error) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.ADDITION_FAILED,
    });
  }
};
exports.addDeviceSetting = async (req, res) => {
  const {
    controllername,
    devicenumber,
    customername,
    lineNo,
    fixturenumber,
    gunservingmodel,
    partname,
    spotcounterperjob,
    tipdress,
    tipchange,
  } = req.body.data.Data;
  try {
    let data = await devicesetting.create({
      controllername,
      devicenumber,
      customername,
      lineNo,
      fixturenumber,
      gunservingmodel,
      partname,
      spotcounterperjob,
      tipdress,
      tipchange,
    });

    res.json({
      data: data,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.ADDITION_SUCCESSFULL,
    });
  } catch (error) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.ADDITION_FAILED,
    });
  }
};
exports.updateDeviceSetting = async (req, res) => {
  // console.log(req.body.data.updatedData);
  const {
    controllername,
    devicenumber,
    customername,
    lineNo,
    fixturenumber,
    gunservingmodel,
    partname,
    spotcounterperjob,
    tipdress,
    tipchange,
    isDeviceDeactivated,
    deactivatedReason,
  } = req.body.data.updatedData;
  try {
    let data = await devicesetting.update(
      {
        controllername,
        devicenumber,
        customername,
        lineNo,
        fixturenumber,
        gunservingmodel,
        partname,
        spotcounterperjob,
        tipdress,
        tipchange,
        isDeviceDeactivated,
        deactivatedReason,
      },
      {
        where: {
          devicenumber,
        },
      }
    );

    res.json({
      data: data,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.UPDATE_SUCCESSFULL,
    });
  } catch (error) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.UPDATE_FAILED,
    });
  }
};

exports.addControllerData = async (req, res) => {
  try {
    const apiControllerData = req.body;
    let { isAdditionSuccessull, data, err } = await pushControllerDataIntoDatabase(
    apiControllerData, res
  );
  if (isAdditionSuccessull) {
    return res.json({
      status: RESPONSE_STATUS.OK,
      data: data,
      message: SUCCESS_RESPONSE.ADDITION_SUCCESSFULL,
    });
  }
  } catch (error) {
    return res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.ADDITION_FAILED,
    });
  }
  
};

exports.addBulkControllerData = async (req, res) => {
  const apiBulkControllerData = req.body;
  for (let iterator = 0; iterator < apiBulkControllerData.length; iterator++) {
    // console.log(apiBulkControllerData[iterator]);
    let {isAdditionSuccessull} = await pushControllerDataIntoDatabase(
      apiBulkControllerData[iterator]
    );
    console.log(isAdditionSuccessull);
    if (!isAdditionSuccessull) {
      return res.json({
        error: error,
        status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
        message: FAILED_RESPONSE.ADDITION_FAILED,
      });
    }
  }

  return res.json({
    status: RESPONSE_STATUS.OK,
    // data: deviceobj,
    message: SUCCESS_RESPONSE.ADDITION_SUCCESSFULL,
  });
};

exports.addDevices = async (req, res) => {
  const {
    controllerId,
    controllerName,
    iotSerialNumber,
    equipmentName,
    equipNumber,
    Description,
    maintainAction,
    Remark,
  } = req.body;

  try {
    let deviceObj = await maintains.create({
      controllerId,
      controllerName,
      iotSerialNumber,
      equipmentName,
      equipNumber,
      Description,
      maintainAction,
      Remark,
    });
    res.json({
      data: deviceObj,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.ADDITION_SUCCESSFULL,
    });
  } catch (error) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.ADDITION_FAILED,
    });
  }
};

exports.updateDevices = async (req, res) => {
  const {
    controllerId,
    controllerName,
    iotSerialNumber,
    equipmentName,
    equipNumber,
    Description,
    dateOfFunction,
    dateOfMaintain,
    maintainAction,
    Remark,
  } = req.body;
  try {
    await maintains.update(
      {
        controllerId,
        controllerName,
        iotSerialNumber,
        equipmentName,
        equipNumber,
        Description,
        dateOfFunction,
        dateOfMaintain,
        maintainAction,
        Remark,
      },
      {
        where: {
          controllerId,
        },
      }
    );
    res.json({
      data: deviceObj,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.UPDATE_SUCCESSFULL,
    });
  } catch (e) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.UPDATE_FAILED,
    });
  }
};

exports.deleteDevices = async (req, res) => {
  let devicenumber = req.params["deviceId"];
  try {
    await devicesetting.destroy({
      where: {
        devicenumber: devicenumber,
      },
    });
    res.json({
      data: deviceObj,
      status: RESPONSE_STATUS.OK,
      message: FAILED_RESPONSE.DELETE_DEVICE_FAILED,
    });
  } catch (e) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.DELETE_DEVICE_FAILED,
    });
  }
};

exports.postAddDevices = async () => { };

exports.getSingleController = async (req, res) => {
  let DeviceID = req.params["DeviceID"];
  try {
    let deviceObj = await controllerdata.findAll({
      DeviceID,
      attributes: { exclude: ["id"] },
    });

    res.json({
      data: deviceObj,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
    });
  } catch (error) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: "failed ",
    });
  }
};
exports.getErrorRemedy = async (req, res) => {
  try {
    let data = await errorcode.findAll({
      attributes: { exclude: ["id"] },
    });
    res.json({
      data: data,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
    });
  } catch (error) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.CONTROLLER_GET_DATA_FAILED,
    });
  }
};

exports.getDeviceSettings = async (req, res) => {
  try {
    let data = await devicesetting.findAll({
      attributes: {
        exclude: ["id", "createdAt", "updatedAt"],
      },
    });

    res.json({
      data: data,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
    });
  } catch (error) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.CONTROLLER_GET_DATA_FAILED,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    let data = await users.findAll({
      attributes: { exclude: ["isPasswordReset"] },
    });
    res.json({
      data: data,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
    });
  } catch (error) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.USER_GET_DATA_FAILED,
    });
  }
};

exports.getUserByControllerId = async (req, res) => {
  try {
    let id = req.params["ControllerId"];
    let userData = await users.destroy({
      attributes: { exclude: ["isPasswordReset"] },
      where: {
        id: id,
      },
    });
    res.json({
      data: userData,
      message: SUCCESS_RESPONSE.DELETE_USER_SUCCESSFULL,
      status: RESPONSE_STATUS.OK,
    });
  } catch (error) {
    res.json({
      error: error,
      message: SUCCESS_RESPONSE.USER_GET_DATA_FAILED,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
    });
  }
};
let SECRET_KEY = "skjbdbswciawbiabwcibaiwcb";
exports.validateUser = async (req, res) => {
  try {
    let username = req.params["email"];
    let password = req.params["password"];
    let userData = await users.findOne({
      where: {
        username,
        password,
      },
    });
    if (userData) {
      const token = jwt.sign({ id: username }, SECRET_KEY);
      res.json({
        data: userData,
        token: token,
        message: SUCCESS_RESPONSE.LOGIN_SUCESS,
        status: RESPONSE_STATUS.OK,
      });
    } else {
      res.json({
        message: FAILED_RESPONSE.LOGIN_FAIL,
        status: RESPONSE_STATUS.NOT_ACCEPTABLE,
      });
    }
  } catch (error) {
    res.json({
      error: error,
      message: FAILED_RESPONSE.LOGIN_FAIL,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
    });
  }
};
exports.protectRoute = async function (req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // const token = req.body.token;
      token = req.headers.authorization.split(" ")[1];
      const payload = jwt.verify(token, SECRET_KEY);
      if (payload) {
        req.id = payload.id;
        next();
      } else {
        res.status(501).json({
          message: "Please Log in !!",
        });
      }
    } catch (error) {
      res.status(501).json({
        message: "Please Log in error !!",
        error,
      });
    }
  }
  if (!token) {
    res.status(501).json({
      message: "Please Log in error !!",
    });
  }
};
exports.userAuth = async function (req, res) {
  try {
    const token = req.params.token;
    const payload = jwt.verify(token, SECRET_KEY);
    if (payload) {
      req.id = payload.id;
      res.json({
        message: "validate user Authentication",
        isUserAutenticated: true,
      });
    } else {
      res.status(501).json({
        message: "Please Log in !!",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Please Log in error !!",
      error,
    });
  }
};

exports.validateUserDemo = async (req, res) => {
  try {
    let email = req.id;
    let password = req.password;
    let devicesData = await users.findOne({
      attributes: { exclude: ["isPasswordReset"] },
      where: {
        email: email,
        password: password,
      },
    });
    jsonToken.sign(
      {
        data: "foobar",
      },
      "secret",
      { expiresIn: 60 * 60 }
    );
  } catch (error) {
    res.json({
      error: error,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
    });
  }
};

exports.setDeviceAsDeactivated = async (req, res) => {
  let { deviceNumber, deactivatedReason } = req.params;

  try {
    await devicesetting.update(
      {
        isDeviceDeactivated: true,
        deactivatedReason,
      },
      {
        where: {
          deviceNumber,
        },
      }
    );
    res.json({
      data: deviceObj,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.DEVICE_DEACTIVATED_SUCCESS,
    });
  } catch (e) {
    res.json({
      error: error,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.DEVICE_DEACTIVATED_FAILED,
    });
  }
};

exports.getErrorCodeDetailsByErrorCode = async (req, res) => {
  const { errorCode } = req.query;
  try {
    let result = await errorcode.findOne({
      where: {
        code: errorCode,
      },
    });
    res.json({
      data: result,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
      status: RESPONSE_STATUS.OK,
    });
  } catch (e) {
    res.json({
      error: e,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.FETCH_FAILED,
    });
  }
};

exports.getErrorCodes = async (req, res) => {
  try {
    let result = await errorcode.findAll({
      attributes: { exclude: ["id"] },
    });
    res.json({
      data: result,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
      status: RESPONSE_STATUS.OK,
    });
  } catch (e) {
    res.json({
      error: e,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      message: FAILED_RESPONSE.FETCH_FAILED,
    });
  }
};

exports.updateErrorCodeDetails = async (req, res) => {
  const { code } = req.body;
  try {
    await errorCode.update(
      { ...req.body },
      {
        where: {
          code,
        },
      }
    );

    return res.json({
      message: SUCCESS_RESPONSE.UPDATE_SUCCESSFULL,
      status: RESPONSE_STATUS.OK,
    });
  } catch (e) {
    return res.json({
      message: FAILED_RESPONSE.UPDATE_FAILED,
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      error: e,
    });
  }
};
exports.insertErrorCode = async (req, res) => {
  let { code, description, causeofalarm, recomoperation } = req.body;

  //check if code already exist

  try {
    let getIfCOdeExist = await errorcode.findAll({ code });
    if (getIfCOdeExist.length > 0) {
      return res.json({
        status: RESPONSE_STATUS.NOT_ACCEPTABLE,
        message: FAILED_RESPONSE.DUBLICATE_ENTRY,
      });
    }

    await errorcode.create({
      code,
      description,
      causeofalarm,
      recomoperation,
    });

    return res.json({
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.CREATED_SUCCESSFULLY,
    });
  } catch (e) {
    return res.json({
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      errorcode: e,
      message: FAILED_RESPONSE.CREATION_FAILED,
    });
  }
};

exports.getAllDevices = async (req, res) => {
  try {
    let data = await devicesetting.findAll({
      attributes: ["controllername", "devicenumber"],
    });
    const devices = [
      ...new Map(data.map((item) => [item["devicenumber"], item])).values(),
    ];
    return res.json({
      data: devices,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
    });
  } catch (error) {
    return res.json({
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      errorcode: e,
      message: FAILED_RESPONSE.FETCH_FAILED,
    });
  }
};

exports.getAllDevicesNew = async (req, res) => {
  try {
    let data = await devicesetting.findAll({
      attributes: [["controllername" , "Gun Number"], "devicenumber", ["customername", "Customer name"], ["fixturenumber" , "Station Number"],["gunservingmodel" , "Controller Number"],["partname", "Part Name"],["isDeviceDeactivated", "Is Device Deactivated"],["deactivatedReason", "Deactivated Reason"]],
    });
    const devices = [
      ...new Map(data.map((item) => [item["devicenumber"], item])).values(),
    ];
    return res.json({
      data: devices,
      status: RESPONSE_STATUS.OK,
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
    });
  } catch (error) {
    return res.json({
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      errorcode: e,
      message: FAILED_RESPONSE.FETCH_FAILED,
    });
  }
}; 

exports.getSingleUserById = async (req, res) => {
  let userId = req.params.id;
  try {
    let data = await users.findOne({ where: { id: userId } });

    return res.json({
      message: SUCCESS_RESPONSE.FETCH_SUCESS,
      data: data,
      status: RESPONSE_STATUS.OK,
    });
  } catch (error) {
    return res.json({
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERRROR,
      errorcode: error,
      message: FAILED_RESPONSE.FETCH_FAILED,
    });
  }
};

exports.getErrorDataForDashboard = async (req, res) => { };

const getControllerDataForCron = async (deviceId, startDate, endDate) => {
  try {
    // deviceId = req.params["deviceId"];
    console.log("<<<<PARAMS 1: ",deviceId, startDate, endDate)
    // startDate = dayjs(startDate).toDate();
    // endDate = dayjs(endDate).toDate();
    // console.log("<<<<PARAMS 2: ",deviceId, startDate, endDate)
    let devicesData = await controllerdata.findAll({
      attributes: { exclude: ["id"] },
      where: {
        DeviceID: deviceId,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["createdAt", "ASC"]],
    });

    let convertedData = convertControllerData(devicesData);

    return convertedData;
  } catch (error) {
    console.log(error);
    return error;
  }
};
const getContollerSettings = async (selectedDeviceId) => {
  try {
    let data = await devicesetting.findAll({
      attributes: {
        exclude: ["id", "createdAt", "updatedAt"],
      },
    });
    let deviceSettingData = {};
    let filename = 'NO_NAME';
    let lineName = '';
    let lineId = "";
    data && data.forEach((obj)=>{
      lineId = obj.lineNo;
    })
    let lines = await line.findAll({
      attributes: ["lineNo", "lineName"],
      where:{lineNo : lineId}
    });
    lineName = lines[0].dataValues.lineName;
    data && data.forEach((obj)=>{
      if(obj.devicenumber.includes(selectedDeviceId)){
          filename = obj.controllername;
          deviceSettingData = {
              "Gun Number":obj.controllername,
              "Device Number":obj.devicenumber,
              "Customer Name":obj.customername,
              "Line No":lineName,
              "Station Number":obj.fixturenumber,
              "Controller Number":obj.gunservingmodel,
              "Part Name":obj.partname,
              "Tip Force KGF at 5bar":obj.spotcounterperjob,
              "Throat Depth mm":obj.tipdress,
              "Throat Gap mm":obj.tipchange,
              "Is Device Deactivated":obj.isDeviceDeactivated,
              "Deactivated Reason":obj.deactivatedReason,
            }
      }
  })
    return {deviceSettingData, filename};
  } catch (error) {
    console.log("<<<<Device Setting Error::",error)
  }
};
exports.crondataTrial = async (req, res) => {
  try {
    let data = await shift.findOne({where: {shiftName: "Shift 1"}});
    let cdt = new Date();
    let nowTime = cdt.getHours()+":"+cdt.getMinutes()+":"+cdt.getSeconds();
    let currentMonth = cdt.getMonth()+1;
    let nowDate = cdt.getFullYear()+"-"+ currentMonth +"-"+cdt.getDate();
    let shiftName = "shift_1";
    
    // if(data.endTime == nowTime)
    // {
      let selectedDevice = "GF220600004";
      // let startDate = `${nowDate} ${data.startTime}`;
      let startDate = `2022-11-18 ${data.startTime}`;
      let endDate = `${nowDate} ${data.endTime}`;
      let reportpath = "./reports/";
 
      const controllerData = await getControllerDataForCron(selectedDevice, startDate, endDate);
      let allData = controllerData[0];
        let novtech = allData.Novtech;
        let GF_AC = allData.GF_AC;
        let GF_MF = allData.GF_MF;
        if(novtech.length > 0 || GF_AC.length > 0 || GF_MF.length > 0){
          const {deviceSettingData, filename} = await getContollerSettings(selectedDevice);
          let preData =  appendPreloadData(deviceSettingData);
          let novtechCsv=preData;
          let GF_AC_Csv=preData;
          let GF_MF_Csv=preData;

          if(GF_AC.length > 0)
          { const json2csv = new Parser();
            GF_AC_Csv += json2csv.parse(GF_AC);
            fs.writeFileSync(`${reportpath}${filename}_AC_${nowDate}_${selectedDevice}_${shiftName}.csv`, GF_AC_Csv);
          }

          if(novtech.length > 0)
          {  const json2csv = new Parser();
            novtechCsv += json2csv.parse(novtech);
            fs.writeFileSync(`${reportpath}${filename}_Novtech_${nowDate}_${selectedDevice}_${shiftName}.csv`, novtechCsv);
          }

          if(GF_MF.length > 0)
          { const json2csv = new Parser();
            GF_MF_Csv += json2csv.parse(GF_MF);     
            fs.writeFileSync(`${reportpath}${filename}_MF_${nowDate}_${selectedDevice}_${shiftName}.csv`, GF_MF_Csv);
          }
          
        }
    // }
  }
  catch (error) {
    console.log("ERROR Occoured",error)
  }
};