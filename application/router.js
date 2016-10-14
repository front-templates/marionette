module.exports = {
	'*page404' : [require('controllers/application').page404, '<%= appName.toUpperCase() %> - 404'],
	''         : [require('controllers/application').home, '<%= appName.toUpperCase() %> - Home']
};