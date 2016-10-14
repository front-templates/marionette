var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var regionManager = new Marionette.RegionManager();
var loading;
var loadingView;

// Controller
var Controller = function() {};
Controller.prototype.before = function() {};
Controller.prototype.after = function() {};
Controller.prototype.showView = showView;
Controller.prototype.extend = function(methods) {

	var instance = _.extend({}, Backbone.Router.prototype, Controller.prototype, this, methods);

	_(methods).each(function(fn, fnName) {
		if(fnName !== 'before' && fnName !== 'after') {
			methods[fnName] = (function() {
				return function() {
					if(instance.before.apply(instance, [fnName, location.hash]) !== false) {
						if(fn.apply(instance, arguments) !== false) {
							instance.after.apply(instance, [fnName, location.hash]);
						}
					}
				};
			})();
		}
	});

	return _.extend({}, Backbone.Router.prototype, Controller.prototype, methods);
};

// Async Controller
var AsyncController = function() {};
AsyncController.prototype.before = _.noop;
AsyncController.prototype.after = _.noop;
AsyncController.prototype.showView = showView;
AsyncController.prototype.extend = function(methods) {

	var instance = _.extend({}, Backbone.Router.prototype, AsyncController.prototype, this, methods);

	_(methods).each(function(fn, fnName) {
		if(fnName !== 'before' && fnName !== 'after') {
			methods[fnName] = (function() {
				return function() {
					var args = arguments;

					var next = function() {
						if(instance.after !== _.noop) {
							[].push.call(args, function() {
								instance.after.apply(instance, [fnName, location.hash]);
							});
						}

						fn.apply(instance, args);
					};

					if(instance.before === _.noop) {
						next();
					} else {
						instance.before.apply(instance, [fnName, location.hash, next]);
					}
				};
			})();
		}
	});

	return _.extend({}, Backbone.Router.prototype, AsyncController.prototype, methods);
};

// showView
function showView(region, view, options) {
	if(regionManager.get(region)) {
		regionManager.removeRegion(region);
	}

	regionManager.addRegion(region, region);

	if(typeof(view) === 'string') {
		view = new (require('../application/' + view))(options);
	}

	if(typeof(view) === 'function') {
		view = new view(options);
	}

	regionManager.get(region).show(view);

	return view;
}

// registerRoutes
function registerRoutes(routes) {
	var router = new Backbone.Router({});

	_(routes).each(function(callback, route) {
		if(route[0] === '/' && route[route.length - 1] === '/') {
			route = route.slice(1).slice(0, -1);
			route = new RegExp(route);
		}

		callback = _.isArray(callback) ? callback : [callback];

		router.route(route, callback[1] || document.title, callback[0]);
	});

	router.on('route', function(route) {
		document.title = route;
	});

	Backbone.history.start();
}

// Patch Backbone Router with showView method
Backbone.Router.prototype.showView = showView;

// loadingView
function setLoadingView(view, region) {
	$(document).ajaxStart(function() {
		loading = setTimeout(function() {
			loadingView = this.showView(region, view);
		}.bind(this), 2000);
	}.bind(this));

	$(document).ajaxStop(function() {
		clearTimeout(loading);
		try {
			loadingView.destroy();
		} catch(err) {}
	});
}

// errorView
function setErrorView(view, region) {
	$(document).ajaxError(function(event, error) {
		clearTimeout(loading);
		this.showView(region, view, {model: new Backbone.Model(error)});
	}.bind(this));
}

// exports
module.exports = {
	Controller: new Controller(),
	AsyncController: new AsyncController(),
	showView: showView,
	registerRoutes: registerRoutes,
	setLoadingView: setLoadingView,
	setErrorView: setErrorView
};