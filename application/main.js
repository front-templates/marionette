// exports jquery globally
window.jQuery = window.$ = require('jquery');

var Boiler = require('boiler');
var Backbone = require('backbone');
var Handlebars = require('handlebars/runtime');
var helpersContext = require.context('./helpers', true, /\.js$/);
var partialsContext = require.context('./', true, /(^|\/)_[_\w+]+\.tpl$/);

// inject css
require('assets/css/main.css');

// injects jquery in backbone
Backbone.$ = window.$;

// register helpers
helpersContext.keys().forEach(helpersContext);

// register partials
partialsContext.keys().forEach(function(file) {
	Handlebars.registerPartial(file.replace(/\.\//g, ''), partialsContext(file));
});

// enable loadingView
// Boiler.setLoadingView(require('views/loading'), '#loading');

// enable errorView
// Boiler.setErrorView(require('views/error'), '#error');

// execute initializer
require('initializer');

// register routes
Boiler.registerRoutes(require('router'));