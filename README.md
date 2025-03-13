# Wegue (WebGIS with OpenLayers and Vue.js)
Template and re-usable components for webmapping applications with OpenLayers and Vue.js

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/wegue-oss/wegue/ci-tests.yml?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/wegue-oss/wegue/badge.svg)](https://snyk.io/test/github/wegue-oss/wegue)
[![license: 2-Clause BSD](https://img.shields.io/badge/license-2--Clause%20BSD-brightgreen.svg)](https://opensource.org/licenses/BSD-2-Clause)
[![Join the chat at https://gitter.im/wegue/community](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/wegue/community)
![GitHub Release Date](https://img.shields.io/github/release-date/wegue-oss/wegue)
![GitHub last commit](https://img.shields.io/github/last-commit/wegue-oss/wegue)

<img align="left" style="padding-bottom: 20px;" src="screenshots/wegue-app-1.png" />

Go to the online demo at https://wegue-oss.github.io/wegue/

## About
Wegue (**We**b**G**IS with OpenLayers and V**ue**) combines the power of [Vue.js](https://vuejs.org/) and the geospatial savvy of [OpenLayers](https://openlayers.org) to make lightweight webmapping applications. For styling and pre-defined UI-components the Material Design
Component Framework [Vuetify](https://vuetifyjs.com/) is used.

It acts as a template to reduce boilerplate work for browser-based mapping applications.

### Want to contribute? Yes, please :grinning:
If you want to contribute, please open a Pull Request in the repository.

Ensure that you have clean commits (and messages) and a meaningful description in your PR. Maybe opening an issue first is a good idea.

We look forward to your contributions!

## Versions

The lastest stable and released version stream is 2.x.

The latest development points towards a Wegue version v3 supporting Vue 3. This development is reflected within the `master` branch.
Herewith some breaking changes come along. In case you have to remain on the v2.x version of Wegue you can use the latest release [v2.1.0](https://github.com/wegue-oss/wegue/releases/tag/v2.1.0) or the maintenance development of v2 in the [v2 branch](https://github.com/wegue-oss/wegue/tree/v2). For a reasonable amount of time `v2` branch will be maintained, at least until there is an official `v3` release plus some additional buffer time.

In case you want to upgrade an existing Wegue app from v2 to the current v3 development stream please have a look at the `upgrade-notes.md` file.

We always try to have a robust state at the `master` branch, but be aware that breaking changes could come along, especially in the phase of a major upgrade.

In case you have to remain on the 1.x version of Wegue you can use the latest release [v1.2.1](https://github.com/wegue-oss/wegue/releases/tag/v1.2.1) or the maintenance development of v1 in the [v1 branch](https://github.com/wegue-oss/wegue/tree/v1). For a reasonable amount of time `v1` branch will be maintained.

Please consider to upgrade at least to Wegue v2 since v1 is quite old and uses a lot of outdated dependencies, which came to EOL.

In case you want to upgrade an existing Wegue app from v1 to the current v2 stream please have a look at the [upgrade-notes.md](upgrade-notes.md) file.

## Development

Prerequisites: Node.js and npm need to be available on your system.

### Dev Setup

  - Checkout / download this repository and navigate to the   checkout / download in a terminal (e.g. by `cd /path/to/checkout`).

  - Install the JS dependencies:

``` bash
# install dependencies
npm install
```

> Note: The **package-lock.json** is generated using the minimum NPM version specified in **package.json** `engines.npm`. If you use a more recent version, please do not commit this file.

  - Run the init-app script, which creates a base application (a copy of the `app-starter` dir) under `app/` to extend with custom components and resources (e.g. CSS styling) for your project.

``` bash
# initializes the Wegue app
npm run init:app
```

  - Start the dev server with auto reload at http://localhost:8081 (will be opened automatically):

``` bash
# serve with hot reload at localhost:8081
npm run serve
```

### Unit tests

To run all unit tests using Karma test runner execute the following:

``` bash
# run all tests
npm run test
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

### Linting your files

Run the lint script in order to lint all your files without fixing the errors. The problems will be reported in the console only.

``` bash
npm run lint
```

### Linting and fixing your files

Run the lint script in order to lint all your files and fix the errors at the same time.

``` bash
npm run lint:fix
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### ENV VARs

Besides the environment variables supported by Vue CLI Wegue offers the following ENV VARs:

- `WGU_PUBLIC_PATH` allows to modify the [publicPath](https://cli.vuejs.org/config/#publicpath) Vue CLI configuration, which is used in the production build. Default of `publicPath` is `'./'`.

## Run with Docker

The shipped Dockerfile gives you a basic idea how to use Wegue with Docker.
Maybe the Dockerfile needs some modification if you use custom application code.
Once you get along with just modifying the application config JSON it should be sufficient to do the following steps:

Build a Wegue Docker image as follows:

``` bash
docker build -t my-wegue-img:latest .
```

Start the freshly build image as a container:

``` bash
docker run -it -p 8080:80 my-wegue-img:latest
```

Open

- <http://127.0.0.1:8080/> or
- <http://localhost:8080/?appCtx=minimal> or
- <http://localhost:8080/?appCtx=projected>

in a browser.

Use Docker Volume mapping to run with your custom Wegue JSON config:

``` bash
docker run -it -p 8080:80 -v $(pwd)/app-conf-mine.json:/usr/share/nginx/html/static/app-conf-mine.json my-wegue-img:latest
```

and open <http://localhost:8080/?appCtx=mine>.

You can even overwrite the default config `app-conf.json`:

``` bash
docker run -it -p 8080:80 -v $(pwd)/app-conf-mine.json:/usr/share/nginx/html/static/app-conf.json my-wegue-img:latest
```

and then open <http://localhost:8080/>.

## Developing online using Gitpod.io

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/wegue-oss/wegue/)

Gitpod.io is an online IDE using VS Code that also provides a terminal and enables live preview. A registration is required but can be done with a GitHub account.

Open [gitpod.io/#https://github.com/wegue-oss/wegue/](https://gitpod.io/#https://github.com/wegue-oss/wegue/) to get started.

Wegue will automatically be initiated and your Wegue application can be previewed in a pane of the online IDE. The live preview of Wegue can also be seen in another browser tab by prefixing your workspace sub-URL with `8081-`. For example  `https://8081-YOUR-WORKSPACE-NAME.ws-eu25.gitpod.io`.

## Commercial Support
You need professional support or teachings for Wegue? Please contact a service provider listed below:

[![meggsimum logo](https://meggsimum.de/img/logo.png "meggsimum")](https://meggsimum.de)

## Credits

The basic project setup was created with [Vue CLI](https://cli.vuejs.org).

Thanks for this great template! :+1:
