#!/bin/bash

###
# Verifies the code via linting/tests and then builds the code.
# Useful for CI as a "check" on its own and also for preparing a deployment.
###

set -e

echo "Linting the code"
npm run lint

echo "Running tests"
npm run test:ci

echo "Building and packaging the code"
npm run build
