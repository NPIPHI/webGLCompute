#version 300 es

in ivec2 vertexIndex;

out vec2 UV;

uniform sampler2D pts;
uniform sampler2D tex;

void main(){
    vec4 data = texelFetch(pts, vertexIndex, 0);
    if(gl_VertexID%3 == 1){
        data.x += 0.002f;
    }
    if(gl_VertexID%3 == 2){
        data.y += 0.002f;
    }
    UV = vec2(1, 0.5);
    gl_Position = vec4(data.x, data.y, 1, 1);
    // UV = vertexPosition;
    // gl_Position = vec4(vertexPosition, 1, 1);
}