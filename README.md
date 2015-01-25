bovine
===

Just an online learning system

bovine was created with a simple goal; to create an online learning system that works.  A virtual classroom with all the bull power, none of the feces.  bovine will provide a wide range of features that will enable teachers and instructors to stop worrying about management and syntax issues and get back to doing what their good at.

bovine is aimed towards a system that will allow for easy integration of modules and stylesheets through npm, while providing a simple, user-friendly interface that anyone can work with comfortably.  Upon initial startup, bovine will search for existing configuration objects in the database.  If none are found, a new configuration object is created to help you get started.

installation
===

To install bovine, simply run `npm install bovine`.  Once installed, the server can be started with `npm start` or through `node app.js`

When run using `node app.js`, bovine will accept the launch parameters `host` (`[--host | --h | -h hostname]`), `port` (`[--port | --p | or -p port]`), `environment` (`[--env | --e | -e { 0 for production, 1 for development, 2 for testing } ]`)

features
===

* versioned configurations management
* class management system
* role-based rendering
* sleek, user-friendly design
* plugins (front-end)

roadmap (planned features)
===

NOTE:  bovine is still in development.  Much more development is necessary before it can be considered stable.

* cluster/loadbalancing support
* middleware
* separation of main components into middleware
* extensive configuration management
* API and theming system
* better documentation

contributing
===

Please see [the all-knowing CONTRIBUTING file](https://github.com/stanier/bovine/blob/master/CONTRIBUTING.md)

license
===

bovine is licensed under the MIT License.  For more information, please see [LICENSE](https://github.com/stanier/bovine/blob/master/LICENSE)
