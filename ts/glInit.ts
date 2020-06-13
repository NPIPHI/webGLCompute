export default function glInit(canvas : HTMLCanvasElement) : WebGL2RenderingContext{
    let gl = canvas.getContext("webgl2", {antialias : false});
    gl.clearColor(0.5, 0, 0.5, 1);
    gl.clearColor(0.5, 0.0, 0.5, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);
    return gl;
}