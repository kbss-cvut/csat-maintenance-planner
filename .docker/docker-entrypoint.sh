#!/usr/bin/env sh
set -eu

envsubst '${REACT_APP_DOMAIN}' < /etc/nginx/config.js.template > /var/www/config.js

exec "$@"
