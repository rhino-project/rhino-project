# Setup

## Prerequisites

### Versions

- Ruby version: 3.1.4
- Bundler 2.3.26
- Rails: 7.0.4
- PostgreSQL: 12 or newer

### OSX

This assumes you have Homebrew installed.

1. Install postgres `brew install postgresql`

2. Install redis `brew install redis-server`

### WSL2 on Windows

This assumes you are using Ubuntu 20

1. Install postgres `sudo apt install postgresql postgresql-contrib libpq-dev`

2. Start postgres `sudo service postgresql start`

3. Setup postgres user

`sudo -u postgres createuser -s -i -d -r -l -w <<username>>`
`sudo -u postgres psql -c "ALTER ROLE <<username>> WITH PASSWORD '<<password>>';"`

4. Install redis `sudo apt install redis-server`

5. Start redis `sudo service redis-server start`

### Ruby setup

1. Install rvm `\curl -sSL https://get.rvm.io | bash -s stable --ruby=3.1.4`

2. As per rvm instructions on completion to start using RVM you need to run `source $HOME/.rvm/scripts/rvm`

3. Run `gem install bundler:2.3.26`

## Launch the application

1. Clone the repo `git clone git@github.com:nubinary/boilerplate_mono.git`

2. `cd boilerplate_mono/server`

3. copy `env.sample` to `.env` and modify env vars. Pay attention to DB_NAME, DB_USERNAME, DB_PASSWORD. They should be good defaults for MacOS with postgres install on OSX with homebrew. On WSL insert the username and password created in the prequisites.

4. Install gem dependencies `bundle install`

5. Create and load the database `rails db:setup`

6. Run the server `rails s`

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

# More info

https://www.rhino-project.org/
