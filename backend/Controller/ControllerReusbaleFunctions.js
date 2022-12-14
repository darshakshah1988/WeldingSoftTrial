const { ErrorCodeDescriptionRegex } = require("../Constants");
const { controllerdata } = require("../database/Models");
const { inputFormatter } = require("../Utlilities/Utilities");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");

exports.pushControllerDataIntoDatabase = async (apiControllerData) => {
  let isAdditionSuccessull = false;
  let type;

  Object.keys(apiControllerData).forEach((key)=>{
    if(typeof apiControllerData[key] === 'string'){
      apiControllerData[key] = apiControllerData[key].replace(/(^'|'$)/g, '');
      apiControllerData[key] = apiControllerData[key].replace(/^\s+|\s+$/gm,'');
    }
  })
  
  if(Object.keys(apiControllerData).length === 10){
    type = 'Novtech';
  } else if(apiControllerData['Upslope'].indexOf('V') != -1){
    type = 'GF_MF';
  } else{
    type = 'GF_AC';
  }
  let sendingObj = {};
  if(type === 'Novtech'){
      const {
        DeviceID,
        PowerFactor,
        ActualCurrent,
        U_P_Slope,
        error_code,
        Primary_current
      } = apiControllerData;
      sendingObj = {
        id: "device-" + uuidv4(),
        DateTime: dayjs().format("DD-MM-YYYY HH:mm:ss"),
        ...apiControllerData,
        PowerFactor: parseFloat((+PowerFactor/100).toFixed(2)),
        ActualCurrent: parseFloat((+ActualCurrent/1000).toFixed(2)),
        Upslope:U_P_Slope,
        error_code: (+error_code)*50,
        SetCurrent : Primary_current

      }
  } else if(type === 'GF_MF'){
   
      const { Upslope,ErrorCodeDescription } = apiControllerData;
      let error;
      
  let ErrorCodeDescriptionFormatted = ErrorCodeDescription;
  try {
    if (
      ErrorCodeDescriptionFormatted &&
      ErrorCodeDescriptionFormatted.match(ErrorCodeDescriptionRegex) &&
      ErrorCodeDescriptionFormatted.match(ErrorCodeDescriptionRegex)[0]
    ) {
      error = ErrorCodeDescriptionFormatted.match(
        ErrorCodeDescriptionRegex
      )[0];
    }
  } catch (error) {
    console.log(error);
  }
      sendingObj = {
        id: "device-" + uuidv4(),
        DateTime: dayjs().format("DD-MM-YYYY HH:mm:ss"),
        ...apiControllerData,
        Upslope: Upslope.split(' ')[0],
        error_code: error,
        ActualCurrent: apiControllerData['ActualCurrent'].split(' ')[0],
        NominalCurrent: apiControllerData['NominalCurrent'].split(' ')[0],
        SetCurrent: apiControllerData['SetCurrent'].split(' ')[0],
        ConductionAngle: apiControllerData['ConductionAngle'].split(' ')[0]

      }
  } else{
    const { Upslope,ErrorCodeDescription } = apiControllerData;
    let error;
    let ErrorCodeDescriptionFormatted = ErrorCodeDescription;
    try {
      if (
        ErrorCodeDescriptionFormatted &&
        ErrorCodeDescriptionFormatted.match(ErrorCodeDescriptionRegex) &&
        ErrorCodeDescriptionFormatted.match(ErrorCodeDescriptionRegex)[0]
      ) {
        error = ErrorCodeDescriptionFormatted.match(
          ErrorCodeDescriptionRegex
        )[0];
      }
    } catch (error) {
      console.log(error);
    }

    sendingObj = {
      id: "device-" + uuidv4(),
      DateTime: dayjs().format("DD-MM-YYYY HH:mm:ss"),
      ...apiControllerData,
      Upslope: Upslope,
      error_code: error,
      ActualCurrent: apiControllerData['ActualCurrent'].split(' ')[0],
      NominalCurrent: apiControllerData['NominalCurrent'].split(' ')[0],
      SetCurrent: apiControllerData['SetCurrent'].split(' ')[0],
      ConductionAngle: apiControllerData['ConductionAngle'].split(' ')[0]
    }
  }   
  try {    
    const response = await controllerdata.create(sendingObj);
    isAdditionSuccessull = true;
    return {isAdditionSuccessull, data:response, err:null};
  } catch (e) {
    return {isAdditionSuccessull, data:null, err:e};
  }
};
exports.convertControllerData = (data) => {
  let array = [];
    let object = { Novtech: [], GF_AC: [], GF_MF: [] }
    let type;
    data.forEach((ele) => {
      let obj = ele.dataValues;
      let nullCount = 0;
      delete obj['createdAt'];
      delete obj['updatedAt'];
      Object.entries(obj).forEach((entry) => {
        let [key, value] = entry;
        if (value === null) {
          nullCount++;
        }
      })
      if (nullCount === 10) {
        let novtech = {};
        type = 'Novtech';
        let { PowerFactor, SetCurrent, ActualCurrent, error_code, Upslope } = obj;
        novtech = {
          ...obj,
          PowerFactor: +PowerFactor * 100,
          ActualCurrent: +ActualCurrent * 1000,
          Error_code: +error_code / 50,
          PrimaryCurrent: SetCurrent,
          Line_Voltage: Upslope
        }
        delete novtech['SetCurrent'];
        delete novtech['Upslope'];
        delete novtech['error_code'];
        Object.entries(novtech).forEach((entry) => { //can be moved to upper loop
          let [key, value] = entry;
          if (value === null) {
            delete novtech[key];
          }
        })
        object['Novtech'].push(novtech);

      } else if (nullCount === 0) {

        if (/^\d+$/.test(obj['Upslope'])) {
          let GF_MF = {};
          type = 'GF_MF';
          let { Upslope,error_code } = obj;
          GF_MF = {
            ...obj,
            Error_code: error_code,
            U_P_Slope: `${Upslope} V`
          }
          delete GF_MF['Upslope'];
          delete GF_MF['error_code'];
          object['GF_MF'].push(GF_MF);

        } else if(obj['Upslope'].includes('!')){
          let GF_AC = {};
          type = 'GF_AC';
          let { Upslope,error_code } = obj;
          GF_AC = {
            ...obj,
            Error_code: error_code,
            U_P_Slope: Upslope
          }
          delete GF_AC['Upslope'];
          delete GF_AC['error_code'];
          object['GF_AC'].push(GF_AC);
        }
      }
    })
    array.push(object);
    return array;
}
// exports.pushControllerDataIntoDatabase = async (apiControllerData) => {
//   let isAdditionSuccessull = false;
//   const {
//     DeviceID,
//     HardwareID,
//     Program,
//     ProgramName,
//     ModeofOperation,
//     Stepper,
//     SpotCounter,
//     Incrementofcurrent,
//     WeldingPressure1,
//     WeldingPressure2,
//     PowerFactor,
//     ActualWeldTimeCycles,
//     SetCurrent,
//     NominalCurrent,
//     HeatPertCurrentIDgs,
//     HeatPertinCurrentIp,
//     ActualCurrent,
//     Upslope,
//     ConductionAngle,
//     ErrorCodeDescription,
//   } = apiControllerData;
//   let error_code;
//   let ErrorCodeDescriptionFormatted = ErrorCodeDescription.split("'")[1];

//   try {
//     if (
//       ErrorCodeDescriptionFormatted &&
//       ErrorCodeDescriptionFormatted.match(ErrorCodeDescriptionRegex) &&
//       ErrorCodeDescriptionFormatted.match(ErrorCodeDescriptionRegex)[0]
//     ) {
//       error_code = ErrorCodeDescriptionFormatted.match(
//         ErrorCodeDescriptionRegex
//       )[0];
//     }
//   } catch (error) {
//     console.log(error);
//   }

//   try {
//     console.log({
//       id: "device-" + uuidv4(),
//       DeviceID: inputFormatter(DeviceID).split("'")[1],
//       DateTime: dayjs().format("DD-MM-YYYY HH:mm:ss"),
//       HardwareID: HardwareID.split("'")[1],
//       Program: Program.split("'")[1],
//       ProgramName: ProgramName.split("'")[1],
//       ModeofOperation: ModeofOperation.split("'")[1],
//       Stepper: Stepper.split("'")[1],
//       SpotCounter: SpotCounter.split("'")[1],
//       Incrementofcurrent: Incrementofcurrent.split("'")[1],
//       WeldingPressure1: WeldingPressure1.split("'")[1],
//       WeldingPressure2: WeldingPressure2.split("'")[1],
//       PowerFactor: PowerFactor.split("'")[1],
//       ActualWeldTimeCycles: ActualWeldTimeCycles.split("'")[1],
//       SetCurrent: Number(SetCurrent.split("kA")[0].split("'")[1]),
//       NominalCurrent: NominalCurrent.split("kA")[0].split("'")[1],
//       HeatPertCurrentIDgs: HeatPertCurrentIDgs,
//       HeatPertinCurrentIp: HeatPertinCurrentIp,
//       ActualCurrent: Number(ActualCurrent.split("kA")[0].split("'")[1]),
//       Upslope: Upslope,
//       ConductionAngle: ConductionAngle.split("^")[0].split("'")[1],
//       error_code,
//     });
    
//             const deviceobj = await controllerdata.create({
//             id: "device-" + uuidv4(),
//             DeviceID: inputFormatter(DeviceID).split("'")[1],
//             DateTime: dayjs().format("DD-MM-YYYY HH:mm:ss"),
//             HardwareID: HardwareID.split("'")[1],
//             Program: Program.split("'")[1],
//             ProgramName: ProgramName.split("'")[1],
//             ModeofOperation: ModeofOperation.split("'")[1],
//             Stepper: Stepper.split("'")[1],
//             SpotCounter: SpotCounter.split("'")[1],
//             Incrementofcurrent: Incrementofcurrent.split("'")[1],
//             WeldingPressure1: WeldingPressure1.split("'")[1],
//             WeldingPressure2: WeldingPressure2.split("'")[1],
//             PowerFactor: PowerFactor.split("'")[1],
//             ActualWeldTimeCycles: ActualWeldTimeCycles.split("'")[1],
//             SetCurrent: Number(SetCurrent.split("kA")[0].split("'")[1]),
//             NominalCurrent: NominalCurrent.split("kA")[0].split("'")[1],
//             HeatPertCurrentIDgs: HeatPertCurrentIDgs,
//             HeatPertinCurrentIp: HeatPertinCurrentIp,
//             ActualCurrent: Number(ActualCurrent.split("kA")[0].split("'")[1]),
//             Upslope: Upslope,
//             ConductionAngle: ConductionAngle.split("^")[0].split("'")[1],
//             error_code: error_code || ErrorCodeDescriptionFormatted,
//         });

//     return (isAdditionSuccessull = true);
//   } catch (e) {
//     return (isAdditionSuccessull = false);
//   }
// };