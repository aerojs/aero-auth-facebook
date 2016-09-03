# aero-auth-facebook
Login via Facebook.

## Installation
Add `aero-auth-facebook` to `dependencies` in your `package.json`:

```json
"dependencies": {
	"aero-auth-facebook": "*"
}
```

### API keys
Register an app on [developers.facebook.com](https://developers.facebook.com/) and add the API key to `security/api-keys.json`:

```json
{
	"facebook": {
		"id": "YOUR_APP_ID",
		"secret": "YOUR_APP_SECRET"
	}
}
```

# Configuration
Add a new startup script `startup/facebook.js` which configures Facebook logins.

```
app.auth.facebook = {
	login: function*(facebook) {
		let user = {
			id: facebook.id
		}

		return user
	}
}
```

`app.auth.facebook.login` receives the Facebook data and returns a user object.

* Return the user object directly if you write `login` as a generator function.
* Return a promise that returns the user object if you write `login` as a normal function.