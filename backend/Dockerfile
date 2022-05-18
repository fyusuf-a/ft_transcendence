ARG NODE_IMAGE=lts-alpine
FROM node:$NODE_IMAGE
WORKDIR /app
EXPOSE 3000

RUN apk update
RUN apk upgrade
RUN apk add bash

COPY ./docker-entrypoint.sh /tmp/

CMD ["bash", "/tmp/docker-entrypoint.sh"]
