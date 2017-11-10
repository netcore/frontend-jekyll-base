// plugins
const gulp                  = require('gulp')
const sass                  = require('gulp-sass')
const cleanCSS              = require('gulp-clean-css')
const autoprefixer          = require('gulp-autoprefixer')
const sourcemaps            = require('gulp-sourcemaps')
const header                = require('gulp-header')
const footer                = require('gulp-footer')
const gulpif                = require('gulp-if')
const svgmin                = require('gulp-svgmin')
const imagemin              = require('gulp-imagemin')
const imageminPngquant      = require('imagemin-pngquant')
const rename                = require('gulp-rename')
const plumber               = require('gulp-plumber')
const concatFilenames 		= require('gulp-concat-filenames')
const chalk                 = require('chalk')
const bs                    = require('browser-sync').create()
const cp                    = require('child_process')
const del                   = require('del')
const path                  = require('path')
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
			'resources/_assets/sass/*.{sass,scss}',
			'resources/_assets/sass/**/*.{sass,scss}'
		],
		img: [
			'resources/_assets/img/*.{jpg,jpeg,png,gif}'
		],
		svg: [
			'resources/_assets/svg/*.svg',
			'resources/_assets/svg/**/*.svg',
			'!resources/_assets/svg/!*.svg',
			'!resources/_assets/svg/**/!*.svg'
		],
		favicon: 'resources/_assets/favicon/*.{ico,png,json,svg}',
		fonts: 'resources/_assets/fonts/*.{ttf,otf,eot,woff,woff2,svg}',
		js: {
			main: 'resources/_assets/js/*.js',
			all: [
				'resources/_assets/js/*.js',
				'resources/_assets/js/**/*.{js,vue}',
			]
		},
		json: [
			'resources/_assets/json/*.json',
			'resources/_assets/json/**/*.json'
		],
		jekyll: 'resources/**/*.html',
	},

	// destination folders
	dest: {
		css: '_site/assets/css',
		img: '_site/assets/img',
		svg: '_site/assets/svg',
		favicon: '_site/assets/favicon',
		fonts: '_site/assets/fonts',
		js: '_site/assets/js',
		json: '_site/assets/json'
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
		imageminPngquant({
			speed: 1,
			quality: 98 //lossy settings
		})
	],
	webpack: require('./webpack.config.js'),
	plumber (task) {
		return {
			errorHandler (error) {
				bs.notify(`ERROR: ${task}`, 10000)
				console.log(`${chalk.white.bgRed(`ERROR: ${task}`)} ${chalk.redBright('====================')}`)
				let message = ''
				if (error.plugin !== 'webpack-stream')
					message = console.error(chalk.redBright(error.formatted || error.message))
				return message
			}
		}
	},
	concatFilenames: {
		template (filename, test) {
			return `	"${filename.substring(filename.lastIndexOf('/') + 1)}",`
		}
	}
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

	let error = false

	return cp.spawn(jekyll, ['build', '--incremental', '--quiet'], { stdio: 'inherit' })
		.on('exit', () => {
			bs.notify('ERROR: build:jekyll', 10000)
			error = true
		})
		.on('close', () => {
			// delete Jekyll's compiled css file
			del(['./_site/assets/main.css'], { force: true })

			// reload browser if browser-sync is running
			if (browserSync && !error)
				bs.reload()

			callback()
		})
})

// task: compile:sass
gulp.task('compile:sass', () => {
	bs.notify('Running: compile:sass')
	return gulp.src(paths.src.sass)
		.pipe(plumber(settings.plumber('compile:sass')))
		.pipe(gulpif(env === 'development', sourcemaps.init()))
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulpif(env === 'production', cleanCSS()))
		.pipe(rename({ suffix: '.bundle' }))
		.pipe(gulpif(env === 'development', sourcemaps.write('.')))
		.pipe(gulp.dest(paths.dest.css))
		.pipe(gulpif(env === 'development', bs.stream()))
		.pipe(plumber.stop())
})

// task: build:img
gulp.task('build:img', () => {
	bs.notify('Running: build:img')
	return gulp.src(paths.src.img)
		.pipe(plumber(settings.plumber('build:img')))
		.pipe(gulpif(env === 'production', imagemin(settings.imagemin)))
		.pipe(gulp.dest(paths.dest.img))
		.pipe(gulpif(env === 'development', bs.stream()))
		.pipe(plumber.stop())
})

// task: build:svg
gulp.task('build:svg', () => {
	bs.notify('Running: build:svg')

	// generate JSON file with SVG icon file names
	gulp.src(paths.src.svg)
		.pipe(plumber(settings.plumber('build:svg')))
		.pipe(concatFilenames('icons.json', settings.concatFilenames))
		.pipe(header('[\n'))
		.pipe(footer(']'))
		.pipe(gulp.dest(paths.dest.json))
		.pipe(plumber.stop())

	// relocate and optimize svg
	return gulp.src(paths.src.svg)
		.pipe(plumber(settings.plumber('build:svg')))
		.pipe(gulpif(env === 'production', svgmin()))
		.pipe(gulp.dest(paths.dest.svg))
		.pipe(gulpif(env === 'development', bs.stream()))
		.pipe(plumber.stop())
})

// task: build:favicon
gulp.task('build:favicon', () => {
	bs.notify('Running: build:favicon')
	return gulp.src(paths.src.favicon)
		.pipe(plumber(settings.plumber('build:favicon')))
		.pipe(gulpif(env === 'production', imagemin(settings.imagemin)))
		.pipe(gulp.dest(paths.dest.favicon))
		.pipe(gulpif(env === 'development', bs.stream()))
		.pipe(plumber.stop())
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

	if (env === 'production') {
		// minify js
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
	} else if (env === 'debug') {
		// visually show library usage
		settings.webpack.plugins.push(
			new BundleAnalyzerPlugin()
		)
	}

	bs.notify('Running: build:js')
	return gulp.src(paths.src.js.main)
		.pipe(plumber(settings.plumber('build:js')))
		.pipe(named())
		.pipe(webpackStream({
			config: settings.webpack
		}))
		.pipe(gulp.dest(paths.dest.js))
		.pipe(gulpif(env === 'development', bs.stream()))
		.pipe(plumber.stop())
})

// task: build:json
gulp.task('build:json', () => {
	bs.notify('Running: build:json')
	return gulp.src(paths.src.json)
		.pipe(gulp.dest(paths.dest.json))
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
		paths.dest.json,
		'_site/*.html'
	], { force: true })
})

// task: default
gulp.task('default', ['clean:build'], () => {
	return gulp.start('compile:sass', 'build:img', 'build:svg', 'build:favicon', 'build:fonts', 'build:js', 'build:json', 'build:jekyll')
})

// task: production
gulp.task('prod', () => {
	env = 'production' // change the environment to "production"
	return gulp.start('default')
})

// task: debug
gulp.task('debug', () => {
	env = 'debug' // change the environment to "debug"
	return gulp.start('default')
})

// (alias) task: development
gulp.task('dev', ['watch'])

// task: watch
gulp.task('watch', ['default', 'browser-sync'], () => {
	gulp.watch(paths.src.sass, ['compile:sass'])
	gulp.watch(paths.src.img, ['build:img'])
	gulp.watch(paths.src.svg.sprites, ['build:svg-sprites'])
	gulp.watch(paths.src.svg.separate, ['build:svg-separate'])
	gulp.watch(paths.src.fonts, ['build:fonts'])
	gulp.watch(paths.src.favicon, ['build:favicon'])
	gulp.watch(paths.src.jekyll, ['build:jekyll'])
	gulp.watch(paths.src.js.all, ['build:js'])
	gulp.watch(paths.src.json, ['build:json'])
})