const slide = require('./lib/slides');
const Hammer = require('hammerjs');
const webrtc = require('./lib/webrtc');
let requestSlide = (() => {});
webrtc().then(d => requestSlide = d.requestSlide, err => {
	console.error('Failure to connect to webrtc', err)
});

function goToSlide(i) {
	const newSlide = $(`#slide-${i}`);
	const oldSlide = $('.slide.active').attr('id');
	if (newSlide[0]) {
		$('.slide').removeClass('active');
		$(`#slide-${i}`).addClass('active');
		slide.setup(`slide-${i}`);
		slide.teardown(oldSlide);
		requestSlide(i);
	}
}

function goToNextSlide() {
	goToSlide($('.slide.active').prevAll().length + 1);
}

function goToPrevSlide() {
	goToSlide($('.slide.active').prevAll().length - 1);
}

function triggerEvent() {
	if(slide.triggerEvent.next().done) {
		goToNextSlide();
	}
}

window.addEventListener('keyup', e => {
	switch(e.keyCode) {
		case 37:
			goToPrevSlide();
			break;

		case 13:
		case 39:
			triggerEvent();
			break;
	}
});

var touches = new Hammer($('.slide-container')[0]);
touches.set({ direction: Hammer.DIRECTION_HORIZONTAL });
touches.on('swipeleft', goToNextSlide);
touches.on('swiperight', goToPrevSlide);
$('.next-button').on('click', goToNextSlide);
$('.prev-button').on('click', goToPrevSlide);
$('.slide-container').on('click', triggerEvent);
goToSlide(0);