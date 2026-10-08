#!/usr/bin/env bash
set -euo pipefail

: "${PGHOST:?PGHOST missing}"
: "${PGPORT:?PGPORT missing}"
: "${PGUSER:?PGUSER missing}"
: "${PGPASSWORD:?PGPASSWORD missing}"
: "${PGDATABASE:?PGDATABASE missing}"
: "${SOURCE_GATEWAY_URL:?SOURCE_GATEWAY_URL missing}"
: "${SOURCE_GATEWAY_TOKEN:?SOURCE_GATEWAY_TOKEN missing}"
: "${EXPECTED_SHA256:?EXPECTED_SHA256 missing}"

BASELINE_KEY="FPV-PILOTO-RC1-BASELINE-20261006-1031-db.dump"
DUMP="/tmp/fpv-pilot-baseline.dump"
TEST_DB="fpv_restore_check_railway"
MODE="${MODE:-validate}"

cleanup() {
  dropdb -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" --if-exists --force "$TEST_DB" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "Downloading validated pilot baseline..."
curl --fail --silent --show-error \
  -H "Authorization: Bearer $SOURCE_GATEWAY_TOKEN" \
  "$SOURCE_GATEWAY_URL/artifact/$BASELINE_KEY" \
  -o "$DUMP"

actual_sha="$(sha256sum "$DUMP" | awk '{print toupper($1)}')"
echo "SHA256=$actual_sha"
test "$actual_sha" = "$EXPECTED_SHA256"

pg_restore -l "$DUMP" >/dev/null
echo "ARCHIVE=OK"

echo "Validating restore in temporary database..."
cleanup
createdb -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" "$TEST_DB"
pg_restore \
  -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$TEST_DB" \
  --no-owner --no-privileges "$DUMP"

count() {
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$1" -Atc "$2"
}

validate_counts() {
  db="$1"
  users="$(count "$db" 'SELECT count(*) FROM "User";')"
  admin="$(count "$db" "SELECT count(*) FROM \"User\" WHERE role::text='FPV_ADMIN' AND status::text='ACTIVE';")"
  unlocked="$(count "$db" "SELECT count(*) FROM \"User\" WHERE role::text='FPV_ADMIN' AND status::text='ACTIVE' AND \"failedLoginCount\"=0 AND \"lockedUntil\" IS NULL;")"
  referees="$(count "$db" 'SELECT count(*) FROM "Referee";')"
  clubs="$(count "$db" 'SELECT count(*) FROM "Club";')"
  events="$(count "$db" 'SELECT count(*) FROM "Event";')"
  seasons="$(count "$db" 'SELECT count(*) FROM "Season";')"
  rates="$(count "$db" 'SELECT count(*) FROM "RateRule";')"
  taxes="$(count "$db" 'SELECT count(*) FROM "TaxRule";')"

  echo "Users=$users"
  echo "FPV_ADMIN_ACTIVE=$admin"
  echo "FPV_ADMIN_UNLOCKED=$unlocked"
  echo "Referees=$referees"
  echo "Clubs=$clubs"
  echo "Events=$events"
  echo "Seasons=$seasons"
  echo "RateRules=$rates"
  echo "TaxRules=$taxes"

  test "$users" = "1"
  test "$admin" = "1"
  test "$unlocked" = "1"
  test "$referees" = "0"
  test "$clubs" = "0"
  test "$events" = "0"
  test "$seasons" = "1"
  test "$rates" = "6"
  test "$taxes" = "1"
}

validate_counts "$TEST_DB"
echo "RAILWAY_BASELINE_RESTORE_VALIDATION_PASS"
cleanup
trap - EXIT

if [ "$MODE" = "apply" ]; then
  echo "Applying baseline to pilot database..."
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -v ON_ERROR_STOP=1 \
    -c 'DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;'
  pg_restore \
    -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
    --no-owner --no-privileges "$DUMP"
  validate_counts "$PGDATABASE"
  echo "RAILWAY_BASELINE_APPLY_PASS"
fi

sleep 3600
