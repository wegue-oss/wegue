# Wegue (WebGIS with OpenLayers and Vue.js)
Template and re-usable components for webmapping applications with OpenLayers and Vue.js

[![Build Status](https://travis-ci.org/meggsimum/wegue.svg?branch=master)](https://travis-ci.org/meggsimum/wegue)
[![Known Vulnerabilities](https://snyk.io/test/github/meggsimum/wegue/badge.svg)](https://snyk.io/test/github/meggsimum/wegue)
[![dependencies Status](https://david-dm.org/meggsimum/wegue/status.svg)](https://david-dm.org/meggsimum/wegue)
[![license: 2-Clause BSD](https://img.shields.io/badge/license-2--Clause%20BSD-brightgreen.svg)](https://opensource.org/licenses/BSD-2-Clause)
[![Join the chat at https://gitter.im/wegue/community](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/wegue/community)

<img align="left" style="padding-bottom: 20px;" src="screenshots/wegue-app-1.png" />

Go to the online demo at https://meggsimum.github.io/wegue/

## About
Wegue (**We**b**G**IS with OpenLayers and V**ue**) combines the power of [Vue.js](https://vuejs.org/) and the geospatial savvy of [OpenLayers](https://openlayers.org) to make lightweight webmapping applications. For styling and pre-defined UI-components the Material Design
Component Framework [Vuetify](https://vuetifyjs.com/) is used.

It acts as a template to reduce boilerplate work for browser-based mapping applications.

### Want to contribute? Yes, please :grinning:
If you want to contribute, please open a Pull Request in the repository.

Ensure that you have clean commits (and messages) and a meaningful description in your PR. Maybe opening an issue first is a good idea.

We look forward to your contributions!

## Development

Prerequisites: Node.js and npm need to be available on your system.

### Dev Setup

  - Checkout / download this repository and navigate to the   checkout / download in a terminal (e.g. by `cd /path/to/checkout`).

  - Install the JS dependencies:

``` bash
# install dependencies
npm install
```

  - Run the init-app script, which creates a base application (a copy of the `app-starter` dir) under `app/` to extend with custom components and resources (e.g. CSS styling) for your project.

``` bash
# initializes the Wegue app
npm run init:app
```

  - Start the dev server with auto reload at http://localhost:8081 (will be opened automatically):

``` bash
# serve with hot reload at localhost:8081
npm run dev
```

### Unit tests

To run all unit tests execute the following:

``` bash
# run all tests
npm test
```

NB the unit tests require Chrome or Chromium browser executable to be found.

On Mac OSX with `Homebrew` package manager this should work:
```
brew cask install chromium;
export CHROME_BIN=/Applications/Chromium.app/Contents/MacOS/Chromium;
npm run test
```

More testing tips and tricks can be found in the [Unit Test README](test/README.md).

### Production build

Run the build script in order to create a production build, which can be copied / deployed to a web server. The output will be placed in the `dist/` folder

``` bash
# build for production with minification
npm run build
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Run with Docker

Versioned Docker images are available on [DockerHub](https://hub.docker.com/r/meggsimum/wegue/tags).
Run the `latest` (`master`) version of the Wegue Docker Image as follows:

``` bash
docker run -it -p 8080:80 meggsimum/wegue:latest
```

Open
  - http://127.0.0.1:8080/ or
  - http://localhost:8080/?appCtx=minimal or
  - http://localhost:8080/?appCtx=projected

in a browser.

Use Docker Volume Mapping to run with your custom Wegue JSON config:

``` bash
docker run -it -p 8080:80 -v $(pwd)/app-conf-mine.json:/usr/share/nginx/html/static/app-conf-mine.json meggsimum/wegue:latest
```

and open http://localhost:8080/?appCtx=mine.

You can even overwrite the default config `app-conf.json`:

``` bash
docker run -it -p 8080:80 -v $(pwd)/app-conf-mine.json:/usr/share/nginx/html/static/app-conf.json meggsimum/wegue:latest
```

and then open http://localhost:8080/.

Build a Wegue Docker Image as follows:

``` bash
docker build -t meggsimum/wegue:latest .
```

## Developing online using Gitpod.io

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/meggsimum/wegue/)

Gitpod.io is an online IDE using VS Code that also provides a terminal and enables live preview. A registration is required but can be done with a GitHub account.

Open [gitpod.io/#https://github.com/meggsimum/wegue/](https://gitpod.io/#https://github.com/meggsimum/wegue/) to get started.

Wegue will automatically be initiated and your Wegue application can be previewed in a pane of the online IDE. The live preview of Wegue can also be seen in another browser tab by prefixing your workspace sub-URL with `8081-`. For example  `https://8081-YOUR-WORKSPACE-NAME.ws-eu25.gitpod.io`.

## Who do I talk to?
You need more information or support? Please contact us at:

`info__(at)__meggsimum__(dot)__de`

## Credits

The basic project setup was created by https://github.com/vuejs-templates/webpack.

Thanks for this great template! :+1:
