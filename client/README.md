# Setup

## Prerequisites

This assumes you have Homebrew installed.

1. Install nvm: https://github.com/nvm-sh/nvm#installing-and-updating

- `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`

2. Install node 20.10.0, `nvm install v20.10.0`

## Launch the application

1. Clone the repo `git clone git@github.com:nubinary/boilerplate_mono.git`

2. `cd boilerplate_mono/client`

3. Install dependencies: `npm install`

4. Copy `env.sample` to `.env` and modify env vars

- PORT: Port to run the app. By default to not conflict with the boilerplate server this would be 3001.

- VITE_API_ROOT_PATH: url of the api to which this client will send requests. By default with the boilerplate_server this would be `VITE_API_ROOT_PATH=http://localhost:3000`

5. Run the application client: `npm start`

### Developing the front end against remote server

Because of CORS by default you will not be able to work against a deployed production server. However if you set `FRONT_END_LOCAL_URL=http://localhost:3001` you can.

## Testing

See https://www.rhino-project.org/docs/guides/testing#frontend

# Customization

The data model driving the UI is loaded from src/models/index.js in production or or dynamically from the server at /api/info/openapi in development (by default http://localhost:3000/api/info/openapi). See [Server README](../server/README.md) for
further instructions on export.

# More info

https://www.rhino-project.org/
