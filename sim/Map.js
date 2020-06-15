import Location from './Location.js'

export default class Map {
	constructor() {
		this._locations = {};
	}
	getLocation( position ) {
		const row = Math.floor( position.y / 10 );
		const col = Math.floor( position.x / 10 );
		var locationRow = this._locations[ row ];
		if( !locationRow ) {
			locationRow = {};
			this._locations[ row ] = locationRow;
		}
		var location = locationRow[ col ];
		if( !location ) {
			location = new Location( row + "," + col );
			locationRow[ col ] = location;
		}
		return location;
	}
	getNearby( position ) {
		return this.getLocation( position ).getAll();
	}
	update( entity ) {
		const newLocation = this.getLocation( entity.position );
		if( newLocation !== entity._mapLocation ) {
			entity._mapLocation.remove( entity );
			newLocation.add( entity );
			entity._mapLocation = newLocation;
		}
	}
	add( entity ) {
		var location = this.getLocation( entity.position );
		entity._mapLocation = location;
		location.add( entity );
	}
	remove( entity ) {
		entity._mapLocation.remove( entity );
	}
}