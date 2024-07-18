#!/bin/sh

set -e

echo "Environment: $NODE_ENV"

# install packages
npm i

# run passed commands
npm run ${@}
