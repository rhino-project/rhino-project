# Setup

See https://www.rhino-project.org/docs/getting_started/

## Debug information

http://localhost:3000/api/info/openapi
http://localhost:3000/api/info/graph

## ERD

`rails diagram:all` and look at doc/\*.svg

## Testing

See https://www.rhino-project.org/docs/guides/testing#backend.

# Updating the production model data

Data model can be updated for production with:

```
rails rhino:open_api_export
```
