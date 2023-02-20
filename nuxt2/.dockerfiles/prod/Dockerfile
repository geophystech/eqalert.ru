FROM node:14.17-alpine

WORKDIR /srv/ssr

COPY ./package.json ./

COPY ./yarn.lock ./

COPY ./ ./

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

RUN yarn install

RUN yarn generate:production

EXPOSE 3000

CMD [ "start:production" ]
