# Based on:
# https://typeofnan.dev/how-to-serve-a-react-app-with-nginx-in-docker/
# https://developer.okta.com/blog/2020/06/24/heroku-docker-react
# https://devopsian.net/notes/docker-nginx-template-env-vars/
FROM node:20.10.0 as builder

# set working directory
WORKDIR /app

# Do the minimum to install dependencies for caching
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Config for API root for build
ARG VITE_API_ROOT_PATH="https://rhino-server.demo.rhino-project.org"
RUN npm run build

# nginx state for serving content
FROM nginx

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*

# Config port at runtime
ENV PORT=80
EXPOSE $PORT

# Setup nginx
RUN mkdir /etc/nginx/templates
COPY docker/default.conf.template /etc/nginx/templates

# Copy static assets from builder stage
COPY --from=builder /app/dist .

# Containers run nginx with global directives and daemon off
CMD ["nginx", "-g", "daemon off;"]
