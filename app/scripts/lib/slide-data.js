var marked = require('marked');
var Templates = require('./templates');
var timeouts = {};

module.exports = {
	'slide-0': {
		setup() {},
		action: function* () {
			yield;
		},
		teardown() {}
	},
	'slide-1': {
		setup() {},
		action: function* () {

			var t = $(this).find('.render-here');
			var templates = Templates['slide-1'];
			var image = $(templates[0]);
			yield;

			t.append(image);
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
		setup() {},
		action: function* () {

			var t = $(this).find('.render-here');
			var templates = Templates['slide-2'];

			t.html('');
			var i = 0;
			var pre = $('<pre></pre>');
			t.append(pre);
			timeouts.s2 = setInterval(() => {
				pre.append(i++ % 2 === 1 ? 'myVar = el.clientHeight;' : 'el.height = (myVar + 1) + "px"');
				pre.append('\n');
			}, 800);
			yield;

			clearInterval(timeouts.s2);
			t.html(templates[0]);
			yield;

			t.html(marked(templates[1]));
			yield;

		},
		teardown() {
			clearInterval(timeouts.s2);
			$(this).find('.render-here').html('');
		}
	},
	'slide-3': {
		setup() {},
		action: function* () {

			var t = $(this).find('.render-here');
			var templates = Templates['slide-3'];

			t.html(templates.demoApp);
			timeouts.s3 = setInterval(() => {
				console.log('boo');
				$(this).find('.notifications-go-here').prepend($(templates.notification));
			}, 3000);
			yield;
		},
		teardown() {
			clearInterval(timeouts.s3);
			$(this).find('.render-here').html('');
		}
	},
	'slide-4': {
		setup() {},
		action: function* () {

			var t = $(this).find('.render-here');
			var templates = Templates['slide-4'];
			yield;
			t.html(marked(templates.containment));
			yield;
		},
		teardown() {
			clearInterval(timeouts.s3);
			$(this).find('.render-here').html('');
		}
	},
};