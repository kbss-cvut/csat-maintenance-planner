#!/usr/bin/env sh
set -eu

envsubst '${API_URL} ${APP_DOMAIN} ${APP_TITLE} ${LANGUAGE} ${NAVIGATOR_LANGUAGE} ${BASENAME}' < /etc/nginx/config.js.template > /var/www/config.js

exec "$@"
