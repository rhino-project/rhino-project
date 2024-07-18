# Setup

See https://www.rhino-project.org/docs/getting_started/

## Developing the front end against remote server

Because of CORS by default you will not be able to work against a deployed production server. However if you set `FRONT_END_LOCAL_URL=http://localhost:3001` you can.

## Testing

See https://www.rhino-project.org/docs/guides/testing#frontend

# Customization

The data model driving the UI is loaded from src/models/index.js in production or or dynamically from the server at /api/info/openapi in development (by default http://localhost:3000/api/info/openapi). See [Server README](../server/README.md) for
further instructions on export.

# More info

https://www.rhino-project.org/
