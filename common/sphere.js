var Sphere = function(radius, latitudeBands, longitudeBands) {
  // Set up vertices, normals and texture coords
  var pointsArray = [];
  var colorsArray = [];
  var normalArray = [];
  var textureCoordData = [];
  for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
    var theta = latNumber * Math.PI / latitudeBands;
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);

    for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
      var phi = longNumber * 2 * Math.PI / longitudeBands;
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);

      var x = cosPhi * sinTheta;
      var y = cosTheta;
      var z = sinPhi * sinTheta;
      var u = 1 - (longNumber / longitudeBands);
      var v = 1 - (latNumber / latitudeBands);

      normalArray.push(vec4(x, y, z, 0.0));
      // normalArray.push(x);
      // normalArray.push(y);
      // normalArray.push(z);
      textureCoordData.push(u);
      textureCoordData.push(v);
      pointsArray.push(vec4(radius * x, radius * y, radius * z, 1.0));
      colorsArray.push(vec4(1.0, 0.0, 0.0, 1.0));
    }
  }

  // Set up indices
  var indexArray = [];
  for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
    for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
      var first = (latNumber * (longitudeBands + 1)) + longNumber;
      var second = first + longitudeBands + 1;
      indexArray.push(first);
      indexArray.push(second);
      indexArray.push(first + 1);

      indexArray.push(second);
      indexArray.push(second + 1);
      indexArray.push(first + 1);
    }
  }

  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  this.normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalArray), gl.STATIC_DRAW);

  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(indexArray), gl.STATIC_DRAW);
  // sphere.indexBuffer.itemSize = 1;
  // sphere.indexBuffer.numItems = indexData.length;

  this.numPoints = pointsArray.length;
  this.numIndices = indexArray.length;
};

function renderSphere() {
  gl.useProgram(reflectiveProgram.program);

  gl.enableVertexAttribArray(reflectiveProgram.vertexLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, sphere.vertexBuffer);
  gl.vertexAttribPointer(reflectiveProgram.vertexLoc, 4, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(reflectiveProgram.normalLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, sphere.normalBuffer);
  gl.vertexAttribPointer(reflectiveProgram.normalLoc, 4, gl.FLOAT, false, 0, 0);

  gl.uniformMatrix4fv(reflectiveProgram.vMatrixLoc, false, flatten(vMatrix));
  gl.uniformMatrix4fv(reflectiveProgram.mMatrixLoc, false, flatten(mat4()));
  gl.uniformMatrix4fv(reflectiveProgram.pMatrixLoc, false, flatten(pMatrix));
  gl.uniform4f(reflectiveProgram.cameraPositionLoc, camera.currentEye[0], camera.currentEye[1], camera.currentEye[2], camera.currentEye[3]);
  gl.uniform1i(reflectiveProgram.materialKeyLoc, materialKey);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.indexBuffer);
  gl.drawElements(gl.TRIANGLES, sphere.numIndices, gl.UNSIGNED_SHORT, 0);
}

