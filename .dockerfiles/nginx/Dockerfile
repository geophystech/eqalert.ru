FROM nginx:latest AS core

RUN rm -rf /etc/nginx/conf.d/*

ADD vhost.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/www/service

CMD exec nginx -g 'daemon off;'

###################################
### STATIC

FROM core AS static

COPY dist/. /var/www/service/dist

COPY entrypoint.sh /opt/entrypoint
RUN chmod a+x /opt/entrypoint
ENTRYPOINT ["/opt/entrypoint"]

CMD exec nginx -g 'daemon off;'

###################################
### DEV

FROM core AS dev

ARG NODE_VERSION=v14.17.0

RUN apt-get update \
    && apt-get install -y xz-utils bzip2 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# nodejs
RUN mkdir -p /usr/local/lib/nodejs \
    && arch=$(arch | sed s/x86_64/x64/ | sed s/aarch64/arm64/) \
    && curl -o /usr/local/lib/nodejs/node.tar.xz https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-linux-$arch.tar.xz \
    && tar -xJf /usr/local/lib/nodejs/node.tar.xz -C /usr/local/lib/nodejs \
    && rm /usr/local/lib/nodejs/node.tar.xz \
    && mv '/usr/local/lib/nodejs/node-'$NODE_VERSION'-linux-'$arch'/' /usr/local/lib/nodejs/node-$NODE_VERSION/

ENV PATH="/usr/local/lib/nodejs/node-$NODE_VERSION/bin:$PATH"

# yarn
RUN npm install -g yarn
