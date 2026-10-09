#!/bin/sh
set -eu

test -n "${SOURCE_GATEWAY_URL:-}"
test -n "${SOURCE_GATEWAY_TOKEN:-}"

curl --fail --silent --show-error \
  -H "Authorization: Bearer ${SOURCE_GATEWAY_TOKEN}" \
  "${SOURCE_GATEWAY_URL}/artifact/frontend.zip" \
  -o /tmp/frontend.zip

mkdir -p /src/frontend
unzip -q /tmp/frontend.zip -d /src/frontend || [ "$?" -eq 1 ]
