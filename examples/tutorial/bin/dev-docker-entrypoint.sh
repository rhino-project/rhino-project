#!/bin/sh

set -e

echo "Environment: $RAILS_ENV"

# install missing gems
bundle check || bundle install --jobs 20 --retry 5

# Set up the dev environment if it does not exist
bundle exec bin/rails rhino:dev:setup -- --no-prompt --skip-existing --defaults=docker

# Set up db if it does not exist or run migrations
bundle exec bin/rails db:prepare

# Install modules
npm install

# # Remove pre-existing puma/passenger server.pid
rm -f $APP_PATH/tmp/pids/server.pid

# run passed commands
bundle exec ${@}
