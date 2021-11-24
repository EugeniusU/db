const events = require('events');
const WebSocket = require('websocket').client;

const ee = new events.EventEmitter();
ee.on('connected', test.bind(null, 100));

const ws = new WebSocket();
ws.connect('ws://localhost:8000');

ws.on('connect', connection => {
	console.log('opening');
	
	ee.emit('connected', connection);
});

function test(i, connection) {
	console.log(i);
	
	let interval = setInterval(() => {
		if (i == 0) {
			clearInterval(interval);
			connection.close();
		} else {
		
			i--;
			connection.send(JSON.stringify({data: i}));
		}
	}, 10);
}
