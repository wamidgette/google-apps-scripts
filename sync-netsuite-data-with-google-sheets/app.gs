//Main Apps Script File - Uses NetSuite credentials to generate JWT session token
//with NetSuite and calls RESTlet webhook to retrieve data. Data is then added to 
//tabs in google sheet

//Define global vars
let accessToken = ""
let headers = "" 
function getEveryFiveMinutes(){
  // Get work order data every 5 minutes
  getToken()
  let dataToGet = [
    ["getProductionDashData","ProductionDashData"],
  ]
  dataToGet.forEach(arr => {
    getDataAndAddToSheet(arr[0], arr[1])
  })
  setLastUpdatedOnDashboards()
}
function getEveryFifteeenMinutes (){
  getToken()
  let dataToGet = [
    ["getGb150Demand", "GB150Data"],
    ["getTilePressDemand", "TilePressData"],
    ["getCylinders", "CylindersToProduceByType"],
    ["getFinishedGoods", "FinshedGoodsData"],
    ["getCylinderProduction", "CylindersPerMonth"],
    ["getCylindersToProduce", "CylindersToProduce"],
    ["getMiscData", "MiscellaneousData"],
    ["getAllWorkCenterDemand", "DemandForAllWorkCenters"],
    ["getTileProductionAndScrap", "TilePressWeeklyProductionAndScrap"],
  ]
  dataToGet.forEach(arr => {
    getDataAndAddToSheet(arr[0], arr[1])
  })
}
//Get NS Token for Subsequent Requests
function getToken(){
  accessToken = getAccessToken()
  headers = {
    "Authorization" : `Bearer ${accessToken}`
  }
  console.log("finished getting access token")
}
/**
 * @restLetFunction, sheetToUpdate
 * Generic function takes a function name defined in the Truckload-Demand NS Restlet and uses the returned
 * data to populate a sheet 
 */
function getDataAndAddToSheet(restLetFunction, sheetToUpdate){
  console.log(sheetToUpdate)
  // console.log("in " + restLetFunction)
  // console.log(accessToken)
  //Fetch Netsuite
  let data = UrlFetchApp.fetch(`https://3496142.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=1984&deploy=1&query=${restLetFunction}`, {method: "get", headers: headers}).getContentText()
  // console.log("data",data)
  //clear the current data in the sheet
  let spreadSheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadSheet.getSheetByName(sheetToUpdate)
  sheet.getDataRange().clear()
  data = JSON.parse(data) //{"GROUP(supplystartdate)":"24-Mar-2023","SUM(formulanumeric)":"7","SUM(formulanumeric)_1":"0","SUM(formulanumeric)_2":"0","SUM(formulanumeric)_3":"0","SUM(quantity)":"7"}
  // console.log('data', data)
  let datatoAppend = []
  data.forEach(object => {
    //convert each 
    // console.log("data object",object)
    let subArray = []
    //push the key then value for each object into the array
    Object.keys(object).forEach(key => {
      //if the value has text or value properties use those, else just use the string
      if(object[key] && object[key][0] && object[key][0].text){
        subArray.push(object[key][0].text)
      }
      else{
        subArray.push(object[key])
      }
    })
    // console.log("subarray", subArray)
    datatoAppend.push(subArray)
  })
  // console.log("alldata", datatoAppend )
  let lastRow = sheet.getLastRow() + 1;
  sheet.getRange(lastRow, 1, datatoAppend.length, datatoAppend[0].length).setValues(datatoAppend);
  // console.log("finished " + restLetFunction)
}
/**
 * Sets the Looker dashboard last updated to the current date/time
 */
function setLastUpdatedOnDashboards(){
  // Timezone EDT/EST
  const targetTimezone = 'America/New_York';
  // Create a new Date object
  const currentDate = new Date();
  // Create options for formatting the date and time
  const currentMonth = currentDate.toLocaleString('en-US', { timeZone: targetTimezone, month: 'long' });
  const currentDay = currentDate.toLocaleString('en-US', { timeZone: targetTimezone, day: 'numeric' });
  const currentWeekday = currentDate.toLocaleString('en-US', { timeZone: targetTimezone, weekday: 'long' });
  const currentTime = currentDate.toLocaleString('en-US', { timeZone: targetTimezone, hour12: true, hour: 'numeric', minute: 'numeric' });
  //getSheetbyId -> getTab -> set index of time, date, shift
  var spreadSheet = SpreadsheetApp.openById("<lookerDashboardDatasourceSheetId>");
  let sheet = spreadSheet.getSheetByName('Time')
  //getRange you need
  let rows = sheet.getDataRange().getValues()
  console.log("rows", rows)
  //get index of last updated column
  let lastUpdatedIndex = rows[0].indexOf("Data Last Updated")
  //set the below row's value to current time
  let lastUpdated = sheet.getRange( 2, lastUpdatedIndex + 1)
  console.log(currentTime)
  lastUpdated.setValue(currentTime)
}