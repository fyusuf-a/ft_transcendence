FROM node:lts-alpine as development
WORKDIR /app
COPY package*.json ./
RUN npm install
EXPOSE 80
CMD npm run serve -- --port 80

FROM node:lts-alpine as pre-production
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production
COPY --from=pre-production /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
