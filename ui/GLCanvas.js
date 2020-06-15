export default class Canvas {
	constructor(parentElement) {
		parentElement.style.overflow = "hidden";
		const width = parentElement.clientWidth;
		const height = parentElement.clientHeight;
		this._canvas = document.createElement( "canvas" );
		this._canvas.width = width;
		this._canvas.height = height;
		this._canvas.style.width = width;
		this._canvas.style.height = height;
		this._canvas.style.position = "absolute";
		this._canvas.style.left = "0";
		this._canvas.style.top = "0";
		parentElement.style.padding = "0";
		parentElement.style.margin = "0";
		parentElement.appendChild( this._canvas );
		const gl = this._canvas.getContext( "webgl" );
		this._gl = gl;
		//gl.viewport(0, 0, 200, 200);
		const shader = this.createProgram([
			this.createShader( gl.VERTEX_SHADER, `
				attribute vec2 aPosition;
				attribute vec2 aVelocity;
				attribute float aLastUpdate;
				attribute vec3 aColor;

				uniform float uTime;

				varying lowp vec3 vColor;

				void main(void) {
					gl_Position = vec4( aPosition + aVelocity * (uTime - aLastUpdate), 0.0, 120.0 );
					gl_PointSize = 3.0;
					vColor = aColor;
				}
			`),
			this.createShader( gl.FRAGMENT_SHADER, `
				varying lowp vec3 vColor;

				void main(void) {
					gl_FragColor = vec4(vColor, 1.0);
				}
			`)
		]);
		gl.enableVertexAttribArray(shader.getAttribLocation("aPosition"));
		gl.enableVertexAttribArray(shader.getAttribLocation("aVelocity"));
		gl.enableVertexAttribArray(shader.getAttribLocation("aLastUpdate"));
		gl.enableVertexAttribArray(shader.getAttribLocation("aColor"));
		gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

		const buffer = gl.createBuffer();
		var bufferLength = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			0,0, // position
			1,1, // velocity
			0, // update time
			1, 0, 0 // color
		]), gl.DYNAMIC_DRAW);
		bufferLength = 1;
		const startTime = performance.now();
		this._draw = function() {
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			shader.use();
			
			const time = ( performance.now() - startTime ) / 1000;
			gl.uniform1f(shader.getUniformLocation("uTime"), time);

			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.vertexAttribPointer(shader.getAttribLocation("aPosition"), 2, gl.FLOAT, false, 4*8, 0);
			gl.vertexAttribPointer(shader.getAttribLocation("aVelocity"), 2, gl.FLOAT, false, 4*8, 4*2);
			gl.vertexAttribPointer(shader.getAttribLocation("aLastUpdate"), 1, gl.FLOAT, false, 4*8, 4*4);
			gl.vertexAttribPointer(shader.getAttribLocation("aColor"), 3, gl.FLOAT, false, 4*8, 4*5);
			gl.drawArrays(gl.POINTS, 0, bufferLength);
		};
		this._setData = function( dots ) {
			gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
			const data = [];
			bufferLength = 0;
			dots.forEach( dot => {
				data.push( dot.position.x );
				data.push( dot.position.y );
				data.push( dot.velocity.x );
				data.push( dot.velocity.y );
				data.push( dot.lastUpdate );
				data.push( dot.color.r );
				data.push( dot.color.g );
				data.push( dot.color.b );
				bufferLength += 1;
			});
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
		}
	}
	setData( entities ) {
		this._setData( entities );
	}
	dot( x, y, color ) {
	}
	clear() {
		this._draw();
	}
	createShader( type, script ) {
		const shader = this._gl.createShader( type );
		this._gl.shaderSource( shader, script );
		this._gl.compileShader( shader );
		if( !this._gl.getShaderParameter( shader, this._gl.COMPILE_STATUS ) ) {
			throw new Error( "error in shader: " + this._gl.getShaderInfoLog( shader ) );
		}
		return shader;
	}
	createProgram( shaders ) {
		const shaderProgram = this._gl.createProgram();
		for( const shader of shaders ) {
			this._gl.attachShader( shaderProgram, shader );
		}
		this._gl.linkProgram( shaderProgram );
		if( !this._gl.getProgramParameter( shaderProgram, this._gl.LINK_STATUS ) ) {
			throw new Error( "Could not initialise shaders" );
		}
		const gl = this._gl;
		return {
			program: shaderProgram,
			use: function() {
				gl.useProgram( shaderProgram );
			},
			getAttribLocation: function( name ) {
				return gl.getAttribLocation( shaderProgram, name );
			},
			getUniformLocation: function( name ) {
				return gl.getUniformLocation( shaderProgram, name );
			}
		};
	}

}