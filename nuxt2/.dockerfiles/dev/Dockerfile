### STAGE 1: Build ###
FROM node:14.17-alpine AS build

WORKDIR /app

RUN apk add --no-cache make gcc g++ python3

ENV PATH=/app/node_modules/.bin:$PATH
ENV NODE_OPTIONS=--max-old-space-size=1024
ENV NODE_ENV=development

COPY package.json yarn.lock ./

RUN yarn install 

COPY . .

RUN yarn generate:development


### STAGE 2: Runtime ###
FROM node:14.17-alpine

WORKDIR /app

ENV NODE_ENV=development

#COPY --from=build /app /app
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/nuxt.config.js ./nuxt.config.js
COPY --from=build /app/environmentsettings.js ./environmentsettings.js
COPY --from=build /app/static ./static
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["yarn", "start:development"]
