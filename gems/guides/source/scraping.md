# Scraping with Rhino

This guide describes how to scrape data to bootstrap an app.

## Excel and CSV

Use the `roo` gem https://github.com/roo-rb/roo. If you need to use older Excel spreadsheets, add the `roo-xls` gem https://github.com/roo-rb/roo-xls.

## Google Sheets

Google sheets can be access via APIs

### Authentication

Set up a service account:
https://console.cloud.google.com/iam-admin/serviceaccounts

Use the google-drive-ruby library as it has some useful higher level abstractions and rows can be easily iterated on:
https://github.com/gimite/google-drive-ruby

Use the environment variable set up described at https://github.com/googleapis/google-auth-library-ruby#example-environment-variables. Place the environment variables in your .env file.

```
GOOGLE_ACCOUNT_TYPE=service_account
GOOGLE_CLIENT_ID=000000000000000000000
GOOGLE_CLIENT_EMAIL=xxxx@xxxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Enable APIs:

- Drive: https://console.cloud.google.com/apis/library/drive.googleapis.com
- Spreadsheet: https://console.cloud.google.com/apis/library/sheets.googleapis.com

### Grant access to sheet:

You will have to share the sheet with the GOOGLE_CLIENT_EMAIL.

### Sample code

```ruby
# Use nil so it will default to the environment variables
session = GoogleDrive::Session.from_service_account_key(nil)

# Pass the sheet id
ws = session.spreadsheet_by_key("1gZNS_SxDXXQ3R8FOalQZUoEmNhVbfvRWrgiOMbjXmcw").worksheets[0]
```
