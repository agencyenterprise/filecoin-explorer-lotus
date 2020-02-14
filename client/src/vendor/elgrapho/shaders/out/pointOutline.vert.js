module.exports = `//#version 300 es
attribute vec4 aVertexPosition;
// TODO: this should be an int
attribute float aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform bool magicZoom;
uniform float outlineSize;
// TODO: focusedGroup and group should change to int
uniform float focusedGroup;
uniform float zoom;
uniform bool darkMode;
varying vec4 vVertexOutlineColor;

const float MAX_NODE_SIZE = 30.0;

// const PALETTE_HEX = [
//   '3366CC',
//   'DC3912',
//   'FF9900',
//   '109618',
//   '990099',
//   '3B3EAC',
//   '0099C6',
//   'DD4477',
//   '66AA00',
//   'B82E2E',
//   '316395',
//   '994499',
//   '22AA99',
//   'AAAA11',
//   '6633CC',
//   'E67300',
//   '8B0707',
//   '329262',
//   '5574A6',
//   '3B3EAC'
// ];

void main() {

  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  float globalAlpha = 0.9;

  if (magicZoom) {
    gl_PointSize = MAX_NODE_SIZE;
  }
  else {
    gl_PointSize = outlineSize * MAX_NODE_SIZE * zoom;
  }

  float validColor = mod(aVertexColor, 8.0);

  // gl_VertexID

  bool isFocused = focusedGroup == -1.0 || aVertexColor == focusedGroup;

  if (isFocused) {
    // must be between -1 and 1
    gl_Position.z = -0.5;
  }
  else {
    gl_Position.z = -0.2;
  }

  if (!isFocused) {
    if (darkMode) {
      vVertexOutlineColor = vec4(60.0/255.0, 60.0/255.0, 60.0/255.0, globalAlpha);
    }
    else {
      vVertexOutlineColor = vec4(220.0/255.0, 220.0/255.0, 220.0/255.0, globalAlpha);
    }
  }
  else if (validColor == 0.0) {
    vVertexOutlineColor = vec4(60.0/255.0, 60.0/255.0, 60.0/255.0, globalAlpha);
  }
  else if (validColor == 1.0) {
    vVertexOutlineColor = vec4(16.0/255.0, 150.0/255.0, 24.0/255.0, globalAlpha); // 109618
  }
  else if (validColor == 2.0) {
    vVertexOutlineColor = vec4(142.0/255.0, 150.0/255.0, 116.0/255.0, globalAlpha); // 990099
  }
  else if (validColor == 3.0) {
    vVertexOutlineColor = vec4(255.0/255.0, 153.0/255.0, 0.0/255.0, globalAlpha); // FF9900
  }
  else if (validColor == 4.0) {
    vVertexOutlineColor = vec4(220.0/255.0, 57.0/255.0, 18.0/255.0, globalAlpha); // DC3912
    
  }


}`
