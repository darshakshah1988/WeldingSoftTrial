// import temp from "./temp.json";

exports.downloadCSV = (data, csv_name, deviceSettingData) => {
    if (!data.length) {
      return true;
    }
    const link = document.createElement('a')
    let csv = convertArrayOfObjectsToCSV(data, deviceSettingData)
    if (csv === null) return
  
    const filename = `${csv_name}.csv`
  
    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }
  
    link.setAttribute('href', `${encodeURI(csv)}`)
    link.setAttribute('download', filename)
    link.click()
}
  
function convertArrayOfObjectsToCSV(array, deviceSettingData) {
    let result;
  
    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = Object.keys(array[0])
  
    result = ''
    result = appendPreloadData(deviceSettingData)
    result += lineDelimiter
    result += lineDelimiter
    result += keys.join(columnDelimiter)
    result += lineDelimiter
  
    array.forEach(item => {
      let ctr = 0
      keys.forEach(key => {
        if (ctr > 0) {
          result += columnDelimiter
        }
  
        const final_string = item[key].toString().replace(/,/g, ' ')
        result += final_string
  
        ctr++
      })
      result += lineDelimiter
    })
    return result;
}
  
exports.appendPreloadData = (object) => {
    let result;
  
    const lineDelimiter = '\n'
  
    result = ''
    Object.entries(object).forEach((entry)=>{
      let [key, value] = entry;
      result += `${key} = ${value}`;
      result += lineDelimiter
    })

    result += lineDelimiter
    result += lineDelimiter

    return result;
}