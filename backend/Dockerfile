ARG NODE_IMAGE=lts-alpine
FROM node:$NODE_IMAGE
EXPOSE 8080

RUN apk update
RUN apk upgrade
RUN apk add bash

COPY ./backend/docker-entrypoint.sh /tmp/

HEALTHCHECK --interval=5s --retries=20 CMD wget --spider http://localhost:8080/docs || exit 1

CMD ["bash", "/tmp/docker-entrypoint.sh"]
