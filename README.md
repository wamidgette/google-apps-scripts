# Google Apps Scripts

This repository contains multiple Google Apps Script (GAS) projects that I have worked on. Google Apps Scripts allow scripting within the Google Cloud and can be used to automate processes in Google Drive and more.

My projects have focused on integrating ERP data with Google Drive, automating tasks such as ERP data synchronization with Google Sheets, Google Looker Studio dashboard updates, and generating documents.

These scripts utilize the OAuth2.0 authentication method documented in NetSuite. The Crypto.js library is used for encryption, and the CryptoJS and JWT generation code is provided by NetSuite.

## Projects

### Sync NetSuite Data with Google Sheets

In this project, I use the NetSuite ERP RESTlet script functionality to retrieve manufacturing production data every few minutes. Since this particular data is stored in "unscriptable" NetSuite records, it is not available through the REST API. Third-party tools like GURUS are unable to retrieve the data as they rely on the NetSuite API.

By developing a NetSuite RESTlet script and calling it from a GAS script, I was able to retrieve the data from my custom function on the NetSuite server, copy it to a new JSON object, and send it back to my GAS script, creating a viable workaround.

If the Google Doc row already had a PDF associated with it, that file is sent to an archive folder, and the value in the cell is replaced by the new PDF URL. However, since the URL also needs to be updated in the NetSuite ERP, a session is created with NetSuite REST services, and a patch request is sent to update the URL in the NetSuite record.

### Generate PDFs from Google Doc Template

In this project, I use NetSuite ERP custom database records to populate data on a Google Sheet. Each row on the Google Sheet represents a different PDF document, which is passed through a Google Doc template file using a Google Apps Script. The values in the Google Doc replace the template doc's template text, and the GAS script saves the file as a new PDF.

If the Google Doc row already had a PDF associated with it, that file is sent to an archive folder, and the value in the cell is replaced by the new PDF URL. However, since the URL also needs to be updated in the NetSuite ERP, a session is created with NetSuite REST services, and a patch request is sent to update the URL in the NetSuite record.

## Usage

To use these apps on your Google account, follow these steps:

1. Create a new Google Apps Script project.
2. Create the necessary files in the project and copy-paste their contents into each file.
3. Replace the account details in the `global.gs` file with your own details before running the scripts.
