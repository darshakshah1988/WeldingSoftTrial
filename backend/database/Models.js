
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./database-connection");

exports.__efmigrationshistory = sequelize.define('__efmigrationshistory', {
    MigrationId: {
        type: DataTypes.STRING(45),
        allowNUll: false,
        primaryKey: true
    },
    ProductVersion: {
        type: DataTypes.STRING(32),
        allowNUll: false

    }
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

exports.controllerdata = sequelize.define('controllerdata', {
    id: {
        type: DataTypes.STRING(255),
        primaryKey: true,
    },
    DeviceID: {
        type: DataTypes.STRING,
    },
    DateTime: {
        type: DataTypes.TEXT
    },
    HardwareID: {
        type: DataTypes.TEXT
    },
    Program: {
        type: DataTypes.TEXT
    },
    ProgramName: {
        type: DataTypes.TEXT
    },
    ModeofOperation: {
        type: DataTypes.TEXT
    },
    Stepper: {
        type: DataTypes.TEXT
    },
    SpotCounter: {
        type: DataTypes.TEXT
    },
    Incrementofcurrent: {
        type: DataTypes.TEXT
    },
    WeldingPressure1: {
        type: DataTypes.TEXT
    },
    WeldingPressure2: {
        type: DataTypes.TEXT
    },
    PowerFactor: {
        type: DataTypes.TEXT
    },
    ActualWeldTimeCycles: {
        type: DataTypes.TEXT
    },
    SetCurrent: {
        type: DataTypes.TEXT
    },
    NominalCurrent: {
        type: DataTypes.TEXT
    },
    HeatPertCurrentIDgs: {
        type: DataTypes.TEXT
    },
    HeatPertinCurrentIp: {
        type: DataTypes.TEXT
    },
    ActualCurrent: {
        type: DataTypes.TEXT
    },
    Upslope: {
        type: DataTypes.TEXT
    },
    ConductionAngle: {
        type: DataTypes.TEXT
    },
    error_code: {
        type: DataTypes.TEXT
    },
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: true
});


exports.dcandidates = sequelize.define('dcandidates', {
    id: {
        type: DataTypes.INTEGER,
        allowNUll: false,
        autoIncrement: true,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING(100),
    },
    mobile: {
        type: DataTypes.STRING(16),
    },
    email: {
        type: DataTypes.STRING(100),
    },
    age: {
        type: DataTypes.INTEGER,
    },
    bloodGroup: {
        type: DataTypes.STRING(3)
    },
    address: {
        type: DataTypes.STRING(100)
    }
}, {

    timestamps: false,
    createdAt: false,
    updatedAt: false,
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

exports.devicesetting = sequelize.define('devicesetting', {
    controllername: DataTypes.STRING(100),
    devicenumber: DataTypes.STRING(100),
    customername: DataTypes.STRING(100),
    lineNo: DataTypes.STRING(255),
    fixturenumber: DataTypes.STRING(45),
    gunservingmodel: DataTypes.STRING(45),
    partname: DataTypes.STRING(45),
    spotcounterperjob: DataTypes.INTEGER,
    tipdress: DataTypes.INTEGER,
    tipchange: DataTypes.INTEGER,
    isDeviceDeactivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    deactivatedReason: {
        type: DataTypes.TEXT,
        defaultValue: "NA"
    }
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

exports.errorcode = sequelize.define('errorcode', {
    code: DataTypes.STRING(10),
    description: DataTypes.STRING(1000),
    causeofalarm: DataTypes.STRING(2000),
    recomoperation: DataTypes.STRING(100),
}, {
    timestamps: false,
    createdAt: true,
    updatedAt: true
});

exports.maintains = sequelize.define('maintains', {
    controllerId: {
        type: DataTypes.STRING(45),
        allowNUll: false,
        primaryKey: true
    },
    controllerName: {
        type: DataTypes.STRING(100),
    },
    iotSerialNumber: {
        type: DataTypes.STRING(200),
    },
    equipmentName: {
        type: DataTypes.STRING(200),
    },
    equipNumber: {
        type: DataTypes.INTEGER,
        allowNUll: false
    },
    Description: {
        type: DataTypes.STRING(2000),
    },
    dateOfFunction: {
        type: DataTypes.DATE,
        allowNUll: false,
        defaultValue: DataTypes.NOW()

    },
    dateOfMaintain: {
        type: DataTypes.DATE,
        allowNUll: false,
        defaultValue: DataTypes.NOW()

    },
    maintainAction: {
        type: DataTypes.STRING(100),
    },
    Remark: {
        type: DataTypes.STRING(100),
    }
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

exports.users = sequelize.define('users', {
    id: {
        type: DataTypes.STRING(255),
        allowNUll: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(30),
        allowNUll: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(50),
        allowNUll: true

    },
    password: {
        type: DataTypes.STRING(138),
        defaultValue: "abc@12345",
        allowNUll: false

    },
    secret_question: {
        type: DataTypes.STRING(1000),
        allowNUll: false

    },
    answer: {
        type: DataTypes.STRING(200),
        allowNUll: false

    },
    role: {
        type: DataTypes.STRING(5),
        allowNUll: false
    },
    isPasswordReset: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

exports.line = sequelize.define('line', {
    lineNo: {
        type: DataTypes.STRING(255),
        allowNUll: false,
        primaryKey: true
    },
    lineName: {
        type: DataTypes.STRING(30),
        allowNUll: false,
    },
      
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: true
});
exports.shift = sequelize.define('shift', {
    shiftID:{
        type:DataTypes.STRING(255),
        allowNUll: false,
        primaryKey: true
    },
    shiftName: {
        type: DataTypes.STRING(15),
        allowNUll: false,
    },
    startTime: {
        type: DataTypes.STRING(30),
        allowNUll: false,
    },
    endTime: {
        type: DataTypes.STRING(30),
        allowNUll: false,
    },
      
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

