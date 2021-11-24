const events = require('events');
const fs = require('fs');
const http = require('http');
const WebSocket = require('websocket').server;

const Queue = require('./queue2');
const funcs = require('./db');

const open = funcs.open;
const insert = funcs.insert;
const show = funcs.show;

const ee = new events.EventEmitter();

const list = new Queue();
let intervalId = null;

ee.on('applyToList', applyToList.bind(null, list));

let db = open();

let createDB = `CREATE TABLE IF NOT EXISTS test
(id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT)`;

let selectFromDB = `SELECT * FROM test`;

db.run(createDB, (err) => {
	if (err) {
		throw err;
	}

	console.log('table created or already was');
});

const server = http.createServer((req, res) => {
	res.writeHead(200);
	res.end();
});

server.listen(8000, () => {
	console.log('listening port', 8000);
});

const ws = new WebSocket({
	httpServer: server,
	autoAcceptConnections: false
});

const clients = [];

ws.on('request', req => {
	const connection = req.accept('', req.origin);
	clients.push(connection);
	console.log('connected ' + connection.remoteAddress);
	connection.on('message', message => {
		const dataName = message.type + 'Data';
		const data = message[dataName];
		let obj = JSON.parse(data);
		
		console.log(obj);
		
		ee.emit('applyToList', obj);
	});
	
	console.log(clients.length);
	
	connection.on('close', (reasonCode, description) => {
///		show(selectFromDB, array => console.log(array));
		console.log('connection close');
	});
});

function slowInsert(list) {
	let interval = setInterval(() => {
		let value = list.pick();
		
		if (!value) {
			console.log('free,', 'list length is', list.length);
			clearInterval(interval);
			intervalId = null;
			
			show(selectFromDB, array => console.log(array));
		} else {
			insert(value);
		}
		
		console.log('buzy', list.length);
	}, 100);
	
	return interval;
}

function applyToList(list, obj) {
	list.push(obj);
	
	if (!intervalId) {
		intervalId = slowInsert(list);
	} else {
		console.log('busy for', list.length * 100, 'ms');
	}
}
