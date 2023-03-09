function initWebGL(canvas) {
	gl = null;
	try { // Попытаться получить стандартный контекст.
// Если не получится, попробовать получить экспериментальный.
		gl =  canvas.getContext("webgl2")  || canvas.getContext("webgl") || canvas.getContext("experimentalwebgl");
	}
	catch(e) {
		console.log(e.toString())
	}
// Если мы не получили контекст GL, завершить работу
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
		gl = null;
	}
	//canvas.width = window.innerWidth
	//canvas.height = window.innerHeight
	return gl;
}

const vsSource =
	[
		'precision mediump float;',
		'',
		'attribute vec2 vertPosition;',
		'attribute vec3 vertColor;',
		'varying vec3 fragColor;',
		'',
		'void main()',
		'{',
		'  fragColor = vertColor;',
		'  gl_Position = vec4(vertPosition, 0.0, 1.0);',
		'}'
	].join('\n');

const fsSource =
	[
		'precision mediump float;',
		'',
		'varying vec3 fragColor;',
		'void main()',
		'{',
		'  gl_FragColor = vec4(fragColor, 1.0);',
		'}'
	].join('\n');


function loadShader(gl, type, source) {
	const shader = gl.createShader(type);
// Send the source to the shader object
	gl.shaderSource(shader, source);
// Compile the shader program
	gl.compileShader(shader);
// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}


function initShaderProgram(gl, vsSource, fsSource) {

	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}
	return shaderProgram;
}


canva = document.getElementById("triangleCanvas")
initWebGL(canva)
if (gl) { // продолжать только если WebGL доступен и работает
// Устанавливаем размер вьюпорта
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
// установить в качестве цвета очистки буфера цвета черный, полная непрозрачность
	gl.clearColor(0.5, 0.5, .5, 1);
// включает использование буфера глубины
	gl.enable(gl.DEPTH_TEST);
// определяет работу буфера глубины: более ближние объекты перекрывают дальние
	gl.depthFunc(gl.LEQUAL);
// очистить буфер цвета и буфер глубины
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
}


function initBuffersPolygon()
{
	let triangleVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVerticesBuffer);

	let vertices =
		[
			0.0, 0.0, 0.0,  1.0, 0.0, 0.0,
			-0.6, -0.1, 0.0, 1.0, 0.0, 0.0,
			0.0, -0.5, 0.0, 1.0, 0.0, 0.0,
			-0.35, 0.5, 0.0, 1.0, 0.0, 0.0 ,
			0.35, 0.5, 0.0, 1.0, 0.0, 0.0 ,
			0.6, -0.1, 0.0, 1.0, 0.0, 0.0 ,
			0.0, -0.5, 0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
		];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function initBuffersSquare() {
	let squareVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
	let vertices = [
		-0.5, 0.5,
		0.5, 0.5,
		-0.5, -0.5,
		0.5, 0.5,
		-0.5, -0.5,
		0.5, -0.5,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	gl.vertexAttribPointer(vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
	let colors = [
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
	];
	let colorsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.vertexAttribPointer(vertColorAttribute, 3, gl.FLOAT, false, 0, 0);

}

const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
initBuffersPolygon()
let vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertPosition");
let vertColorAttribute = gl.getAttribLocation(shaderProgram, "vertColor");
gl.enableVertexAttribArray(vertexPositionAttribute);
gl.enableVertexAttribArray(vertColorAttribute);
gl.useProgram(shaderProgram);
drawScenePolygon()

function drawScenePolygon() {
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 6*Float32Array.BYTES_PER_ELEMENT, 0);
	gl.vertexAttribPointer(vertColorAttribute, 3, gl.FLOAT, false, 6*Float32Array.BYTES_PER_ELEMENT, 3*Float32Array.BYTES_PER_ELEMENT);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 100);
}


//ПОВТОР ДЛЯ КВАДРАТА

canva = document.getElementById("squareCanvas")
initWebGL(canva)
if (gl) { // продолжать только если WebGL доступен и работает
// Устанавливаем размер вьюпорта
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
// установить в качестве цвета очистки буфера цвета черный, полная непрозрачность
	gl.clearColor(0.5, 0.5, .5, 1);
// включает использование буфера глубины
	gl.enable(gl.DEPTH_TEST);
// определяет работу буфера глубины: более ближние объекты перекрывают дальние
	gl.depthFunc(gl.LEQUAL);
// очистить буфер цвета и буфер глубины
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
}


const shaderProgramSquare = initShaderProgram(gl, vsSource, fsSource);
initBuffersSquare()
vertexPositionAttribute = gl.getAttribLocation(shaderProgramSquare, "vertPosition");
vertColorAttribute = gl.getAttribLocation(shaderProgramSquare, "vertColor");
gl.enableVertexAttribArray(vertexPositionAttribute);
gl.enableVertexAttribArray(vertColorAttribute);
gl.useProgram(shaderProgramSquare);
gl.drawArrays(gl.TRIANGLES, 0, 6);