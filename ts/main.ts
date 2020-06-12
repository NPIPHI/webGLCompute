var canvas : HTMLCanvasElement;
var gl : WebGL2RenderingContext;
var ctx : CanvasRenderingContext2D;

function init(){
    canvas = document.getElementById("canv") as HTMLCanvasElement;
    gl = canvas.getContext("webgl2");
    gl.clearColor(0.5, 0, 0.5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

init();