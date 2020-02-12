//#version 300 es

attribute vec4 aVertexPosition;
attribute float aVertexIndex;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform bool magicZoom;
uniform float nodeSize;
uniform float zoom;

varying vec4 vVertexColor;

const float MAX_NODE_SIZE = 16.0;

// unsigned rIntValue = (u_color / 256 / 256) % 256;
// unsigned gIntValue = (u_color / 256      ) % 256;
// unsigned bIntValue = (u_color            ) % 256;

// https://stackoverflow.com/questions/6893302/decode-rgb-value-to-single-float-without-bit-shift-in-glsl
// had to flip r and b to match concrete notation
vec3 unpackColor(float f) {
  vec3 color;
  color.r = floor(f / 256.0 / 256.0);
  color.g = floor((f - color.r * 256.0 * 256.0) / 256.0);
  color.b = floor(f - color.r * 256.0 * 256.0 - color.g * 256.0);
  // now we have a vec3 with the 3 components in range [0..255]. Let's normalize it!
  return color / 255.0;
}

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

  if (magicZoom) {
    gl_PointSize = MAX_NODE_SIZE; 
  }
  else {
    float size = nodeSize * MAX_NODE_SIZE * zoom;
    gl_PointSize = max(size, 5.0);
  }

  vVertexColor = vec4(unpackColor(aVertexIndex), 1.0);
}