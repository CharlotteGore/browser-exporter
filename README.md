#BrowserX

A module for Express to export JS modules to the browser.

Write your client side javascript as node modules. Keep it with your server side code. Maintain one code base. Export your client side modules to the browser.

BrowsereXport. See?

##Usage

	// make sure you've already defined app.
	// it adds the object 'browserx' to app.locals, for use later on.
	var browserx = require('browserx')({ applicationRoot : __dirname, locals : app.locals });

	// add some middleware
	app.use(browserx.middleware());

	// Then in your layout.jade, give browserx your entry point JS.
	// Make sure it's a path relative to /app.js, not the template.
	!= browserx.upload('./lib/client.js')

##Status

Hideously early. Works like Browserify, but without requiring a build step or unit tests. 