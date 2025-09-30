# Modeled from: https://vuejs.org/v2/cookbook/dockerize-vuejs-app.htm

# build stage
FROM node:lts-alpine AS build-stage
ARG PUBLIC_PATH=/
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV WGU_PUBLIC_PATH=${PUBLIC_PATH}
RUN npm run init:app && npm run build

# production stage
FROM nginx:stable-alpine AS production-stage
LABEL maintainer="Just van den Broecke <https://github.com/justb4>"
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# now run with e.g.
# docker run -it -p 8080:80 meggsimum/wegue:latest
#
# Or map your own application config file:
# docker run -it -p 8080:80 -v $(pwd)/app-conf-mine.json:/usr/share/nginx/html/static/app-conf.json meggsimum/wegue:latest
