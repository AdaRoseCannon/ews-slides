const hogan = require('hogan');
const utils = require('./lib/utils');

function goToSlide(i) {
	$('.slide').removeClass('active');
	$(`#slide-${i}`).addClass('active');
}

window.goToSlide = goToSlide;