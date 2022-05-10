# BASE STAGE
# Prepare node, copy package.json
FROM node:16-alpine AS base

ARG REACT_APP_ENDPOINT

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY create-env-file.sh ./create-env-file.sh

# DEPENDENCIES STAGE
# Install production and dev dependencies
FROM base AS dependencies
# install node packages
#RUN npm set progress=false && npm config set depth 0
RUN npm install

RUN sh create-env-file.sh REACT_APP_ENDPOINT=$REACT_APP_ENDPOINT

# BUILD STAGE
# run NPM build
FROM dependencies as build
# If an app is supposed to be deployed in a subdir, this is the place to specify that
# Make sure that React app is built using the right path context
COPY . .
RUN set -ex; \
  npm run build

# RELEASE STAGE
# Only include the static files in the final image
FROM nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html