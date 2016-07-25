---
layout: post
title: "Front-end technologies used in current projects"
date: 2015-08-07
---
Since a couple of months, many front-end technologies have been introduced into our projects. Here I want to summarize some of major changes we did in the past year.

<h3>HTML</h3>
Since most of our users use Chrome and Firefox, so we moved completely to HTML5 (We added the shiv in the conditional comments for low version of IE just in case).

 + The new tags``` header footer article section``` were introduced to replace the old ```div```s. 
 + The DOCTYPE was changed to html.
 + HTML 5 validation was introduced to perform the front-end validation.
 + The old flash player was replaced by the ```<video>```tag

<h3>CSS</h3>
The concept "Mobile First" was applied during the whole process of the design. The layout for the mobile devices is designed first, using media query to add "exceptions" for a bigger view port. View ports are categorized into $phone, $tablet, $desktop which correspond to 480px, 768px and 1024px.  

The grid system was implemented with the [**susy**]()  framework. All CSS were re-written in scss. ```Mixin```s and ```Extend```s were used to define elements in different sizes. For example, buttons in different sizes are defined as follows,

@Mixin

``` css
@mixin btn ($size : M, $type : Bob){
    display:inline-block;
    background-color : blue;
    
    @if $size == 'S' {
        width : 16px;
        padding: 2px;
    }
    @if $size == 'M' {
        width : 20px;
        padding: 3px;
    }
    @if $size == 'L' {
        width : 24px;
        padding: 4px;
    }
    
    @if $type == 'Kate' {
        background-color : orange;
    }
}

.btn-L {
    @include btn(L);
}

.btn-S-Kate {
    @include btn(S, Kate);
}
```

@Extend

``` css
.message {
  padding: 4px;
  color: #333;
}

.success {
  @extend .message;
  border-color: green;
}

.error {
  @extend .message;
  border-color: red;
}
```

> For different viewport, sometimes there is the need for calculating the width with both percentage and absolute value, you can use the calc() function, see [browser support](https://developer.mozilla.org/en-US/docs/Web/CSS/calc)

Modularize CSS code into different files and use ```@import``` to compose them on each page. Leave page specific CSS in separated files and load them at the beginning of each page load. For each page, there will be only one CSS file built by the pre-compiler(we used Grunt for pre-compilation).   

<h3>Icon</h3>
Use SVG for icons, so they can be better rendered in different view ports. Since SVGs are loaded in DOM, so you can manipulate them in JS and they can be styled via CSS. 

Here there are two ways of loading the SVG icons, one way is to load them as a CSS background, to do so, you need to have a CSS class like this

``` css
.icon {
    background-image: url('data:image/svg+xml;charset=utf8,<svg xmlns="SVG 	namespace" version="1.1" width="270px" height="240px"><polygon points="5 235 135 10 265 235" fill="%23f00"/></svg>');
}
```

With the help of the plugin [grunt-svgstore](https://github.com/FWeinb/grunt-svgstore), all SVGs will be merged together in a .svg file and each of them will be defined in a <symbol> tag. Load the SVG file as a sprite of all icons at the beginning of each page and use the icon like this,

``` html
<svg>
    <use xlink:href="#icon"></use>
</svg>
```

<h3>Javascript</h3>
Generally, there are two popular ways to organize JS modules, one way is AMD( [requireJS](http://www.requirejs.org/) ) and the other way is CJS( [commonJS](http://www.commonjs.org/) ). The main difference between these two approaches is that AMD loads scripts asynchronously. It is hard to say which one is better, although CJS is more preferred on the server side, so basically on NodeJS server and AMD is often used on the browser side.

In these ways, dependencies can be organized by the framework you use, you only need to focus on the actual functionality in your current module, all relevant modules are injected either as parameters or instantiated via require() function. 

The following is some sample code of the two frameworks,

AMD
``` javascript
define('sampleModule', ['dep1', 'dep2'], function (dep1, dep2) {
    return function () {};
});
```

CJS
``` javascript
var dep1 = require('dep1');
var dep2 = require('dep2');
exports.foo = function () {};
```

We have tried both approaches. There is one hint to mention here. The common JS modules is generally not supported by browsers directly, we have used the browserify plugin in Grunt to solve this issue. Since all CJS modules can be merged into one file for every page, the number of requests for each page can be reduced to the minimum.

<h3>Test</h3>
We had used [Selenium](http://docs.seleniumhq.org/) as the testing framework. It is well supported with C#(although the framework was originally designed for the Java world). In the new projects, we have tried the testing tool [CasperJS](http://casperjs.org/) based on the [PhantomJS](http://phantomjs.org/) framework.
 
The main advantage of the CasperJS is that it is based on a headless browser, so it is much faster than Selenium. On the other hand, because of the nature of CasperJS, it is really hard to write and debug tests with a headless browser, when you are not that familiar with the whole test suite and its concept of the "evaluate" context.
