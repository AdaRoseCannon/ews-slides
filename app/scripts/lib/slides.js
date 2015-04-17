var slideFuncs = {
	'slide-0': {
		setup() {},
		action: function* () {
			yield;
		},
		teardown() {}
	}
};

module.exports.triggerEvent = {
	next() {}
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