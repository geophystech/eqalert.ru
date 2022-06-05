#!/bin/bash

APP_PATH=`grep -rl 'oauthBaseURL=' /var/www/service/dist/static/js/`

AUTH_URI_PATTERN='https://oauth-web.eqalert.ru'
API_URI_PATTERN='https://rest-api.eqalert.ru/api'

# Replace host names
if [[ -n "${AUTH_URI}" ]]; then
	sed -i "s/${AUTH_URI_PATTERN//\//\\/}/${AUTH_URI//\//\\/}/" $APP_PATH
fi
if [[ -n "${API_URI}" ]]; then
	sed -i "s/${API_URI_PATTERN//\//\\/}/${API_URI//\//\\/}/" $APP_PATH
fi

exec "$@"
