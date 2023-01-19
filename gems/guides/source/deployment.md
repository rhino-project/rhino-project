# Rhino Deployment

This guide is an introduction to deploying Rhino

## General considerations

Rhino uses server side cookies for auth, so you must have [domains that meet the auth rules](auth.md)

## Heroku

For both client and server the default Heroku stack `heroku-20` is sufficient.

### Server

The server needs the `heroku/ruby` buildpack. Along with the following add-ons:

    heroku-postgresql:mini
    heroku-redis:mini
    papertrail:choklad
    rollbar:free

Redis is required only for [rhino_jobs](jobs.md) support and rollbar is required for [error trapping](error_reporting.md).

The server requires the following environment variables to be set:

    FRONT_END_URL=https://<client-host-name>,
    LANG=en_US.UTF-8
    RACK_ENV=production
    RAILS_ENV=production
    RAILS_LOG_TO_STDOUT=enabled
    RAILS_SERVE_STATIC_FILES=enabled
    ROOT_URL=https://<server-host-name>
    SECRET_KEY_BASE=84de524c5cc836b5eaf8e2b5ee36e771f0bc5dfb0b63e76b58fe155d32cb3c71ca48f5a39f4992c5aaa3bb9d323d9ab1529b526bb2349bf2e09fd44385ab234c
    SENDGRID_API_KEY=<sendgrid-api-key>

### Client

The client needs the `mars/create-react-app` buildpack.

The client requires the following environment variables to be set:

    REACT_APP_API_ROOT_PATH=https://<server-host-name>
    NODE_ENV=production

Any additional environment variables that need to be passed into that app should be prefixed with REACT_APP

## Heroku Docker

Rhino comes with support for deploying to Heroku with docker for both the client and server. This is useful if you need to deploy custom tools to the image, for instance an SDK that needs to be built and called from ActiveJob.

Rhino uses the heroku.yml method of building and deploying docker images. https://devcenter.heroku.com/articles/build-docker-images-heroku-yml

The buildpack for docker should be set to the container type `heroku stack:set container -a <app-name>`

Heroku docker deploys still require

## Docker

### Server

```bash
$ docker build -t server .
$ docker run -it --rm -p 3002:3002 -e FRONT_END_URL="http://localhost:3003" -e PORT=3002 -e DISABLE_SSL=1 -e ROOT_URL=http://localhost:3002 server
```

FRONT_END_URL will default to `http://localhost:3001` if not specified.

PORT will default to `3000` if not specified

DISABLE_SSL=1 is necessary for SSL termination earlier in the process

ROOT_URL defaults to `http://localhost:3000` if not specified

DB_NAME, DB_HOST, DB_USERNAME, DB_PASSWORD are also required for a postgres db

### Client

```bash
$ docker build --build-arg REACT_APP_API_ROOT_PATH=http://localhost:3002 -t frontend .
$ docker run --rm -p 3003:3003 -e PORT=3003 frontend
```

REACT*APP_API_ROOT_PATH is \_required* at build time.

PORT will default to `3001` if not overridden.
