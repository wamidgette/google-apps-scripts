# Generate PDFs from Google Doc Template

In this project, I use NetSuite ERP custom database records to populate data on a google sheet.
Each row on the google sheet represents a different pdf document, which is passed through a google
doc template file using a Google Apps Script. The values in the google doc replace the template doc's
template text, and the GAS script saves the file as a new PDF

If the google doc row already had a pdf associated with it, that file is sent to an archive folder, and
the value in the cell is replaced by the new PDF url. However, since the url also needs to be updated
in the NetSuite ERP, a session is created with NetSuite REST services, and a patch request is sent
to update the URL in the NetSuite record.

## Usage

To use these apps on your google account, create a new Google Apps Script project and create the files in the project,
copy and pasting their contents into each file.

Replace the account details in the global.gs file with your details before running.
