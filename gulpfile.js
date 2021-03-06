var gulp = require('gulp'),
    nuget = require('gulp-nuget'),
    coffee = require('gulp-coffee'),
    clean = require('gulp-clean'),
    runSequence = require('run-sequence'),
    project = require('./package.json'),
    nugetApi = require('../nugetApi.json'),
    nugetPath = '../nuget.exe';

gulp.task('nuget-pack', function() {
    return gulp.src('./dist/KODataTable.js' )
        .pipe(nuget.pack({
            nuspec: 'project.nuspec',
            nuget: nugetPath,
            version: project.version,
            workingDirectory: '.tmp/'
        }))
        .pipe(gulp.dest('nuget/'));
});

gulp.task('nuget-push', function() {
    return gulp.src('nuget/' + project.name + '.' + project.version + '.nupkg')
        .pipe(nuget.push({
            feed: 'https://www.nuget.org/',
            nuget: nugetPath,
            apiKey: nugetApi.key
        }));
});

gulp.task('dist', function() {
    return gulp.src(['KODataTable.coffee'])
        .pipe(coffee({noHeader: true}))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function() {
    return gulp.src(['./*.nupkg','./dist/**','.tmp/**']).pipe(clean());
});

gulp.task('clean-leftovers', function() {
    return gulp.src(['./*.nupkg']).pipe(clean());
})

gulp.task('nuget', function() {
    runSequence('clean','dist','nuget-pack','clean-leftovers');
});