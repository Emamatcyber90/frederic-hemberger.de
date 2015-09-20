---
layout: post.hbs
lang: en
deck: Appliness Magazine
title: Grunt – A build tool for front-end projects
intro: >
    Most front-end developers already use some kind of build processes for their projects, even if the might not know – or don't use the term for it: They concatenate files for production, minify JavaScript code to speed up page loading and convert Sass or Less files into CSS for the browser. Grunt helps to manage all these steps in one single location and orchestrate  third party components.
date: 2013-01-04
---

*This article was published first on [Appliness Magazine, January 2013](http://www.appliness.com/january-issue-with-denise-jacobs/).*

## Why another build tool?

All previously existing solutions had their roots in different areas of programming. As they were not primarily built for front-end development, all of them had their own quirks and hindrances. Some involve knowledge of other languages (make, rake) or use individual XML dialects (ant, maven), which have to be learned at first and weren't easy to customize.

So why not have a tool explicitly built for the web workflow written in a language front-end developers work with every day, making it easy for them to modify and enhance this tool to their needs? Grunt is written entirely in JavaScript and running on Node.js, it can be used on various platforms.


## Hello Grunt!

Grunt is already around for a while, but underwent some major changes in the freshly released version 0.4: Now it only consists of a small command line client and a core task runner. All further functionality is based on plug-ins, so you can set it up for your special project needs without any bloat.

Grunt and all its plug-in dependencies are bundled within your project directory to make sure that everything you need to build and ship your project always stays in place. And if you check in the configuration settings into your Subversion or Git repositories, everything can be set up in no time.

Even if Grunt is still quite at an early stage, there are already plenty of plug-ins, for (almost) all your development needs:

Minification of JavaScript and CSS, integration of pre-processors for CSS and JavaScript like Sass/Compass, Less and Stylus, CoffeeScript or LiveScript, file size optimization for PNG and JPEG image files and automatic inlining and spriting of images.

If you plan to write larger web applications, Grunt also integrates optimizations with Require.js and Google Closure Compiler and lets you precompile your templates for Handlebars, Jade, Underscore, Mustache, Eco or Hogan. There are also already plug-ins for the most common testing frameworks like Jasmine, Mocha, QUnit, and Cucumber.

All available plug-ins are linked on the Grunt website (and if someone publishes a new Node.js module with the keyword "gruntplugin", it is automatically added to the list).

So as you can see, Grunt does not only help you building your project, but also serves as central configuration hub for external tools.


## Installation and getting started

Now you have a first impression what Grunt is all about, it's time to get started. First of all, be sure that Node.js is installed on your computer. There are installers available for various platforms, which let you start right away. Open a terminal and type `npm install grunt-cli -g` to install the Grunt command line tool.

Older versions of Grunt came with a set of predefined core tasks. In order to be more flexible and customizable, they were removed in the recent 0.4 release and can be installed as individual tasks plug-ins, which leave you with a little bit more work to set up:

First, create a file in the root folder of your project called `package.json`. If you're familiar with Node.js, you may already be familiar with this file, we'll start with the most basic one for our project.

``` javascript
{
  "name": "my-project-name",
  "version": "0.1.0",
  "devDependencies": {
    "grunt": "~0.4.0",
    "grunt-contrib-jshint": "~0.1.0",
    "grunt-contrib-concat": "~0.1.1",
    "grunt-contrib-uglify": "~0.1.0",
    "grunt-contrib-watch": "~0.1.4"
  }
}
```

Besides the name and the version of our project, it lists the dependencies needed for development. We are going to install Grunt with some of the most basic tasks. Open up the Terminal (or Command Prompt on Windows), change to your project directory and type `npm install`.

After Grunt and all the dependencies needed for our project are installed, it's time to start with the Grunt configuration itself. Therefore, we add a file called `Gruntfile.js` to our project root, next to the previously created `package.json` file.

A basic configuration file might look like this:

``` javascript
module.exports = function(grunt) {

  // Initializes the Grunt tasks with the following settings
  grunt.initConfig({

    // A list of files, which will be syntax-checked by JSHint
    jshint: { … },

    // Files to be concatenated … (source and destination files)
    concat: { … },

    // … and minified (source and destination files)
    uglify: { … },

    // Tasks being executed with 'grunt watch'
    watch: { … }
  });

  // Load the plugins that provide the tasks we specified in package.json.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');


  // This is the default task being executed if Grunt
  // is called without any further parameter.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};
```

So you see all the configuration you need is purely written in JavaScript. Basically, you need three different functions to work with Grunt: `grunt.initConfig`, `grunt.loadNpmTasks` and `grunt.registerTask`.

The first one defines all options and parameters for all the tasks you plan to use, the tasks itself are loaded with `grunt.loadNpmTasks`.

Each task can be called separately from the command line by passing it's name as a command line parameter: For example `grunt jshint` would only execute the linting task of your project. With `grunt.registerTask` you define a default task to run when Grunt is called without any parameter. It executes the listed tasks in the given order, in our case »jshint«, »concat« and »uglify«.


## Example Grunt tasks

### Checking your JavaScript with JSHint

JSHint is a tool to detect errors and potential problems in your JavaScript code, for example the proper setting of semicolons, unclosed brackets or  functions calls, which were not defined before. It also helps spotting typos, which might take long to find during debugging in the browser.

If you're working on a larger project, it's also a great help to enforce  coding conventions for your team. It's very flexible and can easily be adjusted to your needs.

For this plug-in, all files that should be checked are listed in an array:

``` javascript
jshint: {
  files: ['Gruntfile.js', 'lib/**/*.js']
},
```

In this example, the Grunt configuration itself is checked first, afterwards all JavaScript files in all subfolders of »lib«.


### Concatenation of files

This is a so called »multi task«. You can specify multiple groups of files which will be concatenated. The name of the groups is up to you, it just needs to be a valid JavaScript identifier:

``` javascript
concat: {
  js: {
    src: ['lib/module1.js', 'lib/module2.js', 'lib/plugin.js'],
    dest: 'dist/script.js'
  }
  css: {
    src: ['style/normalize.css', 'style/base.css', 'style/theme.css'],
    dest: 'dist/screen.css'
  }
},
```

During the build process, all files in these groups will be concatenated. If you just need to update one particular part, you can pass the task's name as parameter, e.g. `grunt concat:css`.


### Minification

Minifying your JavaScripts works the same way: You can set up one or multiple groups of files to be processed. To spare you typing the same file names over and over again, you can reference file names from other tasks as well. In this example, we'll reuse the target of the JavaScript concat task before ('dist/script.js'):

``` javascript
uglify: {
  dist: {
    src: ['<%= concat.js.dest %>'],
    dest: 'dist/script.min.js'
  }
},
```

### Automatic execution of tasks

All important steps are configured now, the build process is running smoothly. But what can be more annoying than running the process manually over and over again?

With the »watch« task plug-in, you can execute tasks automatically in the background each time a set of files changes in your project:

``` javascript
watch: {
  files: '<%= jshint.files %>',
  tasks: 'jshint'
},
```

Starting Grunt with `grunt watch`, the »jshint« task will be executed as soon as one JavaScript given in the file list of the jshint task-configuration changes.


## The bottom line

With Grunt, front-end developers have a very flexible tool at hand which helps a lot with automating recurring tasks. Once set up, you can either let the watch task do it's magic in the background, or integrate Grunt into your IDE or coding editor as external build command (which works great in Sublime Text, for example).

The code validation and testing increases overall quality and helps you maintain a constant coding standard, which makes Grunt also a perfect tool for teams working on large scale projects.

---

### Online Resources

- [Node.js](http://nodejs.org/download/)
- [Grunt (and an extensive list of plug-ins)](http://gruntjs.com/)
- [Grunt: Getting started](https://github.com/gruntjs/grunt/wiki/Getting-started) and [upgrading help](https://github.com/gruntjs/grunt/wiki/Upgrading-from-0.3-to-0.4)
- [Grunt plug-in for Sublime Text](https://github.com/tvooo/sublime-grunt)
