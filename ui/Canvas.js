export default class Canvas {
	constructor(parentElement) {
		parentElement.style.overflow = "hidden";
		this._canvas = document.createElement( "canvas" );
		this._canvas.width = parentElement.clientWidth;
		this._canvas.height = parentElement.clientHeight;
		this._canvas.style.width = parentElement.clientWidth;
		this._canvas.style.height = parentElement.clientHeight;
		this._canvas.style.position = "absolute";
		this._canvas.style.left = "0";
		this._canvas.style.top = "0";
		parentElement.style.padding = "0";
		parentElement.style.margin = "0";
		parentElement.appendChild( this._canvas );
		this._context = this._canvas.getContext( "2d" );
	}
	dot( x, y, color ) {
		this._context.fillStyle = color;
		this._context.fillRect( x*10-5, y*10-5, 10, 10 );
	}
	clear() {
		this._context.clearRect( 0, 0, this._canvas.width, this._canvas.height );
	}
}