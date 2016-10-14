var Handlebars = require('handlebars/runtime');

Handlebars.registerHelper('config', function(value) {
	return window.Config[value];
});