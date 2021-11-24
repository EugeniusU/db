
const sqlite3 = require('sqlite3').verbose();

function open() {
	let db = new sqlite3.Database('./one.db', (err) => {
		if (err) {
			throw err;
		}
///		console.log('Connecting');
	});
	return db;
}
			
function close() {
	db.close(err => {
		if (err) {
			throw err;
		}
///		console.log('closed');
	});
}

function apply(sql) {
	db = open();
	db.run(sql, err => {
		if (err) {
			throw err;
		}
///		console.log('apply');
		pre();
	});

	function pre() {
		close();
///		console.log('all done');
	}
}

function insert(obj) {
	let data = JSON.stringify(obj);
	let inst = `INSERT INTO test VALUES(null, '${data}')`;
	apply(inst);
}

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
///		console.log('all done');
	}
	
}

function del(obj) {
	let sql3 = `DELETE FROM test WHERE id = ${obj.id}`;
	
	db = open();
	
	db.run(sql3, (err) => {
		if (err) {
			throw err;
		}

		console.log('deleted');
		pre();
	});
	
	function pre() {
		close();
		console.log('all done');
	}
}

module.exports = {open, close, apply, insert, show, del};
