# Sync NetSuite Data with Google Sheets

In this project, I use the NetSuite ERP RESTlet script functionality to retrieve manufacturing production data every few minutes. Because this particular data is stored in "unscriptable" netsuite records, the data is not available through the
REST API. 3rd party tools such as GURUS are unable to retrieve the data as they use the NetSuite API.

By developing a NetSuite RESTlet script and calling it from a GAS script, I was able to call the get from my custom function on the NetSuite server, copy it to a new JSON object, and send it back to my GAS script, creating a good workaround. 

If the google doc row already had a pdf associated with it, that file is sent to an archive folder, and 
the value in the cell is replaced by the new PDF url. However, since the url also needs to be updated
in the NetSuite ERP, a session is created with NetSuite REST services, and a patch request is sent 
to update the URL in the NetSuite record. 

## Usage

To use these apps on your google account, create a new Google Apps Script project and create the files in the project,
copy and pasting their contents into each file. 

Replace the account details in the global.gs file with your details before running.