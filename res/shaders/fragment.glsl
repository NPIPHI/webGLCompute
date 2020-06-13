#version 300 es

out lowp vec4 color;
in highp vec2 UV;

uniform sampler2D pts;
uniform sampler2D tex;

void main(){
    color = texture(tex, UV);
    // color = vec4(1, 1, 1, 1);
}