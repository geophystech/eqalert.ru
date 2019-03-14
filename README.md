<p align="center">
<a href="https://eqalert.ru">
    <img src="https://raw.githubusercontent.com/geophystech/eqalert.ru/master/src/assets/img/logos/eqalert.png">
</a>

<br>
The real-time information resource about earthquakes, seismic impacts, and hazards.
<br>
Built on <a href="https://vuejs.org">Vue.js 2.5</a>, <a href="https://webpack.js.org">Webpack 4</a>, and <a href="https://getbootstrap.com/docs/4.0">Twitter Bootstrap 4</a>
<br>
<br>

<a href="https://vuejs.org">
    <img alt="vue.js-2.5.x" src="https://img.shields.io/badge/vue.js-2.5-337ab7.svg?style=flat-square">
</a>

<a href="https://getbootstrap.com/docs/4.0">
    <img alt="webpack-4" src="https://img.shields.io/badge/webpack-4-337ab7.svg?style=flat-square">
</a>

<a href="https://getbootstrap.com/docs/4.0">
    <img alt="bootstrap-4.0.0" src="https://img.shields.io/badge/bootstrap-4-337ab7.svg?style=flat-square">
</a>

<br>

</p>


# eqalert.ru [![Build Status](https://travis-ci.org/geophystech/eqalert.ru.svg?branch=master)](https://travis-ci.org/geophystech/eqalert.ru) [![codecov](https://codecov.io/gh/geophystech/eqalert.ru/branch/master/graph/badge.svg)](https://codecov.io/gh/geophystech/eqalert.ru/)

Eqalert.ru – the real-time information resource about earthquakes, seismic impacts and hazards

## Used technologies

This is a Single Page Application built with [VueJS](https://vuejs.org/) and [webpack](https://webpack.js.org/).     
Data is received from an API host using [axios](https://github.com/axios/axios) library. 

More about used technologies you can get from the `packages.json` file.

## Preparing application

```bash
# Clone application from GitHub
git clone git@github.com:geophystech/eqalert.ru.git

cd eqalert.ru

# Install dependencies
yarn install 
```


## Development mode

To run application in development mode, just run:

``` bash
yarn dev
```

The application will be compiled and run. 
It will be available at http://localhost:8080 

By default the application uses hot-reload mode which means any changes will be picked up and all open pages will be reloaded automatically.
Exception is static markdown pages located in `static/markdown` directory. 

If you changem them, you should update your browser pages manually (`F5`).

## Run tests

The application has a few tests. Not very good coverage yet, but still. 

To run tests, just run:

```
# Unit tests
npm run unit

# E2E tests
npm run e2e

# Or run all tests
npm test
```

## Build application 

To run application in staging or production areas, it should be compiled first:

```
NODE_ENV=production yarn build
```

The compiled application will be stored in the `dist/` directory.     
You can deploy it to your target (staging, production, etc) using any tools you like. 

Example of deploying the application manually to a staging host:

```bash
rsync -avzr --delete -e ssh dist/ USERNAME@HOSTNAME:/opt/eqalert-frontend-test
```

## LICENSE

   Copyright 2017-2018 GEOPHYSTECH LLC

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
