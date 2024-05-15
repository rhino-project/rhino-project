#!/bin/bash
# After 5 seconds, turn Vite port to public and show no command output on CLI
sleep 5
if [ -n "$CODESPACES" ]; then
    gh codespace ports visibility 3000:public -c $CODESPACE_NAME > /dev/null 2>&1
elif [ -n "$GITPOD_WORKSPACE_URL" ]; then
    gp ports visibility 3000:public > /dev/null 2>&1
else
    echo "Neither CODESPACES or GITPOD_WORKSPACE_URL environment variable is set"
fi
#
# This script is intended to be used only in Browser cloud environment,
# because of a issue involving bad handled preflight requests when
# the port is private from Github and Gitpod parts.
# @see https://github.com/community/community/discussions/15351