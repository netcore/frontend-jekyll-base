# Front-End Boilerplate
Netcore Front-End Boilerplate to quickly start off a new project.

Based on: **yarn**, **webpack** and **gulp**.

Vendor libraries included by default: **bootstrap 4.0.0-beta.2**, **jquery**

## Setup
### Environmental setup
1. Install [NodeJS](https://nodejs.org/en/)
2. Install [gulp](https://gulpjs.com)
3. Install [yarn](https://yarnpkg.com/en/docs/install)
4. Install [ruby](https://www.ruby-lang.org/en/documentation/installation/)
5. Install [Jekyll](https://jekyllrb.com/)

### Project setup
1. `git clone https://github.com/netcore/frontend-base.git <project name>`
2. `cd <project name>`
3. `yarn` or `yarn install`

### Starting the development
`gulp dev` or `gulp watch` to start a local server and watch for changes

### Production
`gulp prod` to get project templates and assets ready for production

_this task may take longer to finish because of image processing tasks_

## Assets
### SVG
* Usage
  * `{% include_relative _assets/svg/<icon name>.svg %}`

### SASS/SCSS
* Variables
  * all variables must be inside `base/_variables.scss`
  * for color naming we use [Name That Color](http://chir.ag/projects/name-that-color/#6195ED). for example, that color would be defined as "cornflower-blue"
  * when defining similar variables it is best if it is defined in a SASS map. [read more about those here](https://webdesign.tutsplus.com/tutorials/an-introduction-to-sass-maps-usage-and-examples--cms-22184)
* File structure
  * all component-like partials must be inside the `components/` directory (e.g. buttons, forms, header, footer etc.)
  * all sub-directory files must have a `_` prefix added to them (e.g. `buttons.scss` -> `_buttons.scss`)

### JS
* Technologies
  * use [ES2015](https://babeljs.io/learn-es2015/) (ES6) standards
* File structure
  * files must be logically split between 3 (or more) directories - `components/`, `classes/` and `directives/`
  * if the name of file (theoretically) consists of two words, each of them must be capitalized (e.g. date picker -> DatePicker) - same applies to single-word files

## Having issues?
* (might not work) If you are getting errors while trying to setup a project or run "gulp" tasks:
  * install bundler - `gem install bundler`
  * now when trying to run the commands again, add a prefix **bundle exec** (e.g. `bundle exec yarn` or `bundle exec gulp prod`)

## Thanks
* [HTML5Boilerplate](https://html5boilerplate.com/)