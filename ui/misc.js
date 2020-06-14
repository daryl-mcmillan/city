export function animate( drawfunc ) {
	var startTime;
	const repeat = function( t ) {
		const frameTime = t - startTime;
		drawfunc( frameTime );
		requestAnimationFrame( repeat );
	};
	requestAnimationFrame( t => {
		startTime = t;
		drawfunc( 0 );
		requestAnimationFrame( repeat );
	} );
}