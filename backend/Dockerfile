ARG NODE_IMAGE=lts-alpine
FROM node:$NODE_IMAGE
EXPOSE $BACKEND_PORT

RUN apk update
RUN apk upgrade
RUN apk add bash

COPY ./backend/docker-entrypoint.sh /tmp/

CMD ["bash", "/tmp/docker-entrypoint.sh"]
