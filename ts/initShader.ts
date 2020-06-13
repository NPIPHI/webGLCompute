import glProgram from "./glProgram";

export default function initShaderProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) : glProgram {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
    // Create the shader program
  
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
  
    // If creating the shader program failed, alert
  
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }
    
    const uniforms = new Map<string, WebGLUniformLocation>();
    const attributes = new Map<string, number>();

    uniforms.set("tex", gl.getUniformLocation(shaderProgram, "tex"));
    uniforms.set("pts", gl.getUniformLocation(shaderProgram, "pts"));
    attributes.set("vertexIndex", gl.getAttribLocation(shaderProgram, "vertexIndex"));

    return new glProgram(shaderProgram, uniforms, attributes);
  }
  
  //
  // creates a shader of the given type, uploads the source and
  // compiles it.
  //

  function loadShader(gl: WebGL2RenderingContext, type: GLenum, source: string) {
    const shader = gl.createShader(type);
  
    // Send the source to the shader object
  
    gl.shaderSource(shader, source);
  
    // Compile the shader program
  
    gl.compileShader(shader);
  
    // See if it compiled successfully
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
  }