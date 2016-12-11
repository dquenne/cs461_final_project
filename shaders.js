let vertexShader = `
attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec3 a_Normal;
attribute vec2 a_TexCoord;

uniform mat4 u_View;
uniform mat4 u_Projection;
uniform mat4 u_Transform;

varying vec3 v_Normal;
varying vec4 v_Color;
varying vec4 v_Position;
varying vec2 v_TexCoord;

void main(){
  v_Color = a_Color;
  v_Normal = a_Normal;
  v_TexCoord = a_TexCoord;
  v_Position = a_Position;
  gl_Position = u_Projection * u_View * u_Transform * a_Position;
}`;

let fragmentShader = `
precision highp float;

uniform mat4 u_Transform;
uniform mat4 u_View;
uniform vec3 u_Ambient;
uniform vec3 u_Diffuse;
uniform vec3 u_Specular;
uniform vec3 u_Shininess;
uniform vec3 u_LightDirection;

uniform sampler2D u_Sampler;

uniform vec3 u_TransparentColor;

varying vec3 v_Normal;
varying vec4 v_Color;
varying vec4 v_Position;
varying vec2 v_TexCoord;

vec3 ambient, diffuse, specular;

vec3 light_position;
vec3 L, N, V, H, P;
float dist, alpha;


void main(){
  float max_angle = 0.2;
  vec3 light_ambient = u_Ambient;
  vec3 light_diffuse = u_Diffuse;
  vec3 light_specular = u_Specular;
  float shininess = 90.0;

  light_position = vec3(0.0,0.1,0.0);


  vec3 color = (texture2D(u_Sampler, v_TexCoord)).xyz;

  if (color == u_TransparentColor) {
    alpha = 0.0;
  } else {
    alpha = 1.0;
  }

  P = (u_View*u_Transform*v_Position).xyz;

  dist = distance(P, (u_View*vec4(light_position, 0.0)).xyz);
  N = normalize((u_View*u_Transform*vec4(v_Normal, 0.0)).xyz);
  // L = normalize(light_position - P);
  L = normalize((u_View*u_Transform*vec4(u_LightDirection, 0.0)).xyz); // directional lighting
  V = normalize( -P);
  H = normalize(L+V);

  ambient = color * light_ambient;
  diffuse = color * max(dot(L, N), 0.0) * light_diffuse;
  diffuse /= (1.0+0.1*dist*dist); // distance attenuation
  specular = max(color * pow(max(dot(N, H), 0.0), shininess) * light_specular, 0.0) ;

  gl_FragColor = vec4(ambient + diffuse + specular, alpha);
  // gl_FragColor = vec4(ambient + diffuse, alpha);
}
`;
