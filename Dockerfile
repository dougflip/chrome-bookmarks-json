FROM node:16.15.0-buster

WORKDIR /app

COPY package-lock.json ./package-lock.json
COPY package.json ./package.json

RUN npm install

CMD tail -f /dev/null
