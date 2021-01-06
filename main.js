const http = require('http');
const funcs = require('./funcs.js');
const sqlite3 = require('sqlite3').verbose();

const power = funcs.power;

let db = open();

function open() {
let db = new sqlite3.Database('./test5.db', (err) => {		// change from test4 to 5
	if (err) {
		throw err;
	}
	console.log('Connecting');
});
return db;
}

let sql = `CREATE TABLE IF NOT EXISTS num(id INTEGER PRIMARY KEY AUTOINCREMENT, 
				    name INTEGER, base INTEGER, power INTEGER, value INTEGER)`;
            
db.run(sql, (err) => {
		if (err) {
			throw err;
		}
		console.log('table created or already was');
}); 

function close() {
db.close(err => {
	if (err) {
		throw err;
	}
	console.log('closed');
});
}

function apply(sql) {
	db = open();
	db.run(sql, err => {
		if (err) {
			throw err;
		}
		console.log('apply');
		pre();
	});
	function pre() {
		close();
		console.log('all done');
	}
}

function insert(obj) {
	let inst = `INSERT INTO NUM VALUES(null, '${obj.name}', ${obj.base}, ${obj.power}, ${obj.value})`;
	apply(inst);
}

const Websocket = require('websocket').server;

const server = http.createServer((req, res) => {
	res.wrireHead(200);
	res.end();
});

server.listen(8000, () => {
	console.log('Listen port 8000');
});

const ws = new Websocket({
	httpServer: server,
	autoAcceptConnections: false
});

const clients = [];

ws.on('request', req => {
	const connection = req.accept('', req.origin);
	clients.push(connection);
	console.log('Connected ' + connection.remoteAddress);
	connection.on('message', message => {
		const dataName = message.type + 'Data';
		const data = message[dataName];
		console.dir(message);
		console.log('Received: ' + data);
		clients.forEach(client => {
//			if (connection !== client) {
			if (connection === client) {
//				let objReady = pre(data);
///				client.send(data);
				let j = JSON.parse(data);

//				if (JSON.parse(data).value != 'show') {
				if (j.value != 'show') {
				let objReady = pre(data);
				
				insert(objReady);
				
				objReady = JSON.stringify(objReady);
				client.send(objReady);
				} else {
///					show(sql2, (array) => {console.log(array); close()});
					show(sql2, (array) => {client.send(JSON.stringify(array)); close()});
				}
			}
		});
	});
	connection.on('close', (reasonCode, description) => {
		console.log('Disconnected: ' + connection.remoteAddress);
		console.dir({reasonCode, description});
	});
});

function pre(obj) {
	obj = JSON.parse(obj);
	let v = power(obj.base, obj.power);
	obj.value = v;
	return obj;
}

let sql2 = `SELECT * FROM num`;

function show(sql, callback) {
	db = open();
	let array = [];
	db.all(sql, [], (err, data) => {
		if (err) {
			throw err;
		}
		data.forEach(str => {
			array.push(str);
		});
		
		callback(array, pre);
	});
	
	function pre() {
		close();
		console.log('all done');
	}
}

///show(sql2, (array) => {console.log(array); close()});	// fine
