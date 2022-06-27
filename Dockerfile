FROM node:16.15.0-buster

# https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN chown -R node:node ./package*.json

USER node

RUN npm install

CMD tail -f /dev/null
