ARG NODE_IMAGE_VERSION=lts-alpine
FROM node:$NODE_IMAGE_VERSION
WORKDIR /app
EXPOSE 80
CMD npm install && \
	npm run dev -- --host 0.0.0.0 --port 80
