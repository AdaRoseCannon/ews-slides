var slideFuncs = {
	'slide-0': {
		setup() {
			console.log('Setup', this);
		},
		action: function* () {
			console.log('Action 1');
			yield;
			console.log('Action 2');
			yield;
		},
		teardown() {
			console.log('Teardown', this);
		}
	}
};

module.exports.setup = function (name) {
	if (slideFuncs[name]) {
		slideFuncs[name].setup.bind(document.getElementById(name))();
	} else {
		slideFuncs[name] = {
			setup() {},
			action: function* (){yield;},
			teardown() {}
		};
	}
	module.exports.triggerEvent = slideFuncs[name].action();

	// Do first action
	module.exports.triggerEvent.next();
};

module.exports.teardown = function (name) {
	if (slideFuncs[name]) {
		slideFuncs[name].teardown.bind(document.getElementById(name))();
	}
};