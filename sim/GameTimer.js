import {sleep} from '../lib/misc.js';

export default class GameTimer {
	constructor( stepMilliseconds ) {
		this._stepMs = stepMilliseconds;
		this._currentTime = 0;
		this._lastStart = performance.now();
		this._idleMs = 0;
		this._statsStart = performance.now();
	}
	async next() {
		const sleepTime = this._lastStart + this._stepMs - performance.now();
		if( sleepTime > 0 ) {
			await sleep( sleepTime );
			this._idleMs += sleepTime;
			this._lastStart += this._stepMs;
		} else {
			await sleep( 0 );
			this._lastStart = performance.now();
		}
		this._currentTime += this._stepMs;
		return this._stepMs;
	}
	currentTime() {
		return this._currentTime;
	}
	getStats() {
		const currentTime = performance.now();
		const elapsedMs = currentTime - this._statsStart;
		const stats = {
			idle: this._idleMs / elapsedMs
		};
		this._idleMs = 0;
		this._statsStart = currentTime;
		return stats;
	}
}