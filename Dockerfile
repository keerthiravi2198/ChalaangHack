FROM node:lts as dependencies
WORKDIR /app
COPY package.json .
RUN npm i
COPY . . 
FROM dependencies as builder
RUN npm run build
EXPOSE 3000
CMD npm run start