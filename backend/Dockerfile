ARG NODE_IMAGE=lts-alpine
FROM node:$NODE_IMAGE
WORKDIR /app
EXPOSE $BACKEND_PORT

RUN apk update
RUN apk upgrade
RUN apk add bash

COPY ./docker-entrypoint.sh /tmp/

CMD ["bash", "/tmp/docker-entrypoint.sh"]
