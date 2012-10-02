#BrowserX

Express middleware to export JS modules to the browser.

Write your client side javascript as node modules. Keep it with your server side code. Maintain one code base. Export your client side modules to the browser.

Should be compatible with all packages labelled 'browserify'.

##Usage

	// Do this after you've defined app as Express...
	// it adds the object 'browserx' to app.locals, for use later on.
	var browserx = require('browserx')({ applicationRoot : __dirname, locals : app.locals });

	// add some middleware
	app.use(browserx.middleware());

	// Then in your layout.jade, give browserx your entry point JS.
	// Make sure it's a path relative to /app.js, not the template.
	!= browserx.upload('./lib/client.js')
	
##What is generated

What is sent to the browser is a single file that contains your entry point script, an implemention of require(), a tiny bit of shimmery for node stuff, and any dependencies compiled as modules. 

##Status

Hideously early. Works like Browserify, but without requiring a build step or unit tests. Or versions of Node builtins. Or, in fact, any sort of testing really.