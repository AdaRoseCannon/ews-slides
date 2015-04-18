var marked = require('marked');
var Templates = require('./templates');
var timeout;

var slideFuncs = {
	'slide-0': {
		setup() {},
		action: function* () {
			yield;
		},
		teardown() {}
	},
	'slide-1': {
		setup() {		},
		action: function* () {

			var t = $(this).find('.render-here');
			var templates = Templates['slide-1'];
			yield;

			t.html(templates[0]);
			yield;

			t.html(marked(templates[1]));
			yield;

			t.html(marked(templates[2]));
			yield;
		},
		teardown() {
			$(this).find('.render-here').html('');
		}
	},
	'slide-2': {
		setup() {		},
		action: function* () {

			var t = $(this).find('.render-here');
			var templates = Templates['slide-2'];
			yield;

			t.html(templates[0]);
			yield;


			t.html('');
			var i = 0;
			var pre = $('<pre></pre>');
			t.append(pre);
			timeout = setInterval(() => {
				pre.append(i++ % 2 === 1 ? 'myVar = el.getBoundingClientRect().height;' : 'el.height = (myVar + 1) + "px"');
				pre.append('\n');
			}, 800);
			yield;

		},
		teardown() {
			clearInterval(timeout);
			$(this).find('.render-here').html('');
		}
	},
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
	module.exports.triggerEvent = slideFuncs[name].action.bind(document.getElementById(name))();

	// Do first action
	module.exports.triggerEvent.next();
};

module.exports.teardown = function (name) {
	if (slideFuncs[name]) {
		slideFuncs[name].teardown.bind(document.getElementById(name))();
	}
};