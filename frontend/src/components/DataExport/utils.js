import temp from "./temp.json";

export function downloadCSV(data, csv_name) {
    if (!data.length) {
      return true;
    }
    const link = document.createElement('a')
    let csv = convertArrayOfObjectsToCSV(data)
    if (csv === null) return
  
    const filename = `${csv_name}.csv`
  
    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }
  
    link.setAttribute('href', `${encodeURI(csv)}`)
    link.setAttribute('download', filename)
    link.click()
  }
  
  export function convertArrayOfObjectsToCSV(array) {
    let result;
  
    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = Object.keys(array[0])
  
    result = ''
    result = appendPreloadData(temp)
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
  
  export function appendPreloadData(array) {
    let result;
  
    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = Object.keys(array[0])
  
    result = ''
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