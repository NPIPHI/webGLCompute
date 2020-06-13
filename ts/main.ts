import fetchText from "./fetchText";
import initShaderProgram from "./initShader";
import glInit from "./glInit";
import loadTexture from "./loadTexture";
import glProgram from "./glProgram";

var canvas : HTMLCanvasElement;
var gl : WebGL2RenderingContext;
var program : glProgram;
var tex : WebGLTexture;
var vIndex : Int32Array;
var dataTex : WebGLTexture;

async function init(){
    canvas = document.getElementById("canv") as HTMLCanvasElement;
    gl = glInit(canvas);
    sizeCanvas();

    tex = loadTexture(gl, "../res/grad.png");

    program = initShaderProgram(gl, await fetchText("../res/shaders/vertex.glsl"), await fetchText("../res/shaders/fragment.glsl"));
    
    // vData = genVerts(60, 0.1);
    // vData = new Float32Array([
    //     -1, -1,
    //     -1, 1,
    //     1, -1,
    //     1, 1

    // ])
    // for(let i = 0; i < 8; i++){
    //     vData[i] *= 0.9;
    // }
    vIndex = new Int32Array([
        0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1
    ])
    let buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, vIndex, gl.STATIC_DRAW);

    const ptData = new Float32Array([
        1, 0, 0, 1, 0, 0, 0, 1
    ])

    dataTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, dataTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 2, 1, 0, gl.RGBA, gl.FLOAT, ptData);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    render();
    loop();
}

function genVerts(tris : number, size : number) : Float32Array {
    const ret = new Float32Array(tris);
    for(let i = 0; i < tris; i+=6){
        let centerX = Math.random()*2-1;
        let centerY = Math.random()*2-1;
        ret[i] = centerX;
        ret[i+1] = centerY;
        ret[i+2] = centerX;
        ret[i+3] = centerY + size;
        ret[i+4] = centerX + size;
        ret[i+5] = centerY + size;
    }
    return ret;
}

function updateVerts(verts: Float32Array){
    for(let i = 0; i < verts.length; i += 2){
        verts[i+1] -= 0.001;
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, verts);
}

function loop(){
    render();
    // updateVerts(vData);
    requestAnimationFrame(loop);
}

function render(){
    gl.useProgram(program.program);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(program.attributes.get("tex"), 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, dataTex);
    gl.uniform1i(program.attributes.get("pts"), 1);

    gl.vertexAttribPointer(
        program.attributes.get("vertexIndex"),  //location
        2,                                      //count
        gl.INT,                                 //type
        false,                                  //normalized
        0,                                      //offset?
        0);                                     //stride?
    gl.enableVertexAttribArray(program.attributes.get("vertexIndex"));
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    // gl.drawArrays(gl.POINTS, 0, 60000);
}

function sizeCanvas(){
    let rect = canvas.getBoundingClientRect()
    canvas.width = rect.width;
    canvas.height = rect.height;
    gl.viewport(0, 0, rect.width, rect.height);
    if(program){
        render();
    }
}

window.addEventListener("resize", sizeCanvas);

init();