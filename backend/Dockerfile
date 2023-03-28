ARG NODE_IMAGE_VERSION=lts-alpine
FROM node:$NODE_IMAGE_VERSION
EXPOSE 80

RUN apk update
RUN apk upgrade
RUN apk add bash

COPY ./backend/docker-entrypoint.sh /tmp/

HEALTHCHECK --interval=5s --retries=20 CMD wget --spider http://localhost/docs || exit 1

CMD ["bash", "/tmp/docker-entrypoint.sh"]
