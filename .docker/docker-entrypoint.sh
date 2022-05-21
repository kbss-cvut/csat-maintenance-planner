#!/usr/bin/env sh
set -eu

envsubst '${SERVER_URL_REVISION_LIST} ${SERVER_URL_REVISION_ID} ${SERVER_URL_WORKPACKAGE_LIST} ${SERVER_URL_WORKPACKAGE_DASHBOARD} ${BASENAME}' < /etc/nginx/config.js.template > /var/www/config.js

exec "$@"
