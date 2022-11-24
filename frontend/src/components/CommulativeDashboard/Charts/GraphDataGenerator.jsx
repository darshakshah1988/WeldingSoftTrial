import dayjs from "dayjs";
import _ from "lodash";
import { OK_STATUS_FOR_CUMMILATIVE_DATA } from "../constants";
const additionalOptions =
{
    animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
            enabled: true,
            delay: 150
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350
        },
    },
    colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800']
}

export const errorDashboardDataGenerator = (selectedErrorCode, groupedErrorData) => {
    const errorHourlyGrouping = {}
    selectedErrorCode.map((item) => {
        //console.log(item);
        let indivisualErrorData = groupedErrorData[item];
        //console.log(indivisualErrorData)
        let hourlyGrouping = _.groupBy(indivisualErrorData, (item) => dayjs(item.DateTime, "DD-MM-YYYY HH:mm:ss").format("DD-MMM-YY HH") + ":00")
        // //console.log(indivisualErrorData, item, hourlyGrouping, selectedErrorCode)
        errorHourlyGrouping[`${item}`] = hourlyGrouping
    })

    let hourInfo = Object.entries(errorHourlyGrouping).map((([key, value], _) =>
        Object.keys(value)))

    let collectionHour = [];
    hourInfo.map((item) => { collectionHour = [...collectionHour, ...item] })
    const uniqueHours = [...new Set([...collectionHour])];

    let seriesDataPreformatted = {}
    //console.log(errorHourlyGrouping, hourInfo, collectionHour)
    uniqueHours.map((hour) => {
        selectedErrorCode.map((errorCode, index) => {

            !seriesDataPreformatted[errorCode] && (seriesDataPreformatted[errorCode] = [])

            //console.log(seriesDataPreformatted)
            seriesDataPreformatted[errorCode].push((errorHourlyGrouping[errorCode][hour] || []).length)
        })
    })

    const seriesDataFormatted = []
    Object.entries(seriesDataPreformatted).map(([key, value], _) => {
        seriesDataFormatted.push({ name: key, data: value })
    })


    const options = {
        ...additionalOptions,
        chart: {
            id: "bar"
        },
        xaxis: {
            categories: uniqueHours
        }
    }
    const series = seriesDataFormatted
    //console.log({ series, options })

    return { series, options }
}