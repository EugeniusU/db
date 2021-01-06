function power(x, n) {
	let base = x;
	
	for (n; n > 1; n--) {
		x = base * x;
	}
	
	return x;
}

const funcs = {power};
module.exports = funcs;
