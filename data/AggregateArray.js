export default class AggregateArray {
	constructor() {
		this._sum = 0;
		this._count = 0;
	}
	push(value) {
		this._sum += value;
		this._count += 1;
		var currentValue = value;
		const self = this;
		return {
			update: function( newValue ) {
				self._sum -= currentValue;
				self._sum += newValue;
				currentValue = newValue;
			},
			get: function() {
				return currentValue;
			}
		};
	}
	sum() {
		return this._sum;
	}
	average() {
		return this._sum / this._count;
	}
}
