/* global self */
/* eslint-ignore */
/* eslint-disable */

/*eslint-disable-next-line */
/*eslint-disable no-undef*/
export default () => {
    self.addEventListener('message', e => {
        importScripts('https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.4/dayjs.min.js');
        importScripts("https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js");
        importScripts('https://unpkg.com/dayjs@1.8.21/dayjs.min.js')
        importScripts("https://unpkg.com/dayjs@1.8.21/plugin/advancedFormat.js");
        importScripts("https://unpkg.com/dayjs@1.8.21/plugin/customParseFormat.js");
        dayjs.extend(self.dayjs_plugin_customParseFormat)
        dayjs.extend(self.dayjs_plugin_advancedFormat)


        const cummilativeData = e.data
        const currentdata = actualCurrentSetCurrentVsTimeStamp(cummilativeData);
        const spotdata = spotCounter(cummilativeData);
        const errorPerHour = errorPerHourPerDayperTime(cummilativeData);
        const powerfactor = powerFactorLineGraph(cummilativeData);
        const actualWeldCycle = actualWeldCycleLineGraph(cummilativeData);
        const conductionAngle = conductionAngleLineGraph(cummilativeData);
        const errorcodegrp = errorCodeGroupingCountPieChart(cummilativeData)
        const errorcountgrp = errorCountGroupingBarGraph(cummilativeData);
        const weldingpressure = weldingPressureLineGraph(cummilativeData);
        const programchart = programDistributionPieChart(cummilativeData)

        const data = {
            currentdata,
            spotdata,
            errorPerHour,
            powerfactor,
            errorcodegrp,
            errorcountgrp,
            weldingpressure,
            programchart,
            actualWeldCycle,
            conductionAngle
        }
        postMessage(JSON.stringify(data))
    })



    const actualCurrentSetCurrentVsTimeStamp = (dataInOrder) => {
        const data = dataInOrder.reverse()
        const xAxis = data.map((item) => dayjs(item.DateTime, "DD-MM-YYYY HH:mm:ss").format("DD-MMM-YY HH:mm:ss"));
        const yAxisSetCurrent = data.map((item) => item.SetCurrent);
        const yAxisActualCurrent = data.map(item => item.ActualCurrent);
        const options = {
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
            colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
            chart: {
                id: "line"
            },
            xaxis: {
                categories: xAxis
            },
        }
        const series = [
            {
                name: "Set Current",
                data: yAxisSetCurrent
            },
            {
                name: "Actual Current",
                data: yAxisActualCurrent
            }
        ]
        //console.log(options, series)
        return { options, series }

    }

    const spotCounter = (data) => {
        const dataGrouping = _.groupBy(data, (item) => dayjs(item.DateTime, "DD-MM-YYYY HH:mm:ss").format("DD-MMM-YY HH") + ":00");
        const yAxis = Object.values(dataGrouping).map((item) => item.length);
        const xAxis = Object.keys(dataGrouping) || [];
        const options = {
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
            colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
            chart: {
                id: "bar"
            },
            xaxis: {
                categories: xAxis
            }
        }
        const series = [
            {
                name: "Spot currents",
                data: yAxis
            },

        ]
        return { options, series }

    }

    const errorPerHourPerDayperTime = (data) => {
        //console.log(data)
        const erroredData = data.filter(item => item.error_code !== 'E000')
        const dataGrouping = _.groupBy(erroredData, (item) => dayjs(item.DateTime, "DD-MM-YYYY HH:mm:ss").format("DD-MMM-YY HH") + ":00");

        const yAxis = Object.values(dataGrouping).map((item) => item.length) || [];
        const xAxis = Object.keys(dataGrouping) || [];
        //console.log(dataGrouping)
        const options = {
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
            colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
            chart: {
                id: "bar"
            },
            xaxis: {
                categories: xAxis
            }
        }
        const series = [
            {
                name: "Spot currents",
                data: yAxis
            },

        ]
        return { options, series }

    }

    const powerFactorLineGraph = (data) => {
        const yAxis = data.map((item) => item.PowerFactor);
        const xAxis = data.map((item) => dayjs(item.DateTime, "DD-MM-YYYY HH:mm:ss").format("DD-MMM-YY HH:mm:ss"));
        const options = {
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
            colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
            chart: {
                id: "line"
            },
            xaxis: {
                categories: xAxis
            }
        }
        const series = [
            {
                name: "Power Factor",
                data: yAxis
            },

        ]
        return { options, series }
    }

    const actualWeldCycleLineGraph = (data) => {
        const yAxis = data.map((item) => Number(item.ActualWeldTimeCycles) || 0);
        const xAxis = data.map((item) => dayjs(item.DateTime, "DD-MM-YYYY HH:mm:ss").format("DD-MMM-YY HH:mm:ss"));
        const options = {
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
            colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
            chart: {
                id: "line"
            },
            xaxis: {
                categories: xAxis
            }
        }
        const series = [
            {
                name: "Weld cycle",
                data: yAxis
            },

        ]
        return { options, series }
    }
    const conductionAngleLineGraph = (data) => {
        const yAxis = data.map((item) => Number(item.ConductionAngle) || 0);
        const xAxis = data.map((item) => dayjs(item.DateTime, "DD-MM-YYYY HH:mm:ss").format("DD-MMM-YY HH:mm:ss"));
        const options = {
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
            colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
            chart: {
                id: "line"
            },
            xaxis: {
                categories: xAxis
            }
        }
        const series = [
            {
                name: "Conduction angle",
                data: yAxis
            },

        ]
        return { options, series }
    }
    const errorCodeGroupingCountPieChart = (data) => {
        let errorGrouping = _.groupBy(data, item => item.error_code);
        //console.log(errorGrouping)
        const series = Object.values(errorGrouping).map((item) => item.length) || [];
        const labels = Object.keys(errorGrouping) || [];
        return {
            series, options: { chart: { type: "pie" }, labels }
        }
    }

    const errorCountGroupingBarGraph = (data) => {
        let errorGrouping = _.groupBy(data, item => item.error_code);
        const yAxis = Object.values(errorGrouping).map((item) => item.length) || [];
        const xAxis = Object.keys(errorGrouping);
        const options = {
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
            colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
            chart: {
                id: "bar"
            },
            xaxis: {
                categories: xAxis
            }
        }
        const series = [
            {
                name: "Error count",
                data: yAxis
            },

        ]
        //console.log("bar",series,options)
        return { series, options }
    }

    const weldingPressureLineGraph = (data) => {
        const yAxisWeldingPressure1 = data.map((item) => Number(item.WeldingPressure1) || 0);
        const yAxisWeldingPressure2 = data.map((item) => Number(item.WeldingPressure2) || 0);

        const xAxis = data.map((item) => dayjs(item.DateTime, "DD-MM-YYYY HH:mm:ss").format("DD-MMM-YY HH:mm:ss"));
        const options = {
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
            colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
            chart: {
                id: "line"
            },
            xaxis: {
                categories: xAxis
            }
        }
        const series = [
            {
                name: "Welding Pressure 1",
                data: yAxisWeldingPressure1
            },
            {
                name: "Welding Pressure 2",
                data: yAxisWeldingPressure2
            },

        ]
        return { options, series }

    }

    const programDistributionPieChart = (data) => {
        let programGrouping = _.groupBy(data, item => item.Program);
        const series = Object.values(programGrouping).map((item) => item.length) || [];
        const labels = Object.keys(programGrouping) || [];
        return { series, options: { chart: { type: "pie" }, labels } }
    }


}