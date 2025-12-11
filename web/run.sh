#!/bin/bash

set -eo pipefail

pnpm db:prod
node .next/standalone/server.js