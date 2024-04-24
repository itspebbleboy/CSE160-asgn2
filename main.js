// Vertex & Fragment shader source codes
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '}\n';

var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';


var shapesList = [];

// global vars for WebGL context & shader program attributes/uniforms
var gl;
var a_Position;
var u_FragColor;
var canvas;
var u_Size;
var u_ModelMatrix = 0;

function setupWebGL() {
    // Retrieve <canvas> element & get the rendering context for WebGL
    canvas = document.getElementById('webgl');

    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true }); // for performance
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return false;
    }
    return true;
  }
  

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return false;
  }

  // Get the storage locations of a_Position & u_FragColor
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

  if (a_Position < 0 || !u_FragColor) {
    console.log('Failed to get the storage location of a_Position or u_FragColor');
    return false;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return false;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM);

  // Set the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  return true;
}

function renderAllShapes() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    drawTriangle3D([-1.0,0.0,0.0 , -.5,-1.0,0.0 , 0,0.0,0.0]);

    var body = new Cube();
    body.color = [1, 0, 0, 1];
    body.render();
}

var currentSegments = 30;


function main() {
    if (!setupWebGL()) {
        return;
    }
    if (!connectVariablesToGLSL()) {
        return;
    }

    var canvas = document.getElementById('webgl');
    gl.enable(gl.DEPTH_TEST);
    // Initial render call
    renderAllShapes();
}

function clearCanvas() {
    shapesList = []; // Reset the list of shapes
    renderAllShapes(); // Re-render the canvas, which should now be clear
}


main();