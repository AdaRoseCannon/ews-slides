const hogan = require('hogan');
const utils = require('./lib/utils');
const slide = require('./lib/slides');

function goToSlide(i) {
	const newSlide = $(`#slide-${i}`);
	const oldSlide = $('.slide.active').attr('id');
	if (newSlide[0]) {
		$('.slide').removeClass('active');
		$(`#slide-${i}`).addClass('active');
		slide.setup(`slide-${i}`);
		slide.teardown(oldSlide);
	}
}

function goToNextSlide() {
	goToSlide($('.slide.active').prevAll().length + 1);
}

function goToPrevSlide() {
	goToSlide($('.slide.active').prevAll().length - 1);
}

window.addEventListener('keyup', e => {
	switch(e.keyCode) {
		case 37:
			goToPrevSlide();
			break;

		case 13:
		case 39:
			goToNextSlide();
			break;
	}
});

goToSlide(0);

window.goToSlide = goToSlide;
window.goToNextSlide = goToNextSlide;
window.goToPrevSlide = goToPrevSlide;