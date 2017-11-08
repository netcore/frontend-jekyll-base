# Front-End Boilerplate
Netcore Front-End Boilerplate to quickly start off a new project.

It consists of **yarn**, **webpack** and **gulp**.

### Setup
#### Environmental setup
1. Install [NodeJS](https://nodejs.org/en/)
2. Install [gulp](https://gulpjs.com)
3. Install [yarn](https://yarnpkg.com/en/docs/install)
4. Install [ruby](https://www.ruby-lang.org/en/documentation/installation/)
5. Install [Jekyll](https://jekyllrb.com/)

#### Project setup
1. `git clone https://github.com/netcore/frontend-base.git <project name>`
2. `cd <project name>`
3. `yarn` or `yarn install`

#### Starting the development
`gulp dev` or `gulp watch` to start a local server and watch for changes

#### Production
`gulp prod` to get project assets ready for production

#### Having issues?
* If you are getting errors while trying to setup a project or run "gulp" tasks:
  * install bundler - `gem install bundler`
  * now when trying to run the commands again, add a prefix **bundle exec** (e.g. `bundle exec yarn` or `bundle exec gulp prod`)