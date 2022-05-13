# BASE STAGE
# Prepare node, copy package.json
FROM node:16-alpine AS base
WORKDIR /usr/src/app
COPY package.json package-lock.json ./

# DEPENDENCIES STAGE
# Install production and dev dependencies
FROM base AS dependencies
# install node packages
#RUN npm set progress=false && npm config set depth 0
RUN npm install

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
FROM nginx:1.17.0-alpine

# Copy the react build from Build Stage
COPY --from=build /usr/src/app/build /var/www

# Copy error page
COPY .docker/error.html /usr/share/nginx/html

# Copy our custom nginx config
COPY .docker/nginx.conf /etc/nginx/nginx.conf

# Copy our custom nginx config
COPY .docker/config.js.template /etc/nginx/config.js.template

# from the outside.
EXPOSE 80

COPY .docker/docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

