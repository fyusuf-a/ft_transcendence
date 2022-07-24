ARG NODE_IMAGE=lts-alpine
FROM node:$NODE_IMAGE
WORKDIR /app
EXPOSE 80
CMD npm install && \
	npm run serve -- --port 80
