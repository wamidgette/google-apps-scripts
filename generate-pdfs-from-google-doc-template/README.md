# Generate PDFs from Google Doc Template

In this project, I use NetSuite ERP custom database records to populate data on a Google Sheet. Each row on the Google Sheet represents a different PDF document, which is passed through a Google Doc template file using a Google Apps Script. The values in the Google Doc replace the template doc's template text, and the GAS script saves the file as a new PDF.

If the Google Doc row already had a PDF associated with it, that file is sent to an archive folder, and the value in the cell is replaced by the new PDF URL. However, since the URL also needs to be updated in the NetSuite ERP, a session is created with NetSuite REST services, and a patch request is sent to update the URL in the NetSuite record.

## Usage

To use these apps on your Google account, follow these steps:

1. Create a new Google Apps Script project.
2. Create the necessary files in the project and copy-paste their contents into each file.
3. Replace the account details in the `global.gs` file with your own details before running the scripts.