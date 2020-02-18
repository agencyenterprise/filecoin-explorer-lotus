module.exports = `//#version 300 es

//https://www.desultoryquest.com/blog/drawing-anti-aliased-circular-points-using-opengl-slash-webgl/
//#extension GL_OES_standard_derivatives : enable

// https://www.desultoryquest.com/blog/drawing-anti-aliased-circular-points-using-opengl-slash-webgl/
// https://www.desultoryquest.com/blog/downloads/code/points.js
precision mediump float;
uniform sampler2D iChannel0;
varying vec4 vVertexOutlineColor;

void main(void) {
  float r = 0.0, delta = 0.0, alpha = 0.9;
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  r = dot(cxy, cxy);
  

  if (r > 1.0) {
    discard;
  }

  // delta = fwidth(r);
  // alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);

  // @todo: gaussian blur
  // vec3 iResolution = vec3(50, 50, 0);
  // vec2 resolution = iResolution.xy;
  // vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);
  // vec2 direction = vec2(0.0);
  // vec4 color = vec4(vVertexOutlineColor);
  // vec2 off1 = vec2(1.3333333333333333) * direction;
  // color += texture2D(iChannel0, uv) * 0.29411764705882354;
  // color += texture2D(iChannel0, uv + (off1 / resolution)) * 0.35294117647058826;
  // color += texture2D(iChannel0, uv - (off1 / resolution)) * 0.35294117647058826;


  // gl_FragColor = color * alpha;

  gl_FragColor = vVertexOutlineColor * alpha;
}`
