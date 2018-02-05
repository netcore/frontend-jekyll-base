# Front-End Boilerplate
Netcore Front-End Boilerplate to quickly start off a new project.

Based on: **yarn**, **webpack** and **gulp**.

Vendor libraries included by default: **bootstrap 4.0.0-beta.2**, **jquery**

**If you are a front-end developer, please see "FRONTEND.md" to learn about the development workflow**

## Requirements
| Engine        | Version       |
| ------------- |:-------------:|
| node          | ≥6            |

## Setup
### Environmental setup
1. Install [NodeJS](https://nodejs.org/en/)
  * on some systems "npm" needs to be installed separately - [see this](https://docs.npmjs.com/getting-started/installing-node) if you're having trouble getting through next steps
2. Install [gulp](https://gulpjs.com)
3. Install [yarn](https://yarnpkg.com/en/docs/install)
4. Install [ruby](https://www.ruby-lang.org/en/documentation/installation/)
5. Install [Jekyll](https://jekyllrb.com/)

### Project setup
1. `git clone https://github.com/netcore/frontend-base.git <project name>`
2. `cd <project name>`
3. `yarn` or `yarn install`
4. (optional) delete all `.placeholder` files
5. changing line break option (inside `.eslintrc.json`):
  * for Windows: rules.linebreak-style must be "windows" _(default)_
  * for Linux/macOS: rules.linebreak-style must be "unix"

### Starting the development
`gulp dev` or `gulp watch` to start a local server and watch for changes

### Production
`gulp prod` to get project templates and assets ready for production

_this task may take longer to finish because of image processing tasks_

## Having issues?
* _(might not work)_ If you are getting errors while trying to setup a project or run "gulp" tasks:
  * install bundler - `gem install bundler`
  * now when trying to run the commands again, add a prefix **bundle exec** (e.g. `bundle exec yarn` or `bundle exec gulp prod`)

## For Frontend Developers

## Thanks
* [HTML5Boilerplate](https://html5boilerplate.com/)
* [Real Favicon Generator](https://realfavicongenerator.net/)
* [SASS @font-face mixin](https://gist.github.com/jonathantneal/d0460e5c2d5d7f9bc5e6)

## To-Do
_empty_
