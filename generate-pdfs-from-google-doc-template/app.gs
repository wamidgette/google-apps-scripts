//This project imports NetSuite product specification guide data, and allows user to click button
//to update all product spec guide pdfs with newest data. Each google sheet row is run through a 
//google doc template, generating a new pdf, and archiving the old one. The new pdf url is 
//updated in the NetSuite ERP via patch request

//Add Button in google sheet UI user can click to trigger pdf generation process
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('Generate PSG PDFs');
  menu.addItem('Create New Docs', 'createNewGoogleDocs')
  menu.addToUi();
}
//TODO create refreshPDFData() function to run before createNewGoogleDocs
//TODO diable 'Create New Docs' button while createNewGoogleDocs is running

let accessToken = ""
function createNewGoogleDocs(){
  getToken()//get netsuite token
  let date = new Date()
  //let dateString = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` //may be useful in future for naming docs
  const googleDocTemplate = DriveApp.getFileById('<googleDocTemplateFileId>')
  const parentFolder = DriveApp.getFolderById('<parentFolderIdOfTemplateFile>')
  const archiveFolder = DriveApp.getFolderById('<archiveFolderId>')
  const destinationFolder = DriveApp.getFolderById("<destinationFolderId>")
  let spreadSheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadSheet.getSheetByName('CurrentData')
  let rows = sheet.getDataRange().getValues()
  let headers = []
  rows.forEach((row, index) => {
    //Assign the first row of google sheet to the headers array
    if(index === 0) {
      headers = row; 
      return
    };

    //** Create a new copy of the template document in the destination folder**//

    const copy = googleDocTemplate.makeCopy(`${row[1]} - Product Spec Guide`, destinationFolder)
    newDoc = DocumentApp.openById(copy.getId())
    const numSections = newDoc.getNumChildren();
    const body = newDoc.getBody();
    const docHeader = newDoc.getHeader()
    const docHeaderParent = docHeader.getParent()  
    row.forEach((value, i) => {
      //does the value contain an html entity? If so, decode it
      //TODO: make more robust to handle other all html entity code
      if(value.toString().includes('&gt') || value.toString().includes('&lt')){
        value = decodeHtml(value)
      }
      if(headers[i] == "Heading" || headers[i] == "Sub-Heading"){
        for (var j = 0; j < numSections; j++) {
          var section = docHeaderParent.getChild(j);
          if(section.getType().name() === "HEADER_SECTION"){
            console.log(`replacing {{${headers[i]}}} with ${value}`)
            section.replaceText(`{{${headers[i]}}}`, value)
            body.replaceText(`{{${headers[i]}}}`, value)
          }
        }
      }
      else{
        body.replaceText(`{{${headers[i]}}}`, value)
      }
    })

    //** Save the new google doc **//

    newDoc.saveAndClose()    
    newDocBlob = newDoc.getAs('application/pdf')
    newDocId = newDoc.getId()
    newDocBlob.setName(`${row[1]} - Product Spec Guide.pdf`)

    //Create the new PDF
    const newPdf = destinationFolder.createFile(newDocBlob);
    const newPdfUrl = newPdf.getUrl()
    const newPdfId = newPdf.getId()

    //** Archive the old PDF and update the new url to new PDF **//
    const pdfUrlCell = sheet.getRange(index + 1, headers.indexOf("Product Spec. PDF") + 1);
    const internalIdCell = sheet.getRange(index + 1, headers.indexOf("Internal ID") + 1);
    const internalId = internalIdCell.getValue()
    const oldPdfUrl = pdfUrlCell.getValue()
    //if there is an old pdf, archive it
    if(oldPdfUrl){
      //get the old pdf url id from the url. It is always after the "/d" part of the url and before the "/view" part
      const oldPdfId = oldPdfUrl.substring(oldPdfUrl.indexOf("d/") + 2, oldPdfUrl.indexOf("/view")) //extract id from old url
      DriveApp.getFileById(oldPdfId).moveTo(archiveFolder)
    }
    pdfUrlCell.setValue(newPdfUrl)
    //trash the doc file - we don't need it anymore
    DriveApp.getFileById(newDocId).setTrashed(true)
    //Update NetSuite Record with the New PDF Url
    syncWithNetSuite(internalId, newPdfUrl)
  })
}
function decodeHtml(str) {
  var decode = XmlService.parse('<d>' + str + '</d>');
  var strDecoded = decode.getRootElement().getText();
  return strDecoded;
}

//Update the NetSuite record with the new pdf url so users have the latest file
function syncWithNetSuite(internalId, newPdfUrl){
  console.log(`updating ${internalId} with new url ${newPdfUrl}`)
  let params = {
    method: "PATCH",
    headers: {
      'Authorization' : `Bearer ${accessToken}`,
      'Content-type': 'application/json',
    },
    payload : JSON.stringify({"custrecord_product_spec_pdf" : newPdfUrl})
  }
  let data = UrlFetchApp.fetch(`https://${global.netsuiteAccountId}.suitetalk.api.netsuite.com/services/rest/record/v1/customrecord863/${internalId}`, params)
}
function getToken(){
  accessToken = getAccessToken()
  headers = {
    "Authorization" : `Bearer ${accessToken}`
  }
}