# Front-End Boilerplate
Netcore Front-End Boilerplate to quickly start off a new project.

It consists of **yarn**, **webpack** and **gulp**.

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
`gulp prod` to get project assets ready for production

## Assets
### SVG sprites
* Processing
  * `<svg>` tags must be replaced with `<symbol>`
  * `<symbol>` must contain only `viewBox` and `id` attributes
  * `id` attribute must have a prefix `icon--`
  * `<path>` tags (or any other shape) must have their `fill` attribute replaced with `currentColor`, which allows to control its fill color with CSS `color` property
  * if the icon has more than 2 colors and its colors do not need to be controlled - the previous step can be skipped
  * if the icon has 2 colors - one `fill` attribute must be replaced with `currentColor` and the other should be removed - this allows the CSS to control its colors with `color` and `fill` properties
* Usage
  * `<svg width="x" height="y"><use xlink:href="{{ 'assets/svg/sprites.svg#icon--<name>' | relative_url }}"></use></svg>`

## Having issues?
* If you are getting errors while trying to setup a project or run "gulp" tasks:
  * install bundler - `gem install bundler`
  * now when trying to run the commands again, add a prefix **bundle exec** (e.g. `bundle exec yarn` or `bundle exec gulp prod`)

## Thanks
* [HTML5Boilerplate](https://html5boilerplate.com/)