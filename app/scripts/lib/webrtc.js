
const EventEmitter = require('events').EventEmitter;
const Peer = require('peerjs');
const masterName = 'ada-slides-controller';
let slideClients = [];

var myPeer;
const peerSettings = {
	host: location.hostname,
	path:"/peerjs",
	port: 9000,
	debug: 2
};

function sendData(dataConn, type, data) {
	dataConn.send({
		type: type,
		data: data
	});
}

module.exports = function setup(controller = true) {
	return new Promise((resolve, reject) => {

		myPeer = (controller ? new Peer('ada-slides-controller', peerSettings) : new Peer(peerSettings))
			.on('error', e => {
				if (e.type === "unavailable-id") {
					controller = false;
					myPeer = new Peer(peerSettings)
						.on('error', e => {
							reject(e);
						})
						.on('open', resolve);
				} else {
					reject(e);
				}
			})
			.on('open', resolve);
	}).then(id => {
		if (controller) {
			console.log('You have the power', id);
			document.body.classList.add('controller');
			myPeer.on('connection', dataConn => slideClients.push(dataConn));
			return {
				controller: true,
				requestSlide(i) {
					console.log('Requseting slide', i);
					slideClients.forEach(dc => sendData(dc, 'goToSlide', i));
				},
				on() {}
			};
		} else {
			console.log('You are the slides', id);
			myPeer.connect(masterName);
			myPeer.on('data', data => console.log(data));
			var ev = new EventEmitter();
			return {
				controller: true,
				on: ev.on,
				requestSlide() {}
			};
		}
	});
};