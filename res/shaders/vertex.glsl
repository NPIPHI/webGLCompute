#version 300 es

in vec2 vertexIndex;

out vec2 UV;

uniform sampler2D pts;
uniform sampler2D tex;

void main(){
    // vec4 data = texelFetch(pts, ivec2(1, 0), 0);
    vertexIndex;
    // vec4 data = texture(pts, vec2(1, 0));
    vec4 data = vec4(0, 0, 0, 0);
    if(gl_VertexID == 1){
        data.x += 2.f;
    }
    if(gl_VertexID == 2){
        data.y += 2.f;
    }
    UV = data.xy;
    gl_Position = vec4(data.x, data.y, 1, 1);
    // UV = vertexPosition;
    // gl_Position = vec4(vertexPosition, 1, 1);
}