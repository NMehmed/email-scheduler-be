FROM node:latest

WORKDIR /usr/src/app

VOLUME [ "/usr/src/app" ]

RUN npm install
RUN npm run build

CMD [ "npm", "start" ]