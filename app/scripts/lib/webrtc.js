
const EventEmitter = require('events').EventEmitter;
const Peer = require('peerjs');
const masterName = 'ada-slides-controller';
let slideClients = [];

var myPeer;
const peerSettings = {
	key: 'l9uje6f673zq6w29',
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

		myPeer = (controller ? new Peer(masterName, peerSettings) : new Peer(peerSettings))
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
				triggerRemoteEvent() {
					console.log('Triggering remote interaction event');
					slideClients.forEach(dc => sendData(dc, 'triggerEvent'));
				},
				on() {}
			};
		} else {
			console.log('You are the slides', id);
			var dc = myPeer.connect(masterName);
			var ev = new EventEmitter();
			dc.on('data', data => ev.emit(data.type, data.data));
			return {
				controller: true,
				on: ev.on,
				requestSlide() {},
				triggerRemoteEvent() {}
			};
		}
	});
};