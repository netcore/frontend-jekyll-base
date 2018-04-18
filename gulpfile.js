// plugins
const gulp					= require('gulp')
const sass					= require('gulp-sass')
const cleanCSS				= require('gulp-clean-css')
const autoprefixer			= require('gulp-autoprefixer')
const sourcemaps			= require('gulp-sourcemaps')
const header				= require('gulp-header')
const footer				= require('gulp-footer')
const gulpif				= require('gulp-if')
const svgmin				= require('gulp-svgmin')
const imagemin				= require('gulp-imagemin')
const imageminPngquant		= require('imagemin-pngquant')
const rename				= require('gulp-rename')
const plumber				= require('gulp-plumber')
const concatFilenames 		= require('gulp-concat-filenames')
const chalk					= require('chalk')
const bs					= require('browser-sync').create()
const cp					= require('child_process')
const fs 					= require('fs')
const del					= require('del')
const path					= require('path')
const webpack				= require('webpack')
const webpackStream			= require('webpack-stream')
const webpackUglify			= require('uglifyjs-webpack-plugin')
const named					= require('vinyl-named')
const BundleAnalyzerPlugin	= require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const cache 				= require('gulp-cache')

// variables
const jekyll				= process.platform === 'win32' ? 'jekyll.bat' : 'jekyll'
let env						= 'development'

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
			'resources/_assets/img/**/*.{jpg,jpeg,png,gif}',
			'resources/_assets/img/*.{jpg,jpeg,png,gif}'
		],
		imgMin: [
			'resources/_assets/img/**/*.{png,gif}',
			'resources/_assets/img/*.{png,gif}'
		],
		svg: [
			'resources/_assets/svg/*.svg',
			'resources/_assets/svg/**/*.svg',
			'!resources/_assets/svg/_*.svg',
			'!resources/_assets/svg/**/_*.svg'
		],
		favicon: 'resources/_assets/favicon/*.{ico,png,json,svg,xml}',
		fonts: 'resources/_assets/fonts/**/*.{ttf,otf,eot,woff,woff2,svg}',
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
		//video: 'resources/_assets/video/*.{mp4,ogg,webm}',
		jekyll: 'resources/**/*.html'
	},

	// destination folders
	dest: {
		css: '_site/assets/css',
		img: '_site/assets/img',
		svg: '_site/assets/svg',
		svgDev: 'resources/_assets/svg',
		favicon: '_site/assets/favicon',
		fonts: '_site/assets/fonts',
		js: '_site/assets/js',
		json: '_site/assets/json',
		//video: '_site/assets/video'
	}
}

// custom settings
const settings = {
	imagemin: [
		imagemin.gifsicle({
			interlaced: true
		}),
		imageminPngquant({
			speed: 1,
			quality: 98 // lossy settings
		})
	],
	webpack: require('./webpack.config.js'),
	plumber (task) {
		return {
			errorHandler (error) {
				bs.notify(`ERROR: ${task}`, 10000)

				// log error
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
	},
	bs: {
		middleware: [
			(req, res, next) => {
				if (req.method !== 'GET') {
					try {
						let extension = req.url.slice((req.url.lastIndexOf('.') - 1 >>> 0) + 2)
						let content = require(path.resolve('.') + '/_site' + req.url)
						if (typeof content === 'object')
							content = JSON.stringify(content)
						let status = parseInt(req.url.substring(req.url.lastIndexOf('/'), req.url.length).split(/\_/g)[1])

						if (extension === 'json')
							res.writeHead(status, { 'Content-Type': 'application/json' })
						else
							res.writeHead(status, { 'Content-Type': 'text/plain' })

						res.write(content)
					} catch (error) {
						res.writeHead(404, { 'Content-Type': 'text/plain' })
					}

					res.end()
				}
				next()
			}
		]
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
		},
		middleware: settings.bs.middleware
	})
})

// task: build:jekyll
gulp.task('build:jekyll', (callback) => {
	bs.notify('Running: build:jekyll')

	let error = false

	return cp.spawn(jekyll, ['build', '--incremental', '--quiet'], { stdio: 'inherit' })
		.on('exit', (code) => {
			if (code === 0)
				return

			bs.notify('ERROR: build:jekyll', 10000)
			error = true
		})
		.on('close', () => {
			// delete Jekyll's compiled css file
			del(['./_site/assets/main.css'], { force: true })

			// initiate browser sync
			if (!browserSync && env === 'development')
				gulp.start('browser-sync')

			// reload browser if browser-sync is running
			if (browserSync && !error)
				bs.reload('**/*.html')

			callback()
		})
})

// task: compile:sass
gulp.task('compile:sass', () => {
	bs.notify('Running: compile:sass')
	return gulp.src(paths.src.sass)
		.pipe(cache(plumber(settings.plumber('compile:sass'))))
		.pipe(gulpif(env === 'development', sourcemaps.init()))
		.pipe(sass().on('error', sass.logError, function () {
			this.emit('end')
		}))
		.pipe(autoprefixer())
		.pipe(gulpif(env === 'production', cleanCSS()))
		.pipe(rename({ suffix: '.bundle' }))
		.pipe(gulpif(env === 'development', sourcemaps.write('.')))
		.pipe(plumber.stop())
		.pipe(gulp.dest(paths.dest.css))
		.pipe(gulpif(env === 'development', bs.stream({ match: '**/*.css' })))
})

// task: build:img
gulp.task('build:img', () => {
	bs.notify('Running: build:img')
	return gulp.src(paths.src.img)
		.pipe(cache(plumber(settings.plumber('build:img'))))
		.pipe(plumber.stop())
		.pipe(gulp.dest(paths.dest.img))
		.pipe(gulpif(env === 'development', bs.stream({ once: true })))
})

gulp.task('minify:img', () => {
	bs.notify('Running: minify:img')
	return gulp.src(paths.src.imgMin)
	.pipe(cache(plumber(settings.plumber('minify:img'))))
	.pipe(gulpif(env === 'production', imagemin(settings.imagemin)))
	.pipe(plumber.stop())
	.pipe(gulp.dest(paths.dest.img))
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
		.pipe(plumber.stop())
		.pipe(gulp.dest(paths.dest.json))

	// relocate and optimize svg
	return gulp.src(paths.src.svg)
		.pipe(plumber(settings.plumber('build:svg')))
		.pipe(svgmin(file => {
			const prefix = path.basename(file.relative, path.extname(file.relative))
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
						minify: true
                    }
                }]
            }
		}))
		.pipe(plumber.stop())
		.pipe(gulp.dest(paths.dest.svgDev))
		.pipe(gulp.dest(paths.dest.svg))
		.pipe(gulpif(env === 'development', bs.stream()))
})

// task: build:favicon
gulp.task('build:favicon', () => {
	bs.notify('Running: build:favicon')
	return gulp.src(paths.src.favicon)
		.pipe(cache(plumber(settings.plumber('build:favicon'))))
		.pipe(gulpif(env === 'production', imagemin(settings.imagemin)))
		.pipe(plumber.stop())
		.pipe(gulp.dest(paths.dest.favicon))
		.pipe(gulpif(env === 'development', bs.stream({ once: true })))
})

// task: build:fonts
gulp.task('build:fonts', () => {
	bs.notify('Running: build:fonts')
	return gulp.src(paths.src.fonts)
		.pipe(gulp.dest(paths.dest.fonts))
		.pipe(gulpif(env === 'development', bs.stream({ once: true })))
})

// task: build:video
/*gulp.task('build:video', () => {
	bs.notify('Running: build:video')
	return gulp.src(paths.src.video)
		.pipe(gulp.dest(paths.dest.video))
		.pipe(gulpif(env === 'development', bs.stream({ once: true })))
})
*/

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

		// change vue alias to the production version
		settings.webpack.resolve.alias['vue$'] = 'vue/dist/vue.min'
	} else if (env === 'debug') {
		// visually show library usage
		settings.webpack.plugins.push(
			new BundleAnalyzerPlugin()
		)
	}

	bs.notify('Running: build:js')
	return gulp.src(paths.src.js.main)
		.pipe(cache(plumber(settings.plumber('build:js'))))
		.pipe(named())
		.pipe(webpackStream({
			config: settings.webpack
		}).on('error', function () {
			this.emit('end')
		}))
		.pipe(plumber.stop())
		.pipe(gulp.dest(paths.dest.js))
		.pipe(gulpif(env === 'development', bs.stream({ once: true })))
})

// task: build:json
gulp.task('build:json', () => {
	bs.notify('Running: build:json')
	return gulp.src(paths.src.json)
		.pipe(gulp.dest(paths.dest.json))
		.pipe(gulpif(env === 'development', bs.stream({ match: '**/*.html' })))
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
	return gulp.start('compile:sass', 'build:img', 'minify:img', 'build:svg', 'build:favicon', 'build:fonts', 'build:js', 'build:json', 'build:jekyll'/*, 'build:video'*/)
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
gulp.task('watch', ['default'], () => {
	gulp.watch(paths.src.sass, ['compile:sass'])
	gulp.watch(paths.src.img, ['build:img'])
	gulp.watch(paths.src.svg, ['build:svg'])
	gulp.watch(paths.src.fonts, ['build:fonts'])
	gulp.watch(paths.src.favicon, ['build:favicon'])
	gulp.watch(paths.src.jekyll, ['build:jekyll'])
	gulp.watch(paths.src.js.all, ['build:js'])
	gulp.watch(paths.src.json, ['build:json'])
	//gulp.watch(paths.src.video, ['build:video'])
})
