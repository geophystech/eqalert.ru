### STAGE 1: Build ###
FROM node:14.17-alpine as build

WORKDIR /app

### Install Python 3.6 and pip ###
RUN apk add --no-cache make gcc g++ python3 && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --no-cache --upgrade pip setuptools wheel && \
    if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi && \
    if [[ ! -e /usr/bin/python ]]; then ln -sf /usr/bin/python3 /usr/bin/python; fi

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

COPY yarn.lock /app/yarn.lock

RUN yarn install --silent

COPY . /app

RUN yarn run generate:development

### STAGE 2: NGINX ###
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
