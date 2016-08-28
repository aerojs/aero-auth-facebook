let passport = require('passport')
let FacebookStrategy = require('passport-facebook').Strategy

module.exports = app => {
	let config = {
		callbackURL: '/auth/facebook/callback',
		profileFields: ['id', 'name', 'email', 'gender', 'age_range'],
		enableProof: false,
		passReqToCallback: true,
		clientID: app.apiKeys.facebook.id,
		clientSecret: app.apiKeys.facebook.secret
	}
	
	// Register Facebook strategy
	passport.use(new FacebookStrategy(config,
		function(request, accessToken, refreshToken, profile, done) {
			console.log(profile._json)
			done(undefined, profile._json)
		}
	))
	
	// Facebook login
	app.get('/auth/facebook', passport.authenticate('facebook', {
		scope: [
			'email',
			'public_profile'
		]
	}))

	// Facebook callback
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect: '/',
			failureRedirect: '/login'
		})
	)
}