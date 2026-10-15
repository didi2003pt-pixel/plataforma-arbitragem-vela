#!/bin/sh
set -eu
test -n "${SOURCE_GATEWAY_URL:-}"
test -n "${SOURCE_GATEWAY_TOKEN:-}"
curl --fail --silent --show-error \
  -H "Authorization: Bearer ${SOURCE_GATEWAY_TOKEN}" \
  "${SOURCE_GATEWAY_URL}/artifact/backend.zip" \
  -o /tmp/backend.zip
unzip -q /tmp/backend.zip -d /app || [ "$?" -eq 1 ]
