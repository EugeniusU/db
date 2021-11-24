
class Queue {
	constructor() {
		this.node = null;
		this.length = 0;
	}
	
	push(value) {
		this.node = {prev: this.node, value: value};
		this.length++;
	}
	
	pick() {
		if (!this.node) {
			return null;
		} else {
			let value = this.node.value;
			this.node = this.node.prev;
			this.length--;
			
			return value;
		}
	}
	
}

module.exports = Queue;
