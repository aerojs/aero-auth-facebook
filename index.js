let passport = require('passport')
let FacebookStrategy = require('passport-facebook').Strategy

module.exports = app => {
	app.on('startup loaded', () => {
		if(!app.auth || !app.auth.facebook)
			throw new Error('Missing Facebook configuration. Please define app.auth.facebook')

		if(!app.api.facebook || !app.api.facebook.id || !app.api.facebook.secret)
			throw new Error('Missing Facebook API keys. Please add them to security/api-keys.json')

		if(!app.auth.facebook.login)
			throw new Error("app.auth.facebook.login needs to be defined")

		if(app.auth.facebook.login.constructor.name === 'GeneratorFunction')
			app.auth.facebook.login = Promise.coroutine(app.auth.facebook.login)

		let config = {
			callbackURL: app.production ? `https://${app.config.domain}/auth/facebook/callback` : '/auth/facebook/callback',
			profileFields: app.auth.facebook.fields || ['id', 'name', 'email', 'gender', 'age_range'],
			enableProof: false,
			passReqToCallback: true,
			clientID: app.api.facebook.id,
			clientSecret: app.api.facebook.secret
		}

		// Register Facebook strategy
		passport.use(new FacebookStrategy(config,
			function(request, accessToken, refreshToken, profile, done) {
				app.auth.facebook.login(profile._json)
				.then(user => done(undefined, user))
				.catch(error => done(error, false))
			}
		))

		// Facebook login
		app.get('/auth/facebook', passport.authenticate('facebook', {
			scope: app.auth.facebook.scopes || [
				'email',
				'public_profile'
			]
		}))

		// Facebook callback
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', app.auth.facebook.onLogin || { successRedirect: '/' })
		)
	})
}