FROM node:18-alpine

# Set container working directory
WORKDIR /app

RUN apk update
RUN apk upgrade
RUN apk add bash

RUN npm install -g npm@8.8.0

EXPOSE 3000

COPY ./docker-entrypoint.sh /tmp/

CMD ["bash", "/tmp/docker-entrypoint.sh"]
