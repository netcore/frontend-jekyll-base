# Development workflow
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
 │           ├── directives/          # Vue directives
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

### SASS/SCSS
* Variables
  * all variables must be inside `base/_variables.scss`
  * for color naming we use [Name That Color](http://chir.ag/projects/name-that-color/#6195ED). for example, that color would be defined as "cornflower-blue"
  * when defining similar variables it is best if it is defined in a SASS map. [read more about those here](https://webdesign.tutsplus.com/tutorials/an-introduction-to-sass-maps-usage-and-examples--cms-22184)
* File structure
  * all component-like partials must be inside the `components/` directory (e.g. buttons, forms, header, footer etc.)
  * all sub-directory files must have a `_` prefix added to them (e.g. `buttons.scss` -> `_buttons.scss`)
  * page-specific edits must be inside the `pages/` directory

### JS
* Technologies
  * use [ES2015](https://babeljs.io/learn-es2015/) (ES6) standards
* File structure
  * files must be logically split between 3 (or more) directories - `components/`, `classes/` and `directives/`
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
8. open and update `resources/_assets/sass/base/_fonts.scss` to match your font files

**Comment:** this is done because some of our clients may have their access to Google's CDN blocked - thus not allowing them to see the custom font.

#### Usage
* directories with "\_" prefix are ignored

### Favicons
* use [Real Favicon Generator](https://realfavicongenerator.net/) to generate favicons for web use