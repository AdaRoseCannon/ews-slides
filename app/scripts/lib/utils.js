module.exports.randomFrom = function(array) {
	return array[(Math.floor(Math.random() * array.length))];
};

module.exports.animateHeightChange = function animateHeightChange(f, el, children, options, callback) {

	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	let dBefore = el.getBoundingClientRect();
	children.forEach(c => $(c).data('old', c.getBoundingClientRect()));
	f();

	let dAfter = el.getBoundingClientRect();
	var scaleChange = {
		width: dAfter.width/dBefore.width,
		height: dAfter.height/dBefore.height
	};

	children.forEach(c => {

		// Ignore elements removed from the dom
		if (!c.parentElement) {
			return;
		}
		let oldPos = $(c).data('old');
		let newPos = c.getBoundingClientRect();
		let cDiffs = {
			top: (oldPos.top - dBefore.top) * (scaleChange.height - 1) + (oldPos.top - newPos.top),
			left: (oldPos.left - dBefore.left) * (scaleChange.width - 1) + (oldPos.left - newPos.left)
		};
		$(c).data('old', null);
		c.style.transformOrigin = "0 0 0";
		c.style.transition = "0s";
		c.style.transform = `scale(${scaleChange.width}, ${scaleChange.height}) translate(${cDiffs.left}px, ${cDiffs.top}px)`;
	});

	let oldStyle = window.getComputedStyle(el);
	let oldStyleTransform = oldStyle.transform;
	let oldStyleTransition = oldStyle.transition;
	el.style.transformOrigin = "0 0 0";
	el.style.transition = "0s";
	el.style.transform = `${oldStyleTransform} scale(${1/scaleChange.width}, ${1/scaleChange.height})`;
	el.style.overflow = "hidden";

	function postTransition() {
		el.style.transition = oldStyleTransition;
		el.style.transform = oldStyleTransform;

		if (callback) {
			$(el).one("transitionend", () => {
				callback();
			});
		}

		children.forEach(c => {
			c.style.transition = oldStyleTransition;
			c.style.transform = 'scale(1, 1)';
		});
		$(el).off("transitionend", postTransition);
	}

	$(el).on("transitionend", postTransition);
	setTimeout(postTransition, 32);
};
