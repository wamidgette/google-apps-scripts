# Sync NetSuite Data with Google Sheets

In this project, I use the NetSuite ERP RESTlet script functionality to retrieve manufacturing production data every few minutes. Since this particular data is stored in "unscriptable" NetSuite records, it is not available through the REST API. Third-party tools like GURUS are unable to retrieve the data as they rely on the NetSuite API.

By developing a NetSuite RESTlet script and calling it from a GAS script, I was able to retrieve the data from my custom function on the NetSuite server, copy it to a new JSON object, and send it back to my GAS script, creating a viable workaround.

If the Google Doc row already had a PDF associated with it, that file is sent to an archive folder, and the value in the cell is replaced by the new PDF URL. However, since the URL also needs to be updated in the NetSuite ERP, a session is created with NetSuite REST services, and a patch request is sent to update the URL in the NetSuite record.

## Usage

To use these apps on your google account, create a new Google Apps Script project and create the files in the project,
copy and pasting their contents into each file.

Replace the account details in the global.gs file with your details before running.
