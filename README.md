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
  * run `bundle clean --force` and then `bundle install`

## For Frontend Developers:

## Project Structure
```
 ├── resources/
 │   ├── _assets/
 │       ├── favicon/
 │       ├── fonts/                   # Fallback fonts for situations where the end-user cannot access Google CDN
 │       ├── img/                     # Source images that will get compressed on production
 │       ├── js/
 │           ├── classes/             # ES6 Classes
 │           ├── components/          # Any site component (e.g. Steps, Tabs, FileUpload etc.)
 |           ├── app.js               # Our application's code
 |           ├── vendor.js            # Vendor libraries
 │       ├── json/                    # JSON for JS use
 │       ├── sass/
 │           ├── base/
 │               ├── functions/       # SCSS functions
 │               ├── mixins/          # SCSS mixins
 │               ├── _functions.scss  # Imports of functions from the "functions" directory
 │               ├── _mixins.scss     # Imports of mixins from the "mixins" directory
 │               ├── _general.scss    # General styling (e.g. body)
 │               ├── _variables.scss  # All project variables
 │           ├── components/          # Project components (e.g. buttons, header, etc.)
 │           ├── vendor/              # Vendor library imports
 │               ├── _bootstrap.scss  # Vendor library imports
 │           ├── app.scss             # Imports of all vendors, components etc.
 │       ├── svg/
 │   ├── _includes/                   # Jekyll template partials
 │   ├── _layouts/                    # Jekyll layouts
 │   ├── _data/                       # JSON for Jekyll use (different from the one found inside the "_assets" folder)
 ├── _config.yml                      # Jekyll configuration
 ├── package.json                     # Installed packages
 └── gulpfile.js                      # Our core for the development of application
 └── webpack.config.js                # JavaScript processing
 └── yarn.lock                        # Required to get consistent installs across machines
```

## Editor
* Tab size: 4
* Indent using spaces: no (false)
* Language-specific changes:
  * JavaScript language version: ECMAScript 6 ([WebStorm example](https://i.imgur.com/rB1DYqi.png))

## Assets
### Installing new packages
1. `yarn add <package name>` in your terminal/cmd
2. `import '<package name>'` in **vendor.js** and **app.js** or any component file

**Comment:** Importing in both places is important because we do not want to have our **app.bundle.js** output to contain any of the vendor libraries.
By doing it this way, webpack notices the sames libraries and puts them in a file named **common.bundle.js**.

### SVG
* Usage
  * `{% include_relative _assets/svg/<icon name>.svg %}`
  * Use https://jakearchibald.github.io/svgomg/ website to remove unnecessary code from svg file

### SASS/SCSS
#### Variables
* all variables must be inside `base/_variables.scss`
* for color naming we use [Name That Color](http://chir.ag/projects/name-that-color/#6195ED). for example, that color would be defined as "cornflower-blue"
* when defining similar variables it is best if it is defined in a SASS map. [read more about those here](https://webdesign.tutsplus.com/tutorials/an-introduction-to-sass-maps-usage-and-examples--cms-22184)

#### File structure
* all component-like partials must be inside the `components/` directory (e.g. buttons, forms, header, footer etc.)
* all sub-directory files must have a `_` prefix added to them (e.g. `buttons.scss` -> `_buttons.scss`)
* page-specific edits must be inside the `pages/` directory

### JS
* Technologies
  * use [ES2015](https://babeljs.io/learn-es2015/) (ES6) standards
* File structure
  * files must be logically split between 2 (or more) directories - `components/` and `classes/`
  * if the name of file (theoretically) consists of two words, each of them must be capitalized (e.g. date picker -> DatePicker) - same applies to single-word files

### Fonts
#### Installation
1. download the fonts from [fonts.google.com](https://fonts.google.com/)
2. go to [transfonter.org](https://transfonter.org/)
3. upload all fonts
4. put in the following settings:
  * Family support: **ON**
  * Add local() rule: **ON** _(doesn't really matter)_
  * Autohint font: **OFF**
  * Base64 encode: **OFF**
  * Formats: **TTF**, **SVG**, **WOFF**, **WOFF2**
  * Subsets: **set the same as you chose before downloading the font from Google Fonts** ([example](https://i.imgur.com/2lIfhif.png))
5. convert and download the fonts
6. place the downloaded fonts inside the `resources/_assets/fonts/<font family name in lowercase>/`
7. if the font files have a prefix "subset-", please remove it

**Comment:** this is done because some of our clients may have their access to Google's CDN blocked - thus not allowing them to see the custom font.

#### Usage
* open and update `resources/_assets/sass/base/_fonts.scss` to match your font files
* directories/files with "\_" prefix are ignored

### Validation
 * validation works only if you add class `.form-submit` to your submit button and class `.validate` to your `<form>` element
 * for error messages, you will need to add `data-error` attribute to your `<input>`, `<select>`, `<textarea>` elements
 * validation works only to elements with the `required` attribute
 * attempting to submit, you will see `.has-error` classes applied to `.form-group` elements
 * to see live example, go to styleguide page.

### Favicons
* use [Real Favicon Generator](https://realfavicongenerator.net/) to generate favicons for web use

## Thanks
* [HTML5Boilerplate](https://html5boilerplate.com/)
* [Real Favicon Generator](https://realfavicongenerator.net/)
* [SASS @font-face mixin](https://gist.github.com/jonathantneal/d0460e5c2d5d7f9bc5e6)

## To-Do
_empty_
