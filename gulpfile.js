/* jshint node:true */
'use strict';
// generated on 2015-02-06 using generator-gulp-webapp 0.2.0
var gulp = require('gulp');
var browserify	= require('browserify');
var es6ify	= require('es6ify');
var debowerify	= require('debowerify');
var $ = require('gulp-load-plugins')();
var fs = require('fs');
require('es6-promise').polyfill();

gulp.task('styles', function () {
	return gulp.src('app/styles/main.scss')
		.pipe($.plumber())
		.pipe($.rubySass({
			style: 'expanded',
			precision: 10
		}))
		.pipe($.autoprefixer({browsers: ['last 1 version']}))
		.pipe(gulp.dest('.tmp/styles'));
});

gulp.task('browserify', function () {
	try {
		fs.mkdirSync('.tmp');
		fs.mkdirSync('.tmp/scripts');
	} catch (e) {
		if (e.code !== 'EEXIST') {
			throw e;
		}
	}

	return Promise.all(fs.readdirSync('./app/scripts/').map(function (a) {
		var path = './app/scripts/' + a;
		if (!fs.statSync(path).isDirectory()) {
			return new Promise(function (resolve, reject) {
				process.stdout.write('Browserify: Processing ' + a + '\n');
                var writer = fs.createWriteStream('.tmp/scripts/' + a);
                writer.on('finish', function () {
                	resolve(a);
                });
				browserify({ debug: true })
					.add(es6ify.runtime)
					.transform(es6ify)
					.transform(debowerify)
					.require(require.resolve(path), { entry: true })
					.bundle()
					.on('error', function(err) {
						this.emit('exit');
						reject(err);
					})
					.pipe(writer);
			}).then(function (a) {
				process.stdout.write('Browserify: Finished processing ' + a + '\n');
			});
		} else {
			return undefined;
		}
	})).then(function (a) {
		process.stdout.write('Browserify: Finished all\n');
	}, function (e) {
		process.stdout.write(e);
	});
});

gulp.task('jshint', function () {
	return gulp.src('app/scripts/**/*.js')
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.jshint.reporter('fail'));
});

gulp.task('html', ['styles'], function () {
	var assets = $.useref.assets({searchPath: '{.tmp,app}'});

	return gulp.src('app/*.html')
		.pipe(assets)
		.pipe($.if('*.css', $.csso()))
		.pipe(assets.restore())
		.pipe($.useref())
		.pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
		.pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
	return gulp.src('app/images/**/*')
		.pipe($.cache($.imagemin({
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
	return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
		.pipe($.filter('**/*.{eot,svg,ttf,woff}'))
		.pipe($.flatten())
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
	return gulp.src([
		'app/*.*',
		'!app/*.html',
		'node_modules/apache-server-configs/dist/.htaccess'
	], {
		dot: true
	}).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('connect', ['browserify', 'styles'], function () {
	var serveStatic = require('serve-static');
	var serveIndex = require('serve-index');
	var app = require('connect')()
		.use(require('connect-livereload')({port: 35729}))
		.use(serveStatic('.tmp'))
		.use(serveStatic('app'))
		// paths to bower_components should be relative to the current file
		// e.g. in app/index.html you should use ../bower_components
		.use('/bower_components', serveStatic('bower_components'))
		.use(serveIndex('app'));

	require('http').createServer(app)
		.listen(8080)
		.on('listening', function () {
			console.log('Started connect web server on http://0.0.0.0:8080');
		});
});

gulp.task('serve', ['connect', 'watch'], function () {
	require('opn')('http://0.0.0.0:8080/');
});

// inject bower components
gulp.task('wiredep', function () {
	var wiredep = require('wiredep').stream;

	gulp.src('app/styles/*.scss')
		.pipe(wiredep())
		.pipe(gulp.dest('app/styles'));

	gulp.src('app/*.html')
		.pipe(wiredep())
		.pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect'], function () {
	$.livereload.listen();

	// watch for changes
	gulp.watch([
		'app/*.html',
		'.tmp/styles/**/*.css',
		'.tmp/scripts/**/*.js',
		'app/images/**/*'
	]).on('change', $.livereload.changed);

	gulp.watch('app/scripts/**/*', ['browserify']);
	gulp.watch('app/styles/**/*.scss', ['styles']);
	gulp.watch('bower.json', ['wiredep']);
});

gulp.task('build', ['browserify', 'html', 'images', 'fonts', 'extras'], function () {
	return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
	gulp.start('build');
});
