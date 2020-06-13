import fetchText from "./fetchText";
import initShaderProgram from "./initShader";
import glInit from "./glInit";
import loadTexture from "./loadTexture";
import glProgram from "./glProgram";

var canvas : HTMLCanvasElement;
var gl : WebGL2RenderingContext;
var program : glProgram;
var tex : WebGLTexture;
var dataTex : WebGLTexture;
var ptData : Float32Array;

const triNum = 1000000;
const maxTexWidth = 1024;
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
    let vIndex = new Int32Array(triNum * 6);
    for(let i = 0; i < triNum; i++){
        vIndex[i*6] = i%maxTexWidth;
        vIndex[i*6+2] = i%maxTexWidth;
        vIndex[i*6+4] = i%maxTexWidth;
        vIndex[i*6+1] = Math.floor(i/maxTexWidth);
        vIndex[i*6+3] = Math.floor(i/maxTexWidth);
        vIndex[i*6+5] = Math.floor(i/maxTexWidth);

    }
    let buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, vIndex, gl.STATIC_DRAW);

    ptData = new Float32Array(triNum * 4);
    for(let i = 0; i < triNum; i++){
        ptData[4*i] = Math.random()*2-1;
        ptData[4*i+1] = Math.random()*2-1;
        ptData[4*i+2] = Math.random()/200;
        ptData[4*i+3] = Math.random()/200;
    }
    // ptData = new Float32Array([
    //     0.6, 0, 0.1, 0,
    //     0, 0, 0, 0, 0
    // ])

    dataTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, dataTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, triNum%maxTexWidth, Math.ceil(triNum/maxTexWidth), 0, gl.RGBA, gl.FLOAT, ptData);
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

function updateState(data : Float32Array){
    for(let i = 0; i < data.length; i += 4){
        data[i+3] += -0.01;
        data[i] += data[i+2];
        data[i+1] += data[i+3];
        if(data[i] < -1 || data[i] > 1){
            data[i+2] *= -0.99;
            data[i] += data[i+2];
        }
        if(data[i+1] < -1 || data[i+1] > 1){
            data[i+3] *= -0.99;
            data[i+1] += data[i+3];
        }
    }
    gl.bindTexture(gl.TEXTURE_2D, dataTex);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0,  triNum%maxTexWidth, Math.ceil(triNum/maxTexWidth), gl.RGBA, gl.FLOAT, data);}

function loop(){
    render();
    updateState(ptData);
    requestAnimationFrame(loop);
}

function render(){
    gl.useProgram(program.program);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(program.uniforms.get("tex"), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, dataTex);
    gl.uniform1i(program.uniforms.get("pts"), 1);

    gl.vertexAttribIPointer(
        program.attributes.get("vertexIndex"),  //location
        2,                                      //count
        gl.INT,                                 //type
        0,                                      //offset?
        0);                                     //stride
    gl.enableVertexAttribArray(program.attributes.get("vertexIndex"));
    gl.drawArrays(gl.TRIANGLES, 0, 3*triNum);
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