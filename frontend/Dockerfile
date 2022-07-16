ARG NODE_IMAGE=lts-alpine
FROM node:$NODE_IMAGE as development
WORKDIR /app
EXPOSE 80
CMD npm install && \
	npm run serve -- --port 80

FROM node:$NODE_IMAGE as pre-production
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend/ ./
RUN rm -f ./dtos
COPY ./dtos/ ./src/dtos/
RUN npm run build

FROM nginx:stable-alpine as production
COPY --from=pre-production /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
