var Boiler = require('boiler');

module.exports = Boiler.Controller.extend({
	home: function() {
		this.showView('main', 'views/commons/home');
	},

	page404: function() {
		this.showView('main', 'views/commons/404');
	}
});