export default class KeyBindings {
	constructor( element ) {
		this._bindings = {};
		const self = this;
		element.addEventListener('keydown', function(e) {
			const handler = self._bindings[e.code];
			if( handler ) {
				handler.press();
			}
		} );
		element.addEventListener('keyup', function(e) {
			const handler = self._bindings[e.code];
			if( handler ) {
				handler.release();
			}
		} );
	}
	bind( code, handler ) {
		this._bindings[code] = {
			press: handler.press || function () {},
			release: handler.release || function () {}
		};
	}
}