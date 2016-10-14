var $ = require('jquery');
var Boiler = require('boiler');
var Marionette = require('backbone.marionette');

require('backbone-query-parameters');

Boiler.showView('header', require('views/commons/header'));
Boiler.showView('footer', require('views/commons/footer'));

// active menu item
Marionette.View.prototype.on('render', function() {
	$('.header .nav.navbar-nav > li').removeClass('active');
	$('.header .nav.navbar-nav > li > a').filter('[href|="' + location.hash + '"]').parent().addClass('active');
});