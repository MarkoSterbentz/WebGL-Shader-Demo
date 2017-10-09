var RotatingCube = function() {
	var NumVertices  = 36;

	var pointsArray = [];
	var normalsArray = [];
	var colorsArray = [];


	var vertices = [
	  vec4(-0.5, -0.5,  0.5, 1.0),
	  vec4(-0.5,  0.5,  0.5, 1.0),
	  vec4(0.5,  0.5,  0.5, 1.0),
	  vec4(0.5, -0.5,  0.5, 1.0),
	  vec4(-0.5, -0.5, -0.5, 1.0),
	  vec4(-0.5,  0.5, -0.5, 1.0),
	  vec4(0.5,  0.5, -0.5, 1.0),
	  vec4(0.5, -0.5, -0.5, 1.0),
	];

	var vertexColors = [
	  vec4(0.0, 0.0, 0.0, 1.0),  // black
	  vec4(1.0, 0.0, 0.0, 1.0),  // red
	  vec4(1.0, 1.0, 0.0, 1.0),  // yellow
	  vec4(0.0, 1.0, 0.0, 1.0),  // green
	  vec4(0.0, 0.0, 1.0, 1.0),  // blue
	  vec4(1.0, 0.0, 1.0, 1.0),  // magenta
	  vec4(0.0, 1.0, 1.0, 1.0),  // cyan
	  vec4(1.0, 1.0, 1.0, 1.0),   // white
	];

	var lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
	var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
	var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
	var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

	var materialAmbient = vec4(1.0, 1.0, 1.0, 1.0);
	var materialDiffuse = vec4(0.5, 0.5, 0.5, 1.0);
	var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
	var materialShininess = 10.0;

}

function quad(a, b, c, d) {

  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[b]);
  var normal = cross(t1, t2);
  var normal = vec3(normal);
  normal = normalize(normal);

  pointsArray.push(vertices[a]);
  normalsArray.push(normal);
  colorsArray.push(vertexColors[a]);
  pointsArray.push(vertices[b]);
  normalsArray.push(normal);
  colorsArray.push(vertexColors[a]);
  pointsArray.push(vertices[c]);
  normalsArray.push(normal);
  colorsArray.push(vertexColors[a]);
  pointsArray.push(vertices[a]);
  normalsArray.push(normal);
  colorsArray.push(vertexColors[a]);
  pointsArray.push(vertices[c]);
  normalsArray.push(normal);
  colorsArray.push(vertexColors[a]);
  pointsArray.push(vertices[d]);
  normalsArray.push(normal);
  colorsArray.push(vertexColors[a]);
}


function colorCube() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}

function renderRotatingCube() {

  gl.uniformMatrix4fv(gl.getUniformLocation(
    program, "modelViewMatrix"), false, flatten(mvMatrix));

  gl.uniform1i(gl.getUniformLocation(program, "i"),0);
  gl.drawArrays(gl.TRIANGLES, 0, 36);

}