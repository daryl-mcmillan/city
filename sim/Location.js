export default class Location {
	constructor(name) {
		this.name = name;
		this._entities = [];
	}
	remove( entity ) {
		const last = this._entities.pop();
		if( last._locationIndex !== entity._locationIndex ) {
			last._locationIndex = entity._locationIndex;
			this._entities[last._locationIndex] = last;
		}
	}
	add( entity ) {
		entity._locationIndex = this._entities.length;
		this._entities.push( entity );
	}
	getAll() {
		return this._entities;
	}
}