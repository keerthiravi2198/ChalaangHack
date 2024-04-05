FROM node:lts as dependencies
WORKDIR /app

COPY package.json .
RUN npm i

COPY . . 

RUN apt-get update && apt-get install -y \
  wget \
  gconf-service \
  libasound2 \
  libatk1.0-0 \
  libcairo2 \
  libcups2 \
  libfontconfig1 \
  libgdk-pixbuf2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libpango-1.0-0 \
  libxss1 \
  fonts-liberation \
  libappindicator1 \
  libnss3 \
  lsb-release \
  xdg-utils

ENV PUPPETEER_DOWNLOAD_PATH=/usr/local/chromium

RUN npm install puppeteer

FROM dependencies as builder
RUN npm run build

EXPOSE 3000
CMD npm run start