function renderSkybox() {
  gl.useProgram(skyboxProgram.program);

  gl.bindBuffer(gl.ARRAY_BUFFER, cube.coordsBuffer);
  gl.vertexAttribPointer(skyboxProgram.aCoords, 3, gl.FLOAT, false, 0, 0);
  gl.uniformMatrix4fv(skyboxProgram.uModelview, false, flatten(vMatrix));
  gl.uniformMatrix4fv(skyboxProgram.uProjection, false, flatten(pMatrix));
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indexBuffer);

  gl.enableVertexAttribArray(skyboxProgram.aCoords);
  gl.drawElements(gl.TRIANGLES, cube.count, gl.UNSIGNED_SHORT, 0);
}

function createModel(modelData) {
    var model = {};
    model.coordsBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);

    return model;
}

function loadTextureCube(urls) {
  var ct = 0;
  var img = new Array(6);
  var urls = [
     'texture/posx.jpg', 'texture/negx.jpg',
     'texture/posy.jpg', 'texture/negy.jpg',
     'texture/posz.jpg', 'texture/negz.jpg'
  ];
  for (var i = 0; i < 6; i++) {
      img[i] = new Image();
      img[i].onload = function() {
          ct++;
          if (ct == 6) {
              texID = gl.createTexture();
              gl.bindTexture(gl.TEXTURE_CUBE_MAP, texID);
              var targets = [
                 gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                 gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                 gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
              ];
              for (var j = 0; j < 6; j++) {
                  gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
                  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
              }
              gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
              render();
          }
      };
      img[i].src = urls[i];
  }
}

 /**
  * Create a model of a cube, centered at the origin.
  * Found on the internet.
  */
function cube(side) {
   var s = (side || 1) / 2;
   var coords = [];
   var normals = [];
   var texCoords = [];
   var indices = [];
   function face(xyz, nrm) {
      var start = coords.length / 3;
      var i;
      for (i = 0; i < 12; i++) {
         coords.push(xyz[i]);
      }
      for (i = 0; i < 4; i++) {
         normals.push(nrm[0], nrm[1], nrm[2]);
      }
      texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
      indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
   }
   face([-s, -s, s, s, -s, s, s, s, s, -s, s, s], [0, 0, 1]);
   face([-s, -s, -s, -s, s, -s, s, s, -s, s, -s, -s], [0, 0, -1]);
   face([-s, s, -s, -s, s, s, s, s, s, s, s, -s], [0, 1, 0]);
   face([-s, -s, -s, s, -s, -s, s, -s, s, -s, -s, s], [0, -1, 0]);
   face([s, -s, -s, s, s, -s, s, s, s, s, -s, s], [1, 0, 0]);
   face([-s, -s, -s, -s, -s, s, -s, s, s, -s, s, -s], [-1, 0, 0]);
   return {
      vertexPositions: new Float32Array(coords),
      vertexNormals: new Float32Array(normals),
      vertexTextureCoords: new Float32Array(texCoords),
      indices: new Uint16Array(indices)
   };
}
