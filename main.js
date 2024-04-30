// Vertex & Fragment shader source codes
var VSHADER_SOURCE = `
attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`;

var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

// global vars for WebGL context & shader program attributes/uniforms
let gl;
let canvas;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let g_rotateMatrix 
//html ui related global vars
var g_globalAngle = 0;
var g_animate = false;
//animation related global vars
var g_time = Date.now();
var g_head_r = 90;
var g_arm_r1 = 0;
var g_arm_r2 = 358; 

var tail_1 = 318;
var tail_2 = 358;
var tail_3 = 169;
//joint vars
var j_tail1 = 0;
var j_tail2 = 0;

//Objs
let brown = [.4, .2, .03, 1];
let lightBrown = [.85, .7,.5,1];
let bodyady;
let body;
let tummy;
let arms; 
let leftArm;
let cyl;

var m = new Matrix4();
let monkey = new Matrix4();
let monkey_head = new Matrix4();
let ear_right; let inner_ear_right;
let ear_left; let inner_ear_left;
let face;
let head;
function main() {
  if (!setupWebGL()) {
      return;
  }
  if (!connectVariablesToGLSL()) {
      return;
  }
  actionsForHTMLUI();
  var canvas = document.getElementById('webgl');

  canvas.onmousemove = function (ev){if(ev.buttons == 1)click(ev);}
  gl.enable(gl.DEPTH_TEST);
  gl.clearDepth(1.0);
  

  function initGeometry(){// note: apply transformations in reverse order for multiplication
    ear_right = new Cylinder(10);
    ear_left = new Cylinder(10);
    inner_ear_right = new Cylinder(10);
    inner_ear_left = new Cylinder(10);
    
    right = new Cylinder(7);
    left = new Cylinder(7);
    lower_right = new Cylinder(7);
    lower_left = new Cylinder(7);
    monkey_head = new Matrix4();
    head = new Dodecahedron();
    face = new Dodecahedron();
    body = new Cylinder(15);
    tummy = new Dodecahedron();
    right_hand = new Dodecahedron();
    left_hand = new Dodecahedron();
    head.color = brown;
    ear_right.color = brown;
    ear_left.color = brown;
    inner_ear_right.color = lightBrown;
    inner_ear_left.color = lightBrown;
    face.color = lightBrown;
    tummy.color = lightBrown;
    body.color=brown;
    right.color = brown;
    left.color = brown;
    lower_right.color = brown;
    lower_left.color = brown;
    right_hand.color = lightBrown;
    left_hand.color = lightBrown;
    
    right_foot = new Dodecahedron();
    left_foot = new Dodecahedron();
    right_leg = new Cylinder(7);
    left_leg = new Cylinder(7);

    right_foot.color = brown;
    right_leg.color = brown;
    left_foot.color = brown;
    left_leg.color = brown;
    right_leg.matrix = new Matrix4(monkey).translate(0,-.8,0);
    left_leg.matrix = new Matrix4(right_leg.matrix).translate(-.2,0,0).rotate(-10,0,0,1);
    right_leg.matrix.translate(.2,0,0);

    right_leg.matrix.rotate(10,0,0,1);
    right_foot.matrix = new Matrix4(right_leg.matrix);
    left_foot.matrix = new Matrix4(left_leg.matrix);
    right_leg.matrix.scale(.2,.5,.2);
    left_leg.matrix.scale(.2,.5,.2);
    right_foot.matrix.translate(.1,0,0).scale(.12,.06,.15);
    left_foot.matrix.translate(-.1,0,0).scale(.12,.06,.15);

    bodyady = new Matrix4(monkey);
    monkey_head = new Matrix4(monkey).translate(0,-.27,0).scale(1,1,1);
    arms = new Matrix4(monkey).translate(0,0,0).rotate(65,1,0,0).scale(1,-1,1); //usually 60
    right.matrix = new Matrix4(arms).translate(.25,0,0).rotate(tail_1,0,0,1);
    left.matrix = new Matrix4(arms).translate(-.25,0,0).rotate(-tail_1,0,0,1);
    lower_right.matrix = new Matrix4(right.matrix).translate(0,.4,0).rotate(203,1,0,0).rotate(tail_2,0,0,1).scale(.3,-.4,.3);
    lower_left.matrix = new Matrix4(left.matrix).translate(0,.4,0).rotate(203,1,0,0).rotate(-tail_2,0,0,1).scale(.3,-.4,.3);

    right_hand.matrix = new Matrix4(lower_right.matrix).translate(0,.9,0).rotate(tail_3,0,0,1).scale(.23,.3,.23);
    left_hand.matrix = new Matrix4(lower_left.matrix).translate(0,.9,0).rotate(-tail_3,0,0,1).scale(.23,.3,.23);
    
    right.matrix.scale(.3,.5,.3);
    left.matrix.scale(.3,.5,.3);
    body.matrix = new Matrix4(bodyady);
    body.matrix = new Matrix4(monkey).translate(0,-.15,-.1)
    tummy.matrix = new Matrix4(monkey).translate(0,-.25,-.11).scale(.15,.15,.07).rotate(30,1,0,0);
    body.matrix.rotate(90,1,0,0).scale(.8,.25,1);
    ear_right.matrix = new Matrix4(monkey_head).translate(.5,.85,-.1).rotate(90,1,0,0).scale(.5,.15,.5);
    ear_left.matrix = new Matrix4(monkey_head).translate(-.5,.85,-.1).rotate(90,1,0,0).scale(.5,.15,.5);
    head.matrix = new Matrix4(monkey_head).translate(0,.75,0).scale(.25,.25,.23);
    face.matrix = new Matrix4(head.matrix).translate(0,0,-.7).scale(.8,.8,.7);
    inner_ear_right.matrix = new Matrix4(ear_right.matrix).translate(0,-.1,0).scale(.7,.7,.7);
    inner_ear_left.matrix = new Matrix4(ear_left.matrix).translate(0,-.1,0).scale(.7,.7,.7);
  }

  function renderScene() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    g_rotateMatrix = new Matrix4().rotate(g_globalAngle,0,1,0);
    //g_rotateMatrix = new Matrix4().rotate(g_globalAngle,1,0,0);
    //g_rotateMatrix = new Matrix4().rotate(g_globalAngle,0,0,1);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, g_rotateMatrix.elements);
    ear_right.render();
    ear_left.render();
    inner_ear_right.render();
    inner_ear_left.render();
    head.render();
    face.render();
    body.render();
    tummy.render();
    right.render();
    left.render();
    lower_right.render();
    lower_left.render();
    right_hand.render();
    left_hand.render();
    right_leg.render();
    left_leg.render();
    right_foot.render();
    left_foot.render();
  }

  var tick = function(){
    let startTime = performance.now();
    if(!g_animate){return;}

    var now = Date.now();
    var elapsed = now - g_time;// in milliseconds
    g_time = now;
    
    updateAnimationAngles(now);
    
    renderScene();
    requestAnimationFrame(tick);// req that the browser calls tick
    let duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "fps");
  };
  function updateSliderAngles(){
    
  }
  function updateAnimationAngles(now){
    
    var angle_step = oscillation(95,85, 1000, now) - g_head_r;
    g_head_r +=angle_step;
    monkey_head.rotate(angle_step, 0, 0, 1);
    angle_step = oscillation(600, 274, 500, now) - g_arm_r1;
    g_arm_r1+= angle_step;
    right.matrix = new Matrix4(arms).translate(.25,0,0).rotate(324,0,0,1);
    left.matrix = new Matrix4(arms).translate(-.25,0,0).rotate(-324,0,0,1);
    right.matrix.rotate(angle_step,0,0,1);
    left.matrix.rotate(-angle_step,0,0,1);
    
    angle_step = oscillation(360, 274, 500, now) - g_arm_r2;
    lower_right.matrix = new Matrix4(right.matrix).translate(0,.4,0).rotate(203,1,0,0).rotate(358,0,0,1);
    lower_left.matrix = new Matrix4(left.matrix).translate(0,.4,0).rotate(203,1,0,0).rotate(-358,0,0,1);
    lower_right.matrix.rotate(angle_step,0,0,1);
    lower_left.matrix.rotate(-angle_step,0,0,1);
    lower_right.matrix.scale(.3,-.4,.3);
    lower_left.matrix.scale(.3,-.4,.3);
    right_hand.matrix = new Matrix4(lower_right.matrix).translate(0,.9,0).rotate(150,0,0,1).scale(.23,.3,.23);
    left_hand.matrix = new Matrix4(lower_left.matrix).translate(0,.9,0).rotate(-150,0,0,1).scale(.23,.3,.23);


    ear_right.matrix = new Matrix4(monkey_head).translate(.5,.85,-.1).rotate(90,1,0,0).scale(.5,.15,.5);
    ear_left.matrix = new Matrix4(monkey_head).translate(-.5,.85,-.1).rotate(90,1,0,0).scale(.5,.15,.5);
    head.matrix = new Matrix4(monkey_head).translate(0,.75,0).scale(.25,.25,.23);
    face.matrix = new Matrix4(head.matrix).translate(0,0,-.7).scale(.85,.8,.7);
    inner_ear_right.matrix = new Matrix4(ear_right.matrix).translate(0,-.1,0).scale(.7,.7,.7);
    inner_ear_left.matrix = new Matrix4(ear_left.matrix).translate(0,-.1,0).scale(.7,.7,.7);
    
    right.matrix.scale(.3,.5,.3);
    left.matrix.scale(.3,.5,.3);
    

    //cubeA.matrix.rotate(newAngle, 1, 0, 0);
    //cubeB.matrix.rotate(newAngle, 1, 0, 0);
    //cubeA.matrix.rotate(newAngle, 0, 1, 0);
    //cubeB.matrix.rotate(newAngle, 0, 1, 0);
  }
  // init render call
  initGeometry();
  renderScene();

  function actionsForHTMLUI(){
    document.getElementById('angleSlider').addEventListener('input', function() {g_globalAngle = this.value; renderScene();});
    document.getElementById('anim').addEventListener('mousedown', function() {g_animate = !g_animate; initGeometry(); tick();});
    
    document.getElementById('tail_1').addEventListener('input', function() {tail_1 = this.value; initGeometry(); renderScene()});
    document.getElementById('tail_2').addEventListener('input', function() {tail_2 = this.value; initGeometry(); renderScene()});
    document.getElementById('tail_3').addEventListener('input', function() {tail_3 = this.value; initGeometry(); renderScene()});
  }

  tick();
}

function oscillation(high, low, freq, now){
  var amplitude = (high - low) / 2;
  var middle = low + amplitude;
  return middle + amplitude * Math.sin(now/freq);
}
function clearCanvas() {
    renderScene(); // Re-render the canvas, which should now be clear
}


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
  // init shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return false;
  }

  // get storage locations of a_Position & u_FragColor
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
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) { 
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return false;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  // Set the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  return true;
}


main();


