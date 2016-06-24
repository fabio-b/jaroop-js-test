//Gulp file will compile JS/CSS files written in ES6 and postCSS respsectively.

const gulp = require('gulp');
const matchdep = require('matchdep');
const del = require('del');
matchdep.filterDev('gulp-*').forEach(function(module){
	let mod = module.replace(/^gulp-/, '').replace(/-/, '');
	
	global[mod] = require(module);
});

//cleans working directory before writing files
gulp.task('clean:css', (cb) => {
	del([
		'assets/css/*'
	]).then( () => {
		cb();
	})
})
gulp.task('clean:js', (cb) => {
	del([
		'assets/js/*'
	]).then( () => {
		cb();
	})
})

//Compiles our css files written in CSS4 to make compatible with most browsers
gulp.task('css', ['clean:css'], () => {
	//our postcss plugins to run through the file
	const PROCESSORS = [
		require('postcss-import'), //helps import files
		require('postcss-cssnext'), //awesome plugin that does a lot
		require('cssnano') //minifies our file
	];
	let css = gulp.src('build/src/css/*.css')
		.pipe(postcss(PROCESSORS))
		.pipe(gulp.dest('assets/css'))
	
	return css;
})

//Compiles our js files written in ES6 syntax to make compatible with most browsers
gulp.task('js', ['clean:js'], () => {
	//jshint validates any errors before compiling
	//babel transpiles ES6 down to ES5 syntax
	//uglify minifies our file
	let js = gulp.src('build/src/js/*.js')
		.pipe(jshint({
			curly: true,
			esversion: 6,
			undef: true,
			asi: true,
			shadow: true,
			evil: true,
			laxcomma: true,
			globals: {
				"$": true,
				"console": true,
				"document": true
			}
		}))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.pipe(gulp.dest('assets/js'))
		
	return js;
})

//helpful task to watch for changes when debugging code
gulp.task('watch', ['css','js'], () => {
	gulp.watch('build/src/css/**/*.css', ['css']);
	gulp.watch('build/src/js/**/*.js', ['js']);
})

gulp.task('default', ['css','js']);