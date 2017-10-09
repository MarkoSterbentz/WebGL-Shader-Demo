"use strict";
var gl;

var pMatrix;
var vMatrix;
var nMatrix;

var lineProgram;
var sphereProgram;
var skyboxProgram;
var reflectiveProgram;

var cube;

var axis;
var floor;
var sphere;
var triforce;
var modelToggle;

var materialKey;

var aspect = 1.0;

/*****************************************************************
 * Methods for rendering and animating the program.
 *****************************************************************/
var up = vec3(0.0, 1.0, 0.0);
var at = vec3(0.0, 0.0, 0.0);
var eye = vec3(0.0, 0.0, 10.0);
const fovy = 40.0;
const near = 0.01;
const far = 1000;
function render() {
  resize(canvas);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  pMatrix = perspective(fovy, aspect, near, far);
  vMatrix = lookAt(camera.currentEye, at, up);

  renderSkybox();

  if (modelToggle) {
    renderTriforce();
  } else {
    renderSphere();
  }
}

function tick() {
    requestAnimFrame(tick);
    render();
    animate();
}

var lastTime = 0;
function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
    }
    lastTime = timeNow;
}

/*****************************************************************
 * Method for initializing the program.
 *****************************************************************/
var canvas;
window.onload = function init() {

  canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL isn't available"); }

  gl.viewport(0, 0, canvas.width, canvas.height);
  aspect = canvas.width / canvas.height;

  // Init some GL stuff
  gl.clearColor(0.5, 0.3, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  lineProgram = new LineProgram();
  sphereProgram = new SphereProgram();
  skyboxProgram = new SkyboxProgram();
  reflectiveProgram = new ReflectiveProgram();

  camera = new YawPitchCamera(eye, at);

  floor = new Floor();
  axis = new Axis();
  sphere = new Sphere(1, 20, 20);
  cube = createModel(cube(200));
  triforce = new Triforce();

  modelToggle = true;
  materialKey = 1;

  loadTextureCube();

  initSounds();

  printInstructions();

  // Set up listeners
  canvas.addEventListener('mousemove', mouse_move, false);
  canvas.addEventListener('mousedown', mouse_down, false);
  canvas.addEventListener('mouseup', mouse_up, false);
  document.onkeydown = keyDown;
  canvas.oncontextmenu = function() {return false;};

  tick();

  alert('Push CTRL + SHIFT + J for control instructions.');
};

/*****************************************************************
 * Methods for handling user input (i.e. camera controls)
 *****************************************************************/
var camera;
function mouse_move(event) {
  camera.handleMouseMove(event);
}

function mouse_down(event) {
  camera.handleMouseDown(event);
}

function mouse_up(event) {
  camera.handleMouseUp();
}

function keyDown(e) {
  switch (e.keyCode) {
  case 32:
    // spacebar
    break;
  case 49:
    // 1
    materialKey = 1;
    playShaderChangeSound();
    break;
  case 50:
    // 2
    materialKey = 2;
    playShaderChangeSound();
    break;
  case 51:
    // 3
    materialKey = 3;
    playShaderChangeSound();
    break;
  case 52:
    // 4
    materialKey = 4;
    playShaderChangeSound();
    break;
  case 53:
    // 5
    materialKey = 5;
    playShaderChangeSound();
    break;
  case 54:
    // 6
    materialKey = 6;
    playShaderChangeSound();
    break;
  case 55:
    // 7
    materialKey = 7;
    playShaderChangeSound();
  case 68:
    // d
    toggleSound();
    break;
  case 83:
    // s
    modelToggle = !modelToggle;
    break;
  default:
    // To see what the code for a certain key is, uncomment this line,
    // reload the page in the browser and press the key.
    //console.log("Unrecognized key press: " + e.keyCode);
    break;
  }
  requestAnimFrame(render);
}
/*****************************************************************
 * Methods for matrix stack manipulation.
 *****************************************************************/
var matrixStack = new Array();

function pushMatrix() {
  matrixStack.push(mat4(vMatrix));
}

function popMatrix() {
  vMatrix = matrixStack.pop();
}

/*****************************************************************
 * Methods for creating shader programs.
 *****************************************************************/
var LineProgram = function() {
  this.program = initShaders(gl, 'line-vshader', 'line-fshader');
  gl.useProgram(this.program);

  this.vertexLoc = gl.getAttribLocation(this.program, 'vPosition');
  this.colorLoc = gl.getAttribLocation(this.program, 'vColor');

  this.vMatrixLoc = gl.getUniformLocation(this.program, 'mvMatrix');
  this.pMatrixLoc = gl.getUniformLocation(this.program, 'pMatrix');
  this.nMatrixLoc = gl.getUniformLocation(this.program, 'nMatrix');
};

var SphereProgram = function() {
  this.program = initShaders(gl, 'sphere-vshader', 'sphere-fshader');
  gl.useProgram(this.program);

  this.vertexLoc = gl.getAttribLocation(this.program, 'vPosition');
  this.normalLoc = gl.getAttribLocation(this.program, 'vNormal');
  this.colorLoc = gl.getAttribLocation(this.program, 'vColor');

  this.vMatrixLoc = gl.getUniformLocation(this.program, 'mvMatrix');
  this.pMatrixLoc = gl.getUniformLocation(this.program, 'pMatrix');
  this.nMatrixLoc = gl.getUniformLocation(this.program, 'nMatrix');
};

var SkyboxProgram = function() {
  this.program = initShaders(gl, 'skybox-vshader', 'skybox-fshader');
  gl.useProgram(this.program);

  this.aCoords = gl.getAttribLocation(this.program, 'coords');

  this.uModelview = gl.getUniformLocation(this.program, 'mvMatrix');
  this.uProjection = gl.getUniformLocation(this.program, 'pMatrix');
};

var ReflectiveProgram = function() {
  this.program = initShaders(gl, 'reflection-vshader', 'reflection-fshader');
  gl.useProgram(this.program);

  this.vertexLoc = gl.getAttribLocation(this.program, 'vPosition');
  this.normalLoc = gl.getAttribLocation(this.program, 'vNormal');

  this.mMatrixLoc = gl.getUniformLocation(this.program, 'mMatrix');
  this.vMatrixLoc = gl.getUniformLocation(this.program, 'vMatrix');
  this.pMatrixLoc = gl.getUniformLocation(this.program, 'pMatrix');
  this.cameraPositionLoc = gl.getUniformLocation(this.program, 'cameraPosition');
  this.materialKeyLoc = gl.getUniformLocation(this.program, 'materialKey');
};

/*****************************************************************
 * Method for dynamically resizing the canvas to the window size.
 *****************************************************************/
function resize(canvas) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width != displayWidth ||
      canvas.height != displayHeight) {

    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = canvas.width / canvas.height;
  }
}

/*****************************************************************
 * Methods for handling sound effects.
 *****************************************************************/
var music;
var shaderChangeSound;
var soundActive;
function initSounds() {
  soundActive = true;
  // Initialize music
  music = new Audio('resources/lostWoods.mp3');
  music.volume = 0.5;
  music.loop = true;
  music.play();

  // Initialize sound effects
  shaderChangeSound = new Audio('resources/itemGet.mp3');
  shaderChangeSound.volume = 0.5;
}

function playShaderChangeSound() {
  if(soundActive) {
    shaderChangeSound.currentTime = 0.3;
    shaderChangeSound.play();
  }
}


function toggleSound() {
  soundActive = !soundActive;
  shaderChangeSound.currentTime = shaderChangeSound.duration;
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}
/*****************************************************************
 * Method for printing out instructions for the user.
 *****************************************************************/
function printInstructions() {
  console.log('Key Presses:\ns - Switch model\nd - Toggle sound on/off\n1 - Load gold reflective material\n2 - Load mirror / steel material\n3 - Load glass material\n4 - Load good material of the north\n5 - Load only specular lit material\n6 - Load only specular lit material with reflection\n7 - Load special glitchy material\n \nMouse Controls:\nLeft Click and Drag - Rotate world\nRight Click and Drag - Adjust zoom distance');
}
