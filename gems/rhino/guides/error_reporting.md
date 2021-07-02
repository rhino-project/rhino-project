# Error Reporting

Error reporting is an essencial component of a healthy software. It is possible to be notified whenever an unexpected and unhandled error occurs. If configured properly, it is also possible to retrieve information about the UI, user's previous action, user's information, etc.

## Rollbar

There are many available services that provide error reporting. Rollbar is the chosen one by default. Rollbar integrates well with both Ruby on Rails and React applications.

## Hosting

Rollbar has a plugin for Heroku, so it's possible to set it up for free with just one click from the app's resources widget in Heroku's panel. It is also possible to set up an account directly in Rollbar and don't depend on Heroku at all.

## Configuration

There are specific steps, libraries and concepts for both client and server.

See [Client's configuration tutorial](./error_reporting_client.md).

See [Server's configuration tutorial](./error_reporting_server.md).
