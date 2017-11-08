// plugins
const gulp                  = require('gulp')
const sass                  = require('gulp-sass')
const concat                = require('gulp-concat')
const notify                = require('gulp-notify')
const cleanCSS              = require('gulp-clean-css')
const autoprefixer          = require('gulp-autoprefixer')
const sourcemaps            = require('gulp-sourcemaps')
const header                = require('gulp-header')
const footer                = require('gulp-footer')
const gulpif                = require('gulp-if')
const svgmin                = require('gulp-svgmin')
const imagemin              = require('gulp-imagemin')
const rename                = require('gulp-rename')
const bs                    = require('browser-sync').create()
const cp                    = require('child_process')
const del                   = require('del')
const webpack               = require('webpack')
const webpackStream         = require('webpack-stream')
const webpackUglify         = require('uglifyjs-webpack-plugin')
const named                 = require('vinyl-named')
const BundleAnalyzerPlugin  = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// variables
const jekyll                = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll'
let env                     = 'development'

// ----------

// paths
const paths = {
    // source files
    src: {
        sass: [
            'resources/assets/sass/*.{sass,scss}',
            'resources/assets/sass/**/*.{sass,scss}'
        ],
        img: [
            'resources/assets/img/*',
            'resources/assets/img/**/*'
        ],
        svg: {
            separate: [
                'resources/assets/svg/*.svg',
                '!resources/assets/svg/!*.svg'
            ],
            sprites: [
                'resources/assets/svg/**/*.svg',
                '!resources/assets/svg/**/!*.svg'
            ]
        },
        favicon: 'resources/assets/favicon/*',
        jekyll: [
            '*.html',
            'resources/views/*',
            'resources/views/**/*',
            'resources/views/**/**/*'
        ],
        fonts: 'resources/assets/fonts/*',
        js: {
            main: 'resources/assets/js/*.js',
            all: [
                'resources/assets/js/*.js',
                'resources/assets/js/**/*.{js,vue}',
            ]
        }
    },

    // destination folders
    dest: {
        css: '_site/assets/css',
        img: '_site/assets/img',
        svg: '_site/assets/svg',
        favicon: '_site/assets/favicon',
        fonts: '_site/assets/fonts',
        js: '_site/assets/js'
    }
}

// custom settings
const settings = {
    imagemin: [
        imagemin.gifsicle({
            interlaced: true
        }),
        imagemin.jpegtran({
            progressive: true
        }),
        imagemin.optipng({
            optimizationLevel: 5
        })
    ],
    webpack: require('./webpack.config.js')
}

// ----------

// task: browser-sync
let browserSync = false
gulp.task('browser-sync', () => {
    browserSync = true
    return bs.init({
        server: './_site',
        ghostMode: {
            scroll: false
        }
    })
})

// task: build:jekyll
gulp.task('build:jekyll', (callback) => {
    bs.notify('Running: build:jekyll')

    const spawn = cp.spawn(jekyll, ['build', '--incremental', '--quiet'], { stdio: 'inherit' })

    spawn.on('close', () => {
        // delete Jekyll's compiled css file
        del(['./_site/assets/main.css'])

        // start browser-sync if gulp runs in development mode
        if (!browserSync && env !== 'production')
            gulp.start('browser-sync')
        else if (browserSync)
            bs.reload()
    })

    spawn.on('exit', (code) => {
        return callback(code === 0 ? null : new Error('Code: ' + code))
    })

    spawn.on('error', notify.onError({
        title: 'Error: Jekyll',
        message: '<%= error.message %>'
    }))
})

// task: compile:sass
gulp.task('compile:sass', () => {
    bs.notify('Running: compile:sass')
    return gulp.src(paths.src.sass)
        .pipe(gulpif(env === 'development', sourcemaps.init()))
        .pipe(sass().on('error', notify.onError({
            title: 'Error: SASS',
            message: '<%= error.message %>'
        })))
        .pipe(autoprefixer())
        .pipe(gulpif(env === 'production', cleanCSS()))
        .pipe(rename({ suffix: '.bundle' }))
        .pipe(gulpif(env === 'development', sourcemaps.write('.')))
        .pipe(gulp.dest(paths.dest.css))
        .pipe(gulpif(env === 'development', bs.stream()))
})

// task: build:img
gulp.task('build:img', () => {
    bs.notify('Running: build:img')
    return gulp.src(paths.src.img)
        .pipe(gulpif(env === 'production', imagemin(settings.imagemin)))
        .pipe(gulp.dest(paths.dest.img))
        .pipe(gulpif(env === 'development', bs.stream()))
})

// task: build:svg-separate
gulp.task('build:svg-separate', () => {
    bs.notify('Running: build:svg')
    return gulp.src(paths.src.svg.separate)
        .pipe(gulpif(env === 'production', svgmin()))
        .pipe(gulp.dest(paths.dest.svg))
        .pipe(gulpif(env === 'development', bs.stream()))
})

// task: build:svg-sprites
gulp.task('build:svg-sprites', () => {
    bs.notify('Running: build:svg-sprites')
    return gulp.src(paths.src.svg.sprites)
        .pipe(concat('sprites.svg').on('error', notify.onError({
            title: 'Error: SVG Concat',
            message: '<%= error.message %>'
        })))
        .pipe(header('<svg xmlns="http://www.w3.org/2000/svg"><defs>'))
        .pipe(footer('</defs></svg>'))
        .pipe(gulpif(env === 'production', svgmin()))
        .pipe(gulp.dest(paths.dest.svg))
        .pipe(gulpif(env === 'development', bs.stream()))
})

// task: build:favicon
gulp.task('build:favicon', () => {
    bs.notify('Running: build:favicon')
    return gulp.src(paths.src.favicon)
        .pipe(gulpif(env === 'production', imagemin(settings.imagemin)))
        .pipe(gulp.dest(paths.dest.favicon))
        .pipe(gulpif(env === 'development', bs.stream()))
})

// task: build:fonts
gulp.task('build:fonts', () => {
    bs.notify('Running: build:fonts')
    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.dest.fonts))
        .pipe(gulpif(env === 'development', bs.stream()))
})

// task: build:js
gulp.task('build:js', () => {
    // define the environment for vendor plugins to compile in
    settings.webpack.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(env)
            }
        })
    )

    // minify js if the environment is set to "production"
    if (env === 'production') {
        settings.webpack.plugins.push(
            new webpackUglify({
                parallel: 2,
                cache: true,
                uglifyOptions: {
                    mangle: false,
                    output: {
                        comments: false,
                        beautify: false
                    }
                }
            })
        )
    } else {
        settings.webpack.plugins.push(
            new BundleAnalyzerPlugin()
        )
    }

    bs.notify('Running: build:js')
    return gulp.src(paths.src.js.main)
        .pipe(named())
        .pipe(webpackStream(settings.webpack).on('error', notify.onError({
            title: 'Error: JS',
            message: '<%= error.message %>'
        })))
        .pipe(gulp.dest(paths.dest.js))
        .pipe(gulpif(env === 'development', bs.stream()))
})

// task: reload:js
gulp.task('reload:js', () => {
    bs.notify('Running: reload:js')
    return bs.reload()
})

// task: clean:build
gulp.task('clean:build', () => {
    return del([
        paths.dest.js,
        paths.dest.css,
        paths.dest.img,
        paths.dest.svg,
        paths.dest.favicon,
        paths.dest.fonts,
        '_site/*.html'
    ], { force: true })
})

// task: default
gulp.task('default', ['clean:build'], () => {
    return gulp.start('compile:sass', 'build:img', 'build:svg-separate', 'build:svg-sprites', 'build:favicon', 'build:fonts', 'build:js')
})

// task: production
gulp.task('prod', () => {
    env = 'production' // change the environment to "production"
    return gulp.start('default')
})

// (alias) task: development
gulp.task('dev', ['watch'])

// task: watch
gulp.task('watch', ['default', 'build:jekyll'], () => {
    gulp.watch(paths.src.sass, ['compile:sass'])
    gulp.watch(paths.src.img, ['build:img'])
    gulp.watch(paths.src.svg.separate, ['build:svg-separate'])
    gulp.watch(paths.src.svg.sprites, ['build:svg-sprites'])
    gulp.watch(paths.src.fonts, ['build:fonts'])
    gulp.watch(paths.src.favicon, ['build:favicon'])
    gulp.watch(paths.src.jekyll, ['build:jekyll'])
    gulp.watch(paths.src.js.all, ['build:js'])
})