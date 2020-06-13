export default class glProgram {
    readonly program : WebGLProgram;
    readonly uniforms : Map<string, WebGLUniformLocation>;
    readonly attributes : Map<string, number>;
    constructor(program : WebGLProgram, uniforms : Map<string, WebGLUniformLocation>, atttributes : Map<string, number>){
        this.program = program;
        this.uniforms = uniforms;
        this.attributes = atttributes;
    }
}