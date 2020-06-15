import {sleep} from './lib/misc.js';
import KeyBindings from './ui/KeyBindings.js';
import AggregateArray from './data/AggregateArray.js';
import GameTimer from './sim/GameTimer.js';
import {animate} from './ui/misc.js';
import Map from './sim/Map.js';
import Canvas from './ui/Canvas.js';

const xAxis = new AggregateArray();
const yAxis = new AggregateArray();
function createBinding( axis, value ) {
	const handle = axis.push(0);
	return {
		press: function() { handle.update(value) },
		release: function() { handle.update(0); }
	};
}

const bindings = new KeyBindings( document.body );
bindings.bind( 'KeyW', createBinding( yAxis, 2 ) );
bindings.bind( 'KeyS', createBinding( yAxis, -2 ) );
bindings.bind( 'KeyA', createBinding( xAxis, -2 ) );
bindings.bind( 'KeyD', createBinding( xAxis, 2 ) );

const stepMs = 10;
const timer = new GameTimer( stepMs );

const map = new Map();

const people = [];
for( var i=0; i<5000; i++ ) {
	people.push( {
		lastUpdate: 0,
		position: { x: Math.random() * 100, y: Math.random() * 100 },
		velocity: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }
	} );
}

people.forEach( p => map.add( p ) );

async function entityLoop() {
	for( ;; ) {
		await sleep( 1000 );
		const time = timer.currentTime();
		for( var i=0; i<people.length; i++ ) {
			if( i % 100 === 0 ) {
				sleep(0);
			}
			const p = people[i];
			const dt = time - p.lastUpdate;
			p.lastUpdate = time;
			p.color = "black";
			p.position.x += p.velocity.x * dt;
			p.position.y += p.velocity.y * dt;
			map.update( p );
		}
		const firstPerson = people[0];
		const lookPosition = {
			x: firstPerson.position.x + firstPerson.velocity.x * 2,
			y: firstPerson.position.y + firstPerson.velocity.y * 2
		};
		map.getNearby( lookPosition ).forEach( p => {
			p.color = "red";
		} );
		firstPerson.color = "green";
	}
}

entityLoop();

async function stats() {
	const sampleTime = 10000;
	for( ;; ) {
		await sleep( sampleTime );
		console.log( timer.getStats() );
		console.log( map.getNearby( people[0].position ) );
	}
}

stats();

function box() {
	const b = document.createElement( "div" );
	b.style.borderWidth = "1px";
	b.style.borderStyle = "solid";
	b.style.borderColor = "black";
	b.style.display = "inline-block";
	b.style.position = "absolute";
	b.innerText = "test";
	document.body.appendChild( b );
	return b;
}

async function run() {
	
	const canvas = new Canvas( document.body );

	const targetVelocity = { x: 0, y: 0 };
	const velocity = { x: 0, y: 0 };
	const position = { x: 0, y: 0 };

	animate( t => {
		var time = timer.currentTime();
		canvas.clear();
		for( var i=0; i<people.length; i++ ) {
			const person = people[i];
			const dt = time - person.lastUpdate;
			canvas.dot( person.position.x + person.velocity.x * dt, person.position.y + person.velocity.y * dt, person.color );
		}
		canvas.dot( position.x, position.y, "green" );
		//document.body.innerText = JSON.stringify( position );
	} );

	for( ;; ) {
		const elapsed = await timer.next();
		targetVelocity.x = xAxis.sum();
		targetVelocity.y = yAxis.sum();
		const length = Math.sqrt( targetVelocity.x * targetVelocity.x + targetVelocity.y * targetVelocity.y );
		if( length > 1 ) {
			targetVelocity.x /= length;
			targetVelocity.y /= length;
		}
		velocity.x = 0.9 * velocity.x + 0.1 * targetVelocity.x;
		velocity.y = 0.9 * velocity.y + 0.1 * targetVelocity.y;
		const totalVelocity = Math.sqrt( velocity.x * velocity.x + velocity.y * velocity.y );
		if( totalVelocity > 1 ) {
			velocity.x /= totalVelocity;
			velocity.y /= totalVelocity;
		}
		position.x += velocity.x * elapsed * 10;
		position.y += velocity.y * elapsed * 10;
	}
}

run();
