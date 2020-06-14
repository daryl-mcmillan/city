import {sleep} from './lib/misc.js';
import KeyBindings from './ui/KeyBindings.js';
import AggregateArray from './data/AggregateArray.js';
import GameTimer from './sim/GameTimer.js';
import {animate} from './ui/misc.js';

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

async function stats() {
	const sampleTime = 10000;
	for( ;; ) {
		await sleep( sampleTime );
		console.log( timer.getStats() );
	}
}

stats();

async function run() {
	const direction = { x: 0, y: 0 };
	const velocity = { x: 0, y: 0 };
	const position = { x: 0, y: 0 };

	const box = document.createElement( "div" );
	box.style.borderWidth = "1px";
	box.style.borderStyle = "solid";
	box.style.borderColor = "black";
	box.style.display = "inline-block";
	box.style.position = "absolute";
	box.innerText = "test";
	document.body.appendChild( box );
	animate( t => {
		box.style.left = (500 + position.x * 100) + "px";
		box.style.top = (500 - position.y * 100) + "px";
		//document.body.innerText = JSON.stringify( position );
	} );

	for( ;; ) {
		const elapsed = await timer.next();
		direction.x = xAxis.sum();
		direction.y = yAxis.sum();
		const length = Math.sqrt( direction.x * direction.x + direction.y * direction.y );
		if( length > 1 ) {
			direction.x /= length;
			direction.y /= length;
		}
		velocity.x = 0.9 * velocity.x + 0.1 * direction.x;
		velocity.y = 0.9 * velocity.y + 0.1 * direction.y;
		const totalVelocity = Math.sqrt( velocity.x * velocity.x + velocity.y * velocity.y );
		if( totalVelocity > 1 ) {
			velocity.x /= totalVelocity;
			velocity.y /= totalVelocity;
		}
		position.x += velocity.x * elapsed / 1000;
		position.y += velocity.y * elapsed / 1000;
	}
}

run();
